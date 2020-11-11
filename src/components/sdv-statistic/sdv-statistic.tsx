import React, { memo } from "react";
import { TSignal, TStatistic, TStatisticSamplingEvent } from "../../types";
import Content from "./components/content/content";

import Header from "./components/header";

import "./sdv-statistic.scss";

type TProps = {
    signal?: TSignal[];
    statistic?: TStatistic | undefined;
    onStatisticSamplingChange?: (event: TStatisticSamplingEvent) => void;
    onDetailsClick?: () => void;
};

const SpeedDetectorStatistic = ({
    signal,
    statistic,
    onStatisticSamplingChange = () => {},
    onDetailsClick = () => {},
}: TProps) => {
    if (!statistic) return null;

    return (
        <div className="sdv-statistic">
            <Header onStatisticSamplingChange={onStatisticSamplingChange} onDetailsClick={onDetailsClick} />
            <Content statistic={statistic} signal={signal} />
        </div>
    );
};

export default memo(SpeedDetectorStatistic);
