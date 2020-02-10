from flask import Flask, request
import os, time
 
app = Flask(__name__)
 
@app.route('/prompt')
def prompt():
    timestamp = request.args.get('timestamp') # absolute time (ms)
    hand = request.args.get('hand') # right | left
    finger = request.args.get('finger') # pinkie | ring finger | middle finger | index finger
 
    with open(file_path, 'a') as f:
        f.write(', '.join([timestamp, 'prompt', hand, finger, '']) + '\n')
 
    return 'OK'
 
@app.route('/data-collection')
def keystroke():
    timestamp = request.args.get('timestamp') # absolute time (ms)
    key = request.args.get('key') # key pressed
 
    with open(file_path, 'a') as f:
        f.write(', '.join([timestamp, 'keystroke', '', '', key]) + '\n')
 
    return 'OK'
 
if not os.path.exists('data'):
    os.makedirs('data')

start_time = int(round(time.time() * 1000))
file_path = 'data/' + str(start_time) + '.txt'
with open(file_path, 'w+') as f:
    f.write('timestamp, event, hand, finger, key\n')
 
if __name__ == '__main__':
    app.run()