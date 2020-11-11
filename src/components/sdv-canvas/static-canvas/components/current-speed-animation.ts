import CanvasKit from "../../utils/canvas-kit";
import { IAnimatedCanvasShape, TData, TDirection, TOnAnimationEnd, TSignal } from "../../../../types";
import {
    CURRENT_SPEED_TITLE_BLOCK_WIDTH,
    ROAD_LINE_HEIGHT,
    SPEED_TITLE_FONT_SIZE,
    SPEED_TITLE_KILOMETERS_FONT_SIZE,
} from "../../consts/shapes-geometry";
import { ANIMATED_SPEED_BACKGROUND_COLOR, CURRENT_SPEED_TITLE_BACKGROUND_COLOR } from "../../consts/colors";
import { TCurrentSpeedAnimationProps } from "../../types/instances";

enum AnimationEventType {
    START,
    STOP,
}

type TAnimation = {
    type: AnimationEventType;
    y: number;
    speed: number;
};

type TDrawPeace = {
    y: number;
    color: string;
    opacity: number;
};

type TDrawText = {
    speed: number;
    opacity: number;
    y: number;
};

export default class CurrentSpeedAnimation implements IAnimatedCanvasShape {
    /** Данные */
    public data: TData;
    /** Направление */
    public direction: TDirection;
    /** Номер полосы */
    public laneNumber: number;
    /** Объект с методами для отрисовки примитивов */
    private canvasKit: CanvasKit;
    /** Отступ сверху */
    private top: number;
    /** Прозрачность анимации */
    private animationOpacity = 0;
    /** Свойство для хранения интервала анимации */
    private animationInterval!: NodeJS.Timeout;
    private animationIndex: number;
    /** Индекс анимации */
    private animationStatus: number = 0;
    /** Коллбек для вызова по окончанию анимации */
    private onAnimationEnd: TOnAnimationEnd;

    constructor({
        canvasKit,
        top,
        data,
        direction,
        laneNumber,
        animationIndex,
        signal,
        onAnimationEnd,
    }: TCurrentSpeedAnimationProps) {
        this.canvasKit = canvasKit;
        this.data = data;
        this.direction = direction;
        this.top = top;
        this.laneNumber = laneNumber;
        this.animationIndex = animationIndex;
        this.onAnimationEnd = onAnimationEnd;

        this.animate(signal);
    }

    /** Метод для получения начального икса в зависимости от типа направления */
    private get x() {
        return this.direction.type === 0 ? this.canvasKit.width - CURRENT_SPEED_TITLE_BLOCK_WIDTH : 0;
    }

    /** Метод для получения высоты тайтла для позиционирования */
    private get titleHeight() {
        return SPEED_TITLE_FONT_SIZE + SPEED_TITLE_KILOMETERS_FONT_SIZE;
    }

    /** Метод для отрисовки куска с анимацией */
    private drawChunk = ({ y, color, opacity }: TDrawPeace) => {
        this.canvasKit.drawRect({
            x: this.x,
            y: y + 1,
            width: CURRENT_SPEED_TITLE_BLOCK_WIDTH,
            height: ROAD_LINE_HEIGHT - 2,
            color: color,
            opacity,
        });
    };

    /** Метод для получения отцентрированного текста скорости */
    private getSpeedText = (speed: number) => {
        return this.canvasKit.getMeasuredText({
            font: `${SPEED_TITLE_FONT_SIZE}px Roboto`,
            text: speed.toString(),
        });
    };

    /** Метод для получения отцентрированного текста подписи скорости */
    private getSpeedUnitsTitleText = () => {
        return this.canvasKit.getMeasuredText({
            font: `${SPEED_TITLE_KILOMETERS_FONT_SIZE}px Roboto`,
            text: "км/ч",
        });
    };

    /** Метод для отрисовки текста */
    private drawText = ({ speed, opacity, y }: TDrawText) => {
        const speedText = this.getSpeedText(speed);

        const titleText = this.getSpeedUnitsTitleText();

        this.canvasKit.drawText({
            x: this.x + (CURRENT_SPEED_TITLE_BLOCK_WIDTH - speedText.measure.width) / 2,
            y: y + (ROAD_LINE_HEIGHT / 2 - this.titleHeight / 2) + 20,
            font: speedText.font,
            text: speedText.text,
            color: "white",
            opacity,
        });

        this.canvasKit.drawText({
            x: this.x + (CURRENT_SPEED_TITLE_BLOCK_WIDTH - titleText.measure.width) / 2,
            y: y + (ROAD_LINE_HEIGHT / 2 - this.titleHeight / 2) + 30,
            color: "#ffffff",
            font: titleText.font,
            text: titleText.text,
            opacity,
        });
    };

    /** Метод для перерисовки куска с анимацией */
    private reDrawChunk(y: number) {
        this.canvasKit.Ctx.clearRect(this.x, y + 1, CURRENT_SPEED_TITLE_BLOCK_WIDTH, ROAD_LINE_HEIGHT - 2);
        this.drawChunk({ y, color: CURRENT_SPEED_TITLE_BACKGROUND_COLOR, opacity: 0.3 });
    }

    /** Метод анимации */
    private animation = ({ type, y, speed }: TAnimation) => {
        this.animationOpacity += type === AnimationEventType.START ? 0.05 : -0.05;
        this.reDrawChunk(y);
        this.drawText({ y, opacity: this.animationOpacity, speed });
        this.drawChunk({ y, color: ANIMATED_SPEED_BACKGROUND_COLOR, opacity: this.animationOpacity });
        if (this.animationStatus === 0 && this.animationOpacity >= 1) {
            this.animationStatus = 1;
        } else if (this.animationStatus === 1 && this.animationOpacity <= 0) {
            this.animationStatus = 3;
        }
    };

    /** Метод для анимирования */
    public animate(signal: TSignal) {
        this.animationOpacity = 0;
        this.reDrawChunk(this.top);
        clearInterval(this.animationInterval);

        this.animationInterval = setInterval(() => {
            if (this.animationStatus === 0)
                this.animation({ type: AnimationEventType.START, y: this.top, speed: signal.speed });
            if (this.animationStatus === 1)
                this.animation({ type: AnimationEventType.STOP, y: this.top, speed: signal.speed });
            if (this.animationStatus === 3) {
                this.stopAnimation();
                this.onAnimationEnd(this.animationIndex);
            }
        }, 25);
    }

    /** Метод для сброса анимации */
    public stopAnimation = () => {
        this.animationOpacity = 0;
        this.animationStatus = 0;
        this.reDrawChunk(this.top);
        clearInterval(this.animationInterval);
    };

    public draw = () => {};

    public reDraw = () => {};
}
