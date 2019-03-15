/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import Checkbox from '../containers/Checkbox';

const LINE_TYPE = 'line';
const BORDER_COLOUR = '#7B9EA8';

class Chart extends Component {
  container = React.createRef();

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
      <div className={'container'} ref={this.container}>
        <div className={'row mb-3'}>
          <div className={'col'}>
            <div className={'d-flex justify-content-center'}>
              <canvas ref={this.mainChart}>
              </canvas>
            </div>
          </div>
        </div>
        <div className={'row mb-3'}>
          <div className={'col'}>
            <div className={'d-flex justify-content-center'}>
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
    this.updateMainCanvas();
    this.updateOverviewChart();
    window.addEventListener('resize', this.resizeCanvases);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeCanvases);
  }

  resizeCanvases = () => {
    const mainChart = this.mainChart.current;
    const overviewChart = this.overviewChart.current;
    mainChart.width = mainChart.parentElement.offsetWidth;
    overviewChart.width = overviewChart.parentElement.offsetWidth;
    // this.updateMainCanvas();
    this.updateOverviewChart();
  };

  updateMainCanvas = () => {
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
      ctx.strokeStyle = BORDER_COLOUR;
      ctx.strokeRect(0, 0, canvas.width, canvas.height);
    }
  };
}

export default Chart;
