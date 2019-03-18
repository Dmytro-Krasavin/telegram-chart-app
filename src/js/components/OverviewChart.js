/* eslint-disable react/prop-types,no-plusplus */
import React, { Component } from 'react';
import ChartPointModifier from '../utils/ChartPointModifier';
import ChartPainter from '../utils/ChartPainter';

const DEFAULT_INVISIBLE_AREA_LEFT_COEFFICIENT = 0.7;
const DEFAULT_INVISIBLE_AREA_RIGHT_COEFFICIENT = 0.2;

class OverviewChart extends Component {
  overviewChart = React.createRef();

  state = {
    invisibleAreaLeft: {
      style: {
        width: 0
      }
    },
    invisibleAreaRight: {
      style: {
        width: 0
      }
    },
    visibleArea: {
      style: {
        left: 0,
        right: 0
      }
    }
  };

  componentDidMount() {
    const canvas = this.overviewChart.current;
    const parentDiv = canvas.parentElement;
    canvas.width = parentDiv.offsetWidth;
    this.updateOverviewChart();
    this.setInitialVisibleArea(canvas.width);
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
    return (
      <div className={'canvas-container'}>
        <canvas ref={this.overviewChart} height={height}>
        </canvas>
        <div className={'invisible-chart-area-left'} style={this.state.invisibleAreaLeft.style}/>
        <div className={'visible-chart-area'} style={this.state.visibleArea.style}/>
        <div className={'invisible-chart-area-right'} style={this.state.invisibleAreaRight.style}/>
      </div>

    );
  }

  resize = () => {
    const canvas = this.overviewChart.current;
    const parentDiv = canvas.parentElement;
    canvas.width = parentDiv.offsetWidth;
    this.updateOverviewChart();
    this.setInitialVisibleArea(canvas.width);
  };

  setInitialVisibleArea = (canvasWidth) => {
    const invisibleAreaLeftWidth = canvasWidth * DEFAULT_INVISIBLE_AREA_LEFT_COEFFICIENT;
    const invisibleAreaRightWidth = canvasWidth * DEFAULT_INVISIBLE_AREA_RIGHT_COEFFICIENT;
    const visibleAreaStyle = {
      left: invisibleAreaLeftWidth,
      right: invisibleAreaRightWidth
    };

    // todo
    this.setState(() => ({
      invisibleAreaLeft: { style: { width: invisibleAreaLeftWidth - 5 } },
      invisibleAreaRight: { style: { width: invisibleAreaRightWidth - 15 } },
      visibleArea: { style: visibleAreaStyle }
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
  };
}

export default OverviewChart;
