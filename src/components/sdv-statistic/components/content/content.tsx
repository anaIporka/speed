import React, { memo } from "react";
import { useStatistic } from "../../../../hooks";
import { TSignal, TStatistic } from "../../../../types";
import Row from "./components/row";
import { RowIconsType } from "./components/row/utils";

import { getIsActive, prettifyNumber } from "./utils";
import "./content.scss";

type TProps = {
    statistic?: TStatistic | undefined;
    signal?: TSignal[];
};

const WholeVehicles = ({ total }: { total: number }) => {
    return (
        <div className="sdv-statistic-content__total">
            <div className="sdv-statistic-content__total__num">{total}</div>
            <div className="sdv-statistic-content__total__title">Всего ТС за сутки</div>
        </div>
    );
};

const CenterVehicles = ({ signal, statistic }: TProps) => {
    if (!statistic) return null;

    return (
        <div className="sdv-statistic-content__transport sdv-statistic-content__transport_center">
            <Row
                type={RowIconsType.MOTO}
                isActive={getIsActive(signal, 1)}
                isFirst={true}
                value={prettifyNumber(statistic.moto)}
            />
            <Row type={RowIconsType.AUTO} isActive={getIsActive(signal, 2)} value={prettifyNumber(statistic.auto)} />
            <Row type={RowIconsType.BUS} isActive={getIsActive(signal, 3)} value={prettifyNumber(statistic.bus)} />
        </div>
    );
};

const RightVehicles = ({ signal, statistic }: TProps) => {
    if (!statistic) return null;

    return (
        <div className="sdv-statistic-content__transport sdv-statistic-content__transport_right">
            <Row
                type={RowIconsType.TRUCK_S}
                isActive={getIsActive(signal, 4)}
                isFirst={true}
                value={prettifyNumber(statistic.truckS)}
            />
            <Row
                type={RowIconsType.TRUCK_M}
                isActive={getIsActive(signal, 5)}
                value={prettifyNumber(statistic.truckM)}
            />
            <Row
                type={RowIconsType.TRUCK_L}
                isActive={getIsActive(signal, 6)}
                value={prettifyNumber(statistic.truckL)}
            />
        </div>
    );
};

const getStatisticBlock = (type: string) => {
    return type === "center" ? CenterVehicles : RightVehicles;
};

const Content = (props: TProps) => {
    const { signal } = props;
    const statistic = useStatistic(props.statistic);

    if (!statistic) return null;

    return (
        <div className="sdv-statistic-content">
            <WholeVehicles total={statistic.total} />
            {getStatisticBlock("center")({ signal, statistic })}
            {getStatisticBlock("right")({ signal, statistic })}
        </div>
    );
};

export default memo(Content);
