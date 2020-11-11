import CanvasKit from "../../utils/canvas-kit";
import { ICanvasShape, TData, TDirection } from "../../../../types";
import { CURRENT_SPEED_TITLE_BACKGROUND_COLOR } from "../../consts/colors";
import { CURRENT_SPEED_TITLE_BLOCK_WIDTH } from "../../consts/shapes-geometry";

export type TCurrentSpeedProps = {
    /** Объект с методами для отрисовки примитивов */
    canvasKit: CanvasKit;
    /** Направление */
    direction: TDirection;
    /** Данные */
    data: TData;
    /** Отступ сверху */
    top: number;
    /** Высота */
    height: number;
};

export default class CurrentSpeed implements ICanvasShape {
    /** Объект с методами для отрисовки примитивов */
    private canvasKit: CanvasKit;
    /** Отступ сверху */
    private top: number;
    /** Высота */
    private height: number;
    /** Данные */
    public data: TData;
    /** Направление */
    public direction: TDirection;

    constructor({ canvasKit, top, height, data, direction }: TCurrentSpeedProps) {
        this.canvasKit = canvasKit;
        this.top = top;
        this.height = height;
        this.data = data;
        this.direction = direction;
    }

    /** Метод для получения стартового икса для блока */
    private get x() {
        return this.direction.type === 0 ? this.canvasKit.width - CURRENT_SPEED_TITLE_BLOCK_WIDTH : 0;
    }

    /** Мето для отрисовки подложки */
    private drawSubstrate = () => {
        this.canvasKit.drawRect({
            x: this.x,
            y: this.top,
            width: CURRENT_SPEED_TITLE_BLOCK_WIDTH,
            height: this.height,
            color: CURRENT_SPEED_TITLE_BACKGROUND_COLOR,
            opacity: 0.38,
        });
    };

    /** Метод для вызова методов отрисовки */
    public draw() {
        this.drawSubstrate();
    }

    /** Метод для перерисвоки компонента */
    public reDraw() {
        this.canvasKit.Ctx.clearRect(this.x, this.top, CURRENT_SPEED_TITLE_BLOCK_WIDTH, this.height);
        this.draw();
    }
}
