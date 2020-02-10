import React, { useCallback, useEffect, useState } from "react";
import { Container, LinearProgress, Typography } from "@material-ui/core";
import { makeStyles, withStyles } from "@material-ui/core/styles";

function addZero(x, n) {
  while (x.toString().length < n) {
    x = "0" + x;
  }
  return x;
}

function getDateTime() {
  let timestamp = Date.now();
  let datetime = new Date(timestamp);

  return [
    timestamp,
    datetime.getFullYear() +
      "-" +
      addZero(datetime.getMonth() + 1, 2) +
      "-" +
      addZero(datetime.getDate(), 2) +
      "-" +
      addZero(datetime.getHours(), 2) +
      ":" +
      addZero(datetime.getMinutes(), 2) +
      ":" +
      addZero(datetime.getSeconds(), 2) +
      ":" +
      addZero(datetime.getMilliseconds(), 3)
  ];
}

function choice(array) {
  return array[Math.floor(Math.random() * array.length)];
}

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
    marginBottom: theme.spacing(2)
  }
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

  const [prompt, setPrompt] = useState(choice(fingers));

  useEffect(() => {
    let interval = setInterval(() => {
      let factor = direction ? 1 : -1;
      setProgress(progress + (updateInterval / 3000) * 100 * factor);

      if ((progress > 100 && direction) || (progress < 0 && !direction)) {
        setDirection(!direction);

        let newPrompt = choice(fingers);
        setPrompt(newPrompt);
        let [timestamp, datetime] = getDateTime();
        fetch(
          "http://localhost:5000/prompt?datetime=" +
            datetime +
            "&timestamp=" +
            timestamp +
            "&hand=" +
            newPrompt.hand +
            "&finger=" +
            newPrompt.finger
        );
      }
    }, updateInterval);

    return () => clearInterval(interval);
  });

  let keyHandler = useCallback(event => {
    let [timestamp, datetime] = getDateTime();
    fetch(
      "http://localhost:5000/data-collection?datetime=" +
        datetime +
        "&timestamp=" +
        timestamp +
        "&key=" +
        event.key
    );
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", keyHandler, false);
    return () => document.removeEventListener("keydown", keyHandler, false);
  });

  return (
    <div className={classes.root}>
      <Container maxWidth="md">
        <ProgressBar
          variant="determinate"
          value={progress}
          className={classes.progressBar}
        />
        <Typography variant="h4">
          Press the "{prompt.key}" key with your {prompt.hand} {prompt.finger}
        </Typography>
      </Container>
    </div>
  );
}

export default App;
