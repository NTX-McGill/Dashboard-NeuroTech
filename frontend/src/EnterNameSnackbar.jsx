import React from 'react';
import { Snackbar, } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';

function EnterNameSnackbar({ onClose, open }) {
    return (
        <Snackbar open={open} autoHideDuration={6000} onClose={onClose}>
            <MuiAlert elevation={6} variant="filled" onClose={onClose} severity="error">
                You must enter a name to record data.
            </MuiAlert>
        </Snackbar>
    );
}

export default EnterNameSnackbar;