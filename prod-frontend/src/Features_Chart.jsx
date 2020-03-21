import React, { Component } from "react";
import { Line } from "react-chartjs-2";
import "chartjs-plugin-streaming"
import { Container, Grid, Typography } from "@material-ui/core";
import socketIOClient from "socket.io-client";
import FeatureSelect from "./FeatureSelect.jsx"


const options = {
  title: {
    display: true,
    text: 'Push data feed sample'
  },
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
          delay: 1000,
          refresh: 2000,
          // onRefresh: function () {
          //   console.log(data.datasets[0]);
          //   if (Math.random() < .01) {
          //     data.datasets[0].data.push({
          //       x: Date.now(),
          //       y: Math.random()
          //     });
          //   }
          // }
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
        labelString: 'value'
      }
    }]
  },
  plugins: {
    streaming: {
      frameRate: 2
    }
  },
  animation: {
    duration: 0
  },
  hover: {
    animationDuration: 0
  },
  responsiveAnimationDuration: 0
};



class ChartJsComponent extends Component {
  constructor(props) {
    super(props);
    const data = {
      datasets: []
    };

    // const features = ['iemg', 'mav', 'mmav', 'mmav2', 'var', 'rms'];
    const colors = ["#FF6900", "#00D084", "#8Ed1FC", "#EB144C", "#F78DA7", "#9900EF", "#7BDCB5", "#FCB900"];

    for (let i = 1; i < 9; i++) {
      data.datasets.push(
        {
          label: "Channel " + i,
          xAxisID: 'live-axis',
          borderColor: colors[i],
          backgroundColor: "rgba(255, 99, 132, 0.5)",
          lineTension: 0,
          borderDash: [8, 4],
          data: [{
            x: Date.now(),
            y: Math.random()
          }],
          hidden: false,
          fill: false,
        }
      )
    }

    this.state = {
      endpoint: "http://localhost:4001",
      feature: props.feature,
      data: data,
      options: options
    };
  }

  componentDidMount() {
    console.log("Chart Mounted");
    const { endpoint } = this.state;
    const socket = socketIOClient(endpoint);

    socket.on("Feature_Data", new_data => {
      console.log(new_data);
      // let int_data = JSON.parse(new_data);
      // this.setState({ response: int_data })
      // // barData.datasets[0].data = int_data;
      for (let i = 0; i < this.state.data.datasets.length; i++) {
        this.state.data.datasets[i].data.push({
          x: Date.now(),
          y: new_data[this.state.feature][i]
        })
      }
    });
  }
  render() {
    return (
      <React.Fragment>
        <Typography variant="h1">
          {this.props.feature}
        </Typography>
        <Line data={this.state.data} options={this.state.options} height={500} width={1200} />
      </React.Fragment>
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

