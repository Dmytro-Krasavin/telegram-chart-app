import React, { Component } from 'react';
import Checkbox from './Checkbox';
import OverviewChart from './OverviewChart';
import MainChart from './MainChart';

const MAIN_CHART_HEIGHT = 800;
const OVERVIEW_CHART_HEIGHT = 120;
const INITIAL_INVISIBLE_AREA_LEFT_COEFFICIENT = 0.75;
const INITIAL_INVISIBLE_AREA_RIGHT_COEFFICIENT = 0;
const ANIMATION_TIME_MILLIS = 150;
const STEP_NUMBER = 50;

class ChartContainer extends Component {
  state = {
    linesVisibility: this.props.initialLinesVisibility,
    leftCoefficient: INITIAL_INVISIBLE_AREA_LEFT_COEFFICIENT,
    rightCoefficient: INITIAL_INVISIBLE_AREA_RIGHT_COEFFICIENT,
    dataIsAvailable: true,
    mainMax: 0,
    overviewMax: 0,
    isMainChartAnimated: false,
    isOverviewChartAnimated: false
  };

  setVisibleCoefficients = (leftCoefficient, rightCoefficient) => {
    this.setState((prevState) => ({
      ...prevState,
      leftCoefficient: leftCoefficient,
      rightCoefficient: rightCoefficient
    }));
  };

  checkboxHandler = (label, checkedState) => {
    const { linesVisibility, mainMax, overviewMax } = this.state;
    linesVisibility[label] = checkedState;
    const dataIsAvailable = !!Object.values(linesVisibility)
      .find(visibility => visibility);
    const newMainMax = dataIsAvailable ? mainMax : 0;
    const newOverviewMax = dataIsAvailable ? overviewMax : 0;
    this.setState(prevState => ({
      ...prevState,
      linesVisibility: linesVisibility,
      dataIsAvailable: dataIsAvailable,
      mainMax: newMainMax,
      overviewMax: newOverviewMax
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

  animateMainChart = (max) => {
    this.moveMainMax(this.state.mainMax, max);
  };

  animateOverviewChart = (max) => {
    this.moveOverviewMax(this.state.overviewMax, max);
  };

  stopMainChartAnimation = (max) => {
    this.setState(prevState => ({
      ...prevState,
      mainMax: max,
      isMainChartAnimated: false
    }));
  };

  stopOverviewChartAnimation = (max) => {
    this.setState(prevState => ({
      ...prevState,
      overviewMax: max,
      isOverviewChartAnimated: false
    }));
  };

  moveMainMax = (prevMax, newMax) => {
    if (prevMax > newMax) {
      const difference = prevMax - newMax;
      const step = difference / STEP_NUMBER;
      let tempMax = prevMax - step;
      const i = setInterval(() => {
        tempMax -= step;
        if (tempMax < newMax) {
          clearInterval(i);
          this.setState(prevState => ({
            ...prevState,
            mainMax: newMax,
            isMainChartAnimated: false
          }));
        } else {
          this.setState(prevState => ({
            ...prevState,
            mainMax: tempMax,
            isMainChartAnimated: true
          }));
        }
      }, ANIMATION_TIME_MILLIS / STEP_NUMBER);
    } else {
      const difference = newMax - prevMax;
      const step = difference / STEP_NUMBER;
      let tempMax = prevMax + step;
      const i = setInterval(() => {
        tempMax += step;
        if (tempMax > newMax) {
          clearInterval(i);
          this.setState(prevState => ({
            ...prevState,
            mainMax: newMax,
            isMainChartAnimated: false
          }));
          clearInterval(i);
        } else {
          this.setState(prevState => ({
            ...prevState,
            mainMax: tempMax,
            isMainChartAnimated: true
          }));
        }
      }, ANIMATION_TIME_MILLIS / STEP_NUMBER);
    }
  };

  moveOverviewMax = (prevMax, newMax) => {
    if (prevMax > newMax) {
      const difference = prevMax - newMax;
      const step = difference / STEP_NUMBER;
      let tempMax = prevMax - step;
      const i = setInterval(() => {
        tempMax -= step;
        if (tempMax < newMax) {
          clearInterval(i);
          this.setState(prevState => ({
            ...prevState,
            overviewMax: newMax,
            isOverviewChartAnimated: false
          }));
        } else {
          this.setState(prevState => ({
            ...prevState,
            overviewMax: tempMax,
            isOverviewChartAnimated: true
          }));
        }
      }, ANIMATION_TIME_MILLIS / STEP_NUMBER);
    } else {
      const difference = newMax - prevMax;
      const step = difference / STEP_NUMBER;
      let tempMax = prevMax + step;
      const i = setInterval(() => {
        tempMax += step;
        if (tempMax > newMax) {
          clearInterval(i);
          this.setState(prevState => ({
            ...prevState,
            overviewMax: newMax,
            isOverviewChartAnimated: false
          }));
          clearInterval(i);
        } else {
          this.setState(prevState => ({
            ...prevState,
            overviewMax: tempMax,
            isOverviewChartAnimated: true
          }));
        }
      }, ANIMATION_TIME_MILLIS / STEP_NUMBER);
    }
  };

  render() {
    const {
      linesVisibility, leftCoefficient, rightCoefficient, dataIsAvailable, mainMax, overviewMax, isMainChartAnimated, isOverviewChartAnimated
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
                         initialMax={mainMax}
                         animateChart={this.animateMainChart}
                         stopAnimation={this.stopMainChartAnimation}
                         isAnimated={isMainChartAnimated}
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
                             initialMax={overviewMax}
                             animateChart={this.animateOverviewChart}
                             stopAnimation={this.stopOverviewChartAnimation}
                             isAnimated={isOverviewChartAnimated}
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
