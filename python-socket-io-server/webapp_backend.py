from gevent import monkey
monkey.patch_all()
from flask import Flask, render_template
from flask_socketio import SocketIO, send, emit
from pylsl import StreamInlet, resolve_stream
import time, threading

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app, cors_allowed_origins="*")


emit_lsl = None



@socketio.on('connect')
def test_connect():

    # def thread_function():
    #     streams = resolve_stream('type', 'EEG')
    #     inlet = StreamInlet(streams[0])

    #     print("In Emition")
    #     while True:
    #         # sample, timestamp = inlet.pull_sample()
    #         sample = "go"
    #         #print(sample)
    #         socketio.emit('FromAPI', sample)
    #         socketio.sleep(10)

    print("User connected")
    
@socketio.on('disconnect')
def test_disconnect():
    print('Client disconnected')

@socketio.on('update')
def stream(data):
    print(data)


if __name__ == '__main__':
    socketio.run(app, debug=True, host="0.0.0.0")