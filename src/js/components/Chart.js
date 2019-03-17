/* eslint-disable react/prop-types,no-plusplus */
import React, { Component } from 'react';
import Checkbox from '../containers/Checkbox';

const BORDER_COLOUR = '#7B9EA8';

class Chart extends Component {
  mainChart = React.createRef();

  overviewChart = React.createRef();

  state = {
    linesVisibility: this.props.initialLinesVisibility
  };

  render() {
    const { lines, names, colors } = this.props;
    const buttons = lines.map((linePoints, index) => {
      const label = linePoints[0];
      const name = names[label];
      const color = colors[label];
      return (
        <div key={index} className={'col'}>
          <Checkbox key={index} color={color} checkboxHandler={this.checkboxHandler} label={label}>{name}</Checkbox>
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
              <canvas ref={this.overviewChart} height={50}>
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
    window.addEventListener('resize', this.updateCanvases);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateCanvases);
  }

  checkboxHandler = (label, checkedState) => {
    const linesVisibility = this.state.linesVisibility;
    linesVisibility[label] = checkedState;
    this.setState(prevState => ({
      ...prevState,
      linesVisibility: linesVisibility
    }));
    this.updateCanvases();
  };

  updateCanvases = () => {
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
      ctx.translate(0, canvas.height);
      ctx.scale(1, -1);

      const { timestamps, lines, colors } = this.props;
      const modifiedTimestamps = this.modifyTimestamps(timestamps, canvas.width);
      const modifiedLines = this.modifyLines(lines, canvas.height);

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

  modifyTimestamps = (originalTimestamps, canvasWidth) => {
    const timestamps = originalTimestamps.slice();
    const label = timestamps.shift();
    if (!this.isSortedArray(timestamps)) {
      timestamps.sort((a, b) => a - b);
    }

    const min = Math.min(...timestamps);
    const max = Math.max(...timestamps);
    const range = max - min;
    const modifiedTimestamps = timestamps.map(timestamp => ((timestamp - min) * canvasWidth) / range);

    modifiedTimestamps.unshift(label);
    return modifiedTimestamps;
  };

  modifyLines = (originalLines, canvasHeight) => {
    const modifiedLines = [];
    const max = this.getMaxValueInLinePoints(originalLines);
    originalLines.forEach(lineArray => {
      const lineLabel = lineArray[0];
      if (this.state.linesVisibility[lineLabel]) {
        const lines = lineArray.slice();
        const label = lines.shift();
        const modifiedLine = lines.map(linePoint => (linePoint * canvasHeight * 0.9) / max);
        modifiedLine.unshift(label);
        modifiedLines.push(modifiedLine);
      }
    });
    return modifiedLines;
  };

  getMaxValueInLinePoints(originalLines) {
    let max = 0;
    originalLines.forEach(lineArray => {
      const lineLabel = lineArray[0];
      if (this.state.linesVisibility[lineLabel]) {
        const lines = lineArray.slice();
        const label = lines.shift();
        max = Math.max(...lines, max);
        lines.unshift(label);
      }
    });
    return max;
  }

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
