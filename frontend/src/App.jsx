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
  var d = new Date();
  var year = d.getFullYear();
  var month = addZero(d.getMonth(), 2);
  var date = addZero(d.getDate(), 2);
  var h = addZero(d.getHours(), 2);
  var m = addZero(d.getMinutes(), 2);
  var s = addZero(d.getSeconds(), 2);
  var ms = addZero(d.getMilliseconds(), 3);
  return (
    year + "-" + month + "-" + date + "-" + h + ":" + m + ":" + s + ":" + ms
  );
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
        fetch(
          "http://localhost:5000/prompt?timestamp=" +
            getDateTime() +
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
    fetch(
      "http://localhost:5000/data-collection?timestamp=" +
        getDateTime() +
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
