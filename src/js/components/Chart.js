/* eslint-disable react/prop-types,no-plusplus */
import React, { Component } from 'react';
import Checkbox from '../containers/Checkbox';
import OverviewChart from './OverviewChart';

const OVERVIEW_CHART_HEIGHT = 50;

class Chart extends Component {
  mainChart = React.createRef();

  state = {
    linesVisibility: this.props.initialLinesVisibility
  };

  render() {
    const {
      timestamps, lines, names, colors
    } = this.props;
    const buttons = lines.map((linePoints, index) => {
      const label = linePoints[0];
      const name = names[label];
      const color = colors[label];
      return (
        <div key={index} className={'col'}>
          <Checkbox key={index}
                    color={color}
                    checkboxHandler={this.checkboxHandler}
                    label={label}>{name}</Checkbox>
        </div>
      );
    });

    return (
      <div className={'chart-container'}>
        <div className={'row mb-3'}>
          <div className={'col'}>
            <div className={'canvas'}>
              <canvas ref={this.mainChart} height={200}>
              </canvas>
            </div>
          </div>
        </div>
        <div className={'row mb-3'}>
          <div className={'col'}>
            <OverviewChart timestamps={timestamps}
                           lines={lines}
                           names={names}
                           colors={colors}
                           linesVisibility={this.state.linesVisibility}
                           height={OVERVIEW_CHART_HEIGHT}
            />
          </div>
        </div>
        <div className={'row mb-5'}>
          {buttons}
        </div>
      </div>
    );
  }

  checkboxHandler = (label, checkedState) => {
    const linesVisibility = this.state.linesVisibility;
    linesVisibility[label] = checkedState;
    this.setState(prevState => ({
      ...prevState,
      linesVisibility: linesVisibility
    }));
  };
}

export default Chart;
