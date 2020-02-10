from flask import Flask, request
import os, time
 
app = Flask(__name__)
 
@app.route('/prompt')
def prompt():
    datetime = request.args.get('datetime') # YYYY-MM-DD-HH:MM:SS:msms
    timestamp = request.args.get('timestamp') # absolute time (ms)
    hand = request.args.get('hand') # right | left
    finger = request.args.get('finger') # pinkie | ring finger | middle finger | index finger
 
    with open(file_path, 'a') as f:
        f.write(', '.join([datetime, timestamp, 'prompt', hand, finger, '']) + '\n')
 
    return 'OK'
 
@app.route('/data-collection')
def keystroke():
    datetime = request.args.get('datetime') # YYYY-MM-DD-HH:MM:SS:msms
    timestamp = request.args.get('timestamp') # absolute time (ms)
    key = request.args.get('key') # key pressed
 
    with open(file_path, 'a') as f:
        f.write(', '.join([datetime, timestamp, 'keystroke', '', '', key]) + '\n')
 
    return 'OK'
 
if not os.path.exists('data'):
    os.makedirs('data')

start_time = int(round(time.time() * 1000))
file_path = 'data/' + str(start_time) + '.txt'
with open(file_path, 'w+') as f:
    f.write('datetime, timestamp, event, hand, finger, key\n')
 
if __name__ == '__main__':
    app.run()