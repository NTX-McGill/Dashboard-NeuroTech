import React, { Component } from "react";
import Sketch from "react-p5";
import socketIOClient from "socket.io-client";

export default class App extends Component {
  setup = (p5, canvasParentRef) => {
    let sketchHeight = this.props.height;
    let sketchWidth = this.props.width;
    let numSamples = 100;
    let numFingers = 10;
    let w = sketchWidth / numSamples;
    let h = sketchHeight / numFingers;
    let yAxisWidth = 100;
    let leftMargin = 10;
    const socket = socketIOClient("http://localhost:4002");
    let fingerLabels = [
      "Nothing",
      "Right Thumb",
      "Right Index",
      "Right Middle",
      "Right Ring",
      "Right Pinky",
      "Left Index",
      "Left Middle",
      "Left Ring",
      "Left Pinky",
    ];

    let colors = [
      "#f7fbff",
      "#e1edf8",
      "#cbdff1",
      "#abd0e6",
      "#82badb",
      "#59a2cf",
      "#3787c0",
      "#1b6aaf",
      "#084d97",
      "#08306b",
    ];

    let probsData = [[0, 0.2, 0.8, 0, 0, 0, 0, 0, 0, 0]];
    let color_id = 0;

    function updateChart(newData) {
      // probs array with shape 10

      newData = JSON.parse(newData);
      newData = newData.map((val) => Number(val));
      console.log(newData);
      probsData.push(newData);
      if (probsData.length > numSamples) {
        probsData.splice(0, 1);
      }

      for (let i = 0; i < probsData.length; i++) {
        //x
        for (let j = 0; j < numFingers; j++) {
          // y
          // values range from 0 to 1. Multiply value by colors length and floor it
          color_id = Math.floor(probsData[i][j] * (colors.length - 1));
          p5.fill(colors[color_id]);
          p5.rect(i * w + yAxisWidth, (numFingers - j - 1) * h, w, h);
        }
      }
      displayAxis();
    }

    function displayLabels() {
      p5.fill('black');
      p5.strokeWeight(0);
      for (let i = 0; i < fingerLabels.length; i++) {
        p5.text(fingerLabels[i], 0 + leftMargin, i * h + h/2);
      }
    }

    function displayAxis() {
      p5.strokeWeight(1);
      p5.stroke(0);
      for (let i = 0; i < numFingers + 1; i++) {
        p5.line(0 + yAxisWidth, h * i, sketchWidth, h * i);
      }
      p5.strokeWeight(0);
    }
    // use parent to render canvas in this ref (without that p5 render this canvas outside your component)
    p5.createCanvas(sketchWidth, sketchHeight).parent(canvasParentRef);
    p5.strokeWeight(0);
    p5.stroke(0);
    p5.background(240);
    p5.fill('white');
    p5.rect(yAxisWidth, 0, sketchWidth - yAxisWidth, sketchHeight);
    displayAxis();
    displayLabels();

    socket.on("FingerProbs", function (data) {
      updateChart(data);
    });
  };

  render() {
    return <Sketch setup={this.setup} draw={this.draw} />;
  }
}
