type TPoint = [number, number];

export type TLine = [TPoint, TPoint];

type TCanvasSize = {
    width: number | string;
    height: number | string;
};

enum LineType {
    VERTICAL,
    HORIZONTAL,
}

type TDrawShape = {
    x: number;
    y: number;
};

type TLineArgs = {
    type: LineType;
    length: number;
    color: string;
};

type TDrawTextArgs = TDrawShape & {
    text: string;
    color: string;
    font: string;
    opacity?: number;
};

type TGetMeasuredText = {
    font: string;
    text: string;
};

type TDrawLineArgs = TDrawShape & TLineArgs;

type TDrawWidthLineArgs = TDrawShape &
    TLineArgs & {
        width: number;
    };

type TDrawRect = TDrawShape & {
    width: number;
    height: number;
    color: string;
    opacity?: number;
};

type TDrawPoint = TDrawShape & {
    radius: number;
    color: string;
};

type TDrawRoundRect = TDrawPoint & TDrawRect;

type TDrawTriangle = {
    startX: number;
    startY: number;
    corner: {
        first: TDrawShape;
        second: TDrawShape;
    };
    color: string;
};

type TDrawStyledPoint = TDrawShape & {
    fillColor: string;
    borderColor: string;
    radius: number;
    borderWidth: number;
};

type TDrawImage = TDrawShape & {
    image: HTMLImageElement;
    width?: number;
    height?: number;
    rotateDegrees?: number;
};

type TDrawCurve = {
    points: TPoint[];
    width: number;
    color: string;
    opacity?: number;
};

type TClearBy = {
    x: number;
    y: number;
    w: number;
    h: number;
};

/** Класс-обертка над канвасом для отрисовки примитивов */
class CanvasKit {
    private canvas!: HTMLCanvasElement;
    private ctx!: CanvasRenderingContext2D;

    constructor(canvas: HTMLCanvasElement) {
        if (canvas === null) return;

        this.canvas = canvas as HTMLCanvasElement;

        this.ctx = this.getCtx(canvas);

        this.initResizeEvent(canvas);

        this.ctx.globalCompositeOperation = "destination-over";
    }

    private getCtx(canvas: HTMLCanvasElement) {
        return this.setDpi(canvas) as CanvasRenderingContext2D;
    }

    private initResizeEvent(canvas: HTMLCanvasElement) {
        window.onresize = () => {
            this.ctx = this.getCtx(canvas);
        };
    }

    private setDpi(canvas: HTMLCanvasElement) {
        const width = canvas.offsetWidth;
        const height = canvas.offsetHeight;
        const ctx = canvas.getContext("2d");
        const devicePixelRatio = window.devicePixelRatio || 1;
        // @ts-ignore
        const backingStoreRatio =
            // @ts-ignore
            ctx.webkitBackingStorePixelRatio ||
            // @ts-ignore
            ctx.mozBackingStorePixelRatio ||
            // @ts-ignore
            ctx.msBackingStorePixelRatio ||
            // @ts-ignore
            ctx.oBackingStorePixelRatio ||
            // @ts-ignore
            ctx.backingStorePixelRatio ||
            1;

        if (devicePixelRatio !== backingStoreRatio) {
            const ratio = devicePixelRatio / backingStoreRatio;
            canvas.width = width * ratio;
            canvas.height = height * ratio;
            // @ts-ignore
            ctx.scale(ratio, ratio);
        } else {
            canvas.width = width;
            canvas.height = height;
        }
        return ctx;
    }

    /** Method allows to get canvas context */
    get Ctx() {
        return this.ctx;
    }

    get Canvas() {
        return this.canvas;
    }

    /** Method allows to get canvas width */
    get width(): number {
        return this.canvas.width;
    }

    /** Method allows to get canvas height */
    get height(): number {
        return this.canvas.height;
    }

    set width(width: number) {
        this.canvas.width = width;
    }

    set height(height: number) {
        this.canvas.height = height;
    }

    /** Method allows to set canvas size */
    setSize(args: TCanvasSize): void {
        const { width, height } = args;

        if (typeof width === "string") this.canvas.style.width = width;
        else this.canvas.width = width;

        if (typeof height === "string") this.canvas.style.height = height;
        else this.canvas.height = height;
    }

    /** Method allows to set canvas background color */
    setBackgroundColor(color: string): void {
        this.canvas.style.backgroundColor = color;
    }

    /** Method allows to set canvas scale */
    setScale() {}

    /** Method allows to set  */
    setColor(color: string): string {
        this.ctx.fillStyle = color;
        return color;
    }

    rotate(radians: number) {
        this.ctx.translate(0, this.height);
        this.ctx.rotate(radians);
    }

