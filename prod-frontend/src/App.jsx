import React from "react";

import { Container, Grid, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import PredictionWidget from "./PredictionWidget";

import Bar_Chart from "./ChartJsComponent.jsx";
import Line_Chart from "./Chart_Iemg.jsx";
import Channel_1_Chart from "./Chart_feature1.jsx";

const useStyles = makeStyles(theme => ({
  paper: {
    minHeight: 300,
    padding: theme.spacing() * 2,
  },
  root: {
    margin: theme.spacing() * 4
  },
  title: {
    marginBottom: theme.spacing() * 4,
  },
}));

function App() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Container maxWidth="xl">
        <Typography className={classes.title} variant="h3">
          McGill NeuroTech 2020 - Production Dashboard
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={3}>
            <PredictionWidget paperCN={classes.paper} />
          </Grid>
        </Grid>
      </Container>
      <Bar_Chart/>
      <Line_Chart/>
      <Channel_1_Chart/>
    </div>
  );
}

export default App;
