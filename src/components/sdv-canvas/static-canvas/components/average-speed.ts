// @ts-ignore
import { Bezier } from "bezier-js";
import { IAnimatedCanvasShape, TData, TDirection, TLane, TSignal } from "../../../../types";
import { AVERAGE_SPEED_BLOCK_ALPHA, AVERAGE_SPEED_BLOCK_BACKGROUND_COLOR } from "../../consts/colors";
import {
    AVERAGE_SPEED_BLOCK_CURVE_RADIUS,
    SPEED_TITLE_FONT_SIZE,
    BUMP_STOP_HEIGHT,
    CURRENT_SPEED_TITLE_BLOCK_WIDTH,
    ROAD_LINE_HEIGHT,
    SPEED_TITLE_KILOMETERS_FONT_SIZE,
} from "../../consts/shapes-geometry";
import CanvasKit from "../../utils/canvas-kit";

type TProps = {
    /** Объект с методами для отрисовки примитивов */
    canvasKit: CanvasKit;
    /** Направление */
    direction: TDirection;
    /** Отступ сверху */
    top: number;
    /** Высота */
    height: number;
    /** Метод для перерисовки канваса */
    canvasReDraw: () => void;
};

type TBezierPoint = {
    x: number;
    y: number;
    t: number;
};

export default class AverageSpeed implements IAnimatedCanvasShape {
    /** Экземпляр класса с методами для отрисовки примитивов */
    private canvasKit: CanvasKit;
    /** Отступ сверху */
    private top: number;
    /** Высота блока */
    private height: number;
    /** Точки кривой */
    private bezierPoints!: TBezierPoint[];
    /** Направление */
    public direction: TDirection;
    /** Данные */
    public data!: TData;
    /** Номер полосы */
    public laneNumber!: number;
    /** Метод для перерисовки канваса */
    public canvasReDraw: () => void;

    constructor({ canvasKit, direction, top, height, canvasReDraw }: TProps) {
        this.canvasKit = canvasKit;
        this.direction = direction;
        this.top = top;
        this.height = height;
        this.canvasReDraw = canvasReDraw;
    }

    /** Метод для получения радиуса кривой в зависимости от типа направления */
    private get radius() {
        return this.direction.type === 0 ? AVERAGE_SPEED_BLOCK_CURVE_RADIUS : -AVERAGE_SPEED_BLOCK_CURVE_RADIUS;
    }

    /** Метод для получения начального икса в зависимости от типа направления */
    private get x() {
        return this.direction.type === 0
            ? CURRENT_SPEED_TITLE_BLOCK_WIDTH / 10
            : this.canvasKit.width - CURRENT_SPEED_TITLE_BLOCK_WIDTH;
    }

    /** Свойство ширины пространства для очистки */
    private get clearByLaneWidth() {
        return this.direction.type === 0
            ? -(CURRENT_SPEED_TITLE_BLOCK_WIDTH + this.radius)
            : CURRENT_SPEED_TITLE_BLOCK_WIDTH + this.radius;
    }

    /** Метод для получения выравненного текста */
    private getText = (text: string, font: string) => {
        return this.canvasKit.getMeasuredText({
            font,
            text,
        });
    };

    /** Метод для получения точек кривой для нужной полосы */
    private getRoadLaneBezierPoints = (laneNumber: number) => {
        return this.bezierPoints.filter(
            (point) =>
                point.y >= this.top + BUMP_STOP_HEIGHT + ROAD_LINE_HEIGHT * (laneNumber - 1) + 1 &&
                point.y <= this.top + ROAD_LINE_HEIGHT * laneNumber + BUMP_STOP_HEIGHT - 1
        );
    };

    /** Метод для преобразования простых точек в точки кривой */
    private getBezierTypePoint = (pointX: number, pointY: number) => {
        return {
            x: pointX,
            y: pointY,
        };
    };

    /** Метод для получения цвета в зависимости от процента превышения средней скорости */
    private getColor = (percentage: number) => {
        if (percentage >= 120 && percentage < 140) return "#F7C344";
        if (percentage >= 140) return "#E63125";
        return AVERAGE_SPEED_BLOCK_BACKGROUND_COLOR;
    };

    /** Метод для получения процента превышения скорости */
    private getPercentage = (signalSpeed: number, averageSpeed: number) => {
        return (signalSpeed * 100) / averageSpeed;
    };

