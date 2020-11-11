import { ICanvasShape, TDirection } from "../../../../types";
import CanvasKit from "../../utils/canvas-kit";
import { DOTTED_LINE_BACKGROUND_COLOR } from "../../consts/colors";
import { DOTTED_LINE_MARGIN_LEFT, DOTTED_LINE_WIDTH } from "../../consts/shapes-geometry";

type TProps = {
    /** Объект с методами для отрисовки примитивов */
    canvasKit: CanvasKit;
    /** Отступ сверху */
    top: number;
};

export default class DottedLine implements ICanvasShape {
    /** Объект с методами для отрисовки примитивов */
    private canvasKit: CanvasKit;
    /** Отступ сверху */
    private top: number = 0;
    /** Направление */
    public direction!: TDirection;

    constructor({ canvasKit, top }: TProps) {
        this.canvasKit = canvasKit;
        this.top = top;
    }

    /** Метод для отрисовки */
    public draw() {
        const dotesCount = Math.round(this.canvasKit.width / DOTTED_LINE_WIDTH);

        [...new Array(dotesCount)].forEach((_, i) => {
            this.canvasKit.drawLine({
                x: i * (DOTTED_LINE_WIDTH + DOTTED_LINE_MARGIN_LEFT),
                y: this.top,
                length: DOTTED_LINE_WIDTH,
                type: 1,
                color: DOTTED_LINE_BACKGROUND_COLOR,
            });
        });
    }

    /** Метод для перерисовки */
    public reDraw() {}
}
