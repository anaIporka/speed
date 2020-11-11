import BumpStop, { BumpType } from "../static-canvas/components/bump-stop";
import { IAnimatedCanvasShape, ICanvasShape, TData, TDirection, TOnAnimationEnd, TSignal } from "../../../types";
import CanvasKit from "../utils/canvas-kit";

export type TGetDirectionLanesTop = {
    /** Данные */
    data: TData;
    /** Идентификатор направления */
    directionId: number;
    /** Список компонентов, находящихся на канвасе */
    components: (ICanvasShape | IAnimatedCanvasShape)[];
};

/** Тип отступа сверху для полосы дороги */
export type TLaneTop = {
    /** номер полосы дороги */
    laneNumber: number;
    /** отступ сверху */
    top: number;
};

export type TGetLaneTopByNumberResponse = (TLaneTop[] | TLaneTop) | undefined;

export type TGetLaneTopByNumberBind = (laneNumber: number | undefined) => TGetLaneTopByNumberResponse;

/** Типы скоростных блоков */
export enum SpeedBlockType {
    /** Тип блока текущей скорости транспорта */
    CURRENT,
    /** Тип блока средней скорости транспорта */
    AVERAGE,
}

export type TBindTypeFunction = (type?: BumpType) => BumpStop[] | BumpStop | undefined;

/** Тип для отступа полосы дороги */
export type TLaneStart = {
    /** Номер полосы */
    laneNumber: number;
    /** Отступ */
    startTop: number;
};

/** Тип для отступов полос дороги для направлений */
export type TLanesStarts = {
    /** Идентификатор направления */
    directionId: number;
    /** Отступы */
    starts: TLaneStart[];
}[];

/** Компонент канваса */
export type TCanvasComponent = ICanvasShape | IAnimatedCanvasShape;

/** Компоненты канваса */
export type TCanvasComponents = TCanvasComponent[];

/** Тип пропсов для блока с текущей скоростью */
export type TCurrentSpeedAnimationProps = {
    /** Индекс анимации */
    animationIndex: number;
    /** Объект с методами для отрисовки примитивов */
    canvasKit: CanvasKit;
    /** Отступ сверху */
    top: number;
    /** Данные */
    data: TData;
    /** Направление */
    direction: TDirection;
    /** Номер полосы */
    laneNumber: number;
    /** Сигнал с датчика */
    signal: TSignal;
    /** Коллбек для вызова по окончанию анимации */
    onAnimationEnd: TOnAnimationEnd;
};
