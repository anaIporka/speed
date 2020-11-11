import { BUMP_STOP_HEIGHT } from "../../consts/shapes-geometry";
import CanvasKit from "../../utils/canvas-kit";
import { BUMP_STOP_BACKGROUND_COLOR } from "../../consts/colors";
import { ICanvasShape, TDirection } from "../../../../types";

export enum BumpType {
    TOP = "top",
    BOTTOM = "bottom",
}

type TProps = {
    /** Объект с методами для отрисовки примитивов */
    canvasKit: CanvasKit;
    /** Направление */
    direction: TDirection;
    /** Отступ сверху */
    top: number;
    /** Тип отбойника */
    type: BumpType;
};

export default class BumpStop implements ICanvasShape {
    /** Объект с методами для отрисовки примитивов */
    private canvasKit: CanvasKit;
    /** Отступ сверху */
    public top: number;
    /** Направление */
    public direction: TDirection;
    /** Тип отбойника */
    public type: BumpType;

    constructor({ canvasKit, top, direction, type }: TProps) {
        this.canvasKit = canvasKit;
        this.top = top;
        this.direction = direction;
        this.type = type;
    }

    /** Метод отрисовки отбойника */
    public draw() {
        this.canvasKit.drawRect({
            x: 0,
            y: this.top,
            width: this.canvasKit.width,
            height: BUMP_STOP_HEIGHT,
            color: BUMP_STOP_BACKGROUND_COLOR,
        });
    }

    /** Метод для перерисовки */
    public reDraw() {}
}
