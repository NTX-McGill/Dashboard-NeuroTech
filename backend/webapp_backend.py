from flask import Flask, request
from flask_cors import CORS
import os, time

app = Flask(__name__)
CORS(app)
 
@app.route('/prompt')
def prompt():
    global file_path

    datetime = request.args.get('datetime') # YYYY-MM-DD-HH:MM:SS:msms
    timestamp = request.args.get('timestamp') # absolute time (ms)
    hand = request.args.get('hand') # right | left
    finger = request.args.get('finger') # pinkie | ring finger | middle finger | index finger
 
    with open(file_path, 'a') as f:
        f.write(', '.join([datetime, timestamp, 'prompt_end', hand, finger, '']) + '\n')
 
    return 'OK'
 
@app.route('/data-collection')
def keystroke():
    global file_path

    datetime = request.args.get('datetime') # YYYY-MM-DD-HH:MM:SS:msms
    timestamp = request.args.get('timestamp') # absolute time (ms)
    key = request.args.get('key') # key pressed
 
    with open(file_path, 'a') as f:
        f.write(', '.join([datetime, timestamp, 'keystroke', '', '', key]) + '\n')
 
    return 'OK'

@app.route('/new-session')
def new_session():    
    global file_path

    datetime = request.args.get('datetime') # YYYY-MM-DD-HH:MM:SS:msms
    timestamp = request.args.get('timestamp') # absolute time (ms)
    name = request.args.get('name') # name of person recording
    notes = request.args.get('notes') # any additional notes
    mode = request.args.get('mode') # 0=self-directed; 1=guided; 2=in-the-air

    session_filepath = f'data/{name}'
    if not os.path.exists(session_filepath):
        os.makedirs(session_filepath)

    file_path = os.path.join(session_filepath, datetime.replace(':', '-') + '.txt')
    print(file_path)
    with open(file_path, 'w+') as f:
        f.write('name=' + name.strip() + '\n')
        f.write('notes=' + notes.strip() + '\n')
        f.write('mode=' + mode.strip() + '\n')
        
        f.write('datetime, timestamp, event, hand, finger, key\n')

    return 'OK'
 
if __name__ == '__main__':
    app.run()