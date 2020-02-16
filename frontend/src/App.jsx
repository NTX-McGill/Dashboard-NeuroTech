import React, { useState } from "react";

import { Container, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import EnterNameSnackbar from "./EnterNameSnackbar";
import EventList from "./EventList";
import Recorder from "./Recorder";
import SessionInfoForm from "./SessionInfoForm";
import { newSession } from "./Bridge";
import { format } from "./Utilities";

const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing() * 4
  }
}));

function App() {
  const [recording, setRecording] = useState(false);
  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [events, setEvents] = useState([]);

  const classes = useStyles();

  const click = () => {
    if (!recording) {
      if (name === "") setSnackbarOpen(true);
      else {
        setSnackbarOpen(false);
        setEvents([]);
        newSession({ name, notes }, () => setRecording(true));
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
        open={snackbarOpen}
        onClose={(_, reason) =>
          reason === "clickaway" || setSnackbarOpen(false)
        }
      />

      <Container maxWidth="lg">
        <br />
        <Typography variant="h2">
          NeuroTech 2020 - Recording Dashboard
        </Typography>
        <br />
        <SessionInfoForm
          {...{ click, recording, name, setName, notes, setNotes }}
        />
        <br />
        <br />
        <Recorder {...{ recording, onKey, onPrompt }} />
        <br />
        <br />
        <EventList {...{ events }} />
      </Container>
    </div>
  );
}

export default App;
