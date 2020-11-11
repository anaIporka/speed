import React, { memo } from "react";
import { useSwitcher } from "../../../../hooks";
import { TStatisticSamplingEvent } from "../../../../types";
import Button from "./components/button";
import Switcher from "./components/switcher";

import "./header.scss";

type TProps = {
    onStatisticSamplingChange: (event: TStatisticSamplingEvent) => void;
    onDetailsClick: () => void;
};

const Header = ({ onStatisticSamplingChange, onDetailsClick }: TProps) => {
    const { isLeft, onSwitcherClick } = useSwitcher(onStatisticSamplingChange);

    return (
        <div className="sdv-statistic-header">
            <div className="sdv-statistic-header__control-wrapper sdv-statistic-header__control-wrapper_left">
                <Switcher isLeft={isLeft} onClick={onSwitcherClick} />
            </div>
            <div className="sdv-statistic-header__control-wrapper sdv-statistic-header__control-wrapper_right">
                <Button title={"Подробнее"} onClick={onDetailsClick} />
            </div>
        </div>
    );
};

export default memo(Header);
