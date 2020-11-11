import { TSignal } from "../../../../types";

export const getIsActive = (signal: TSignal[] | undefined, value: number) => {
    if (!signal) return false;

    const sig = signal.find((el) => el.carType === value);

    return !!sig;
};
export const prettifyNumber = (x: number) => {
    if (x === 0) return "-";

    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
};
