import React, { Component } from 'react';
import Checkbox from './Checkbox';
import OverviewChart from './OverviewChart';
import MainChart from './MainChart';

const MAIN_CHART_HEIGHT = 800;
const OVERVIEW_CHART_HEIGHT = 120;
const INITIAL_INVISIBLE_AREA_LEFT_COEFFICIENT = 0.75;
const INITIAL_INVISIBLE_AREA_RIGHT_COEFFICIENT = 0;

class ChartContainer extends Component {
  state = {
    linesVisibility: this.props.initialLinesVisibility,
    leftCoefficient: INITIAL_INVISIBLE_AREA_LEFT_COEFFICIENT,
    rightCoefficient: INITIAL_INVISIBLE_AREA_RIGHT_COEFFICIENT,
    dataIsAvailable: true
  };

  setVisibleCoefficients = (leftCoefficient, rightCoefficient) => {
    this.setState((prevState) => ({
      ...prevState,
      leftCoefficient: leftCoefficient,
      rightCoefficient: rightCoefficient
    }));
  };

  checkboxHandler = (label, checkedState) => {
    const { linesVisibility } = this.state;
    linesVisibility[label] = checkedState;
    const dataIsAvailable = !!Object.values(linesVisibility)
      .find(visibility => visibility);
    this.setState(prevState => ({
      ...prevState,
      linesVisibility: linesVisibility,
      dataIsAvailable: dataIsAvailable
    }));
  };

  linePointsToButtons = (linePoints, index, names, colors, linesVisibility) => {
    const label = linePoints[0];
    const name = names[label];
    const color = colors[label];
    return (
      <div key={index} className={'col-sm-3'}>
        <Checkbox key={index}
                  color={color}
                  checkboxHandler={this.checkboxHandler}
                  initialChecked={linesVisibility[label]}
                  label={label}>{name}
        </Checkbox>
      </div>
    );
  };

  render() {
    const {
      linesVisibility, leftCoefficient, rightCoefficient, dataIsAvailable
    } = this.state;
    const {
      timestamps, lines, names, colors, isNightMode
    } = this.props;
    const buttons = lines.map((linePoints, index) => this.linePointsToButtons(linePoints, index, names, colors, linesVisibility));
    const noDataClass = isNightMode ? 'no-data-container night' : 'no-data-container day';
    return (
      dataIsAvailable
        ? <div className={'chart-container'}>
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
                         isNightMode={isNightMode}
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

        : <div className={'chart-container'}>
          <div className={noDataClass}>
            <h1 className={'no-data-text'}>No data is available</h1>
          </div>
          <div className={'row mb-3'}>
            {buttons}
          </div>
        </div>
    );
  }
}

export default ChartContainer;
