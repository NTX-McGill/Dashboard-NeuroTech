import React from 'react';

import { Button, Grid, TextField, } from '@material-ui/core';
import { makeStyles, } from '@material-ui/core/styles';

const useStyles = makeStyles({
    fullWidth: {
        width: '100%',
    },
});

function SessionInfoForm({ click, recording, name, setName, notes, setNotes }) {
    const classes = useStyles();

    return (
        <Grid container spacing={4} alignItems='flex-start'>
            <Grid item xs={4}>
                <TextField
                    className={classes.fullWidth}
                    InputProps={{
                        readOnly: recording,
                    }}
                    label='Name'
                    margin='dense'
                    onChange={event => setName(event.target.value)}
                    variant={recording ? 'filled' : 'outlined'}
                    width={1}
                    value={name}
                />
                <br /><br />
                <Button
                    className={classes.fullWidth}
                    color='primary'
                    onClick={click}
                    size='medium'
                    variant='contained'
                    width={1}
                >
                    {recording ? 'Stop' : 'Start'} recording
                </Button>
            </Grid>
            <Grid item xs>
                <TextField
                    className={classes.fullWidth}
                    InputProps={{
                        readOnly: recording,
                    }}
                    label='Extra notes'
                    margin='dense'
                    multiline
                    onChange={event => setNotes(event.target.value)}
                    rows={4}
                    value={notes}
                    variant={recording ? 'filled' : 'outlined'}
                />
            </Grid>
        </Grid>
    );
}

export default SessionInfoForm;