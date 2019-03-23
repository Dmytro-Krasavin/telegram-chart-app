import React, { Component } from 'react';
import * as inputChartData from '../../data/chart_data';
import ChartContainer from './ChartContainer';
import SwitchModeButton from '../components/SwitchModeButton';
import {
  DAY_BACKGROUND_COLOR, LINE_TYPE, NIGHT_BACKGROUND_COLOR, TIMESTAMP_TYPE
} from '../utils/constants';

class ChartsPageContainer extends Component {
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
      chartData: inputChartData.default,
      isLoading: false
    }));
  };

  switchMode = (event) => {
    event.preventDefault();
    const currentIsNightMode = !this.state.isNightMode;
    document.body.style.backgroundColor = currentIsNightMode ? NIGHT_BACKGROUND_COLOR : DAY_BACKGROUND_COLOR;
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
      .forEach(name => {
        linesVisibility[name] = true;
      });

    return (
      <ChartContainer key={index}
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

export default ChartsPageContainer;
