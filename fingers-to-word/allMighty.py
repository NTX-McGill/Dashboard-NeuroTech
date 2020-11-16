#!/usr/bin/env python

from multiprocessing import Process, Queue, Lock

from collections import defaultdict,deque
from pprint import pprint
from data import *
import itertools
import matplotlib.pyplot as plt
import numpy as np
import readchar
from aiohttp import web
import socketio

import sys
sys.path.append('NeuroTech-ML/')
from pylsl import StreamInlet, resolve_stream
import time
import asyncio
from real_time_class import Prediction
import pickle
# from filters import *
from scipy import zeros, signal, random



def producer(queue):

    BUFFER_SIZE_SECONDS = 0.5
    BUFFER_DIST_SECONDS = 0.5
    OPENBCI_HERTZ = 250
    BUFFER_SIZE = round(OPENBCI_HERTZ * BUFFER_SIZE_SECONDS)
    BUFFER_DIST = round(OPENBCI_HERTZ * BUFFER_DIST_SECONDS)
    FEATURES = ['iemg', 'mav', 'mmav', 'var', 'rms']
    DEBUG = False

    model_file = 'NeuroTech-ML/models/model_windows_date_all_subject_all_mode_1_2_4_groups_ok_good.pkl'
    # model_file = 'NeuroTech-ML/models/model_features_windows_date_all_subject_all_mode_1_2_4_groups_good_1000ms-05_12_2020_23_59_21.pkl'
    bci_buffer = np.zeros([8, 1])
    predictor = Prediction(model_filename=model_file,
                           shift=BUFFER_DIST/BUFFER_SIZE)

    print("Attempting to connect to OpenBCI. Please make sure OpenBCI is open with LSL enabled.")

    # Set up streaming over lsl from OpenBCI. 0 picks up the first of three
    streams = resolve_stream('type', 'EEG')
    inlet = StreamInlet(streams[0])

    while True:
        # Pull and append sample from OpenBCI to buffer
        sample, timestamp = inlet.pull_sample()
        sample_np = np.array([sample]).transpose()
        bci_buffer = np.append(bci_buffer, sample_np, axis=1)

        # # Quickly relequish control to other processes to prevent blocking
        # await sio.sleep(0)

        # Check if buffer is large enough to make a prediction
        if (bci_buffer.shape[1] == BUFFER_SIZE):
            # Build filter buffer
            timestamp = round(time.time() * 1000)

            filter_buffer, feature_dict, finger_probs = predictor.get_filtered_features_prediction(
                np.array(bci_buffer))

            # Predict finger pressed
            finger_index = np.argmax(finger_probs)
            formatted_feature_dict = {}
            formatted_feature_dict["timestamp"] = timestamp

            # construct feature dictionary for frontend
            for feature in FEATURES:
                feature_array = []
                for i in range(1, 9):
                    # [0] because elements of feature_dict array of length 1
                    feature_array.append(
                        feature_dict["channel " + str(i) + "_" + feature][0])

                formatted_feature_dict[feature] = feature_array

            # Emit predictions
            # @todo emit the timestamps along with the data points. Fix Signal_Data labels
            print(finger_index)
            print("Adding to queue")
            queue.put(int(finger_index))

            # # Predicted finger index
            # await sio.emit('Finger', int(finger_index))
            # # List of finger probabilities, [0] because finger_probs is 2d array of length 1
            # await sio.emit('FingerProbs', str(finger_probs[0].tolist()))
            # # Feature dictionary
            # await sio.emit('Feature_Data', formatted_feature_dict)
            # # Filtered signal data
            # await sio.emit('Filtered_Signal_Data', {
            #     "data": str(filter_buffer[:, (BUFFER_SIZE - 1)].tolist()),
            #     "timestamp": timestamp
            # })

            if (DEBUG):
                print(finger_probs[0])
            # Remove BUFFER_DIST from beginning of buffer
            bci_buffer = np.delete(bci_buffer, np.arange(0, BUFFER_DIST, 1), 1)


