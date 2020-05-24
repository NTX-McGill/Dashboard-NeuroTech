import React from 'react';

import FeaturesChart from "./FeatureLinegraph.jsx";
import FingerHeatmap from "./FingerPredictionHeatmap.jsx";

import SignalsChart from "./SignalLinegraph.jsx";
import P5heatmap from "./P5FingerPredictionHeatmap.jsx";

function ChartPage() {
    return (<>
        {/* <Bar_Chart/> */}
        {/*<Signals_Chart/>*/}
        <FeaturesChart feature="rms" />
        <P5heatmap/>
        {/* <P5Feature/> */}
    </>);
};

export default ChartPage;

