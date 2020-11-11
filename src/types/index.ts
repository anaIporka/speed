export type TCanvasControllerProps = {
    /** Реф канваса */
    canvas: HTMLCanvasElement;
    /** Данные для отрисовки */
    data: TData;
    /** Ширина канваса */
    width: number;
};

export type TLane = {
    number: number;
    speedByLane: number;
};

export type TDirection = {
    id: number;
    type: number;
    lanes: TLane[];
};

export type TData = TDirection[];

export type TOnAnimationEnd = (vehicleIndex: number) => void;

export type TSignal = {
    /** Направление */
    direction: TDirection;
    /** Номер полосы */
    laneNumber: number;
    /** В км/ч */
    speed: number;
    /** Тип машины: легковой, автобус и прочее */
    carType: number;
};

export interface ICanvasShape {
    draw: () => void | any;
    reDraw: () => void | any;
    direction: TDirection;
}

export interface IAnimatedCanvasShape extends ICanvasShape {
    data: TData;
    direction: TDirection;
    laneNumber: number;
    animate: (signal: TSignal) => void | any;
}

export type TStatistic = {
    total: number;
    moto: number;
    auto: number;
    bus: number;
    truckS: number;
    truckM: number;
    truckL: number;
};

export type TStatisticSamplingEvent = {
    type: string;
};

export type TSdvProps = {
    /** Тип данных для компонента */
    data: TData;
    /** Ширина компонента */
    width: number;
    /** Показывать статистику или нет */
    isShowStatistic?: boolean;
    /** Сигнал с датчика */
    signal?: TSignal[];
    /** Данные со статистикой */
    statistic?: TStatistic | undefined;
    /** Событие сменытипа выборки статистики */
    onStatisticSamplingChange?: (event: TStatisticSamplingEvent) => void;
    /** Событие при клике на кнопку подробнее */
    onDetailsClick?: () => void;
};
