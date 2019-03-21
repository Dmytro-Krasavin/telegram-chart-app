/* eslint-disable no-unused-expressions */
import React, { Component } from 'react';

const TOUCH_AREA = 20;

class VisibleOverviewChartArea extends Component {
  state = {
    dragging: false,
    resizingLeft: false,
    resizingRight: false,
    posX: 0,
    shiftX: 0
  };

  componentDidUpdate(props, state) {
    if (this.state.dragging && !state.dragging) {
      document.addEventListener('mousemove', this.onMouseMove);
      document.addEventListener('mouseup', this.onMouseUp);
      document.addEventListener('touchmove', this.onMouseMove);
      document.addEventListener('touchend', this.onMouseUp);
    } else if (!this.state.dragging && state.dragging) {
      document.removeEventListener('mousemove', this.onMouseMove);
      document.removeEventListener('mouseup', this.onMouseUp);
      document.removeEventListener('touchmove', this.onMouseMove);
      document.removeEventListener('touchend', this.onMouseUp);
    }
  }

  onMouseDown = (e) => {
    if (e.button === 0 || e.touches) {
      const isTouch = !!e.touches;
      const event = isTouch ? e.touches[0] : e;
      const { pageX, target } = event;
      const borderWidth = getComputedStyle(target)
        .getPropertyValue('border-left-width')
        .replace('px', '');

      const offsetX = pageX - borderWidth - target.getBoundingClientRect().left;
      const isLeftBorder = isTouch ? offsetX - TOUCH_AREA < 0 : offsetX < 0;
      const isRightBorder = isTouch ? offsetX + TOUCH_AREA > target.clientWidth : offsetX > target.clientWidth;
      this.setState((prevState) => ({
        ...prevState,
        dragging: true,
        resizingLeft: isLeftBorder,
        resizingRight: isRightBorder,
        posX: pageX
      }));

      e.stopPropagation();
      e.preventDefault();
    }
  };

  onMouseUp = (e) => {
    this.setState((prevState) => ({
      ...prevState,
      dragging: false,
      resizingLeft: false,
      resizingRight: false
    }));
    e.stopPropagation();
    e.preventDefault();
  };

  onMouseMove = (e) => {
    if (!this.state.dragging) return;
    const event = e.touches ? e.touches[0] : e;
    const oldPosX = this.state.posX;

    this.setState((prevState) => ({
      ...prevState,
      shiftX: event.pageX - oldPosX,
      posX: event.pageX
    }));
    e.stopPropagation();
    e.preventDefault();

    const { onVisibleAreaSizingLeft, onVisibleAreaSizingRight, onVisibleAreaDrag } = this.props;
    const { resizingLeft, resizingRight, shiftX } = this.state;
    resizingLeft && onVisibleAreaSizingLeft(shiftX);
    resizingRight && onVisibleAreaSizingRight(shiftX);
    !(resizingLeft || resizingRight) && onVisibleAreaDrag(shiftX);
  };

  render() {
    return (
      <div className={'visible-chart-area'} style={this.props.style} onMouseDown={this.onMouseDown} onTouchStart={this.onMouseDown}/>
    );
  }
}

export default VisibleOverviewChartArea;
