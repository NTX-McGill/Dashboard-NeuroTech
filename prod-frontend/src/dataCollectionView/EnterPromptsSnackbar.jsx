import React from 'react';
import { Snackbar, } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';

function EnterPromptSnackbar({ onClose, open }) {
    return (
        <Snackbar open={open} autoHideDuration={6000} onClose={onClose}>
            <MuiAlert elevation={6} variant="filled" onClose={onClose} severity="error">
                You must enter custom prompts to use the In the Air mode.
            </MuiAlert>
        </Snackbar>
    );
}

export default EnterPromptSnackbar;