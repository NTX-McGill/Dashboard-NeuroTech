import React, { useCallback, useEffect, useState } from "react";

import { Typography } from "@material-ui/core";

import { sendData, sendPrompt } from "./Bridge";
import ProgressBar from "./ProgressBar";
import { choice } from "./Utilities";

function Recorder({ recording, onKey, onPrompt }) {
  const fingers = [
    { hand: "left", finger: "pinkie", key: "a" },
    { hand: "left", finger: "ring finger", key: "s" },
    { hand: "left", finger: "middle finger", key: "d" },
    { hand: "left", finger: "index finger", key: "f" },
    { hand: "right", finger: "index finger", key: "j" },
    { hand: "right", finger: "middle finger", key: "k" },
    { hand: "right", finger: "ring finger", key: "l" },
    { hand: "right", finger: "pinkie", key: ";" }
  ];

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
          sendPrompt({ newPrompt }, onPrompt);
        }
      } else setProgress(0);
    }, updateInterval);

    return () => clearInterval(interval);
  }, [fingers, onPrompt, progress, recording]);

  const keyHandler = useCallback(
    event => {
      if (recording) sendData({ key: event.key }, onKey);
    },
    [onKey, recording]
  );

  useEffect(() => {
    document.addEventListener("keydown", keyHandler, false);
    return () => document.removeEventListener("keydown", keyHandler, false);
  }, [keyHandler]);

  return (
    <div>
      <ProgressBar percent={progress} />
      <Typography variant="h4">
        {recording ? (
          <>
            Press the "{prompt.key}" key with your {prompt.hand} {prompt.finger}
          </>
        ) : (
          <>Waiting...</>
        )}
      </Typography>
    </div>
  );
}

export default Recorder;
