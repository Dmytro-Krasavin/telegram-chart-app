import React, { Component } from 'react';
import ChartPointModifier from '../utils/ChartPointModifier';
import ChartPainter from '../utils/ChartPainter';
import VisibleOverviewChartArea from './VisibleOverviewChartArea';

const VISIBLE_AREA_BORDER = 15;
const MAX_INVISIBLE_AREA_COEFFICIENT = 0.85;
const OVERVIEW_LINE_WIDTH = 1;
const OVERVIEW_LINE_JOIN = 'round';

class OverviewChart extends Component {
  overviewChart = React.createRef();

  state = {
    invisibleAreaLeftStyle: {
      width: 0
    },
    invisibleAreaRightStyle: {
      width: 0
    },
    canvasWidth: 0
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
      invisibleAreaRightStyle: { width: newRightWidth }
    }));
    this.props.setVisibleCoefficients(leftCoefficient, rightCoefficient);
  };

  resizeVisibleAreaLeft = (shiftX) => {
    const { canvasWidth, invisibleAreaLeftStyle } = this.state;
    const { rightCoefficient } = this.props;
    const oldLeftWidth = invisibleAreaLeftStyle.width;
    const newLeftWidth = oldLeftWidth + shiftX;
    const leftCoefficient = newLeftWidth / canvasWidth;
    if (leftCoefficient < 0 || ((leftCoefficient + rightCoefficient) > MAX_INVISIBLE_AREA_COEFFICIENT)) return;
    this.setState((prevState) => ({
      ...prevState,
      invisibleAreaLeftStyle: { width: newLeftWidth }
    }));
    this.props.setVisibleCoefficients(leftCoefficient, rightCoefficient);
  };

  resizeVisibleAreaRight = (shiftX) => {
    const { canvasWidth, invisibleAreaRightStyle } = this.state;
    const { leftCoefficient } = this.props;
    const oldRightWidth = invisibleAreaRightStyle.width;
    const newRightWidth = oldRightWidth - shiftX;
    const rightCoefficient = newRightWidth / canvasWidth;
    if (rightCoefficient < 0 || ((leftCoefficient + rightCoefficient) > MAX_INVISIBLE_AREA_COEFFICIENT)) return;
    this.setState((prevState) => ({
      ...prevState,
      invisibleAreaRightStyle: { width: newRightWidth },
      rightCoefficient: rightCoefficient
    }));
    this.props.setVisibleCoefficients(leftCoefficient, rightCoefficient);
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
    const { leftCoefficient, rightCoefficient } = this.props;
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
      ctx.lineJoin = OVERVIEW_LINE_JOIN;

      const {
        timestamps, lines, colors, linesVisibility
      } = this.props;
      const borderWidth = getComputedStyle(parentDiv)
        .getPropertyValue('border-width')
        .replace('px', '');
      const max = ChartPointModifier.getMaxValueInLinePoints(lines, linesVisibility);
      const modifiedTimestamps = ChartPointModifier.modifyTimestamps(timestamps, canvas.width, borderWidth);
      const modifiedLines = ChartPointModifier.modifyLines(lines, canvas.height, linesVisibility, max);
      ChartPainter.paintChart(ctx, modifiedTimestamps, modifiedLines, colors, canvas.height, OVERVIEW_LINE_WIDTH);
    }
    return canvas;
  };

  render() {
    const { height, isNightMode } = this.props;
    const { canvasWidth, invisibleAreaLeftStyle, invisibleAreaRightStyle } = this.state;
    const visibleAreaStyle = {
      left: invisibleAreaLeftStyle.width + VISIBLE_AREA_BORDER,
      right: invisibleAreaRightStyle.width + VISIBLE_AREA_BORDER
    };
    let invisibleAreaLeftClass = 'invisible-chart-area-left';
    let invisibleAreaRightClass = 'invisible-chart-area-right';
    if (isNightMode) {
      invisibleAreaLeftClass += ' night';
      invisibleAreaRightClass += ' night';
    }
    return (
      <div className={'overview-canvas-container'}>
        <canvas ref={this.overviewChart} height={height} width={canvasWidth}>
        </canvas>
        <div className={invisibleAreaLeftClass} style={invisibleAreaLeftStyle}/>
        <VisibleOverviewChartArea style={visibleAreaStyle}
                                  onVisibleAreaDrag={this.dragVisibleArea}
                                  onVisibleAreaSizingLeft={this.resizeVisibleAreaLeft}
                                  onVisibleAreaSizingRight={this.resizeVisibleAreaRight}/>
        <div className={invisibleAreaRightClass} style={invisibleAreaRightStyle}/>
      </div>
    );
  }
}

export default OverviewChart;
