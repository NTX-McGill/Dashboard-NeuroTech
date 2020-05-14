import React, { Component } from "react";
import { Bar } from "react-chartjs-2";
import "chartjs-plugin-streaming"
import socketIOClient from "socket.io-client";




const barData = {
  labels: ['Left Pinky', 'Left Ring', 'Left Middle', 'Left Index', 'Thumbs', 'Right Index', 'Right Middle', 'Right Ring', 'Right Pinky'],
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
    this.state = {
      response: [0, 0, 0, 0, 0, 0, 0, 0],
      endpoint: "http://localhost:4002"
    };
  }

  componentDidMount() {
    console.log("Chart Mounted");
    const { endpoint } = this.state;
    const socket = socketIOClient(endpoint);
    socket.on("FingerProbs", new_data => {
      console.log(new_data);
      let int_data = JSON.parse(new_data);
      console.log(int_data);
      console.log(typeof(int_data));
      this.setState({ response: int_data })
      barData.datasets[0].data = int_data;
      // data.datasets[0].data.push({
      // x: Date.now(),
      // y: new_data[1]
      // });
    });
  }
  render() {
    return (
      //<Line data={data} options={options} height="500" width="1200"/>
      <Bar
        data={barData}
        width={100}
        height={50}
        options={{ maintainAspectRatio: true }}
      />
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
// const data = {
//   datasets: [
//     {
//       label: "Dataset 1",
//       borderColor: "rgb(255, 99, 132)",
//       backgroundColor: "rgba(255, 99, 132, 0.5)",
//       lineTension: 0,
//       borderDash: [8, 4],
//       data: [],
//       fill: false,
//     }
//   ]
// };
// 
// 
// 
// const options = {
//   title: {
//     display: true,
//     text: 'Push data feed sample'
//   },
//   height:500,
//   width:500,
//   responsive: false,
//   scales: {
//     xAxes: [{
//       type: 'realtime',
//       realtime: {
//         duration: 20000,
//         delay: 2000,
//         refresh: 1,
//         // onRefresh: function () {
//         //   if (Math.random() < .01) {
//         //   data.datasets[0].data.push({
//         //     x: Date.now(),
//         //     y: Math.random() 
//         //   });
//         // }
//         
//         // },
// 
//       },
//       // ticks: {
//       //   autoSkip: false,
//       //   maxTicksLimit: 10
//       // },
//     }],
//     yAxes: [{
//       scaleLabel: {
//         display: true,
//         labelString: 'value'
//       }
//     }]
//   },
//   tooltips: {
//     mode: 'nearest',
//     intersect: false
//   },
//   hover: {
//     mode: 'nearest',
//     intersect: false
//   },
//   plugins: {
//     streaming: {
//       frameRate: 30
//     }
//   }
// };
// 
