import sys
sys.path.append('NeuroTech-ML/')

from pylsl import StreamInlet, resolve_stream
import socketio
import time
from aiohttp import web
import asyncio
from real_time_prediction import predict_function
import pickle
import numpy as np


sio = socketio.AsyncServer(
    async_mode='aiohttp', cors_allowed_origins="*", sync_handlers=True)
app = web.Application()
sio.attach(app)
streams = resolve_stream('type', 'EEG')
inlet = StreamInlet(streams[0])

channels = [1, 2, 3, 4, 5, 6, 7, 8]


BUFFER_SIZE = 500
BUFFER_DIST = 250



async def emit_predictions():
    """Example of how to send server generated events to clients."""
    count = 0
    bci_buffer = np.zeros([8, 1])
    while True:

        sample, timestamp = inlet.pull_sample()
        sample_np = np.array([sample]).transpose()
        # print(sample)
        # print(sample_np)
        bci_buffer = np.append(bci_buffer, sample_np, axis=1)
        # print(bci_buffer)

        await sio.sleep(0)

        # print(bci_buffer.shape[1])
        if (bci_buffer.shape[1] == BUFFER_SIZE):
            prediction = (predict_function(bci_buffer))[0]
            print(prediction)
            print(np.argmax(prediction))
            finger_index = np.argmax(prediction)
            bci_buffer = np.delete(bci_buffer, np.arange(0, BUFFER_DIST, 1), 1)
            await sio.emit('Finger', int (finger_index))



# async def index(request):
#     with open('app.html') as f:
#         return web.Response(text=f.read(), content_type='text/html')
#
#
# @sio.event
# async def my_event(sid, message):
#     await sio.emit('my_response', {'data': message['data']}, room=sid)
#
#
# @sio.event
# async def my_broadcast_event(sid, message):
#     await sio.emit('my_response', {'data': message['data']})


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
