
let sketchHeight = 400;
let sketchWidth = 800;
let numSamples = 100;
let numFingers = 10;
let w = sketchWidth / numSamples;
let h = sketchHeight / numFingers;
const socket = io('http://localhost:4002');
let fingerLabels = ['Nothing', 'Right Thumb', 'Right Index', 'Right Middle', 'Right Ring', 'Right Pinky', 'Left Index', 'Left Middle', 'Left Ring', 'Left Pinky'];

let colors = ["#f7fbff", "#e1edf8", "#cbdff1", "#abd0e6", "#82badb", "#59a2cf", "#3787c0", "#1b6aaf", "#084d97", "#08306b"];

let probsData = [[0, 0.2, 0.8, 0, 0, 0, 0, 0, 0, 0]];
let color_id = 0;

// file:///home/gautierk/Projects/Dashboard-NeuroTech/p5/index.html
function setup() { 
  createCanvas(sketchWidth, sketchHeight);
  strokeWeight(0);
  stroke(0);
  background(220);

  function updateChart(newData) { // probs array with shape 10

    newData = JSON.parse(newData);
    newData = newData.map(val => Number(val));
    console.log(newData);
    probsData.push(newData);
    if (probsData.length > numSamples) {
      probsData.splice(0, 1);
    }

    for (let i = 0; i < probsData.length; i++) { //x
      for (let j = 0; j < numFingers; j++) { // y
        // values range from 0 to 1. Multiply value by colors length and floor it
        color_id = Math.floor(probsData[i][j] * (colors.length - 1));
        // probsData[i][j] 
        // console.log(color_id);
        // console.log(colors[color_id]);
        fill(colors[color_id]);
        // x, y, w, h
        rect(i * w, (numFingers - j - 1) * h, w, h);
      }
    }
  }

  // updateChart(probsData[0]);

  socket.on("FingerProbs", function (data) {
    updateChart(data);
  });
} 

