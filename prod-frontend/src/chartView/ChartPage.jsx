import React from 'react';

// import FeaturesChart from "./FeatureLinegraph.jsx";
// import FingerHeatmap from "./FingerPredictionHeatmap.jsx";
// import SignalsChart from "./SignalLinegraph.jsx";

// idea to have two chartpage settings, one for p5 and one for fancy

import P5FingerPredictionHeatmap from "./P5FingerPredictionHeatmap.jsx";

function ChartPage() {
    return (<>
        <P5FingerPredictionHeatmap/>
    </>);
};

export default ChartPage;

