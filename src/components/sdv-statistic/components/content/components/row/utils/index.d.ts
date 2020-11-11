declare module "*.svg" {
    import React from "react";

    export const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
    export const text: string;
    const src: string;
    export default src;
}
