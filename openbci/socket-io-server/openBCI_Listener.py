#!/usr/bin/env python
import multiprocessing
from pylsl import StreamInlet, resolve_stream
import time
from collections import deque

print(time.time())
# start = time.time()


def get_lsl():
    global counter
    while True:

        sample, timestamp = inlet.pull_sample()
        # print(sample)

        print(counter)
        counter = counter + 1

        time.sleep(0)
        # for i in range(channel):

        #     sample, timestamp = inlet.pull_sample()
        #     print(sample)
        #     # print(timestamp)
        #     if i not in data:
        #         data[i] = sample
        #     else:
        #         data[i].append(sample)

        # fps.append(time.time() - start)
        # # print("FPS: ", 1.0 / (time.time() - start))
        # start = time.time()

        # # print(1/(sum(fps)/len(fps)))

        # # print(data)
        # print("end of iteration \n")


if __name__ == '__main__':
    streams = resolve_stream("type", "EEG")

    # create a new inlet to read from the stream
    inlet = StreamInlet(streams[0])

    data = {}

    fps = deque(maxlen=100)

    channel = 8

    counter = 0

    # Start foo as a process
    p = multiprocessing.Process(target=get_lsl, name="Foo", args=())
    print("Starting")
    p.start()

    # Wait 10 seconds for foo
    time.sleep(5)

    # Terminate foo
    p.terminate()

    # Cleanup
    p.join()
    print(counter)
