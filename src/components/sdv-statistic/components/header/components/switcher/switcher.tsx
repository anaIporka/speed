import React, { memo } from "react";
import cn from "classnames";

import "./switcher.scss";

type TProps = {
    isLeft?: boolean;
    onClick: (key: string) => void;
};

const Switcher = ({ isLeft = true, onClick }: TProps) => {
    const leftClassName = cn([
        { "sdv-statistic-header-switcher__btn": !isLeft },
        { "sdv-statistic-header-switcher__btn sdv-statistic-header-switcher__btn_active": isLeft },
    ]);

    const rightClassName = cn([
        { "sdv-statistic-header-switcher__btn": isLeft },
        { "sdv-statistic-header-switcher__btn sdv-statistic-header-switcher__btn_active": !isLeft },
    ]);

    return (
        <div className="sdv-statistic-header-switcher">
            <button onClick={() => onClick("by_day")} className={leftClassName}>
                За сутки
            </button>
            <button onClick={() => onClick("by_hour")} className={rightClassName}>
                За час
            </button>
        </div>
    );
};

export default memo(Switcher);
