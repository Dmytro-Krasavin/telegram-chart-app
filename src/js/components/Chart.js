/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import Checkbox from '../containers/Checkbox';

const TIMESTAMP_TYPE = 'x';
const LINE_TYPE = 'line';
const BORDER_COLOUR = '#7B9EA8';

class Chart extends Component {
  container = React.createRef();

  mainChart = React.createRef();

  overviewChart = React.createRef();

  render() {
    const chart = this.props.children;
    const types = chart.types;
    const lines = Object.keys(types).filter(type => types[type] === LINE_TYPE);
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
      <div className={'container'} ref={this.container}>
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
      // ctx.beginPath();
      // ctx.moveTo(0, 150);
      // ctx.lineTo(50, 20);
      // ctx.lineTo(100, 100);
      // ctx.lineTo(150, 120);
      // ctx.lineTo(200, 40);
      // ctx.lineTo(250, 70);
      // ctx.lineTo(300, 10);
      // ctx.stroke();
    }
  };

  updateOverviewChart = () => {
    const canvas = this.overviewChart.current;
    canvas.width = canvas.parentElement.offsetWidth;
    if (canvas.getContext) {
      const ctx = canvas.getContext('2d');
      const chart = this.props.children;
      ctx.beginPath();

      const types = chart.types;
      const timestamps = this.modifyTimestamps(chart, canvas.width);
      const lines = this.modifyLines(chart, canvas.height);

      lines.forEach(line => ctx.moveTo(timestamps[1], line[1]));

      // todo
      for (let i = 1; i < lines.length - 1; i++) {
        ctx.lineTo(timestamps, lines[i]);
      }
      ctx.stroke();


      const lineNames = Object.keys(types).filter(type => types[type] === LINE_TYPE);
      const buttons = lineNames.forEach((lineName) => {
        const name = chart.names[lineName];
        const color = chart.colors[lineName];
      });
      ctx.strokeStyle = BORDER_COLOUR;
      // ctx.strokeRect(0, 0, canvas.width, canvas.height);
    }
  };

  modifyTimestamps = (chart, canvasWidth) => {
    const copiedChart = JSON.parse(JSON.stringify(chart)); // deep clone
    const types = copiedChart.types;
    const columns = copiedChart.columns;
    const timestamps = columns.find(column => {
      const columnLabel = column[0];
      return types[columnLabel] === TIMESTAMP_TYPE;
    });

    timestamps.shift(); // delete label
    if (!this.isSortedArray(timestamps)) {
      timestamps.sort((a, b) => a - b);
    }

    const min = Math.min(...timestamps);
    const max = Math.max(...timestamps);
    const range = max - min;
    return timestamps.map(timestamp => ((timestamp - min) * canvasWidth) / range);
  };

  modifyLines = (chart, canvasHeight) => {
    const copiedChart = JSON.parse(JSON.stringify(chart)); // deep clone
    const types = copiedChart.types;
    const columns = copiedChart.columns;
    const linesArray = columns.filter(column => {
      const columnLabel = column[0];
      return types[columnLabel] === LINE_TYPE;
    });

    return linesArray.map(lines => {
      lines.shift(); // delete label
      const min = Math.min(...lines);
      const max = Math.max(...lines);
      const range = max - min;
      return lines.map(line => ((line - min) * canvasHeight) / range);
    });
  };

  isSortedArray = (array) => {
    for (let i = 0; i < array.length - 1; i++) {
      if (array[i] > array[i + 1]) {
        return false;
      }
    }
    return true;
  }
}

export default Chart;
