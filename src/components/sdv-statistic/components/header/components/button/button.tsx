import React, { memo } from "react";

import "./button.scss";

type TProps = {
    title: string;
    onClick: () => void;
};

const Button = ({ title, onClick }: TProps) => {
    return (
        <button onClick={onClick} className="sdv-statistic-header-button">
            {title}
        </button>
    );
};

export default memo(Button);
