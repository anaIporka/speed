// @ts-ignore
import { v4 as createUID } from "uuid";
import { CanvasIcons, vehicleIcons } from "../../../../icons/canvas-icons";
import { IAnimatedCanvasShape, TData, TDirection, TOnAnimationEnd, TSignal } from "../../../../types";
import CanvasKit, { TLine } from "../../utils/canvas-kit";
import { getIcon, TIconProperties } from "../../utils/canvas-icons";
import { CARS_UPDATE_FREQUENCY } from "../../consts/animations";
import VehiclesCanvasController from "../vehicles-canvas-controller";
import { getVectorsDifference } from "../../utils/geometry-calculations";

type TProps = {
    vehicleIndex: number;
    canvasKit: CanvasKit;
    top: number;
    direction: TDirection;
    laneNumber: number;
    signal: TSignal;
    parent: VehiclesCanvasController;
    onAnimationEnd: TOnAnimationEnd;
};

type TGetNewLeft = {
    type: number;
    speed: number;
    impositionDifference?: number;
};

export default class Vehicle implements IAnimatedCanvasShape {
    /** Индекс в массиве компонентов */
    private vehicleIndex: number;
    /** Объект с методами для отрисовки примитивов */
    private canvasKit: CanvasKit;
    /** Отступ сверху */
    private top: number = 0;
    /** Переменная для хранения интервала анимации */
    private animationInterval!: NodeJS.Timeout;
    /** Скорость машины в км/ч */
    private speed!: number;
    /** Коллбек для вызова по окончанию анимации */
    private onAnimationEnd: TOnAnimationEnd;
    /** Направление */
    public direction: TDirection;
    /** Номер полосы */
    public laneNumber: number;
    /** Данные */
    public data!: TData;
    /** Отступ ТС слева */
    public left: number = 0;
    /** Контроллер */
    public parent: VehiclesCanvasController;
    /** Флаг показывающий закончена анимация или нет */
    public isAnimationEnd: boolean = false;
    /** Уникальный идентификатор ТС на канвасе */
    public uId: string;
    /** Иконка ТС */
    public icon!: TIconProperties;
    /** Сигнал с датчика */
    public signal: TSignal;

    constructor({ vehicleIndex, canvasKit, top, direction, laneNumber, signal, parent, onAnimationEnd }: TProps) {
        this.uId = createUID();
        this.vehicleIndex = vehicleIndex;
        this.canvasKit = canvasKit;
        this.top = top;
        this.direction = direction;
        this.laneNumber = laneNumber;
        this.parent = parent;
        this.signal = signal;
        this.onAnimationEnd = onAnimationEnd;

        this.left = direction.type === 0 ? this.canvasKit.width + 100 : -100;

        const iconType = this.getIconByCarType(this.direction.type, signal.carType) as CanvasIcons;
        const icon = getIcon(iconType);

        if (!icon) return;

        this.icon = icon;

        this.animate(signal);
    }

    /** Получение иконки по типу ТС */
    private getIconByCarType = (dirType: number, carType: number) => {
        return vehicleIcons.find((icon) => icon.carType === carType)?.icons[dirType];
    };

    /** Метод для статической отрисовки машинки с заданными параметрами */
    public draw() {
        const icon = getIcon(this.direction.type === 0 ? CanvasIcons.CAR_REVERTED_ICON : CanvasIcons.CAR_ICON);

        if (!icon) return;

        this.canvasKit.drawImage({
            image: icon.icon,
            x: this.left,
            y: this.top,
            width: icon.size[0],
            height: icon.size[1],
        });
    }

    /** Метод для отрисовки машиники с иконкой */
    private drawWithIcon(icon: TIconProperties) {
        this.canvasKit.drawImage({
            image: icon.icon,
            x: this.left,
            y: this.top,
            width: icon.size[0],
            height: icon.size[1],
        });
    }