    /** Метод для отрисовки кривой блока средней скорости */
    private drawCurve = (x: number) => {
        const ctx = this.canvasKit.Ctx;

        ctx.beginPath();
        ctx.globalAlpha = AVERAGE_SPEED_BLOCK_ALPHA;
        ctx.fillStyle = AVERAGE_SPEED_BLOCK_BACKGROUND_COLOR;
        ctx.strokeStyle = AVERAGE_SPEED_BLOCK_BACKGROUND_COLOR;

        const [startPointX, startPointY] = [x, this.top];
        const [controlPointX, controlPointY] = [x + this.radius, this.top + this.height / 2];
        const [endPointX, endPointY] = [x, this.top + this.height];

        const bezier = new Bezier([
            this.getBezierTypePoint(startPointX, startPointY),
            this.getBezierTypePoint(controlPointX, controlPointY),
            this.getBezierTypePoint(endPointX, endPointY),
        ]);

        this.bezierPoints = bezier.getLUT(1000) as TBezierPoint[];

        ctx.moveTo(startPointX, startPointY);
        ctx.quadraticCurveTo(controlPointX, controlPointY, endPointX, endPointY);

        ctx.stroke();
        ctx.fill();
        ctx.globalAlpha = 1;
    };

    /** Метод для отрисовки текста скорости для полосы */
    private drawSpeedTitle = (lane: TLane, index: number) => {
        const titleHeight = SPEED_TITLE_FONT_SIZE + SPEED_TITLE_KILOMETERS_FONT_SIZE;
        const y = this.top + BUMP_STOP_HEIGHT + titleHeight / 2;
        const unitsText = this.getText("км/ч", `${SPEED_TITLE_KILOMETERS_FONT_SIZE}px Roboto`);
        const speedText = this.getText(lane.speedByLane.toString(), `${SPEED_TITLE_FONT_SIZE}px Roboto`);

        this.canvasKit.drawText({
            x: this.x,
            y: y + ROAD_LINE_HEIGHT / 2 + ROAD_LINE_HEIGHT * index - titleHeight / 2,
            font: speedText.font,
            text: speedText.text,
            color: "white",
        });

        this.canvasKit.drawText({
            x: this.x + unitsText.measure.width / 2,
            y: y + ROAD_LINE_HEIGHT / 2 + ROAD_LINE_HEIGHT * index,
            font: unitsText.font,
            text: unitsText.text,
            color: "white",
        });
    };

    /** Метод для отрисовки подписей скорости */
    private drawSpeedTitles() {
        this.direction.lanes.forEach(this.drawSpeedTitle);
    }

    /** Метод для отрисовки блока */
    public draw() {
        const x = this.direction.type === 0 ? 0 : this.canvasKit.width - CURRENT_SPEED_TITLE_BLOCK_WIDTH;

        this.drawSpeedTitles();

        this.canvasKit.drawRect({
            x,
            y: this.top,
            width: CURRENT_SPEED_TITLE_BLOCK_WIDTH,
            height: this.height,
            color: AVERAGE_SPEED_BLOCK_BACKGROUND_COLOR,
            opacity: AVERAGE_SPEED_BLOCK_ALPHA,
        });

        this.drawCurve(x + (this.direction.type === 0 ? CURRENT_SPEED_TITLE_BLOCK_WIDTH : 0));
    }

    /** Метод анимации кусочка блока средней скорости */
    public animate = (signal: TSignal) => {
        const percentage = this.getPercentage(signal.speed, this.direction.lanes[signal.laneNumber - 1].speedByLane);

        if (percentage < 120) return;

        const points = this.getRoadLaneBezierPoints(signal.laneNumber);

        this.canvasReDraw();

        this.clearByLane(points);

        const lane = this.direction.lanes.find((el) => el.number === signal.laneNumber);

        if (!lane) return;

        this.drawSpeedTitle(lane, signal.laneNumber - 1);

        this.drawAnimatedBack(points, percentage);

        setTimeout(() => {
            this.canvasReDraw();
        }, 800);
    };

    /** Метод для отрисовки бекграунда для анимированного блока полосы */
    private drawAnimatedBack = (points: TBezierPoint[], percentage: number) => {
        points.forEach((point) => {
            this.canvasKit.drawPoint({
                x: point.x + (this.direction.type === 0 ? -1 : 1),
                y: point.y,
                radius: 1,
                color: this.getColor(percentage),
            });

            this.canvasKit.drawRect({
                x: point.x,
                y: point.y,
                width: this.direction.type === 0 ? -this.canvasKit.width : this.canvasKit.width,
                height: 1,
                color: this.getColor(percentage),
                opacity: AVERAGE_SPEED_BLOCK_ALPHA,
            });
        });
    };

    /** Метод для очистки по точкам */
    private clearByLane = (points: TBezierPoint[]) => {
        if (this.direction.type === 0) {
            this.canvasKit.clearBy({
                x: points[0].x + this.clearByLaneWidth,
                y: points[0].y,
                w: CURRENT_SPEED_TITLE_BLOCK_WIDTH + this.radius + 20,
                h: ROAD_LINE_HEIGHT - 2,
            });
        } else if (this.direction.type === 1) {
            this.canvasKit.clearBy({
                x: points[0].x - this.clearByLaneWidth,
                y: points[0].y,
                w: this.canvasKit.width,
                h: ROAD_LINE_HEIGHT - 2,
            });
        }
    };

    /** Нативный метод перерисовки */
    public reDraw() {
        this.draw();
    }
}
