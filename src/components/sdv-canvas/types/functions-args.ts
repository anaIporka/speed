import CanvasKit, { TLine } from "../utils/canvas-kit";
import { TData, TDirection, TLane } from "../../../types";
import { TCanvasComponents } from "./instances";

/** Тип аргументов для поиска анимации среди компонентов */
export type TGetAnimationByParamsArgs = {
    /** Список компонентов канваса */
    components: TCanvasComponents;
    /** Направление */
    direction: TDirection;
    /** Номер полосы дороги */
    laneNumber: number;
};

/**  */
export type TBumpStopsArgs = {
    /** Экземпляр оболочки для канваса для отрисовки примитивов */
    canvasKit: CanvasKit;
    /** Y первого отбойника в направлении */
    firstBumpTop: number;
    /** Y второго отбойника в направлении */
    secondBumpTop: number;
    /** Направление */
    direction: TDirection;
};

export type TGetVectorsDifferenceArgs = {
    /** Тип навравления */
    directionType: number;
    /** Вектор наложенной машины */
    impositionVector: TLine;
    /** Вектор текущей машины */
    vector: TLine;
};

/** Тип аргумента для конструктора разметки */
export type TDottedLinesArgs = {
    /** Экземпляр оболочки для канваса для отрисовки примитивов */
    canvasKit: CanvasKit;
    /** нулевой Y для разметки */
    top: number;
    /** Линии направления */
    lanes: TLane[];
};

/** Тип аргумента для конструкторов скоростных блоков */
export type TSpeedBlockArgs = {
    /** Экземпляр оболочки для канваса для отрисовки примитивов */
    canvasKit: CanvasKit;
    /** Y первого отбойника в направлении */
    firstBumpTop: number;
    /** Y второго отбойника в направлении */
    secondBumpTop: number;
    /** Направление */
    direction: TDirection;
    /** Данные */
    data: TData;
    /** Метод для перерисовки всего канваса */
    canvasReDraw?: () => void;
};

/** Тип для поиска */
export type TSearchArgs = {
    /** Идентификатор направления */
    id: number;
    /** Номер линии */
    laneNumber: number;
};