    /** Метод для перерисовки машинки с иконкой */
    public reDrawWithIcon = (icon: TIconProperties) => {
        this.clearCar(icon.size);
        this.drawWithIcon(icon);
    };

    /** Метод для перерисовки */
    public reDraw = () => {
        this.draw();
    };

    /** Метод для очистки пространства машинки */
    private clearCar = (size: [number, number]) => {
        this.canvasKit.Ctx.clearRect(this.left - 10, this.top, size[0] + 20, size[1]);
    };

    /** Метод для обнуления отступов машинки */
    private clearLeft = (size: [number, number]) => {
        if (this.direction.type === 0) {
            this.left = this.canvasKit.width;
        } else {
            this.left = -size[0];
        }
    };

    /** Метод для получени нового отступа по скорости */
    private getNewLeft({ type, speed, impositionDifference = 0 }: TGetNewLeft) {
        return type === 0
            ? -((speed / this.canvasKit.width) * 10 + impositionDifference)
            : (speed / this.canvasKit.width) * 10 + impositionDifference;
    }

    /** Метод анимации */
    private animation = () => {
        const imposition = this.getImpositionVehicle();

        if (imposition) {
            this.setSpeed(imposition.vehicle.getSpeed() + 20);
            this.left += this.getNewLeft({
                type: this.direction.type,
                speed: this.speed,
                impositionDifference: getVectorsDifference({
                    directionType: this.direction.type,
                    impositionVector: imposition.vector,
                    vector: this.getVehicleVector(),
                }),
            });
        } else {
            this.left += this.getNewLeft({
                type: this.direction.type,
                speed: this.speed,
            });
        }

        this.reDrawWithIcon(this.icon);

        if (this.left <= -this.icon.size[0] || this.left >= this.canvasKit.width + 100) {
            clearInterval(this.animationInterval);
            this.reDrawWithIcon(this.icon);
            this.isAnimationEnd = true;
            this.onAnimationEnd(this.vehicleIndex);
        }
    };

    /** Метод для вызова анимации */
    public animate = (signal: TSignal) => {
        clearInterval(this.animationInterval);

        this.speed = signal.speed;

        this.clearCar(this.icon.size);
        this.clearLeft(this.icon.size);
        this.reDrawWithIcon(this.icon);

        this.animationInterval = setInterval(this.animation, CARS_UPDATE_FREQUENCY);
    };

    /** Метод для поиска наложения двух машин */
    private getImpositionVehicle = () => {
        const vehicles: Vehicle[] = this.parent.components as Vehicle[];
        const vector = this.getVehicleVector();

        const imposition = vehicles.find((vehicle) => {
            const vehVector = vehicle.getVehicleVector();

            const isThis = vehicle.uId === this.uId;
            const isThisDirectionAndLane =
                vehicle.direction.id === this.direction.id && vehicle.laneNumber === this.laneNumber;

            let condition =
                !isThis && isThisDirectionAndLane && vehVector[1][0] >= vector[0][0] && vehVector[1][0] <= vector[1][0];
            if (this.direction.type === 0) {
                condition =
                    !isThis &&
                    isThisDirectionAndLane &&
                    vehVector[0][0] <= vector[1][0] &&
                    vehVector[0][0] >= vector[0][0];
            }

            return condition;
        });

        if (!imposition) return;

        const impVector = imposition.getVehicleVector();

        return {
            vector: impVector as TLine,
            vehicle: imposition,
        };
    };

    /** Метод получения вектора машины */
    public getVehicleVector = () => {
        return [
            [this.left - 10, this.top + this.icon.size[1] / 2],
            [this.left + 10 + this.icon.size[0], this.top + this.icon.size[1] / 2],
        ] as TLine;
    };

    /** Сеттер для скорости */
    public setSpeed = (newSpeed: number) => (this.speed = newSpeed);

    /** Геттер для скорости */
    public getSpeed = () => this.speed;
}
