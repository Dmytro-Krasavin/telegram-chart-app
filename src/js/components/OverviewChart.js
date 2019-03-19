/* eslint-disable react/prop-types,no-plusplus */
import React, { Component } from 'react';
import ChartPointModifier from '../utils/ChartPointModifier';
import ChartPainter from '../utils/ChartPainter';
import VisibleOverviewChartArea from './VisibleOverviewChartArea';

const INITIAL_INVISIBLE_AREA_LEFT_COEFFICIENT = 0.5;
const INITIAL_INVISIBLE_AREA_RIGHT_COEFFICIENT = 0.2;
const VISIBLE_AREA_BORDER = 15;

class OverviewChart extends Component {
  overviewChart = React.createRef();

  state = {
    invisibleAreaLeftStyle: {
      width: 0
    },
    invisibleAreaRightStyle: {
      width: 0
    },
    canvasWidth: 0,
    leftCoefficient: INITIAL_INVISIBLE_AREA_LEFT_COEFFICIENT,
    rightCoefficient: INITIAL_INVISIBLE_AREA_RIGHT_COEFFICIENT
  };

  componentDidMount() {
    this.resize();
    window.addEventListener('resize', this.resize);
  }

  componentDidUpdate() {
    this.updateOverviewChart();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }

  render() {
    const { height } = this.props;
    const { canvasWidth, invisibleAreaLeftStyle, invisibleAreaRightStyle } = this.state;
    const visibleAreaStyle = {
      left: this.state.invisibleAreaLeftStyle.width + VISIBLE_AREA_BORDER,
      right: this.state.invisibleAreaRightStyle.width + VISIBLE_AREA_BORDER
    };
    return (
      <div className={'canvas-container'}>
        <canvas ref={this.overviewChart} height={height} width={canvasWidth}>
        </canvas>
        <div className={'invisible-chart-area-left'} style={invisibleAreaLeftStyle}/>
        <VisibleOverviewChartArea style={visibleAreaStyle} onVisibleAreaDrag={this.onVisibleAreaDrag}/>
        <div className={'invisible-chart-area-right'} style={invisibleAreaRightStyle}/>
      </div>
    );
  }

  onVisibleAreaDrag = (shiftX) => {
    const { canvasWidth, invisibleAreaLeftStyle, invisibleAreaRightStyle } = this.state;
    const oldLeftWidth = invisibleAreaLeftStyle.width;
    const oldRightWidth = invisibleAreaRightStyle.width;
    const newLeftWidth = oldLeftWidth + shiftX;
    const newRightWidth = oldRightWidth - shiftX;
    this.setState((prevState) => ({
      ...prevState,
      invisibleAreaLeftStyle: { width: newLeftWidth },
      invisibleAreaRightStyle: { width: newRightWidth },
      leftCoefficient: newLeftWidth / canvasWidth,
      rightCoefficient: newRightWidth / canvasWidth
    }));
  };

  resize = () => {
    const canvas = this.updateOverviewChart();
    this.resizeVisibleArea(canvas.width);
    this.setState((prevState) => ({
      ...prevState,
      canvasWidth: canvas.width
    }));
  };

  resizeVisibleArea = (canvasWidth) => {
    const { leftCoefficient, rightCoefficient } = this.state;
    const invisibleAreaLeftWidth = canvasWidth * leftCoefficient;
    const invisibleAreaRightWidth = canvasWidth * rightCoefficient;
    this.setState((prevState) => ({
      ...prevState,
      invisibleAreaLeftStyle: { width: invisibleAreaLeftWidth },
      invisibleAreaRightStyle: { width: invisibleAreaRightWidth }
    }));
  };

  updateOverviewChart = () => {
    const canvas = this.overviewChart.current;
    const parentDiv = canvas.parentElement;
    canvas.width = parentDiv.offsetWidth;
    if (canvas.getContext) {
      const ctx = canvas.getContext('2d');
      ctx.translate(0, canvas.height);
      ctx.scale(1, -1);
      if (!this.chartPainter) {
        this.chartPainter = new ChartPainter(ctx);
      }

      const {
        timestamps, lines, colors, linesVisibility
      } = this.props;
      const modifiedTimestamps = ChartPointModifier.modifyTimestamps(timestamps, canvas.width);
      const modifiedLines = ChartPointModifier.modifyLines(lines, canvas.height, linesVisibility);
      this.chartPainter.paintChart(modifiedTimestamps, modifiedLines, colors);
    }
    return canvas;
  };
}

export default OverviewChart;
