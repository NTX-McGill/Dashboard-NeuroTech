import React, { useCallback, useEffect, useState } from "react";

import { Typography } from "@material-ui/core";

import { sendData, sendPrompt } from './Bridge';
import ProgressBar from './ProgressBar';
import { choice } from './Utilities';

function Recorder({ recording }) {
  const fingers = [
    ["left", "pinkie", "a"],
    ["left", "ring finger", "s"],
    ["left", "middle finger", "d"],
    ["left", "index finger", "f"],
    ["right", "index finger", "j"],
    ["right", "middle finger", "k"],
    ["right", "ring finger", "l"],
    ["right", "pinkie", ";"]
  ].map(array => ({
    hand: array[0],
    finger: array[1],
    key: array[2]
  }));

  const [progress, setProgress] = useState(0);
  const [prompt, setPrompt] = useState(choice(fingers));

  useEffect(() => {
    const updateInterval = 30; // in ms

    let interval = setInterval(() => {
      if (recording) {
        setProgress(progress => progress + (updateInterval / 3000) * 100);

        if (progress >= 100) {
          setProgress(0);

          let newPrompt = choice(fingers);
          setPrompt(newPrompt);
          sendPrompt({ newPrompt });
        }
      } else
        setProgress(0);
    }, updateInterval);

    return () => clearInterval(interval);
  }, [fingers, progress, recording]);

  const keyHandler = useCallback(event => {
    if (recording)
      sendData({ key: event.key });
  }, [recording]);

  useEffect(() => {
    document.addEventListener("keydown", keyHandler, false);
    return () => document.removeEventListener("keydown", keyHandler, false);
  }, [keyHandler]);

  return (
    <div>
      <ProgressBar percent={progress} />
      <Typography variant="h4">
        {recording
          ? <>Press the "{prompt.key}" key with your {prompt.hand} {prompt.finger}</>
          : <>Waiting...</>
        }
      </Typography>
    </div>
  );
}

export default Recorder;
