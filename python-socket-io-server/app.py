import sys
sys.path.append('NeuroTech-ML/')

from pylsl import StreamInlet, resolve_stream
import socketio
import time
from aiohttp import web
import asyncio
from real_time_prediction import predict_function


sio = socketio.AsyncServer(
    async_mode='aiohttp', cors_allowed_origins="*", sync_handlers=True)
app = web.Application()
sio.attach(app)
streams = resolve_stream('type', 'EEG')
inlet = StreamInlet(streams[0])

model_file = 'NeuroTech-ML/model_windows-2020-02-23-03_08_2020_15:48:56.pkl'
f = open(model_file, "r")

data = pickle.load(f)
clf = data['classifier']
features = data['features']

channels = [1, 2, 3, 4, 5, 6, 7, 8]
channel_names = ['channel {}'.format(i) for i in channels]
sample = np.zeros([len(channels), 250])



async def background_task():
    """Example of how to send server generated events to clients."""
    count = 0
    while True:
        await sio.sleep(.0001)
        print(predict_function(sample))
        # count += 1
        # await sio.emit("FromAPI", count)
        sample, timestamp = inlet.pull_sample()
        # print(sample)
        await sio.emit('Timeseries', sample)


async def index(request):
    with open('app.html') as f:
        return web.Response(text=f.read(), content_type='text/html')


@sio.event
async def my_event(sid, message):
    await sio.emit('my_response', {'data': message['data']}, room=sid)


@sio.event
async def my_broadcast_event(sid, message):
    await sio.emit('my_response', {'data': message['data']})


@sio.event
async def connect(sid, environ):
    print("Connected")
    await sio.emit('my_response', {'data': 'Connected', 'count': 0}, room=sid)


@sio.event
def disconnect(sid):
    print('Client disconnected')


# app.router.add_get('/', index)


if __name__ == '__main__':
    sio.start_background_task(background_task)
    web.run_app(app, host='0.0.0.0', port='4001')
