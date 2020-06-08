#!/usr/bin/env python

import sys
sys.path.append('NeuroTech-ML/')
from pylsl import StreamInlet, resolve_stream
import socketio
import time
from aiohttp import web
import asyncio
from real_time_class import Prediction
import pickle
# from filters import *
import numpy as np
from scipy import zeros, signal, random
# from real_time_prediction import predict_function


# Set up Async socketio middleware
sio = socketio.AsyncServer(
    async_mode='aiohttp', cors_allowed_origins="*", sync_handlers=True)

# Initialize aiohttp server
app = web.Application()

# Attach the async socketio to the server
sio.attach(app)

# Tunable Params. Note OpenBCI gives 250 samples per second
BUFFER_SIZE = 250
BUFFER_DIST = 25
FEATURES = ['iemg', 'mav', 'mmav', 'var', 'rms']
DEBUG = True


# Setup background process for emitting predictions
async def emit_predictions():
    """
    Waits for sample from OpenBCI, predicts the finger pressed, and emits it.
    """

    # Initialize buffer for storing incoming data

    model_file = 'NeuroTech-ML/models/model_windows_date_all_subject_all_mode_1_2_4_groups_ok_good.pkl'
    # model_file = 'NeuroTech-ML/models/model_features_windows_date_all_subject_all_mode_1_2_4_groups_good_1000ms-05_12_2020_23_59_21.pkl'
    bci_buffer = np.zeros([8, 1])
    predictor = Prediction(model_filename=model_file,
                           shift=BUFFER_DIST/BUFFER_SIZE)

    while True:
        # Pull and append sample from OpenBCI to buffer
        sample, timestamp = inlet.pull_sample()
        print(timestamp)
        sample_np = np.array([sample]).transpose()
        bci_buffer = np.append(bci_buffer, sample_np, axis=1)

        # Quickly relequish control to other processes to prevent blocking
        await sio.sleep(0)

        # Check if buffer is large enough to make a prediction
        if (bci_buffer.shape[1] == BUFFER_SIZE):
            # Build filter buffer
            timestamp = round(time.time() * 1000)
            # print(timestamp)

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

            # Predicted finger index
            await sio.emit('Finger', int(finger_index))
            # List of finger probabilities, [0] because finger_probs is 2d array of length 1
            await sio.emit('FingerProbs', str(finger_probs[0].tolist()))
            # Feature dictionary
            await sio.emit('Feature_Data', formatted_feature_dict)
            # Filtered signal data
            await sio.emit('Filtered_Signal_Data', {
                "data": str(filter_buffer[:, 249].tolist()),
                "timestamp": timestamp
            })

            if (DEBUG): print(finger_probs[0])
            # Remove BUFFER_DIST from beginning of buffer
            bci_buffer = np.delete(bci_buffer, np.arange(0, BUFFER_DIST, 1), 1)

@sio.event
async def connect(sid, environ):
    print("Connected", sid)

@sio.event
def disconnect(sid):
    print('Client disconnected')

if __name__ == '__main__':
    print("Attempting to connect to OpenBCI. Please make sure OpenBCI is open with LSL enabled.")

    # Set up streaming over lsl from OpenBCI. 0 picks up the first of three
    streams = resolve_stream('type', 'EEG')
    inlet = StreamInlet(streams[0])

    sio.start_background_task(emit_predictions)

    # Start app on port 4002
    web.run_app(app, host='0.0.0.0', port='4002')
