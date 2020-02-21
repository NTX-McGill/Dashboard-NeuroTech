import React, { useCallback, useEffect, useState } from "react";

import { Typography } from "@material-ui/core";

import { sendData, sendPrompt } from "./Bridge";
import ProgressBar from "./ProgressBar";
import { choice } from "./Utilities";

import Hands from './hand.png';
import Green from './green.png';
import './app.css';

function GuidedRecorder({ recording, onKey, onPrompt }) {
  const fingers = [
    { hand: "left", finger: "pinkie", key: "a" },
    { hand: "left", finger: "ring finger", key: "s" },
    { hand: "left", finger: "middle finger", key: "d" },
    { hand: "left", finger: "index finger", key: "f" },
    { hand: "right", finger: "index finger", key: "j" },
    { hand: "right", finger: "middle finger", key: "k" },
    { hand: "right", finger: "ring finger", key: "l" },
    { hand: "right", finger: "pinkie", key: "semicolon" }
  ];

  const [progress, setProgress] = useState(0);
  const [prompt, setPrompt] = useState(choice(fingers));

  useEffect(() => {
    const updateInterval = 30; // in ms

    let interval = setInterval(() => {
      if (recording) {
        setProgress(progress => progress + (updateInterval / 3000) * 100);

        if (progress === 80) {
          let newPrompt = choice(fingers);
          sendPrompt({ newPrompt }, onPrompt);
        }

        if (progress >= 100) {
          setProgress(0);

          let newPrompt = choice(fingers);
          setPrompt(newPrompt);
        }
      } else setProgress(0);
    }, updateInterval);

    return () => clearInterval(interval);
  }, [fingers, onPrompt, progress, recording]);

  const keyHandler = useCallback(
    event => recording && sendData({ key: event.key }, onKey),
    [onKey, recording]
  );

  useEffect(() => {
    document.addEventListener("keydown", keyHandler, false);
    return () => document.removeEventListener("keydown", keyHandler, false);
  }, [keyHandler]);

  return (
    <div>
      <div className='notGrey'>
        <ProgressBar percent={progress} />
        <div className='line'>
          <img width='25px' align='center' src={Green} alt="" />
        </div>
      </div>
      <Typography variant="h4">
        {recording ? (
          <>
            Press the "{prompt.key}" key when the bar reaches the green dot
          </>
        ) : (
            <>Waiting...</>
          )
        }
      </Typography>
      {recording &&
        (progress > 80 ? (
          <div className='notGrey'>
            <div className='image1'>
              <img width='40%' src={Hands} alt="" />
            </div>
            <div className={prompt.key} >
              <img width='3%' src={Green} alt="" />
            </div>
          </div>
        ) : (
            <div className='parent'>
              <div className='image1'>
                <img width='40%' src={Hands} alt="" />
              </div>
              <div className={prompt.key} >
                <img width='3%' src={Green} alt="" />
              </div>
            </div>
          ))
      }
    </div>
  );
}

export default GuidedRecorder;
