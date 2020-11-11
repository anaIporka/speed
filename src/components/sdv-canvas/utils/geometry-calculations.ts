import BumpStop, { BumpType } from "../static-canvas/components/bump-stop";
import { TData, TDirection, TLane } from "../../../types";
import { BUMP_STOP_HEIGHT, ROAD_LINE_HEIGHT } from "../consts/shapes-geometry";
import {
    TGetDirectionLanesTop,
    TLaneTop,
    TGetLaneTopByNumberBind,
    TGetLaneTopByNumberResponse,
} from "../types/instances";
import { TGetVectorsDifferenceArgs } from "../types/functions-args";
import { getDirectionBumpStops, getDirectionById } from "./instances-search";

const sumHeight = (currentTotalHeight: number, direction: TDirection) =>
    currentTotalHeight + BUMP_STOP_HEIGHT * 2 + direction.lanes.length * ROAD_LINE_HEIGHT;

/**
 * Метод для высчитывания высоты канваса
 * @param {TData} data направления
 * @returns {number} высота канваса
 */
export const getCanvasHeight = (data: TData) => data.reduce(sumHeight, 0);

/** Метод получения функции, которая возвращает отсуты полос дороги по параметрам  */
export const getDirectionLanesTop = (args: TGetDirectionLanesTop): TGetLaneTopByNumberBind => {
    const { data, components, directionId } = args;

    const direction = getDirectionById(data, directionId);

    if (!direction) return getLaneTopByNumber.bind(null, []);

    const tops = direction.lanes
        .map((...args) => {
            const directionBumpTop = getDirectionBumpStops(components, directionId)(BumpType.TOP);

            if (!directionBumpTop) return undefined;

            return {
                laneNumber: args[0].number,
                top: getLaneStart((directionBumpTop as BumpStop).top + BUMP_STOP_HEIGHT, args[1]),
            } as TLaneTop;
        })
        .filter((el) => el !== undefined) as TLaneTop[];

    return getLaneTopByNumber.bind(null, tops) as TGetLaneTopByNumberBind;
};

/** Функции, которая возвращает отсуты полос направления по параметрам  */
export const getLaneTopByNumber = (
    /** отступы полос направления */
    lanesTops: TLaneTop[],
    /** номер нужной полосы */
    laneNumber: number | undefined
): TGetLaneTopByNumberResponse => {
    if (!laneNumber) return lanesTops;

    return lanesTops.find((lane) => lane.laneNumber === laneNumber);
};

/** Метод для получения отсупа полосы направления по индексу */
export const getLaneStart = (directionTop: number, index: number) => {
    return directionTop + ROAD_LINE_HEIGHT * index;
};

/** Метод для получения всех отсупов для полос направления */
export const getLanesStarts = (directionTop: number, lanes: TLane[]) => {
    return lanes.map((...args) => getLaneStart(directionTop, args[1]));
};

/** Метод для получения центра полосы направления */
export const getLaneCenter = (start: number) => start + ROAD_LINE_HEIGHT / 2 - 20;

/** Метод для получения центров полос направления */
export const getLanesCenters = (lanesStarts: number[]) => lanesStarts.map(getLaneCenter);

/** Метод для получения разницы векторов ТС */
export const getVectorsDifference = ({ directionType, vector, impositionVector }: TGetVectorsDifferenceArgs) => {
    if (directionType === 0) {
        return Math.abs(vector[1][0] - impositionVector[0][0]);
    } else if (directionType === 1) {
        return Math.abs(vector[0][0] - impositionVector[1][0]);
    }
    return 0;
};
