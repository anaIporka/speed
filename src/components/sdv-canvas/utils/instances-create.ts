import AverageSpeed from "../static-canvas/components/average-speed";
import BumpStop, { BumpType } from "../static-canvas/components/bump-stop";
import DottedLine from "../static-canvas/components/dotted-line";
import CurrentSpeed from "../static-canvas/components/current-speed";
import { TSignal } from "../../../types";
import { BUMP_STOP_HEIGHT, ROAD_LINE_HEIGHT } from "../consts/shapes-geometry";
import { TBumpStopsArgs, TDottedLinesArgs, TSpeedBlockArgs } from "../types/functions-args";
import { SpeedBlockType } from "../types/instances";

/** Метод для создания экземпляров отбойников */
export const createBumpStops = ({ canvasKit, firstBumpTop, secondBumpTop, direction }: TBumpStopsArgs) => {
    return [
        new BumpStop({ type: BumpType.TOP, canvasKit: canvasKit, top: firstBumpTop, direction }),
        new BumpStop({ type: BumpType.BOTTOM, canvasKit: canvasKit, top: secondBumpTop, direction }),
    ];
};

/** Метод для создания экземпляров разметки  */
export const createDottedLines = ({ canvasKit, top, lanes }: TDottedLinesArgs) => {
    return lanes
        .map((_, i) => {
            if (i === lanes.length - 1) return undefined;
            const dottedLineTop = (i + 1) * ROAD_LINE_HEIGHT + BUMP_STOP_HEIGHT;

            return new DottedLine({ canvasKit: canvasKit, top: top + dottedLineTop });
        })
        .filter((el) => el !== undefined) as DottedLine[];
};

/** Метод для получения объекта с аргументами для поиска транспорта */
export const createVehicleSearchArgs = (signal: TSignal) => {
    return {
        id: signal.direction.id,
        laneNumber: signal.laneNumber,
    };
};

/** Метод для получения экземпляров блоков для отрисовки средней скорости */
export const createAverageSpeedBlocks = ({
    canvasKit,
    firstBumpTop,
    secondBumpTop,
    direction,
    canvasReDraw = () => {},
}: TSpeedBlockArgs) => {
    return new AverageSpeed({
        canvasKit,
        top: firstBumpTop,
        height: secondBumpTop + BUMP_STOP_HEIGHT - firstBumpTop,
        direction,
        canvasReDraw,
    });
};

/** Метод для получения экземпляров блоков для отрисовки текущей скорости */
export const createCurrentSpeedBlocks = ({
    canvasKit,
    firstBumpTop,
    secondBumpTop,
    data,
    direction,
}: TSpeedBlockArgs) => {
    return new CurrentSpeed({
        canvasKit,
        top: firstBumpTop,
        height: secondBumpTop + BUMP_STOP_HEIGHT - firstBumpTop,
        data,
        direction,
    });
};

export const createSpeedBlock = (blockType: SpeedBlockType) =>
    blockType === SpeedBlockType.CURRENT ? createCurrentSpeedBlocks : createAverageSpeedBlocks;
