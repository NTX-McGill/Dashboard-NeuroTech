import React from "react";

import {
	Button,
	Grid,
	TextField,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
	fullWidth: {
		width: "100%"
	},
	selectFormControl: {
		minWidth: 120
	}
});

function SessionInfoForm({
	click,
	recording,
	id,
	setId,
	notes,
	setNotes,
}) {
	const classes = useStyles();

	return (
		<Grid container spacing={4} alignItems="flex-start">
			<Grid item xs={4}>
				<TextField
					className={classes.fullWidth}
					InputProps={{
						readOnly: recording
					}}
					label="Subject ID"
					margin="dense"
					onChange={event => setId(event.target.value)}
					variant={recording ? "filled" : "outlined"}
					width={1}
					value={id}
				/>
				<br />
				<br />
				<Button
					className={classes.fullWidth}
					color="primary"
					onClick={click}
					size="medium"
					variant="contained"
					width={1}
				>
					{recording ? "Cancel" : "Start"} calibration
        		</Button>
			</Grid>
			<Grid item xs>
				<TextField
					className={classes.fullWidth}
					InputProps={{
						readOnly: recording
					}}
					label="Extra notes"
					margin="dense"
					multiline
					onChange={event => setNotes(event.target.value)}
					rows={7}
					value={notes}
					variant={recording ? "filled" : "outlined"}
				/>
			</Grid>
		</Grid>
	);
}

export default SessionInfoForm;
