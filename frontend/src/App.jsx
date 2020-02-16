import React, { useState } from 'react';

import { Container } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import EnterNameSnackbar from './EnterNameSnackbar';
import Recorder from './Recorder';
import SessionInfoForm from './SessionInfoForm';
import { newSession } from './Bridge';

const useStyles = makeStyles(theme => ({
    root: {
        margin: theme.spacing() * 4,
    },
}));

function App() {
    const [recording, setRecording] = useState(false);
    const [name, setName] = useState('');
    const [notes, setNotes] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    const classes = useStyles();

    const click = () => {
        if (!recording) {
            if (name === '')
                setSnackbarOpen(true);
            else {
                setSnackbarOpen(false);
                newSession({ name, notes }, () => setRecording(true));
            }
        } else
            setRecording(false);
    };

    return (
        <div className={classes.root}>
            <EnterNameSnackbar open={snackbarOpen} onClose={
                (_, reason) => reason === 'clickaway' || setSnackbarOpen(false)
            } />

            <Container maxWidth='md'>
                <br />
                <SessionInfoForm {...{ click, recording, name, setName, notes, setNotes }} />
                <br /><br />
                <Recorder {...{ recording }} />
            </Container>
        </div>
    );
}

export default App;