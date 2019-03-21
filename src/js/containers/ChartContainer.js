/* eslint-disable no-return-assign */
import React, { Component } from 'react';
import * as chartData from '../../data/chart_data';
import Chart from '../components/Chart';
import SwitchModeButton from '../components/SwitchModeButton';

const TIMESTAMP_TYPE = 'x';
const LINE_TYPE = 'line';

class ChartContainer extends Component {
  state = {
    chartData: [],
    isNightMode: false,
    isLoading: true
  };

  componentDidMount() {
    this.loadData();
  }

  render() {
    const chartList = this.state.chartData.map((chart, index) => this.chartDataToComponent(chart, index));
    return (
      <div className={'chart-page-container'}>
        {chartList}
        <SwitchModeButton isNightMode={this.state.isNightMode} switchModeHandler={this.switchMode}/>
      </div>
    );
  }

  loadData = () => {
    this.setState(() => ({
      chartData: chartData.default,
      isLoading: false
    }));
  };

  switchMode = (event) => {
    event.preventDefault();
    this.setState((prevState) => ({
      ...prevState,
      isNightMode: !this.state.isNightMode
    }));
  };

  chartDataToComponent = (chart, index) => {
    const {
      columns, types, names, colors
    } = chart;
    const linesArray = columns.filter(column => types[column[0]] === LINE_TYPE);
    const timestamps = columns.find(column => types[column[0]] === TIMESTAMP_TYPE);

    const linesVisibility = {};
    Object.keys(names).forEach(name => linesVisibility[name] = true);

    return (
      <Chart key={index}
             timestamps={timestamps}
             lines={linesArray}
             names={names}
             colors={colors}
             initialLinesVisibility={linesVisibility}/>
    );
  }
}

export default ChartContainer;
