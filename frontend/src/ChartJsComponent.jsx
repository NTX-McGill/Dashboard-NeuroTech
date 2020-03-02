import React from "react";
import { Line } from "react-chartjs-2";

function shuffle(array) {
  let counter = array.length;

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}

const data = {
  labels: ["January", "February", "March", "April", "May", "June", "July", 1, 2, 3, 4, 5, 6, 7, 9, 0, 123, 6, 4, ],
  datasets: [
    {
      label: "My First dataset",
      fill: false,
      lineTension: 0.1,
      backgroundColor: "rgba(75,192,192,0.4)",
      borderColor: "rgba(75,192,192,1)",
      borderCapStyle: "butt",
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: "miter",
      pointBorderColor: "rgba(75,192,192,1)",
      pointBackgroundColor: "#000",
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: "rgba(75,192,192,1)",
      pointHoverBorderColor: "rgba(220,220,220,1)",
      pointHoverBorderWidth: 2,
      pointRadius: 10,
      pointHitRadius: 10,
      data: shuffle([59, 80, 80, 56, 55, 40, 270, 5, 3, 30, 54, 56, 78, 32, 97])
    },
    {
      label: "My second dataset",
      fill: false,
      lineTension: 0.1,
      backgroundColor: "rgba(255,0,192,0.4)",
      borderColor: "rgba(255,0,192,1)",
      borderCapStyle: "butt",
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: "miter",
      pointBorderColor: "rgba(255,0,192,1)",
      pointBackgroundColor: "#fff",
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: "rgba(255,0,192,1)",
      pointHoverBorderColor: "rgba(255,0,220,1)",
      pointHoverBorderWidth: 2,
      pointRadius: 10,
      pointHitRadius: 10,
      data: [59, 80, 80, 56, 55, 40, 270, 5, 3, 30, 54, 56, 78, 32, 97]
    }
  ]
};

function ChartJsComponent() {
  return <Line data={data} />;
}

export default ChartJsComponent;
