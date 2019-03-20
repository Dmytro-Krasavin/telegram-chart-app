/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import ChartPointModifier from '../utils/ChartPointModifier';
import ChartPainter from '../utils/ChartPainter';

const MAIN_LINE_WIDTH = 3;
const MAIN_LINE_JOIN = 'round';

class MainChart extends Component {
  mainChart = React.createRef();

  componentDidMount() {
    this.resize();
    window.addEventListener('resize', this.resize);
  }

  componentDidUpdate() {
    this.updateMainChart();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }

  resize = () => {
    this.updateMainChart();
  };

  updateMainChart = () => {
    const canvas = this.mainChart.current;
    const parentDiv = canvas.parentElement;
    canvas.width = parentDiv.offsetWidth;
    if (canvas.getContext) {
      const ctx = canvas.getContext('2d');
      ctx.translate(0, canvas.height);
      ctx.scale(1, -1);
      ctx.lineJoin = MAIN_LINE_JOIN;

      const {
        timestamps, lines, colors, linesVisibility, leftCoefficient, rightCoefficient
      } = this.props;
      const borderWidth = getComputedStyle(parentDiv)
        .getPropertyValue('border-width')
        .replace('px', '');
      const slicedTimestamps = ChartPointModifier.sliceMainTimestamps(timestamps, leftCoefficient, rightCoefficient);
      const slicedLines = ChartPointModifier.sliceMainLines(lines, leftCoefficient, rightCoefficient);
      const max = ChartPointModifier.getMaxValueInLinePoints(slicedLines, linesVisibility);
      const modifiedTimestamps = ChartPointModifier.modifyTimestamps(slicedTimestamps, canvas.width, borderWidth);
      const modifiedLines = ChartPointModifier.modifyLines(slicedLines, canvas.height, linesVisibility, max);
      ChartPainter.paintCoordinateGrid(ctx, timestamps, modifiedTimestamps, lines, modifiedLines, canvas.height, canvas.width);
      ChartPainter.paintChart(ctx, modifiedTimestamps, modifiedLines, colors, MAIN_LINE_WIDTH);
    }
    return canvas;
  };

  render() {
    const { height } = this.props;
    return (
      <div className={'main-canvas-container'}>
        <canvas ref={this.mainChart} height={height} >
        </canvas>
      </div>
    );
  }
}

export default MainChart;
