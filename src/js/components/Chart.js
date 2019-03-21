import React, { Component } from 'react';
import Checkbox from '../containers/Checkbox';
import OverviewChart from './OverviewChart';
import MainChart from './MainChart';

const MAIN_CHART_HEIGHT = 800;
const OVERVIEW_CHART_HEIGHT = 120;
const INITIAL_INVISIBLE_AREA_LEFT_COEFFICIENT = 0.75;
const INITIAL_INVISIBLE_AREA_RIGHT_COEFFICIENT = 0;

class Chart extends Component {
  state = {
    linesVisibility: this.props.initialLinesVisibility,
    leftCoefficient: INITIAL_INVISIBLE_AREA_LEFT_COEFFICIENT,
    rightCoefficient: INITIAL_INVISIBLE_AREA_RIGHT_COEFFICIENT
  };

  setVisibleCoefficients = (leftCoefficient, rightCoefficient) => {
    this.setState((prevState) => ({
      ...prevState,
      leftCoefficient: leftCoefficient,
      rightCoefficient: rightCoefficient
    }));
  };

  checkboxHandler = (label, checkedState) => {
    const linesVisibility = this.state.linesVisibility;
    linesVisibility[label] = checkedState;
    this.setState(prevState => ({
      ...prevState,
      linesVisibility: linesVisibility
    }));
  };

  linePointsToButtons = (linePoints, index, names, colors) => {
    const label = linePoints[0];
    const name = names[label];
    const color = colors[label];
    return (
      <div key={index} className={'col-sm-3'}>
        <Checkbox key={index}
                  color={color}
                  checkboxHandler={this.checkboxHandler}
                  label={label}>{name}</Checkbox>
      </div>
    );
  };

  render() {
    const { linesVisibility, leftCoefficient, rightCoefficient } = this.state;
    const {
      timestamps, lines, names, colors, isNightMode
    } = this.props;
    const buttons = lines.map((linePoints, index) => this.linePointsToButtons(linePoints, index, names, colors));

    return (
      <div className={'chart-container'}>
        <div className={'row mb-3'}>
          <div className={'col'}>
            <MainChart timestamps={timestamps}
                       lines={lines}
                       names={names}
                       colors={colors}
                       linesVisibility={linesVisibility}
                       height={MAIN_CHART_HEIGHT}
                       leftCoefficient={leftCoefficient}
                       rightCoefficient={rightCoefficient}
                       setVisibleCoefficients={this.setVisibleCoefficients}
            />
          </div>
        </div>
        <div className={'row mb-3'}>
          <div className={'col'}>
            <OverviewChart timestamps={timestamps}
                           lines={lines}
                           names={names}
                           colors={colors}
                           linesVisibility={linesVisibility}
                           height={OVERVIEW_CHART_HEIGHT}
                           leftCoefficient={leftCoefficient}
                           rightCoefficient={rightCoefficient}
                           setVisibleCoefficients={this.setVisibleCoefficients}
                           isNightMode={isNightMode}
            />
          </div>
        </div>
        <div className={'row mb-3'}>
          {buttons}
        </div>
      </div>
    );
  }
}

export default Chart;
