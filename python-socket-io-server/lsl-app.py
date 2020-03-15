import sys
sys.path.append('NeuroTech-ML/')
from scipy import zeros, signal, random
import numpy as np
from filters import *
import pickle
from real_time_prediction import predict_function
import asyncio
from aiohttp import web
import time
import socketio
from pylsl import StreamInlet, resolve_stream


# Set up Async socketio middleware
sio = socketio.AsyncServer(
    async_mode='aiohttp', cors_allowed_origins="*", sync_handlers=True)

# Initialize aiohttp server
app = web.Application()

# Attach the async socketio to the server
sio.attach(app)


# Set up streaming over lsl from OpenBCI
streams = resolve_stream('type', 'EEG')
inlet = StreamInlet(streams[0])


# Tunable Params
BUFFER_SIZE = 250
BUFFER_DIST = 50


# Setup background process for emitting predictions
async def emit_predictions():
    """
    Waits for sample from OpenBCI, predicts the finger pressed, and emits it.   
    """

    # Initialize buffer for storing incoming data
    bci_buffer = np.zeros([8, 1])

    # Initializing filter hyperparameters
    fs = 250
    order = 2
    low = 20
    high = 120
    nyq = fs / 2
    bb, ba = signal.butter(order, [low/nyq, high/nyq], 'bandpass')
    bz = signal.lfilter_zi(bb, ba)
    notch_freq = 60.0
    bp_stop = notch_freq + 3.0 * np.array([-1, 1])
    nb, na = signal.iirnotch(notch_freq, notch_freq / 6, fs)
    nz = signal.lfilter_zi(nb, na)

    # Initialize variable filter parameters for each channel
    filter_params = {
        "nz": nz,
        "bz": bz,
    }
    filtering = [filter_params] * 8

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
            filter_buffer = []

            for i, (channel, filters) in enumerate(zip(bci_buffer, filtering)):
                # print(channel[0])
                # print("NZ", str(filtering[i]["nz"]))
                # print("BZ:",str(filtering[i]["bz"]))

                out_1, filtering[i]["nz"] = signal.lfilter(
                    nb, na, channel, zi=filtering[i]["nz"])
                out_2, filtering[i]["bz"] = signal.lfilter(
                    bb, ba, out_1, zi=filtering[i]["bz"])
                filter_buffer.append(out_2)

            filter_buffer = np.array(filter_buffer)

            # Predict finger pressed
            finger_probs, feature_arr = (predict_function(filter_buffer))
            finger_index = np.argmax(finger_probs)
            print(feature_arr.shape)
            # print("BCI BUFFER: ", bci_buffer[0], str(np.sum(bci_buffer)))

            # print("AFTER BUFFER: ", filter_buffer[0], str(np.sum(filter_buffer)))
            print(str(np.array2string(finger_probs[0], separator=', ')))
            print(finger_index)

            # Remove BUFFER_DIST from beginning of buffer
            bci_buffer = np.delete(bci_buffer, np.arange(0, BUFFER_DIST, 1), 1)

            # Emit predictions
            await sio.emit('Finger', int(finger_index))
            await sio.emit('FingerProbs', str(finger_probs[0].tolist()))
            await sio.emit('Channel_1_IEMG', int(feature_arr[0]))
            # get last column
            await sio.emit('channels_filtered', str(filter_buffer[:, 249].tolist()))

@sio.event
async def connect(sid, environ):
    print("Connected")
    await sio.emit('my_response', {'data': 'Connected', 'count': 0}, room=sid)


@sio.event
def disconnect(sid):
    print('Client disconnected')


# app.router.add_get('/', index)


if __name__ == '__main__':
    print("Attempting to connect to OpenBCI")
    sio.start_background_task(emit_predictions)
    web.run_app(app, host='0.0.0.0', port='4001')