def consumer(queue):

    ## SocketIO
    #setup server
    print("Setting up server")
    sio = socketio.AsyncServer()
    app = web.Application()
    sio.attach(app)

    # -- demo code --#
    async def index(request):
        with open('index.html') as f:
            return web.Response(text=f.read(), content_type='text/html')

    app.router.add_get('/', index)
    #----------------#

    #handle events
    @sio.event
    def connect(sid, environ):
        print('connect ', sid)
        unity_sid=sid

    @sio.event
    def disconnect(sid):
        print('disconnect ', sid)


    ## Create maps

    # maps from finger name to finger number
    finger_name_to_finger_number = {
        "left_pinky": 0,
        "left_ring": 1,
        "left_middle": 2,
        "left_index": 3,
        "thumb": 4,
        "right_index": 5,
        "right_middle": 6,
        "right_ring": 7,
        "right_pinky": 8,
        "left_squeeze": 9,
        "right_squeeze": 10,
        "left_and_right_squeeze": 11
    }

    # maps from finger number to possible finger letters
    finger_number_to_letters = {
        "0": ["q", "a", "z"],
        "1": ["w", "s", "x"],
        "2": ["e", "d", "c"],
        "3": ["r", "f", "v", "t", "g", "b"],
        "4": [" "],
        "5": ["y", "h", "n", "u", "j", "m"],
        "6": ["i", "k", ","],
        "7": ["o", "l", "."],
        "8": ["p", ";", ":", "'", '"', "/"],
        "9": ["0"],
        "10": ["\\x7f"],
        "11": ["\\x03"]
    }

    # maps from letter to finger number
    letters_to_finger_numbers = {}
    for number, letters in finger_number_to_letters.items():
        for letter in letters:
            letters_to_finger_numbers[letter] = number

    # create a translator for translating from english to fingers
    english_letters = "qazwsxedcrfvtgbyhnujmikolp"
    finger_letters = "00011122233333355555566778"
    english_to_finger_table = "".maketrans(english_letters, finger_letters)

    # translate from english to finger word
    def english_to_finger_word(word):
        return word.lower().translate(english_to_finger_table)

    # build dictionary to translate from fingers to english
    # keys are finger words
    # values are lists of potential english words
    # parameter is a list of common english words
    def get_finger_number_to_word_map(word_list):
        word_groupings = defaultdict(list)
        for word in word_list:
            word_groupings[english_to_finger_word(word)].append(word)
        return word_groupings


    ## Data analysis

    # print data on number of conflict counts
    # for words of varying lengths
    def get_conflict_counts(word_list):
        word_groupings = defaultdict(list)
        for word in word_list:
            word_groupings[english_to_finger_word(word)].append(word)

        conflict_count = defaultdict(int)
        for group, words in word_groupings.items():
            group_size = len(words)
            conflict_count[group_size] += 1
            # conflict_count[group_size] += 1

        # for key, val in conflict_count.items():
        #     conflict_count[key] = val * key
        return conflict_count

    # print the top finger words
    def calculate_average_word_distance_by_length(word_list, plot_results=False):
        # key: length of finger word
        # value: list of finger words of length key
        finger_word_length_dictionary = defaultdict(list)
        for word in word_list:
            finger_word = english_to_finger_word(word)
            finger_word_length_dictionary[len(finger_word)].append(finger_word)
            # word_groupings.setdefault(len(finger_word), []).append(finger_word)

        # Function to return the minimum number of
        # operations to convert string A to B
        def minOperations(word1, word2):
            count = 0
            for index, letter in enumerate(word1):
                if letter != word2[index]:
                    count += 1
            return count


        # key: length of finger word
        # value: average min distance of words
        distance_dict = {}
        for length, words in sorted(finger_word_length_dictionary.items()):
            # print(length)
            min_dist_dict = defaultdict(lambda: 100)
            if len(words) > 1:
                for word1, word2 in itertools.combinations((set(words)), 2):
                    min_dist_dict[word1] = min(min_dist_dict[word1], minOperations(word1, word2))
                distance_dict[length] = {
                    "average_min_distance": sum(min_dist_dict.values()) / len(min_dist_dict),
                    "count": len(min_dist_dict)
                }
                if plot_results:
                    plt.hist(min_dist_dict.values(), bins=range(length))
                    plt.show()

        return distance_dict

    ## Networking

    # gets finger number from prediction algorithm
    async def get_finger_number():
        # while len(finger_number_queue) == 0:
        #     await sio.sleep(0.001)
        print("Pulling From Queue")
        return str(queue.get())

    # send most likely words
    async def send_most_likely_words(words):
        print(words)
        await sio.emit('options', {"words":words})

    # trigger word selection mode
    async def send_word_selection_mode():
        await sio.emit('selection', None)

    # trigger word capture
    async def send_word_capture(word):
        await sio.emit('word', {"word":word})

    # trigger delete word
    async def send_delete_word():
        print("deleting a word")
        await sio.emit('delete', None)

    # leave typing mode
    def send_leave_typing_mode():
        pass

    # send error code
    def send_error_code():
        pass

    ## Interactive mode
    # server_mode indicates that we should send messages to the frontend
    # finger_mode indictates that we should read message predictions from pipeline
    async def interactive_mode(word_groupings, server_mode=False, finger_mode=False):
        # finger_word stores the word that the user is building
        finger_word = ""

        # sentence stores the words the user has built
        sentence = ""

        async def handle_most_likely_words(potential_words):
            if (len(potential_words) != 0):
                tmp_res = ""
                for index, potential_word in enumerate(potential_words):
                    tmp_res += f"{index}: {potential_word}, "
                print(f"Possible words: {tmp_res}")
            else:
                print("Could not translate")

            if server_mode:
                await send_most_likely_words(potential_words)

        async def handle_word_selection_mode(potential_words):
            nonlocal finger_word, sentence

            potential_words_display = ""
            for index, potential_word in enumerate(potential_words):
                potential_words_display += f"{index}: {potential_word}, "

            print("Word Selection Mode. Please select a word:")
            print(potential_words_display)

            if server_mode:
                await send_word_selection_mode()

            if finger_mode:
                # get character prediction
                finger_number = await get_finger_number()
            else:
                # get character from keyboard
                keystroke = repr(readchar.readkey())[1:-1]
                try:
                    finger_number = letters_to_finger_numbers[keystroke]
                except Exception as e:
                    print(f"Invalid key: {keystroke}")
                    return

            number = int(finger_number)

            try:
                selected_word = potential_words[number]
            except Exception as e:
                print(f"Key out of selection range: {number}")
                return

            print(f"Selected word: {selected_word}")
            await handle_word_capture(selected_word)

        async def handle_word_capture(english_word):
            nonlocal finger_word, sentence
            finger_word = ""
            sentence += english_word + " "

            print(f"Your Sentence: {sentence}")

            if server_mode:
                await send_word_capture(english_word)

        async def handle_delete_word():
            nonlocal finger_word, sentence
            sentence = sentence.rsplit(' ', 1)[0]

            if server_mode:
                await send_delete_word()

        def handle_leave_typing_mode():
            if server_mode:
                send_leave_typing_mode()
            else:
                exit()

        def handle_error_code(code):
            # add options for continuing or resetting
            if code == "could_not_enter_word_selection_mode":
                print("Could not enter word selection mode. No potential words")

            if server_mode:
                send_error_code(code)

            # continuously read characters
        while True:
            if finger_mode:
                # get character prediction
                finger_number = await get_finger_number()
                print(finger_number)
                print(type(finger_number))
            else:
                # get character from keyboard
                keystroke = repr(await readchar.readkey())[1:-1]
                print (keystroke)
                try:
                    finger_number = letters_to_finger_numbers[keystroke]
                except Exception as e:
                    print(f"Invalid key: {keystroke}")
                    break

            # type C-c to exit (left and right squeeze)
            if finger_number == "11":
                handle_leave_typing_mode()

            # type space to select the first word (thumb)
            elif finger_number == "4":
                try:
                    selected_word = word_groupings[finger_word][0]
                    await handle_word_capture(selected_word)
                except Exception as e:
                    print(f"No word to select")

            # type backspace to go back a character (right squeeze)
            elif finger_number == "10":
                if (len(finger_word) == 0):
                    # remove last word from the sentence
                    await handle_delete_word()
                else:
                    # remove last char from the word
                    finger_word = finger_word[:-1]
                    await handle_most_likely_words(word_groupings[finger_word])

            # type 0 to enter word selection mode (left squeeze)
            elif finger_number == "9":
                if finger_word in word_groupings:
                    await handle_word_selection_mode(word_groupings[finger_word])
                else:
                    handle_error_code("could_not_enter_word_selection_mode")

            # other characters are interpretted as typing
            else:
                finger_word += finger_number
                await handle_most_likely_words(word_groupings[finger_word])

            # print(f"Your Sentence: {sentence}")
            print("")

    word_groupings = get_finger_number_to_word_map(top_5000_words)
    print("Starting interactive mode")
    sio.start_background_task(interactive_mode,word_groupings, server_mode=True,finger_mode=True)
    web.run_app(app)



if __name__ == "__main__":
    queue = Queue()
    producer = Process(target=producer, args=(queue,))
    consumer = Process(target=consumer, args=(queue,))

    producer.start()
    consumer.start()

    consumer.join()
    producer.join()
