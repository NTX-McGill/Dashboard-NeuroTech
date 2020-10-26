#!/usr/bin/env python

from collections import defaultdict
from pprint import pprint
from data import *
import itertools
import matplotlib.pyplot as plt
import numpy as np
import readchar

## Helper functions



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
def get_finger_number():
    pass

# send most likely words
def send_most_likely_words(words):
    pass

# trigger word selection mode
def send_word_selection_mode():
    pass

# trigger word capture
def send_word_capture(word):
    pass

# trigger delete word
def send_delete_word():
    pass

# leave typing mode
def send_leave_typing_mode():
    pass

# send error code
def send_error_code():
    pass

## Interactive mode
# server_mode indicates that we should send messages to the frontend
# finger_mode indictates that we should read message predictions from pipeline
def interactive_mode(word_groupings, server_mode=False, finger_mode=False):
    # finger_word stores the word that the user is building
    finger_word = ""

    # sentence stores the words the user has built
    sentence = ""

    def handle_most_likely_words(potential_words):
        if (len(potential_words) != 0):
            tmp_res = ""
            for index, potential_word in enumerate(potential_words):
                tmp_res += f"{index}: {potential_word}, "
            print(f"Possible words: {tmp_res}")
        else:
            print("Could not translate")

        if server_mode:
            send_most_likely_words(potential_words)

    def handle_word_selection_mode(potential_words):
        nonlocal finger_word, sentence

        potential_words_display = ""
        for index, potential_word in enumerate(potential_words):
            potential_words_display += f"{index}: {potential_word}, "

        print("Word Selection Mode. Please select a word:")
        print(potential_words_display)

        if server_mode:
            send_word_selection_mode(potential_words)

        if finger_mode:
            # get character prediction
            finger_number = get_finger_number()
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
        handle_word_capture(selected_word)

    def handle_word_capture(english_word):
        nonlocal finger_word, sentence
        finger_word = ""
        sentence += english_word + " "

        print(f"Your Sentence: {sentence}")

        if server_mode:
            send_word_capture(english_word)

    def handle_delete_word():
        nonlocal finger_word, sentence
        sentence = sentence.rsplit(' ', 1)[0]

        if server_mode:
            send_delete_word()

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
            finger_number = get_finger_number()
        else:
            # get character from keyboard
            keystroke = repr(readchar.readkey())[1:-1]
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
            handle_word_capture(word_groupings[finger_word][0])

        # type backspace to go back a character (right squeeze)
        elif finger_number == "10":
            if (len(finger_word) == 0):
                # remove last word from the sentence
                handle_delete_word()
            else:
                # remove last char from the word
                finger_word = finger_word[:-1]
                handle_most_likely_words(word_groupings[finger_word])

        # type 0 to enter word selection mode (left squeeze)
        elif finger_number == "9":
            if finger_word in word_groupings:
                handle_word_selection_mode(word_groupings[finger_word])
            else:
                handle_error_code("could_not_enter_word_selection_mode")

        # other characters are interpretted as typing
        else:
            finger_word += finger_number
            handle_most_likely_words(word_groupings[finger_word])

        # print(f"Your Sentence: {sentence}")
        print("")


if __name__ == "__main__":
    word_groupings = get_finger_number_to_word_map(top_5000_words)
    print("Starting interactive mode")
    interactive_mode(word_groupings, server_mode=False)

    # pprint(calculate_average_word_distance_by_length(top_5000_words, plot_results=False))
    # pprint(get_conflict_counts(top_5000_words))