    drawImage({ image, x, y, width = image.width, height = image.height, rotateDegrees = 0 }: TDrawImage) {
        if (rotateDegrees !== 0) {
            this.ctx.save();

            // move to the center of the canvas
            this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);

            // rotate the canvas to the specified degrees
            this.ctx.rotate((rotateDegrees * Math.PI) / 180);

            // draw the image
            // since the context is rotated, the image will be rotated also
        }
        this.ctx.drawImage(image, x, y, width, height);
        // we’re done with the rotating so restore the unrotated context
        this.ctx.restore();
    }

    drawLineWithPoints(point: TLine, color: string) {
        this.ctx.beginPath();
        this.ctx.strokeStyle = color;
        this.ctx.moveTo(point[0][0], point[0][1]);
        this.ctx.lineTo(point[1][0], point[1][1]);
        this.ctx.stroke();
    }

    drawStyledPoint({ x, y, fillColor, borderColor, radius, borderWidth }: TDrawStyledPoint) {
        this.ctx.beginPath();
        this.ctx.strokeStyle = borderColor;
        this.ctx.fillStyle = fillColor;
        this.ctx.lineWidth = borderWidth;
        this.ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
        this.ctx.stroke();
        this.ctx.fill();
        this.ctx.closePath();
    }

    /** Method allows to draw text on canvas */
    drawText({ x = 0, y = 0, font, color = "#000000", text = "", opacity = 1 }: TDrawTextArgs): void {
        this.ctx.font = font;
        this.ctx.globalAlpha = opacity;
        this.ctx.fillStyle = color;
        this.ctx.fillText(text, x, y);
        this.ctx.globalAlpha = 1;
    }

    getMeasuredText({ font, text }: TGetMeasuredText) {
        this.ctx.font = font;
        return { measure: this.ctx.measureText(text), ...{ text, font } };
    }

    /** Nethod allows to draw line on canvas */
    drawLine({ x, y, color, type, length }: TDrawLineArgs): void {
        this.ctx.beginPath();
        this.setColor(color);
        type === LineType.HORIZONTAL && this.ctx.fillRect(x, y, length, 1);
        type === LineType.VERTICAL && this.ctx.fillRect(x, y, 1, length);
    }

    /** Nethod allows to draw line with custom width on canvas */
    drawWidthLine({ x, y, color, width, type, length }: TDrawWidthLineArgs): void {
        this.ctx.beginPath();
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = width;
        this.ctx.moveTo(x, y);
        type === LineType.HORIZONTAL && this.ctx.lineTo(x + length, y);
        type === LineType.VERTICAL && this.ctx.lineTo(x, y + length);
        this.ctx.stroke();
        this.ctx.lineWidth = 1;
    }

    /** Method allows to draw rect on canvas */
    drawRect({ x, y, width, height, color, opacity }: TDrawRect): void {
        if (opacity) this.ctx.globalAlpha = opacity;
        this.setColor(color);
        this.ctx.fillRect(x, y, width, height);
        this.ctx.globalAlpha = 1;
    }

    /** Method allows to draw rect width round border */

    drawTriangle({ startX, startY, corner, color }: TDrawTriangle) {
        this.ctx.beginPath();
        this.ctx.fillStyle = color;
        this.ctx.moveTo(startX, startY);
        this.ctx.lineTo(corner.first.x, corner.first.y);
        this.ctx.lineTo(corner.second.x, corner.second.y);
        this.ctx.fill();
    }

    drawPoint({ x, y, radius, color }: TDrawPoint) {
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, 2 * Math.PI, true);
        this.ctx.fillStyle = color;
        this.ctx.fill();
        this.ctx.closePath();
    }

    drawCurve({ points, width, color, opacity }: TDrawCurve) {
        this.ctx.beginPath();
        if (opacity) this.ctx.globalAlpha = opacity;
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = width;
        this.ctx.moveTo(points[0][0], points[0][1]);
        this.ctx.quadraticCurveTo(points[1][0], points[1][1], points[2][0], points[2][1]);
        this.ctx.stroke();
        this.ctx.closePath();
        this.ctx.globalAlpha = 1;
    }

    drawBezier({ points, width, color }: TDrawCurve) {
        this.ctx.beginPath();
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = width;
        this.ctx.moveTo(points[0][0], points[0][1]);
        this.ctx.bezierCurveTo(points[1][0], points[1][1], points[2][0], points[2][1], points[3][0], points[3][1]);
        this.ctx.stroke();
        this.ctx.closePath();
    }

    drawRoundRect({ x, y, width, height, color, radius }: TDrawRoundRect) {
        if (width < 2 * radius) radius = width / 2;
        if (height < 2 * radius) radius = height / 2;
        this.ctx.beginPath();
        this.ctx.fillStyle = color;
        this.ctx.moveTo(x + radius, y);
        this.ctx.arcTo(x + width, y, x + width, y + height, radius);
        this.ctx.arcTo(x + width, y + height, x, y + height, radius);
        this.ctx.arcTo(x, y + height, x, y, radius);
        this.ctx.arcTo(x, y, x + width, y, radius);
        this.ctx.fill();
        this.ctx.closePath();
    }

    /** Method allows to clear the canvas before redrawing */
    clear() {
        this.ctx.clearRect(0, 0, this.width, this.height);
    }

    clearBy({ x, y, w, h }: TClearBy) {
        this.ctx.clearRect(x, y, w, h);
    }
}

export default CanvasKit;
