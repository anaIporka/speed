import { addImage } from "../components/sdv-canvas/utils/canvas-icons";
import { AUTOBUS_ICON, AUTOBUS_REVERTED_ICON } from "./autobus";
import { CAR_ICON, CAR_REVERTED_ICON } from "./car";
import { MOTO_ICON, MOTO_REVERTED_ICON } from "./moto";
import { TRACK_L_ICON, TRACK_L_REVERTED_ICON } from "./track-l";
import { TRACK_M_ICON, TRACK_M_REVERTED_ICON } from "./track-m";
import { TRACK_S_ICON, TRACK_S_REVERTED_ICON } from "./track-s";

/** Типы всех имеющихся иконок */
export enum CanvasIcons {
    CURRENT_SPEED_ICON = "current_speed_icon",
    CAR_ICON = "car_icon",
    CAR_REVERTED_ICON = "car_reverted_icon",
    MOTO_ICON = "moto_icon",
    MOTO_REVERTED_ICON = "moto_reverted_icon",
    AUTOBUS_ICON = "autobus_icon",
    AUTOBUS_REVERTED_ICON = "autobus_reverted_icon",
    TRACK_S_ICON = "track_s_icon",
    TRACK_S_REVERTED_ICON = "track_s_reverted_icon",
    TRACK_M_ICON = "track_m_icon",
    TRACK_M_REVERTED_ICON = "track_m_reverted_icon",
    TRACK_L_ICON = "track_l_icon",
    TRACK_L_REVERTED_ICON = "track_l_reverted_icon",
}

/** Метод для подгрузки все иконок */
export const prepareIcons = () => {
    addImage({ name: CanvasIcons.CAR_ICON, icon: CAR_ICON, size: [70, 40] });
    addImage({ name: CanvasIcons.CAR_REVERTED_ICON, icon: CAR_REVERTED_ICON, size: [70, 40] });
    addImage({ name: CanvasIcons.MOTO_ICON, icon: MOTO_ICON, size: [70, 40] });
    addImage({ name: CanvasIcons.MOTO_REVERTED_ICON, icon: MOTO_REVERTED_ICON, size: [70, 40] });
    addImage({ name: CanvasIcons.AUTOBUS_ICON, icon: AUTOBUS_ICON, size: [80, 40] });
    addImage({ name: CanvasIcons.AUTOBUS_REVERTED_ICON, icon: AUTOBUS_REVERTED_ICON, size: [80, 40] });
    addImage({ name: CanvasIcons.TRACK_S_ICON, icon: TRACK_S_ICON, size: [90, 40] });
    addImage({ name: CanvasIcons.TRACK_S_REVERTED_ICON, icon: TRACK_S_REVERTED_ICON, size: [90, 40] });
    addImage({ name: CanvasIcons.TRACK_M_ICON, icon: TRACK_M_ICON, size: [100, 40] });
    addImage({ name: CanvasIcons.TRACK_M_REVERTED_ICON, icon: TRACK_M_REVERTED_ICON, size: [100, 40] });
    addImage({ name: CanvasIcons.TRACK_L_ICON, icon: TRACK_L_ICON, size: [110, 40] });
    addImage({ name: CanvasIcons.TRACK_L_REVERTED_ICON, icon: TRACK_L_REVERTED_ICON, size: [110, 40] });
};

export type TVehicleIcon = {
    carType: number;
    icons: [string, string];
    size?: [number, number];
};

export const vehicleIcons: TVehicleIcon[] = [
    {
        carType: 1,
        icons: [CanvasIcons.MOTO_REVERTED_ICON, CanvasIcons.MOTO_ICON],
    },
    {
        carType: 2,
        icons: [CanvasIcons.CAR_REVERTED_ICON, CanvasIcons.CAR_ICON],
    },
    {
        carType: 3,
        icons: [CanvasIcons.AUTOBUS_REVERTED_ICON, CanvasIcons.AUTOBUS_ICON],
    },
    {
        carType: 4,
        icons: [CanvasIcons.TRACK_S_REVERTED_ICON, CanvasIcons.TRACK_S_ICON],
    },
    {
        carType: 5,
        icons: [CanvasIcons.TRACK_M_REVERTED_ICON, CanvasIcons.TRACK_M_ICON],
    },
    {
        carType: 6,
        icons: [CanvasIcons.TRACK_L_REVERTED_ICON, CanvasIcons.TRACK_L_ICON],
    },
];
