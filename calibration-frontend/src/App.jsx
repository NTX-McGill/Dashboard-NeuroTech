import React, { useState } from "react";

import { Container } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import EnterIdSnackbar from "./EnterIdSnackbar";
import EventList from "./EventList";
import GuidedRecorder from "./GuidedRecorder";
import SessionInfoForm from "./SessionInfoForm";
import { newSession, sendContinueCalibration, getCalibrationDone } from "./Bridge";
import { format } from "./Utilities";
import RecordingStoppedSnackbar from "./RecordingStoppedSnackbar";
import { useEffect } from "react";

const useStyles = makeStyles(theme => ({
	root: {
		margin: theme.spacing() * 4
	}
}));

function App() {
	const [recording, setRecording] = useState(false);
	const [id, setId] = useState("");
	const [notes, setNotes] = useState("");
	const [snackbarIdOpen, setSnackbarIdOpen] = useState(false);
	const [snackbarRecordingStoppedOpen, setSnackbarRecordingStoppedOpen] = useState(false);
	const [events, setEvents] = useState([]);
	const [calibrating, setCalibrating] = useState(false);
	const [calibrationDone, setCalibrationDone] = useState(false);

	const classes = useStyles();

	useEffect(() => {
		let interval = setInterval(() => {
			if (calibrating) {
				getCalibrationDone(res => res.json().then(json => {
					console.log(json);
					setCalibrationDone(json.done);
				}));
			}
		}, 200);
		return () => clearInterval(interval);
	}, [calibrating]);

	const closeSnackbars = () => {
		setSnackbarIdOpen(false);
		setSnackbarRecordingStoppedOpen(false);
	};

	const stopRecording = continueCalibration => {
		setRecording(false);
		setSnackbarRecordingStoppedOpen(true);

		if (!!continueCalibration)
			sendContinueCalibration(() => setCalibrating(true));
	};

	const click = () => {
		if (!recording) {
			if (id === "") setSnackbarIdOpen(true);
			else {
				closeSnackbars();
				setEvents([]);
				let prompts = "left pinkie a , left ring finger s , left middle finger d ,left index finger f ,right index finger j ,right middle finger k ,right ring finger l ,right pinkie semicolon";
				newSession({ id, notes, prompts }, () =>
					setRecording(true)
				);
			}
		} else stopRecording();
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
			<EnterIdSnackbar
				open={snackbarIdOpen}
				onClose={(_, reason) =>
					reason === "clickaway" || setSnackbarIdOpen(false)
				}
			/>

			<RecordingStoppedSnackbar
				open={snackbarRecordingStoppedOpen}
				onClose={(_, reason) =>
					reason === 'clickaway' || setSnackbarRecordingStoppedOpen(false)
				}
			/>
			<Container maxWidth="xl">
				{calibrating
					? <>{calibrationDone + ""}</>
					: <>
						<SessionInfoForm
							{...{
								click,
								recording,
								id,
								setId,
								notes,
								setNotes,
							}}
						/>
						<br />
						<br />
						<GuidedRecorder {...{ recording, onKey, onPrompt, stopRecording }} />
						<br />
						<br />
						<EventList {...{ events }} />
					</>
				}
			</Container>
		</div>
	);
}

export default App;
