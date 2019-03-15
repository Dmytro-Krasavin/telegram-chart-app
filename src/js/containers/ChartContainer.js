/* eslint-disable no-console */
import React, { Component } from 'react';
import * as chartData from '../../data/chart_data';
import Chart from '../components/Chart';
import SwitchModeButton from '../components/SwitchModeButton';

class ChartContainer extends Component {
  state = {
    chartData: [],
    isNightMode: false,
    isLoading: true
  };

  render() {
    const chartList = this.state.chartData.map((chart, index) => <Chart key={index}>{chart}</Chart>);
    return (
      <div className={'container mt-5'}>
        {chartList}
        <SwitchModeButton isNightMode={this.state.isNightMode} switchModeHandler={this.switchMode}/>
      </div>
    );
  }

  componentDidMount() {
    this.loadData();
    this.printData();
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

  printData = () => {
    console.log(chartData);
  };
}

export default ChartContainer;
