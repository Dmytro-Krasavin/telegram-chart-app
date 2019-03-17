/* eslint-disable no-console */
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

  render() {
    const chartList = this.state.chartData.map((chart, index) => {
      const {
        columns, types, names, colors
      } = chart;
      const linesArray = columns.filter(column => {
        const columnLabel = column[0];
        return types[columnLabel] === LINE_TYPE;
      });

      const timestamps = columns.find(column => {
        const columnLabel = column[0];
        return types[columnLabel] === TIMESTAMP_TYPE;
      });

      return (<Chart key={index} timestamps={timestamps} lines={linesArray} names={names} colors={colors}/>);
    });
    return (
      <div className={'container mt-5'}>
        {chartList}
        <SwitchModeButton isNightMode={this.state.isNightMode} switchModeHandler={this.switchMode}/>
      </div>
    );
  }

  componentDidMount() {
    this.loadData();
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
}

export default ChartContainer;
