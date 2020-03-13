import React from 'react';
import { Snackbar, } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';

function RecordingStoppedSnackbar({ onClose, open }) {
    return (
        <Snackbar open={open} autoHideDuration={4000} onClose={onClose}>
            <MuiAlert elevation={6} variant="filled" onClose={onClose} severity="info">
                Recording stopped!
            </MuiAlert>
        </Snackbar>
    );
}

export default RecordingStoppedSnackbar;