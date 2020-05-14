import React from 'react';

//import PredictionWidget from "./PredictionWidget";

import FeaturesChart from "./FeaturesChart.jsx";
//import Signals_Chart from "./FilteredSignalsChart.jsx";
import FingerHeatmap from "./HeatmapComponent.jsx";

import SignalsChart from "./FilteredSignalsChart.jsx";
import P5heatmap from "./p5heatmap.jsx";
import P5Feature from "./P5Feature.jsx";
// import ChartPage from "./ChartPage";

function ChartPage() {
    return (<>
        {/* <Bar_Chart/> */}
        {/*<Signals_Chart/>*/}
        {/* <Features_Chart feature="rms" /> */}
        <P5heatmap/>
        <P5Feature/>
    </>);
};

export default ChartPage;

