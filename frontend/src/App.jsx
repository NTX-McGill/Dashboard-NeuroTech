import React, { useEffect, useState } from "react";
import { Container, LinearProgress, Typography } from "@material-ui/core";
import { makeStyles, withStyles } from "@material-ui/core/styles";

const ProgressBar = withStyles({
  root: {
    height: 15
  }
})(LinearProgress);

const useStyles = makeStyles(theme => ({
  root: {
    margin: 20
  },
  progressBar: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
}));

function App() {
  let updateInterval = 200;
  let fingers = [
    ["left", "pinkie", "a"],
    ["left", "ring finger", "s"],
    ["left", "middle finger", "d"],
    ["left", "index finger", "f"],
    ["right", "index finger", "j"],
    ["right", "middle finger", "k"],
    ["right", "ring finger", "l"],
    ["right", "pinkie", ";"]
  ].map(array => ({
    hand: array[0],
    finger: array[1],
    key: array[2]
  }));

  const classes = useStyles();

  const [progress, setProgress] = useState(0);
  const [direction, setDirection] = useState(true); // increasing=true, decreasing=false

  const [prompt, setPrompt] = useState(fingers.sample());

  useEffect(() => {
    let interval = setInterval(() => {
      let factor = direction ? 1 : -1;
      setProgress(progress + (updateInterval / 3000) * 100 * factor);

      if ((progress > 100 && direction) || (progress < 0 && !direction)) {
        setDirection(!direction);
        setPrompt(fingers.sample());
      }
    }, updateInterval);

    return () => clearInterval(interval);
  });

  return (
    <div className={classes.root}>
      <Container maxWidth="md">
        <ProgressBar variant="determinate" value={progress} className={classes.progressBar} />
        <Typography variant="h4">
          Press the "{prompt.key}" key with your {prompt.hand} {prompt.finger}
        </Typography>
      </Container>
    </div>
  );
}

export default App;
