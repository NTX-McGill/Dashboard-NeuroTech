import React, { useCallback, useEffect } from "react";

import { Typography } from "@material-ui/core";

import { sendData } from "./Bridge";

function SelfDirectedRecorder({ recording, onKey }) {
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
            <Typography variant="h4">
                {recording ? <>Start typing!</> : <>Waiting...</>}
            </Typography>
        </div>
    )
}

export default SelfDirectedRecorder;