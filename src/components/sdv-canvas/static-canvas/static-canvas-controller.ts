import CanvasKit from "../utils/canvas-kit";
import { TCanvasControllerProps, TData, TDirection, TSignal } from "../../../types";
import { getCanvasHeight, getDirectionLanesTop } from "../utils/geometry-calculations";
import { BUMP_STOP_HEIGHT, ROAD_LINE_HEIGHT } from "../consts/shapes-geometry";
import { getAnimationByParams, getAverageSpeedBlockByDirection } from "../utils/instances-search";
import { SpeedBlockType, TCanvasComponents } from "../types/instances";
import { createBumpStops, createDottedLines, createSpeedBlock } from "../utils/instances-create";
import CurrentSpeedAnimation from "./components/current-speed-animation";

export default class StaticCanvasController {
    /** Реф канваса */
    private canvas: HTMLCanvasElement;
    /** Данные для отрисовки */
    private data: TData;
    /** Ширина канваса */
    private width: number;
    /** Экземпляр класса с методами для отрисовки примитивов */
    private canvasKit: CanvasKit;
    /** КОмпоненты для отрисовки */
    public components: TCanvasComponents = [];

    private prevLastBumpTop = 0;

    constructor({ canvas, width, data }: TCanvasControllerProps) {
        this.canvas = canvas;
        this.data = data;
        this.width = width;

        this.canvasKit = this.initCanvas();

        this.initCanvasComponents();

        this.draw();
    }

    public reDraw = () => {
        this.canvasKit.clear();
        this.draw();
    };

    private onAnimationEnd = (animationIndex: number) => {
        if (!this.components[animationIndex]) return;
        this.components.splice(animationIndex, 1);
    };

    private getCurrentSpeedAnimationInstance = (el: TSignal) => {
        const laneTop = getDirectionLanesTop({
            data: this.data,
            directionId: el.direction.id,
            components: this.components,
        })(el.laneNumber);

        if (Array.isArray(laneTop) || !laneTop) return;

        return {
            animationIndex: this.components.length,
            canvasKit: this.canvasKit,
            data: this.data,
            direction: el.direction,
            laneNumber: el.laneNumber,
            height: 0,
            signal: el,
            top: laneTop.top,
            onAnimationEnd: this.onAnimationEnd,
        };
    };

    public animate(signal: TSignal[]) {
        signal.forEach((el) => {
            const averageSpeed = getAverageSpeedBlockByDirection(this.components, el.direction.id);

            if (averageSpeed) averageSpeed.animate(el);

            const animationIndex = getAnimationByParams({
                components: this.components,
                direction: el.direction,
                laneNumber: el.laneNumber,
            });

            if (animationIndex !== -1) {
                this.onAnimationEnd(animationIndex);
            }

            const animationInstance = this.getCurrentSpeedAnimationInstance(el);

            if (!animationInstance) return;

            this.components.push(new CurrentSpeedAnimation(animationInstance));
        });
    }

    /** Метод инициализирует canvasKit и размеры канваса */
    private initCanvas() {
        this.canvas.width = this.width;
        this.canvas.height = getCanvasHeight(this.data);
        this.canvas.style.backgroundColor = "transparent";

        return new CanvasKit(this.canvas);
    }

    private prepareDirectionComponents = (direction: TDirection, index: number) => {
        const firstBumpTop = this.prevLastBumpTop + (index !== 0 ? BUMP_STOP_HEIGHT : 0);

        const secondBumpTop = firstBumpTop + ROAD_LINE_HEIGHT * direction.lanes.length + BUMP_STOP_HEIGHT;

        const speedBlocksParams = {
            canvasKit: this.canvasKit,
            firstBumpTop,
            secondBumpTop,
            data: this.data,
            direction,
            canvasReDraw: this.reDraw,
        };

        this.components.push(createSpeedBlock(SpeedBlockType.CURRENT)(speedBlocksParams));

        this.components.push(createSpeedBlock(SpeedBlockType.AVERAGE)(speedBlocksParams));

        this.components.push(
            ...createBumpStops({
                canvasKit: this.canvasKit,
                firstBumpTop,
                secondBumpTop,
                direction,
            })
        );

        this.components.push(
            ...createDottedLines({ canvasKit: this.canvasKit, top: firstBumpTop, lanes: direction.lanes })
        );

        this.prevLastBumpTop = secondBumpTop;
    };

    /** Метод для инициализации компонентов канваса и вычисления некоторых геометрий */
    private initCanvasComponents() {
        this.data.forEach(this.prepareDirectionComponents);
    }

    private draw() {
        this.components.forEach((cmp) => cmp.draw());
    }
}
