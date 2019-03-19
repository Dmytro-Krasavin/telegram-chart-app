/* eslint-disable react/prop-types */
import React, { Component } from 'react';

class VisibleOverviewChartArea extends Component {
  state = {
    dragging: false,
    shiftX: 0,
    posX: 0
  };

  componentDidUpdate(props, state) {
    if (this.state.dragging && !state.dragging) {
      document.addEventListener('mousemove', this.onMouseMove);
      document.addEventListener('mouseup', this.onMouseUp);
    } else if (!this.state.dragging && state.dragging) {
      document.removeEventListener('mousemove', this.onMouseMove);
      document.removeEventListener('mouseup', this.onMouseUp);
    }
  }

  onMouseDown = (e) => {
    if (e.button !== 0) return;
    this.setState({
      dragging: true,
      posX: e.pageX
    });
    e.stopPropagation();
    e.preventDefault();
  };

  onMouseUp = (e) => {
    this.setState({ dragging: false });
    e.stopPropagation();
    e.preventDefault();
  };

  onMouseMove = (e) => {
    if (!this.state.dragging) return;
    const oldPosX = this.state.posX;
    this.setState(() => ({
      shiftX: e.pageX - oldPosX,
      posX: e.pageX
    }));
    e.stopPropagation();
    e.preventDefault();
    this.props.onVisibleAreaDrag(this.state.shiftX);
  };

  render() {
    return (
      <div className={'visible-chart-area'} style={this.props.style} onMouseDown={this.onMouseDown}/>
    );
  }
}

export default VisibleOverviewChartArea;
