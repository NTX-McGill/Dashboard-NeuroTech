import React from 'react';

import FeaturesChart from "./FeaturesChart.jsx";
import FingerHeatmap from "./HeatmapComponent.jsx";

import SignalsChart from "./FilteredSignalsChart.jsx";
// import P5heatmap from "./p5heatmap.jsx";
// import P5Feature from "./P5Feature.jsx";
// import ChartPage from "./ChartPage";

function ChartPage() {
    // return <>
    //     <FingerHeatmap blockWidth={100} />
    //     <FeaturesChart feature="var" />
    // </>;
    return (<>
        {/* <Bar_Chart/> */}
        {/*<Signals_Chart/>*/}
        <FeaturesChart feature="rms" />
        {/* <P5heatmap/> */}
        {/* <P5Feature/> */}
    </>);
};

export default ChartPage;

