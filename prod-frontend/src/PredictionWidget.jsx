import React, { useEffect, useState, Component } from "react";
import socketIOClient from "socket.io-client";

import { Divider, Paper, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import Green from "./green.png";
import Hands from "./hand.png";
import "./predictionWidget.css";
import { choice } from "./Utilities";

const data = ['a','s','d','f','j','k','l','semicolon','space'];
let finger = 'a';

class PredictionWidget extends Component {

  constructor() {
    super();
    this.state = {
      response: false,
      endpoint: "http://localhost:4001"
    };
  }

  componentDidMount() {
    const { endpoint } = this.state;
    const socket = socketIOClient(endpoint);
    socket.on("Finger", new_data => {
      console.log(new_data);
      this.setState({ prediction: new_data })
      finger = data[new_data];
    });
  }
  render() {
    return (
      <Paper className="paper">
      <Typography variant="h4">Predictions</Typography>
      <Divider className="divider"/>
      <p> {finger} </p>
      <div className="notGrey">
        <div className="image1">
          <img width="100%" src={Hands} alt="" />
        </div>
        <div className={finger}>
          <img width="15px" src={Green} alt="" />
        </div>
      </div>
    </Paper>
    )
  
  }
}

export default PredictionWidget;