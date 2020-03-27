import React, { useState } from "react";

import { AppBar, Container, Tab, Tabs, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import ChartPage from "./ChartPage";
import DataCollection from "./dataCollection/DataCollection";

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
  navigation: {
    marginBottom: theme.spacing(4),
  },
}));

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

function App() {
  const [tab, setTab] = useState(0);

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Container maxWidth="xl">
        <Typography className={classes.title} variant="h3">
          McGill NeuroTech 2020 - Production Dashboard
        </Typography>
        <Tabs
          className={classes.navigation}
          value={tab}
          onChange={(tab, newValue) => setTab(newValue)}
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="Chart View" {...a11yProps(0)} />
          <Tab label="Data Collection" {...a11yProps(1)} />
        </Tabs>

        {/* <Grid container spacing={4}>
          <Grid item xs={3}>
            <PredictionWidget paperCN={classes.paper} />
          </Grid>
        </Grid> */}
      </Container>

      {[<ChartPage />, <DataCollection />][tab]}
    </div>
  );
}

export default App;
