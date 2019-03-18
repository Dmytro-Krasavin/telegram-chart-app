/* eslint-disable react/prop-types,no-plusplus */
import React, { Component } from 'react';
import LinePointConverter from '../utils/ChartPointModifier';

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
      <canvas ref={this.overviewChart} height={this.props.height}>
      </canvas>
    );
  }

  updateOverviewChart = () => {
    const canvas = this.overviewChart.current;
    canvas.width = canvas.parentElement.offsetWidth;
    if (canvas.getContext) {
      const ctx = canvas.getContext('2d');
      ctx.translate(0, canvas.height);
      ctx.scale(1, -1);

      const {
        timestamps, lines, colors, linesVisibility
      } = this.props;
      const modifiedTimestamps = LinePointConverter.modifyTimestamps(timestamps, canvas.width, linesVisibility);
      const modifiedLines = LinePointConverter.modifyLines(lines, canvas.height, linesVisibility);

      for (let i = 0; i < modifiedLines.length; i++) {
        const lineLabel = modifiedLines[i][0];
        ctx.strokeStyle = colors[lineLabel];
        ctx.beginPath();
        ctx.moveTo(modifiedTimestamps[1], modifiedLines[i][1]);
        for (let j = 2; j < modifiedLines[i].length; j++) {
          ctx.lineTo(modifiedTimestamps[j], modifiedLines[i][j]);
        }
        ctx.stroke();
      }
    }
  };
}

export default OverviewChart;
