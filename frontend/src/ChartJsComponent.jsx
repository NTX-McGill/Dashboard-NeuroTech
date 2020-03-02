import React from "react";
import { Line } from "react-chartjs-2";
import "chartjs-plugin-streaming"

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

const data_old = {
  labels: ["January", "February", "March", "April", "May", "June", "July", 1, 2, 3, 4, 5, 6, 7, 9, 0, 123, 6, 4,],
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

const data = {
  datasets: [
    {
      label: "Dataset 1",
      borderColor: "rgb(255, 99, 132)",
      backgroundColor: "rgba(255, 99, 132, 0.5)",
      lineTension: 0,
      borderDash: [8, 4],
      data: []
    }
  ]
};



const options = {
  title: {
    display: true,
    text: 'Push data feed sample'
  },
  height:500,
  width:500,
  responsive: false,
  scales: {
    xAxes: [{
      type: 'realtime',
      realtime: {
        duration: 20000,
        delay: 2000,
        refresh: 1,
        onRefresh: function () {
          if (Math.random() < .01) {
          data.datasets[0].data.push({
            x: Date.now(),
            y: Math.random() 
          });
        }
        
        },

      },
      // ticks: {
      //   autoSkip: false,
      //   maxTicksLimit: 10
      // },
    }],
    yAxes: [{
      scaleLabel: {
        display: true,
        labelString: 'value'
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
    streaming: {
      frameRate: 30
    }
  }
};

// scales: {
//   xAxes: [{
//       type: 'realtime',
//       realtime: {
//           duration: 20000,
//           delay: 2000,
//       }
//   }],
//   yAxes: [{
//       scaleLabel: {
//           display: true,
//           labelString: 'value'
//       }
//   }]
// },
// scales: {
//   xAxes: [
//     {
//       type: "realtime",
//       realtime: {
//         onRefresh: function () {
//           // data.datasets[0].data.push({
//             // x: Date.now(),
//             // y: Math.random() 
//           // });
//         },
//         delay: 2000,
//         refresh: 1000,
//       }
//     }
//   ]
// }
// };

function ChartJsComponent() {
  return <Line data={data} options={options} height="500" width="1200"/>;
}

export default ChartJsComponent;
