/* eslint-disable no-return-assign,no-shadow */
import React, { Component } from 'react';
import * as chartData from '../../data/chart_data';
import Chart from '../components/Chart';
import SwitchModeButton from '../components/SwitchModeButton';

const TIMESTAMP_TYPE = 'x';
const LINE_TYPE = 'line';
const NIGHT_COLOR = '#293340';

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
    const { isNightMode, chartData } = this.state;
    const modeClass = isNightMode ? 'mode night' : 'mode day';
    const chartList = chartData.map((chart, index) => this.chartDataToComponent(chart, index, isNightMode));
    return (
      <div className={modeClass}>
        <div className={'chart-page-container'}>
          {chartList}
          <SwitchModeButton isNightMode={isNightMode} switchModeHandler={this.switchMode}/>
        </div>
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
    const currentIsNightMode = !this.state.isNightMode;
    document.body.style.backgroundColor = currentIsNightMode ? NIGHT_COLOR : '';
    this.setState((prevState) => ({
      ...prevState,
      isNightMode: currentIsNightMode
    }));
  };

  chartDataToComponent = (chart, index, isNightMode) => {
    const {
      columns, types, names, colors
    } = chart;
    const linesArray = columns.filter(column => types[column[0]] === LINE_TYPE);
    const timestamps = columns.find(column => types[column[0]] === TIMESTAMP_TYPE);

    const linesVisibility = {};
    Object.keys(names)
      .forEach(name => linesVisibility[name] = true);

    return (
      <Chart key={index}
             timestamps={timestamps}
             lines={linesArray}
             names={names}
             colors={colors}
             initialLinesVisibility={linesVisibility}
             isNightMode={isNightMode}
      />
    );
  };
}

export default ChartContainer;
