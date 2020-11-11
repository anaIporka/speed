import CanvasKit from "../utils/canvas-kit";
import { getCanvasHeight, getLaneCenter, getLanesStarts } from "../utils/geometry-calculations";
import { TCanvasControllerProps, TData, TSignal } from "../../../types";
import { ROAD_LINE_BACKGROUND_COLOR } from "../consts/colors";
import { BUMP_STOP_HEIGHT, ROAD_LINE_HEIGHT } from "../consts/shapes-geometry";
import { getRidingVehicles, getVehicleTop } from "../utils/instances-search";
import { TCanvasComponents, TLanesStarts, TLaneStart } from "../types/instances";
import { createVehicleSearchArgs } from "../utils/instances-create";
import Vehicle from "./components/vehicle";

export default class VehiclesCanvasController {
    /** Реф канваса */
    private canvas: HTMLCanvasElement;
    /** Данные для отрисовки */
    private data: TData;
    /** Ширина канваса */
    private width: number;
    /** Экземпляр класса с методами для отрисовки примитивов */
    private canvasKit: CanvasKit;
    /** Y начал полос направления */
    private lanesStarts: TLanesStarts = [];
    /** КОмпоненты для отрисовки */
    public components: TCanvasComponents = [];

    constructor({ canvas, width, data }: TCanvasControllerProps) {
        this.canvas = canvas;
        this.data = data;
        this.width = width;

        this.canvasKit = this.initCanvas();

        this.initCanvasComponents();
    }

    /** Метод инициализирует canvasKit и размеры канваса */
    private initCanvas() {
        this.canvas.width = this.width;
        this.canvas.height = getCanvasHeight(this.data);
        this.canvas.style.backgroundColor = ROAD_LINE_BACKGROUND_COLOR;

        return new CanvasKit(this.canvas);
    }

    /** Коллбек для вызова после окончания анимации ТС */
    private onAnimationEnd = (vehicleIndex: number) => {
        this.components.splice(vehicleIndex, 1);
    };

    /** Метод для вызова анимации из сигнала */
    public animate(signal: TSignal[]) {
        this.components = getRidingVehicles(this.components);

        signal.forEach((el: TSignal) => {
            const vehicleTop = getVehicleTop(this.lanesStarts, createVehicleSearchArgs(el));

            if (!vehicleTop) return;

            const signalVehicle = new Vehicle({
                vehicleIndex: this.components.length,
                canvasKit: this.canvasKit,
                direction: el.direction,
                top: getLaneCenter(vehicleTop.startTop),
                laneNumber: el.laneNumber,
                signal: el,
                parent: this,
                onAnimationEnd: this.onAnimationEnd,
            });

            this.components.push(signalVehicle);
        });
    }

    /** Метод для инициализации компонентов канваса и вычисления некоторых геометрий */
    private initCanvasComponents() {
        let prevLastBumpTop = 0;
        this.data.forEach((direction, i) => {
            const firstBumpTop = prevLastBumpTop + (i !== 0 ? BUMP_STOP_HEIGHT : 0);

            const secondBumpTop = firstBumpTop + ROAD_LINE_HEIGHT * direction.lanes.length + BUMP_STOP_HEIGHT;

            const starts: TLaneStart[] = getLanesStarts(firstBumpTop + BUMP_STOP_HEIGHT, direction.lanes).map(
                (el, i) => {
                    return {
                        laneNumber: i + 1,
                        startTop: el,
                    };
                }
            );

            this.lanesStarts.push({
                directionId: direction.id,
                starts,
            });

            prevLastBumpTop = secondBumpTop;
        });
    }
}
