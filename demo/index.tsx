import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import SpeedDetectorVisualization, { TData, TSignal, TStatistic, TStatisticSamplingEvent } from "../src";
import { data, initialStatistic } from "./data";

import "normalize.css";
import "./demo.scss";

const page = document.createElement("div");
page.id = "page";
page.className = "page";
document.body.append(page);

function randomInteger(min: number, max: number) {
    const rand = min + Math.random() * (max - min);
    return Math.round(rand);
}

const getRandomSignal = (data: TData): TSignal => {
    const dirNum = randomInteger(0, data.length - 1);
    const laneNumber = randomInteger(1, data[dirNum].lanes.length);
    const speed = randomInteger(30, 80);
    const carType = randomInteger(1, 6);

    return {
        direction: data[dirNum],
        laneNumber,
        speed,
        carType,
    };
};

const getSignals = () => {
    const signalCount = randomInteger(1, 1);

    const signals: TSignal[] = [];
    return [...new Array(signalCount)]
        .map(() => {
            const signal = getRandomSignal(data);

            const sameSignal = signals.filter(
                (sig) => sig.direction.id === signal.direction.id && sig.laneNumber === signal.laneNumber
            );

            if (sameSignal.length > 0) {
                return undefined;
            }

            signals.push(signal);
            return signal;
        })
        .filter((el) => el !== undefined);
};

const getNewStatistic = (statistic: TStatistic | undefined, carType: number) => {
    if (!statistic) return;

    statistic.total++;

    switch (carType) {
        case 1:
            statistic.moto++;
            return statistic;

        case 2:
            statistic.auto++;
            return statistic;

        case 3:
            statistic.bus++;
            return statistic;

        case 4:
            statistic.truckS++;
            return statistic;

        case 5:
            statistic.truckM++;
            return statistic;

        case 6:
            statistic.truckL++;
            return statistic;

        default:
            return statistic;
    }
};

const useDemo = () => {
    const [signal, setSignal] = useState<TSignal[] | undefined>(undefined);
    const [statistic, setStatistic] = useState<TStatistic | undefined>(initialStatistic);

    useEffect(() => {
        setInterval(() => {
            const signal = getSignals();
            // @ts-ignore
            setSignal(signal);
        }, 1000);
    }, []);

    useEffect(() => {
        let newStatistic = initialStatistic;

        if (Array.isArray(signal) && signal[0]) newStatistic = getNewStatistic(statistic, signal[0].carType);

        if (newStatistic) setStatistic({ ...newStatistic } as TStatistic | undefined);
    }, [signal]);

    return {
        signal,
        statistic,
    };
};

function Demo() {
    const { signal, statistic } = useDemo();

    const onStatisticSamplingChange = (event: TStatisticSamplingEvent) => {
        console.log(event);
    };

    const onDetailsClick = () => {
        console.log("details click");
    };

    return (
        <div className="demo-card">
            <SpeedDetectorVisualization
                width={408}
                data={data}
                signal={signal}
                isShowStatistic={true}
                statistic={statistic}
                onStatisticSamplingChange={onStatisticSamplingChange}
                onDetailsClick={onDetailsClick}
            />
        </div>
    );
}

ReactDOM.render(<Demo />, page);
