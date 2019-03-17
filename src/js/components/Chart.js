/* eslint-disable react/prop-types,no-plusplus */
import React, { Component } from 'react';
import Checkbox from '../containers/Checkbox';

const TIMESTAMP_TYPE = 'x';
const LINE_TYPE = 'line';
const BORDER_COLOUR = '#7B9EA8';

class Chart extends Component {
  mainChart = React.createRef();

  overviewChart = React.createRef();

  render() {
    const chart = this.props.children;
    const types = chart.types;
    const lines = Object.keys(types)
      .filter(type => types[type] === LINE_TYPE);
    const buttons = lines.map((line, index) => {
      const name = chart.names[line];
      const color = chart.colors[line];
      return (
        <div key={index} className={'col'}>
          <Checkbox key={index} color={color}>{name}</Checkbox>
        </div>
      );
    });

    return (
      <div className={'container'}>
        <div className={'row mb-3'}>
          <div className={'col'}>
            <div className={'d-flex justify-content-center'}>
              <canvas ref={this.mainChart} height={200}>
              </canvas>
            </div>
          </div>
        </div>
        <div className={'row mb-3'}>
          <div className={'col'}>
            <div className={'d-flex justify-content-center overview-canvas'}>
              <canvas ref={this.overviewChart} height={80}>
              </canvas>
            </div>
          </div>
        </div>
        <div className={'row mb-5'}>
          {buttons}
        </div>
      </div>
    );
  }

  componentDidMount() {
    this.updateMainChart();
    this.updateOverviewChart();
    window.addEventListener('resize', this.resizeCanvases);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeCanvases);
  }

  resizeCanvases = () => {
    this.updateMainChart();
    this.updateOverviewChart();
  };

  updateMainChart = () => {
    const canvas = this.mainChart.current;
    canvas.width = canvas.parentElement.offsetWidth;
    if (canvas.getContext) {
      const ctx = canvas.getContext('2d');
      ctx.strokeStyle = BORDER_COLOUR;
      ctx.strokeRect(0, 0, canvas.width, canvas.height);
    }
  };

  updateOverviewChart = () => {
    const canvas = this.overviewChart.current;
    canvas.width = canvas.parentElement.offsetWidth;
    if (canvas.getContext) {
      const ctx = canvas.getContext('2d');
      const chart = this.props.children;

      const types = chart.types;
      const columns = chart.columns;
      const linesArray = columns.filter(column => {
        const columnLabel = column[0];
        return types[columnLabel] === LINE_TYPE;
      });

      const timestamps = columns.find(column => {
        const columnLabel = column[0];
        return types[columnLabel] === TIMESTAMP_TYPE;
      });

      const modifiedTimestamps = this.modifyTimestamps(timestamps, canvas.width);
      const modifiedLines = this.modifyLines(linesArray, canvas.height);

      for (let i = 0; i < modifiedLines.length; i++) {
        const lineLabel = modifiedLines[i][0];
        ctx.strokeStyle = chart.colors[lineLabel];
        ctx.beginPath();
        ctx.moveTo(modifiedTimestamps[1], modifiedLines[i][1]);
        for (let j = 2; j < modifiedLines[i].length; j++) {
          ctx.lineTo(modifiedTimestamps[j], modifiedLines[i][j]);
        }
        ctx.stroke();
      }
    }
  };

  modifyTimestamps = (timestamps, canvasWidth) => {
    const timePoints = timestamps.slice();
    const label = timePoints.shift(); // delete label
    if (!this.isSortedArray(timePoints)) {
      timePoints.sort((a, b) => a - b);
    }

    const min = Math.min(...timePoints);
    const max = Math.max(...timePoints);
    const range = max - min;
    const modifiedTimestamps = timePoints.map(timestamp => ((timestamp - min) * canvasWidth) / range);

    modifiedTimestamps.unshift(label);
    return modifiedTimestamps;
  };

  modifyLines = (linesArray, canvasHeight) => {
    return linesArray.map(lineArray => {
      const lines = lineArray.slice();
      const label = lines.shift(); // delete label

      const min = Math.min(...lines);
      const max = Math.max(...lines);
      const range = max - min;
      const modifiedLines = lines.map(line => ((line - min) * canvasHeight) / range);

      modifiedLines.unshift(label);
      return modifiedLines;
    });
  };

  isSortedArray = (array) => {
    for (let i = 0; i < array.length - 1; i++) {
      if (array[i] > array[i + 1]) {
        return false;
      }
    }
    return true;
  };
}

export default Chart;
