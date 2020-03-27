import React from 'react';

import PredictionWidget from "./PredictionWidget";

import Features_Chart from "./FeaturesChart.jsx";
import Signals_Chart from "./FilteredSignalsChart.jsx";
import FingerHeatmap from "./HeatmapComponent.jsx";

function ChartPage() {
    return (<>
        {/* <Bar_Chart/> */}
        {/*<Signals_Chart/>*/}
        {/* <Features_Chart feature="rms" /> */}
        <FingerHeatmap blockWidth={100} />
        <Features_Chart feature="var" />
    </>);
};

export default ChartPage;