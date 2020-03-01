import React from 'react';

import { Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField, } from '@material-ui/core';
import { makeStyles, } from '@material-ui/core/styles';

const useStyles = makeStyles({
    fullWidth: {
        width: '100%',
    },
    selectFormControl: {
        minWidth: 120,
    }
});

function SessionInfoForm({ click, recording, name, setName, notes, setNotes, customPrompts, setCustomPrompts, mode, setMode }) {
    const classes = useStyles();

    return (
        <Grid container spacing={4} alignItems='flex-start'>
            <Grid item xs={4}>
                <TextField
                    className={classes.fullWidth}
                    InputProps={{
                        readOnly: recording,
                    }}
                    label='Subject ID'
                    margin='dense'
                    onChange={event => setName(event.target.value)}
                    variant={recording ? 'filled' : 'outlined'}
                    width={1}
                    value={name}
                />
                <br /><br />
                <FormControl className={classes.selectFormControl}>
                    <InputLabel>Recording mode</InputLabel>
                    <Select
                        inputProps={{ readOnly: recording }}
                        onChange={event => setMode(event.target.value)}
                        value={mode}
                        variant={recording ? 'filled' : 'standard'}
                    >
                        <MenuItem value={0}><b>Self-directed:</b>&nbsp;type at your own pace; no prompt</MenuItem>
                        <MenuItem value={1}><b>Guided:</b>&nbsp;receive set prompts to type keys</MenuItem>
                        <MenuItem value={2}><b>In the air:</b>&nbsp;respond to timed custom commands</MenuItem>
                    </Select>
                </FormControl>
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
            {mode === 2 ? 
            <Grid item xs>
                <TextField
                    className={classes.fullWidth}
                    InputProps={{
                        readOnly: recording,
                    }}
                    label='Custom prompts (separate by commas)'
                    margin='dense'
                    multiline
                    onChange={event => setCustomPrompts(event.target.value)}
                    variant={recording ? 'filled' : 'outlined'}
                    width={1}
                    rows={7}
                    value={customPrompts}
                />
            </Grid>
            : <></>}
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
                    rows={7}
                    value={notes}
                    variant={recording ? 'filled' : 'outlined'}
                />
            </Grid>
        </Grid>
    );
}

export default SessionInfoForm;