import { TData, TStatistic } from "../src/types";

export const initialStatistic: TStatistic | undefined = {
    total: 120903,
    moto: 233,
    auto: 123446,
    bus: 23553,
    truckS: 23,
    truckM: 0,
    truckL: 4,
};

export const data: TData = [
    {
        // номер направления
        id: 1,

        /**
         * тип направление
         * @remark Обратное
         */
        type: 0,

        lanes: [
            {
                // Номер палосы
                number: 1,

                // средняя скорость по полосе
                speedByLane: 15.8,
            },
            {
                // Номер палосы
                number: 2,

                // средняя скорость по полосе
                speedByLane: 25.8,
            },
            {
                // Номер палосы
                number: 3,

                // средняя скорость по полосе
                speedByLane: 15.8,
            },
            {
                // Номер палосы
                number: 4,

                // средняя скорость по полосе
                speedByLane: 15.8,
            },
        ],
    },
    {
        // номер направления
        id: 2,

        /**
         * тип направление
         * @remark Прямое
         */
        type: 1,

        lanes: [
            {
                // Номер палосы
                number: 1,

                // средняя скорость по полосе
                speedByLane: 31.6,
            },
            {
                // Номер палосы
                number: 2,

                // средняя скорость по полосе
                speedByLane: 37.6,
            },
            {
                // Номер палосы
                number: 3,

                // средняя скорость по полосе
                speedByLane: 31.6,
            },
        ],
    },
    {
        // номер направления
        id: 3,

        /**
         * тип направление
         * @remark Прямое
         */
        type: 1,

        lanes: [
            {
                // Номер палосы
                number: 1,

                // средняя скорость по полосе
                speedByLane: 19.2,
            },
            {
                // Номер палосы
                number: 2,

                // средняя скорость по полосе
                speedByLane: 49.9,
            },
        ],
    },
];
