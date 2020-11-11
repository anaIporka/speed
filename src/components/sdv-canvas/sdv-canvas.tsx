import React, { createRef } from "react";
import { TData, TSignal } from "../../types";
import StaticCanvasController from "./static-canvas/static-canvas-controller";
import VehiclesCanvasController from "./animated-canvas/vehicles-canvas-controller";

import "./sdv-canvas.scss";

type TProps = {
    /** Данные */
    data: TData;
    /** Ширина */
    width: number;
    /** Сигнал с датчика */
    signal?: TSignal[];
};

type TState = {
    /** Можно ли рисовать */
    allowDraw: boolean;
};

export default class SpeedDetectorCanvas extends React.Component<TProps, TState> {
    constructor(props: TProps) {
        super(props);

        this.state = {
            allowDraw: true,
        };

        this.vehiclesCanvasRef = createRef();
        this.canvasRef = createRef();
        this.canvasContainerRef = createRef();
    }

    componentDidMount() {
        if (!this.vehiclesCanvasRef || !this.vehiclesCanvasRef.current) return;
        if (!this.canvasRef || !this.canvasRef.current) return;
        if (!this.canvasContainerRef || !this.canvasContainerRef.current) return;

        this.tryToDraw();

        this.staticCanvasController = new StaticCanvasController({
            canvas: this.canvasRef.current,
            data: this.props.data,
            width: this.props.width,
        });

        this.vehiclesCanvasController = new VehiclesCanvasController({
            canvas: this.vehiclesCanvasRef.current,
            data: this.props.data,
            width: this.props.width,
        });
    }

    shouldComponentUpdate(nextProps: TProps) {
        return nextProps.signal !== this.props.signal;
    }

    componentDidUpdate() {
        if (!this.props.signal || !this.state.allowDraw) return;
        this.vehiclesCanvasController.animate(this.props.signal);
        this.staticCanvasController.animate(this.props.signal);
    }

    componentWillUnmount() {
        if (typeof this.idAnimationFrame === "number") {
            window.cancelAnimationFrame(this.idAnimationFrame);
        }
    }

    /** идентификатор анимации для теста */
    private idAnimationFrame?: number;
    /** реф для канваса с ТС */
    private vehiclesCanvasRef: React.RefObject<HTMLCanvasElement>;
    /** реф для канваса со всем остальным */
    private canvasRef: React.RefObject<HTMLCanvasElement>;
    /** реф для контейнера канвасов */
    private canvasContainerRef: React.RefObject<HTMLDivElement>;
    /**  */
    private staticCanvasController!: StaticCanvasController;
    /**  */
    private vehiclesCanvasController!: VehiclesCanvasController;

    private tryToDraw() {
        if (typeof this.idAnimationFrame === "number") {
            window.cancelAnimationFrame(this.idAnimationFrame);
        }

        if (!this.vehiclesCanvasRef.current) return;
        const ctx = this.vehiclesCanvasRef.current.getContext("2d");
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(0, 0, 1, 0, 2 * Math.PI, false);
        ctx.closePath();

        const timer = setInterval(() => {
            if (this.state.allowDraw === false) return;
            this.setState({ allowDraw: false });
        }, 100);

        this.idAnimationFrame = window.requestAnimationFrame(() => {
            clearTimeout(timer);

            if (this.state.allowDraw === false) {
                this.setState({ allowDraw: true }, () => {
                    this.tryToDraw();
                });
            } else {
                this.tryToDraw();
            }
        });
    }

    render() {
        return (
            <div ref={this.canvasContainerRef} className="speed-detector-visualization-canvas">
                <canvas className="speed-detector-visualization-canvas__animated-canvas" ref={this.vehiclesCanvasRef} />
                <canvas className="speed-detector-visualization-canvas__static-canvas" ref={this.canvasRef} />
            </div>
        );
    }
}
