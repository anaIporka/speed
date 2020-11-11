import React from "react";
import { prepareIcons } from "./icons/canvas-icons";
import SpeedDetectorCanvas from "./components/sdv-canvas";
import SpeedDetectorStatistic from "./components/sdv-statistic";

import "./speed-detector-visualization.scss";
import { TSdvProps } from "./types";

export default class SpeedDetectorVisualization extends React.Component<TSdvProps, {}> {
    componentDidMount() {
        prepareIcons();
    }

    shouldComponentUpdate(nextProps: TSdvProps) {
        return nextProps.signal !== this.props.signal;
    }

    render() {
        return (
            <div className="speed-detector-visualization">
                <div className="speed-detector-visualization__canvas-container">
                    <SpeedDetectorCanvas width={this.props.width} data={this.props.data} signal={this.props.signal} />
                </div>
                <div className="speed-detector-visualization__statistic-container">
                    {(this.props.isShowStatistic === undefined || this.props.isShowStatistic) && (
                        <SpeedDetectorStatistic
                            statistic={this.props.statistic}
                            signal={this.props.signal}
                            onStatisticSamplingChange={this.props.onStatisticSamplingChange}
                            onDetailsClick={this.props.onDetailsClick}
                        />
                    )}
                </div>
            </div>
        );
    }
}
