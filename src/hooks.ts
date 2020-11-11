import { useEffect, useState } from "react";
import { TStatistic, TStatisticSamplingEvent } from "./types";

export const useSwitcher = (onStatisticSamplingChange: (event: TStatisticSamplingEvent) => void) => {
    const [isLeft, setIsLeft] = useState(true);

    const onSwitcherClick = (key: string) => {
        if (key === "by_day") setIsLeft(true);
        if (key === "by_hour") setIsLeft(false);

        onStatisticSamplingChange({ type: key });
    };

    return {
        isLeft,
        onSwitcherClick,
    };
};

export const useStatistic = (statistic: TStatistic | undefined) => {
    const [stateStat, setStateStat] = useState<TStatistic | undefined>(statistic);

    useEffect(() => {
        setStateStat(statistic);
    }, [statistic]);

    return stateStat;
};
