import Vehicle from "../animated-canvas/components/vehicle";
import AverageSpeed from "../static-canvas/components/average-speed";
import BumpStop, { BumpType } from "../static-canvas/components/bump-stop";
import CurrentSpeedAnimation from "../static-canvas/components/current-speed-animation";
import { IAnimatedCanvasShape, TData } from "../../../types";
import { TGetAnimationByParamsArgs, TSearchArgs } from "../types/functions-args";
import { TBindTypeFunction, TCanvasComponent, TCanvasComponents, TLanesStarts } from "../types/instances";

/** Метод для получения отбойников для нужного направления */
export const getDirectionBumpStops = (components: TCanvasComponents, directionId: number): TBindTypeFunction => {
    if (!Array.isArray(components) || !Number.isFinite(directionId)) getBumpByType.bind(null, []) as TBindTypeFunction;

    const bumps: BumpStop[] = components
        .filter((cmp) => cmp instanceof BumpStop && cmp.direction.id === directionId)
        .filter((el) => el !== undefined) as BumpStop[];

    return getBumpByType.bind(null, bumps) as TBindTypeFunction;
};

/** Метод для получения отбойника по типу (верхний или нижний) */
export const getBumpByType = (bumps: BumpStop[], type?: BumpType): BumpStop[] | BumpStop | undefined => {
    if (!type) return bumps;

    return bumps.find((bump) => bump.type === type);
};

/** Метод для получения анимации текущей скорости по параметрам */
export const getAnimationByParams = ({ components, direction, laneNumber }: TGetAnimationByParamsArgs) => {
    const filterAnimation = (cmp: TCanvasComponent) =>
        cmp instanceof CurrentSpeedAnimation && cmp.direction.id === direction.id && cmp.laneNumber === laneNumber;

    return components.findIndex(filterAnimation);
};

/** Метод для получения направления по идентификатору */
export const getDirectionById = (data: TData, id: number) => data.find((dir) => dir.id === id);

/** Метод для получения ТС, которые не закончили свою анимацию */
export const getRidingVehicles = (components: TCanvasComponents) =>
    components.filter((cmp) => cmp instanceof Vehicle && !cmp.isAnimationEnd);

/** Метод для получения отступа сверху для ТС */
export const getVehicleTop = (lanesStarts: TLanesStarts, searchArgs: TSearchArgs) =>
    lanesStarts
        .find((direction) => direction.directionId === searchArgs.id)
        ?.starts.find((start) => start.laneNumber === searchArgs.laneNumber);

/** Метод для получения блока средней скорости для направления */
export const getAverageSpeedBlockByDirection = (components: TCanvasComponents, id: number) =>
    components.find((cmp) => cmp instanceof AverageSpeed && cmp.direction.id === id) as IAnimatedCanvasShape;
