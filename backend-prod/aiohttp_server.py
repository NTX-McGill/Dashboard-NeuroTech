import asyncio

from aiohttp import web

import time
import socketio
from pylsl import StreamInlet, resolve_stream

sio = socketio.AsyncServer(
    async_mode='aiohttp', cors_allowed_origins="*", sync_handlers=True)
app = web.Application()
sio.attach(app)
streams = resolve_stream('type', 'EEG')
inlet = StreamInlet(streams[0])


async def background_task():
    """Example of how to send server generated events to clients."""
    count = 0
    while True:
        await sio.sleep(.0001)
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

