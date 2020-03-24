import React, { Component } from "react";
import Heatmap from "react-simple-heatmap"
// import Chart from 'react-apexcharts';
// import ApexCharts from 'apexcharts';
import socketIOClient from "socket.io-client";




const barData = {
  labels: ['Nothing', 'Right Thumb', 'Right Index', 'Right Middle', 'Right Ring', 'Right Pinky', 'Left thumb', 'Left Index', 'Left Middle', 'Left Ring', 'Left Pinky'],
  datasets: [
    {
      label: 'My First dataset',
      backgroundColor: 'rgba(255,99,132,0.2)',
      borderColor: 'rgba(255,99,132,1)',
      borderWidth: 1,
      hoverBackgroundColor: 'rgba(255,99,132,0.4)',
      hoverBorderColor: 'rgba(255,99,132,1)',
      data: [0, 0, 0, 0, 0, 0, 0, 0, 0]
    }
  ]
};

function generateData(count, yrange) {
  var i = 0;
  var series = [];
  while (i < count) {
    var x = (i + 1).toString();
    var y = Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;
    series.push({
      x: x,
      y: y
    });
    i++;
  }
  return series;
}

class FingerHeatmap extends Component {
  constructor(props) {
    super(props);

    let fingerLabels = ['Nothing', 'Right Thumb', 'Right Index', 'Right Middle', 'Right Ring', 'Right Pinky', 'Left thumb', 'Left Index', 'Left Middle', 'Left Ring', 'Left Pinky'];
    let series = [];
    let zeroData = [];
    for (let i = 0; i < 8; i++) {
      let rowData = [];
      for (let j = 0; j < 10; j++) {
        rowData.push(Math.random());
      }
      series.push(rowData);
    }

    this.state = {
      counter: props.blockWidth + 1,
      series: series,
      options: {
        chart: {
          id: 'heatmap',
          height: 350,
          type: 'heatmap',
          animations: {
            enabled: false,
            dynamicAnimation: {
              enabled: false
            }
          }
        },
        dataLabels: {
          enabled: false
        },
        colors: ["#008FFB"],
        title: {
          text: 'HeatMap Chart (Single color)'
        },
      },
      test_data: [[10, 12, 33],
            [21, 45, 31],
            [16, 32, 29]],
    }
  }

  componentDidMount() {
    console.log("Chart Mounted");
    const endpoint = "http://localhost:4001";
    const socket = socketIOClient(endpoint);
    socket.on("FingerProbs", new_data => {
      let int_data = JSON.parse(new_data);
      let series = this.state.series;
      console.log(int_data);
      console.log(series);

      // series = series.map((val, i) => val.slice(0, -1).push(int_data[i]));
      series.splice(0, 1);
      series.push(int_data);
      let random_data = [];
      for (let i = 0; i < 8; i++) {
        random_data.push(Math.random());
      }
      series.push(random_data);
      // for (let i = 0; i < series.length; i++) {
      //   series[i].splice(0, 1);
      //   series[i].push(int_data[i]);
      // }
      console.log(series);

      // for (let i = 0; i < 9; i++) {

      //   series[i].data.shift();
      //   // for (let j = 0; j < 17; j++) {
      //   //   console.log(series[i]);
      //   //   series[i].data[j + 1].x = j;
      //   // }
      //   series[i].data.push({ x: "" + this.state.counter, y: (int_data[i] * 100) });
      // }
      this.setState({
        counter: this.state.counter + 1,
        series: series,
        options: this.state.options,
        test_data: this.state.test_data
      })
    });
  }
  render() {
    return (
      <div className="app">
        <div className="row">
          <div className="mixed-chart" style={{ height: "500px", width: "500px" }}>
            <Heatmap
              data={this.state.series}
            // width="500"
            />
          </div>
        </div>
      </div>
    );
  }
}

export default FingerHeatmap;


