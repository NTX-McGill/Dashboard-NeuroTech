import sys
sys.path.append('NeuroTech-ML/')

from pylsl import StreamInlet, resolve_stream
import socketio
import time
from aiohttp import web
import asyncio
from real_time_prediction import predict_function
import pickle
from filters import *
import numpy as np
from scipy import zeros, signal, random


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
BUFFER_DIST = 250



# Setup background process for emitting predictions
async def emit_predictions():
    """
    Waits for sample from OpenBCI, predicts the finger pressed, and emits it.   
    """

    # Initialize buffer for storing incoming data
    bci_buffer = np.zeros([8, 1])


    # Initializing filter hyperparameters
    fs=250
    order=2
    low=20
    high=120
    nyq = fs / 2
    bb, ba = signal.butter(order, [low/nyq, high/nyq], 'bandpass')
    bz = signal.lfilter_zi(bb, ba)
    notch_freq = 60.0
    bp_stop = notch_freq + 3.0 * np.array([-1,1])
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

            for channel, filters in zip(bci_buffer, filtering):

                out_1, filters["nz"] = signal.lfilter(nb, na, channel, zi=filters["nz"])
                out_2, filters["bz"] = signal.lfilter(bb, ba, out_1, zi=filters["bz"])
                filter_buffer.append(out_2)

            filter_buffer = np.array(filter_buffer)


            # Predict finger pressed
            finger_probs = (predict_function(filter_buffer))
            finger_index = np.argmax(finger_probs)
            # print("BCI BUFFER: ", bci_buffer[0, 0], str(np.sum(bci_buffer)))
            # print("AFTER BUFFER: ", filter_buffer[0, 0], str(np.sum(filter_buffer)))
            # print(finger_probs)
            # print(np.argmax(finger_probs))
            # print(list(finger_probs))

            # Remove BUFFER_DIST from beginning of buffer
            bci_buffer = np.delete(bci_buffer, np.arange(0, BUFFER_DIST, 1), 1)

            # Emit predictions 
            await sio.emit('Finger', int(finger_index))
            await sio.emit('FingerProbs', str(list(finger_probs)))

@sio.event
async def connect(sid, environ):
    print("Connected")
    await sio.emit('my_response', {'data': 'Connected', 'count': 0}, room=sid)


@sio.event
def disconnect(sid):
    print('Client disconnected')


# app.router.add_get('/', index)


if __name__ == '__main__':
    sio.start_background_task(emit_predictions)
    web.run_app(app, host='0.0.0.0', port='4001')
