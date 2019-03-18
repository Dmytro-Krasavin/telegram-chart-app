/* eslint-disable react/prop-types,no-plusplus */
import React, { Component } from 'react';
import ChartPointModifier from '../utils/ChartPointModifier';
import ChartPainter from '../utils/ChartPainter';

class OverviewChart extends Component {
  overviewChart = React.createRef();

  componentDidMount() {
    this.updateOverviewChart();
    window.addEventListener('resize', this.updateOverviewChart);
  }

  componentDidUpdate() {
    this.updateOverviewChart();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateOverviewChart);
  }

  render() {
    return (
      <div className={'canvas-container'}>
        <canvas ref={this.overviewChart} height={this.props.height}>
        </canvas>
      </div>
    );
  }

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
      const borderWidth = getComputedStyle(parentDiv).getPropertyValue('border-width').replace('px', '');
      const modifiedTimestamps = ChartPointModifier.modifyTimestamps(timestamps, canvas.width, borderWidth);
      const modifiedLines = ChartPointModifier.modifyLines(lines, canvas.height, linesVisibility);
      this.chartPainter.paintChart(modifiedTimestamps, modifiedLines, colors);
    }
  };
}

export default OverviewChart;
