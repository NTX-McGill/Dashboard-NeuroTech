import React, { useEffect, useState } from "react";

import { Typography } from "@material-ui/core";

import { sendCustomPrompt } from "./Bridge";
import ProgressBar from "./ProgressBar";
import { choice } from "./Utilities";

import Green from './green.png';
import './app.css';

function InTheAirRecorder({ recording, onCustomPrompt, customPrompts }) {
    const fingers = customPrompts.split(',');
    const [customPrompt, setCustomPrompt] = useState(choice(fingers));

    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const updateInterval = 30; // in ms

        let interval = setInterval(() => {
            if (recording) {
                if (progress === 0) {
                    let newCustomPrompt = choice(fingers);
                    setCustomPrompt(newCustomPrompt);
                }  
                setProgress(progress => progress + (updateInterval / 3000) * 100);

                if (progress === 80) {
                    let newCustomPrompt = customPrompt
                    sendCustomPrompt({ newCustomPrompt }, onCustomPrompt);
                }

                if (progress >= 100) {
                    setProgress(0);
                }
            } else setProgress(0);
        }, updateInterval);

        return () => clearInterval(interval);
    }, [fingers, onCustomPrompt, progress, recording]);
 
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
                    <>"{customPrompt}" when the bar reaches the green dot</>
                ) : (
                        <>Waiting...</>
                    )
                }
            </Typography>
        </div>
    );
}

export default InTheAirRecorder;
