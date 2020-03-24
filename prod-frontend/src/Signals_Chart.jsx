import React, { Component } from "react";
import "moment"

import { Line } from "react-chartjs-2";
import "chartjs-plugin-streaming"
import socketIOClient from "socket.io-client";



const options = {
  title: {
    display: true,
    text: 'Push data feed sample'
  },
  height: 500,
  width: 500,
  responsive: false,
  scales: {
    xAxes: [
      {
        id: 'time-axis',
        type: 'linear',
        ticks: {
          max: 0,
          min: -5,
          stepSize: 1
        },
        // type: 'time',
        // time: {
        //   unit: 'second',
        // },
        scaleLabel: {
          display: true,
          labelString: 'Time'
        }
      },


      {
        id: 'live-axis',
        type: 'realtime',
        realtime: {
          duration: 20000,
          delay: 0,
          refresh: 1,
          // onRefresh: function () {
          //   if (Math.random() < .01) {
          //   data.datasets[0].data.push({
          //     x: Date.now(),
          //     y: Math.random() 
          //   });
          // }

          // },

        },
        ticks: {
          display: false,
          // autoSkip: false,
          // maxTicksLimit: 10
        }

      },
    ],
    yAxes: [{
      scaleLabel: {
        display: true,
        labelString: 'uVrms'
      }
    }]
  },
  tooltips: {
    mode: 'nearest',
    intersect: false
  },
  hover: {
    mode: 'nearest',
    intersect: false
  },
  plugins: {
    streaming: false
    // streaming: {
    //   frameRate: 10
    // }
  },
  animation: false
};


// socket.on('ML graphs', function (data) { // 1st channel ("left")
//   // update left datapoint
//   console.log('received data from ML')
//   chart.data.datasets[0].data[0] = data['left-prob'];
//   chart.data.datasets[0].data[1] = data['right-prob'];
//   historyChart.config.data.datasets[0].data.push({
//     x: Date.now(),
//     y: data['right-prob']
//   })
//   chart.update()
//   x_val++
//   historyChart.update( {
//     preservation: true
//   })
// });

class ChartJsComponent extends Component {
  constructor() {
    super();
    const data = {
      datasets: []
    };

    const colors = ["#808081", "#7B4A8C", "#36569C", "#317058", "#DBB10E", "#FA5D34", "#DE382D", "#A05131"];

    for (let i = 0; i < 8; i++) {
      data.datasets.push(
        {
          label: "Channel " + (i + 1) + " Filtered",
          xAxisID: 'live-axis',
          borderColor: colors[i],
          backgroundColor: colors[i],
          lineTension: 0,
          borderDash: [8, 4],
          data: [{
            x: Date.now(),
            y: Math.random()
          }],
          fill: false,
        },
        {
          label: "Channel " + (i + 1) + " Unfiltered",
          xAxisID: 'live-axis',
          borderColor: colors[i],
          backgroundColor: colors[i],
          lineTension: 0,
          borderDash: [8, 4],
          data: [{
            x: Date.now(),
            y: Math.random()
          }],
          fill: false,
          hidden: true,
        }
      )
    }

    this.state = {
      response: [0, 0, 0, 0, 0, 0, 0, 0],
      endpoint: "http://localhost:4001",
      data: data,
      options: options
    };

  }

  componentDidMount() {
    console.log("Chart Mounted");
    const { endpoint } = this.state;
    const socket = socketIOClient(endpoint);
    socket.on("Signal_Data", new_data => {
      console.log("Signal data: " + new_data);
      const int_data = JSON.parse(new_data["data"])
      // let int_data = JSON.parse(new_data);
      // barData.datasets[0].data = int_data;
      for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 2; j++) {
          this.state.data.datasets[i + j * 8].data.push({
            x: new_data["timestamp"],
            y: int_data[j][i]
          });
        }
      }
      console.log(this.state.data.datasets[0].data)
    })
  }

  render() {
    return (
      <Line data={this.state.data} options={options} height={400} width={1200} />
      // <Line
      //   data={barData}
      //   width={100}
      //   height={50}
      //   options={{ maintainAspectRatio: true }}
      // />
    )

  }
}

export default ChartJsComponent;

// For Reference
// function shuffle(array) {
//   let counter = array.length;
// 
//   // While there are elements in the array
//   while (counter > 0) {
//     // Pick a random index
//     let index = Math.floor(Math.random() * counter);
// 
//     // Decrease counter by 1
//     counter--;
// 
//     // And swap the last element with it
//     let temp = array[counter];
//     array[counter] = array[index];
//     array[index] = temp;
//   }
// 
//   return array;
// }
// 
// 
// 
// 

// 
