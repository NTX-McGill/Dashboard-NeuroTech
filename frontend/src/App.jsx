import React, { useState } from "react";

import { Container, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import EnterIdSnackbar from "./EnterIdSnackbar";
import EnterPromptsSnackbar from "./EnterPromptsSnackbar";
import EventList from "./EventList";
import GuidedRecorder from "./GuidedRecorder";
import SessionInfoForm from "./SessionInfoForm";
import { newSession } from "./Bridge";
import { format } from "./Utilities";
import SelfDirectedRecorder from "./SelfDirectedRecorder";
import InTheAirRecorder from "./InTheAirRecorder";

const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing() * 4
  }
}));

function App() {
  const [recording, setRecording] = useState(false);
  const [id, setId] = useState("");
  const [customPrompts, setCustomPrompts] = useState("");
  const [notes, setNotes] = useState("");
  const [mode, setMode] = useState(1);
  const [snackbarIdOpen, setSnackbarIdOpen] = useState(false);
  const [snackbarPromptsOpen, setSnackbarPromptsOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const [hand, setHand] = React.useState('both');
  const [trial, setTrial] = React.useState(0);

  const classes = useStyles();

  const click = () => {
    if (!recording) {
      if (id === "") setSnackbarIdOpen(true);
      else if (mode === 2 && customPrompts === "") setSnackbarPromptsOpen(true);
      else {
        setSnackbarIdOpen(false);
        setSnackbarPromptsOpen(false);
        setEvents([]);
        let prompts = customPrompts;
        if (mode === 1){
          prompts = "left pinkie a , left ring finger s , left middle finger d ,left index finger f ,right index finger j ,right middle finger k ,right ring finger l ,right pinkie semicolon" ;
        }
        newSession({ id, notes, prompts, mode, hand, trial }, () => setRecording(true));
      }
    } else {
      setRecording(false);
      setTrial(parseFloat(trial) + 1);
    }
  };

  const onPrompt = ({ newPrompt, datetime, timestamp }) => {
    setEvents(events => [
      [
        format(
          'Prompted "{0}" key with {1} {2}',
          newPrompt.key,
          newPrompt.hand,
          newPrompt.finger
        ),
        datetime + format(" ({0})", timestamp)
      ],
      ...events
    ]);
  };

  const onCustomPrompt = ({ newCustomPrompt, datetime, timestamp }) => {
    setEvents(events => [
      [
        format(
          'Prompted "{0}"',
          newCustomPrompt
        ),
        datetime + format(" ({0})", timestamp)
      ],
      ...events
    ]);
  };

  const onKey = ({ key, datetime, timestamp }) => {
    setEvents(events => [
      [
        format('"{0}" key pressed', key),
        datetime + format(" ({0})", timestamp)
      ],
      ...events
    ]);
  };

  return (
    <div className={classes.root}>
      <EnterIdSnackbar
        open={snackbarIdOpen}
        onClose={(_, reason) =>
          reason === "clickaway" || setSnackbarIdOpen(false)
        }
      />

      <EnterPromptsSnackbar
        open={snackbarPromptsOpen}
        onClose={(_, reason) =>
          reason === "clickaway" || setSnackbarPromptsOpen(false)
        }
      />

      <Container maxWidth="lg">
        <br />
        <Typography variant="h2">
          NeuroTech 2020 - Recording Dashboard
        </Typography>
        <br />
        <SessionInfoForm
          {...{ click, recording, id, setId, notes, setNotes, customPrompts, setCustomPrompts, mode, setMode, hand, trial, setTrial, setHand }}
        />
        <br />
        <br />
        {mode === 0 && <SelfDirectedRecorder {...{ recording, onKey, onPrompt }} />}
        {mode === 1 && <GuidedRecorder {...{ recording, onKey, onPrompt }} />}
        {mode === 2 && <InTheAirRecorder {...{ recording, onCustomPrompt, customPrompts }} />}
        <br />
        <br />
        <EventList {...{ events }} />
      </Container>
    </div>
  );
}

export default App;
