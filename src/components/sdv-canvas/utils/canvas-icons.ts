/** Тип не загруженной иконки */
type TAddImage = {
    /** Имя иконки */
    name: string;
    /** Незагруженная иконка */
    icon: string;
    /** Размеры иконки */
    size: [number, number];
};

/** Тип загруженной картинки */
export type TIconProperties = TAddImage & {
    /** Загруженная иконка */
    icon: HTMLImageElement;
};

/** Массив загруженных иконок */
const icons: TIconProperties[] = [];

/** Метод для получения иконки по имени */
export const getIcon = (name: string): TIconProperties | undefined => icons.find((icon) => icon.name === name);

/** Метод для добавления загрузки иконки */
export const addImage = (args: TAddImage) => {
    if (!args.icon) return;
    const DOMURL = window.URL || window.webkitURL || window;
    const image = new Image();
    const svg = new Blob([args.icon], { type: "image/svg+xml" });
    // @ts-ignore
    const url = DOMURL.createObjectURL(svg);
    image.src = url;

    const iconProps = { ...args, ...{ icon: image } } as TIconProperties;
    return icons.push(iconProps);
};

export default icons;
