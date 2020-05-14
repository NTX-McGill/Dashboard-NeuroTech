#!/usr/bin/env bash

source ../../backend/venv/bin/activate

python ./openBCI_Listener.py & 

node ./osc-experiment.js &
