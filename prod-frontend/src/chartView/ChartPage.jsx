import React from 'react';

import FeaturesChart from "./FeaturesChart.jsx";
import FingerHeatmap from "./HeatmapComponent.jsx";

function ChartPage() {
    return <>
        <FingerHeatmap blockWidth={100} />
        <FeaturesChart feature="var" />
    </>;
};

export default ChartPage;