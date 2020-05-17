import sys
sys.path.append('NeuroTech-ML/')
from pylsl import StreamInlet, resolve_stream
import socketio
import time
from aiohttp import web
import asyncio
from real_time_class import Prediction
import pickle
from filters import *
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


# Tunable Params
# @todo convert to seconds
BUFFER_SIZE = 250
BUFFER_DIST = 25
FEATURES = ['iemg', 'mav', 'mmav', 'var', 'rms']


# Setup background process for emitting predictions
async def emit_predictions():
    """
    Waits for sample from OpenBCI, predicts the finger pressed, and emits it.   
    """

    # Initialize buffer for storing incoming data

    # model_file = 'NeuroTech-ML/model_features_2020-03-22_windows_date_all_subject_all_mode_1_2_4-03_24_2020_18_40_49.pkl'
    model_file = 'NeuroTech-ML/model_windows_date_all_subject_all_mode_1_2_4_groups_ok_good.pkl'
    bci_buffer = np.zeros([8, 1])
    predictor = Prediction(model_filename=model_file,
                           shift=BUFFER_DIST/BUFFER_SIZE)

    while True:
        # Pull and append sample from OpenBCI to buffer
        sample, timestamp = inlet.pull_sample()
        sample_np = np.array([sample]).transpose()
        bci_buffer = np.append(bci_buffer, sample_np, axis=1)

        # Quickly relequish control so that other processes can do their thing
        await sio.sleep(0)

        # Check if buffer is ready for prediction
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
            for feature in FEATURES:
                feature_array = []
                for i in range(1, 9):
                    feature_array.append(
                        feature_dict["channel " + str(i) + "_" + feature][0])

                formatted_feature_dict[feature] = feature_array

            # Emit predictions

            # @todo emit the timestamps along with the data points. Fix Signal_Data labels
            # print(filter_buffer[:, 249])
            # print(bci_buffer[:, 249])
            # signal_data = np.append([filter_buffer[:, 249]], [
            #                         bci_buffer[:, 249]], axis=0).tolist()
            # print(signal_data)
            
            # print(timestamp - round(time.time() * 1000))
            # print("New")

            await sio.emit('Finger', int(finger_index))
            print(finger_probs[0])
            await sio.emit('FingerProbs', str(finger_probs[0].tolist()))
            await sio.emit('Feature_Data', formatted_feature_dict)
            # str(feature_arr.transpose().reshape(8,len(FEATURES)).tolist()))
            # await sio.emit('Signal_Data', {
            #     "data": str(signal_data),
            #     "timestamp": timestamp
            # })
            await sio.emit('Filtered_Signal_Data', {
                "data": str(filter_buffer[:, 249].tolist()),
                "timestamp": timestamp
            })

            # print("Fitlered")
            # print(filter_buffer[:, 249])
            # print("BCI")
            # print(bci_buffer[:, 249])

            # Remove BUFFER_DIST from beginning of buffer
            bci_buffer = np.delete(bci_buffer, np.arange(0, BUFFER_DIST, 1), 1)


@sio.event
async def connect(sid, environ):
    print("Connected")
    # await sio.emit('my_response', {'data': 'Connected', 'count': 0}, room=sid)


@sio.event
def disconnect(sid):
    print('Client disconnected')


# app.router.add_get('/', index)


if __name__ == '__main__':
    print("Attempting to connect to OpenBCI")
    # Set up streaming over lsl from OpenBCI
    streams = resolve_stream('type', 'EEG')
    inlet = StreamInlet(streams[0])

    sio.start_background_task(emit_predictions)
    web.run_app(app, host='0.0.0.0', port='4002')
