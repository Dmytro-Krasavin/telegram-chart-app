/* eslint-disable react/prop-types */
import React, { Component } from 'react';

class VisibleOverviewChartArea extends Component {
  visibleArea = React.createRef();

  state = {
    dragging: false,
    posX: 0,
    relX: 0
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
    const pos = this.visibleArea.current.offsetLeft;
    this.setState({
      dragging: true,
      relX: e.pageX - pos
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
    this.props.onVisibleAreaDrag(e.pageX - this.state.relX);
    // this.setState((prevState) => ({
    //   ...prevState,
    //   posX: e.pageX - this.state.rel.x
    // }));
    e.stopPropagation();
    e.preventDefault();
  };

  render() {
    return (
      <div className={'visible-chart-area'} style={this.props.style} onMouseDown={this.onMouseDown} ref={this.visibleArea}/>
    );
  }
}

export default VisibleOverviewChartArea;
