import React from "react";
import Moto from "../icons/moto.svg";
import MotoActive from "../icons/moto_active.svg";
import Auto from "../icons/auto.svg";
import AutoActive from "../icons/auto_active.svg";
import Bus from "../icons/bus.svg";
import BusActive from "../icons/bus_active.svg";
import TruckS from "../icons/truck_s.svg";
import TruckSActive from "../icons/truck_s_active.svg";
import TruckM from "../icons/truck_m.svg";
import TruckMActive from "../icons/truck_m_active.svg";
import TruckL from "../icons/truck_l.svg";
import TruckLActive from "../icons/truck_l_active.svg";

export enum RowIconsType {
    MOTO = "moto",
    AUTO = "auto",
    BUS = "bus",
    TRUCK_S = "truck_s",
    TRUCK_M = "truck_m",
    TRUCK_L = "truck_l",
}

type TIcon = {
    id: string;
    icon: JSX.Element;
};

export type TIcons = {
    icons: TIcon[];
    get: (id: string) => TIcon | undefined;
};

const StatisticRowIcons: TIcons = {
    icons: [
        {
            id: RowIconsType.MOTO,
            icon: <Moto />,
        },
        {
            id: `${RowIconsType.MOTO}_active`,
            icon: <MotoActive />,
        },
        {
            id: RowIconsType.AUTO,
            icon: <Auto />,
        },
        {
            id: `${RowIconsType.AUTO}_active`,
            icon: <AutoActive />,
        },
        {
            id: RowIconsType.BUS,
            icon: <Bus />,
        },
        {
            id: `${RowIconsType.BUS}_active`,
            icon: <BusActive />,
        },
        {
            id: RowIconsType.TRUCK_S,
            icon: <TruckS />,
        },
        {
            id: `${RowIconsType.TRUCK_S}_active`,
            icon: <TruckSActive />,
        },
        {
            id: RowIconsType.TRUCK_M,
            icon: <TruckM />,
        },
        {
            id: `${RowIconsType.TRUCK_M}_active`,
            icon: <TruckMActive />,
        },
        {
            id: RowIconsType.TRUCK_L,
            icon: <TruckL />,
        },
        {
            id: `${RowIconsType.TRUCK_L}_active`,
            icon: <TruckLActive />,
        },
    ],
    get: (id: string) => StatisticRowIcons.icons.find((icon) => icon.id === id),
};

export default StatisticRowIcons;
