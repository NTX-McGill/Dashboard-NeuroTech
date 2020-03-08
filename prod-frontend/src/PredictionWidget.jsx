import React, { useEffect, useState } from "react";

import { Divider, Paper, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import Green from "./green.png";
import Hands from "./hand.png";
import "./predictionWidget.css";
import { choice } from "./Utilities";

const useStyles = makeStyles(theme => ({
  divider: {
    marginBottom: theme.spacing() * 2,
    marginTop: theme.spacing() * 2
  }
}));

function PredictionWidget({ paperCN }) {
  const classes = useStyles();

  const [prediction, setPrediction] = useState("d");

  return (
    <Paper className={paperCN}>
      <Typography variant="h4">Predictions</Typography>
      <Divider className={classes.divider} />
      <div className="notGrey">
        <div className="image1">
          <img width="100%" src={Hands} alt="" />
        </div>
        <div className={prediction}>
          <img width="7.5%" src={Green} alt="" />
        </div>
      </div>
    </Paper>
  );
}

export default PredictionWidget;
