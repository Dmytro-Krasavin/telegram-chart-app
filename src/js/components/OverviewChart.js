/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import ChartPointModifier from '../utils/ChartPointModifier';
import ChartPainter from '../utils/ChartPainter';
import VisibleOverviewChartArea from './VisibleOverviewChartArea';

const VISIBLE_AREA_BORDER = 15;
const INITIAL_INVISIBLE_AREA_LEFT_COEFFICIENT = 0.5;
const INITIAL_INVISIBLE_AREA_RIGHT_COEFFICIENT = 0.2;
const MAX_INVISIBLE_AREA_COEFFICIENT = 0.9;

class OverviewChart extends Component {
  overviewChart = React.createRef();

  state = {
    invisibleAreaLeftStyle: {
      width: 0
    },
    invisibleAreaRightStyle: {
      width: 0
    },
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
      left: invisibleAreaLeftStyle.width + VISIBLE_AREA_BORDER,
      right: invisibleAreaRightStyle.width + VISIBLE_AREA_BORDER
    };
    return (
      <div className={'canvas-container'}>
        <canvas ref={this.overviewChart} height={height} width={canvasWidth}>
        </canvas>
        <div className={'invisible-chart-area-left'} style={invisibleAreaLeftStyle}/>
        <VisibleOverviewChartArea style={visibleAreaStyle}
                                  onVisibleAreaDrag={this.dragVisibleArea}
                                  onVisibleAreaSizingLeft={this.resizeVisibleAreaLeft}
                                  onVisibleAreaSizingRight={this.resizeVisibleAreaRight}/>
        <div className={'invisible-chart-area-right'} style={invisibleAreaRightStyle}/>
      </div>
    );
  }

  dragVisibleArea = (shiftX) => {
    const { canvasWidth, invisibleAreaLeftStyle, invisibleAreaRightStyle } = this.state;
    const oldLeftWidth = invisibleAreaLeftStyle.width;
    const oldRightWidth = invisibleAreaRightStyle.width;
    const newLeftWidth = oldLeftWidth + shiftX;
    const newRightWidth = oldRightWidth - shiftX;
    const leftCoefficient = newLeftWidth / canvasWidth;
    const rightCoefficient = newRightWidth / canvasWidth;
    if (leftCoefficient < 0 || rightCoefficient < 0) return;
    this.setState((prevState) => ({
      ...prevState,
      invisibleAreaLeftStyle: { width: newLeftWidth },
      invisibleAreaRightStyle: { width: newRightWidth },
      leftCoefficient: leftCoefficient,
      rightCoefficient: rightCoefficient
    }));
  };

  resizeVisibleAreaLeft = (shiftX) => {
    const { canvasWidth, invisibleAreaLeftStyle, rightCoefficient } = this.state;
    const oldLeftWidth = invisibleAreaLeftStyle.width;
    const newLeftWidth = oldLeftWidth + shiftX;
    const leftCoefficient = newLeftWidth / canvasWidth;
    if (leftCoefficient < 0 || ((leftCoefficient + rightCoefficient) > MAX_INVISIBLE_AREA_COEFFICIENT)) return;
    this.setState((prevState) => ({
      ...prevState,
      invisibleAreaLeftStyle: { width: newLeftWidth },
      leftCoefficient: leftCoefficient
    }));
  };

  resizeVisibleAreaRight = (shiftX) => {
    const { canvasWidth, invisibleAreaRightStyle, leftCoefficient } = this.state;
    const oldRightWidth = invisibleAreaRightStyle.width;
    const newRightWidth = oldRightWidth - shiftX;
    const rightCoefficient = newRightWidth / canvasWidth;
    if (rightCoefficient < 0 || ((leftCoefficient + rightCoefficient) > MAX_INVISIBLE_AREA_COEFFICIENT)) return;
    this.setState((prevState) => ({
      ...prevState,
      invisibleAreaRightStyle: { width: newRightWidth },
      rightCoefficient: rightCoefficient
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
      const borderWidth = getComputedStyle(parentDiv)
        .getPropertyValue('border-width')
        .replace('px', '');
      const modifiedTimestamps = ChartPointModifier.modifyTimestamps(timestamps, canvas.width, borderWidth);
      const modifiedLines = ChartPointModifier.modifyLines(lines, canvas.height, linesVisibility);
      this.chartPainter.paintChart(modifiedTimestamps, modifiedLines, colors);
    }
    return canvas;
  };
}

export default OverviewChart;
