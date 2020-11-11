import React, { memo, useEffect, useState } from "react";

import cn from "classnames";

import StatisticRowIcons, { RowIconsType } from "./utils";

import "./row.scss";

type TProps = {
    type?: RowIconsType;
    isActive?: boolean;
    isFirst?: boolean;
    value: string;
};

const getIconId = (type: RowIconsType, isActive: boolean) => {
    return `${type}${isActive ? "_active" : ""}`;
};

const Row = ({ type = RowIconsType.AUTO, isActive = false, value, isFirst = false }: TProps) => {
    const [_isActive, setIsActive] = useState(isActive);

    useEffect(() => {
        setIsActive(isActive);

        setTimeout(() => {
            setIsActive(false);
        }, 1000);
    }, [isActive]);

    const className = cn([
        { "sdv-statistic-content-row": !isFirst },
        { "sdv-statistic-content-row sdv-statistic-content-row_first": isFirst },
    ]);

    return (
        <div className={className}>
            <div className="sdv-statistic-content-row__ico">
                {StatisticRowIcons.get(getIconId(type, _isActive))?.icon}
            </div>
            <div className="sdv-statistic-content-row__value">{value}</div>
        </div>
    );
};

export default memo(Row);
