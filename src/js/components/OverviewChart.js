/* eslint-disable react/prop-types,no-plusplus */
import React, { Component } from 'react';
import ChartPointModifier from '../utils/ChartPointModifier';
import ChartPainter from '../utils/ChartPainter';

const DEFAULT_INVISIBLE_AREA_LEFT_COEFFICIENT = 0.5;
const DEFAULT_INVISIBLE_AREA_RIGHT_COEFFICIENT = 0.2;
const VISIBLE_AREA_BORDER = 15;

class OverviewChart extends Component {
  overviewChart = React.createRef();

  state = {
    invisibleAreaLeftStyle: {
      width: 0
    },
    invisibleAreaRightStyle: {
      width: 0
    }
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
    const visibleAreaStyle = {
      left: this.state.invisibleAreaLeftStyle.width + VISIBLE_AREA_BORDER,
      right: this.state.invisibleAreaRightStyle.width + VISIBLE_AREA_BORDER
    };
    return (
      <div className={'canvas-container'}>
        <canvas ref={this.overviewChart} height={height}>
        </canvas>
        <div className={'invisible-chart-area-left'} style={this.state.invisibleAreaLeftStyle}/>
        <div className={'visible-chart-area'} style={visibleAreaStyle}/>
        <div className={'invisible-chart-area-right'} style={this.state.invisibleAreaRightStyle}/>
      </div>

    );
  }

  resize = () => {
    const canvas = this.updateOverviewChart();
    this.setInitialVisibleArea(canvas.width);
  };

  setInitialVisibleArea = (canvasWidth) => {
    const invisibleAreaLeftWidth = canvasWidth * DEFAULT_INVISIBLE_AREA_LEFT_COEFFICIENT;
    const invisibleAreaRightWidth = canvasWidth * DEFAULT_INVISIBLE_AREA_RIGHT_COEFFICIENT;
    this.setState(() => ({
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
