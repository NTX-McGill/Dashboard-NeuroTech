import React, { useState } from "react";

import { Container, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import EnterNameSnackbar from "./EnterNameSnackbar";
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
  const [name, setName] = useState("");
  const [customPrompts, setCustomPrompts] = useState("");
  const [notes, setNotes] = useState("");
  const [mode, setMode] = useState(1);
  const [snackbarNameOpen, setSnackbarNameOpen] = useState(false);
  const [snackbarPromptsOpen, setSnackbarPromptsOpen] = useState(false);
  const [events, setEvents] = useState([]);

  const classes = useStyles();

  const click = () => {
    if (!recording) {
      if (name === "") setSnackbarNameOpen(true);
      else if (mode === 2 && customPrompts === "") setSnackbarPromptsOpen(true);
      else {
        setSnackbarNameOpen(false);
        setSnackbarPromptsOpen(false);
        setEvents([]);
        newSession({ name, notes, customPrompts, mode }, () => setRecording(true));
      }
    } else setRecording(false);
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
      <EnterNameSnackbar
        open={snackbarNameOpen}
        onClose={(_, reason) =>
          reason === "clickaway" || setSnackbarNameOpen(false)
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
          {...{ click, recording, name, setName, notes, setNotes, customPrompts, setCustomPrompts, mode, setMode }}
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
