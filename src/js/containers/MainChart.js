import React, { Component } from 'react';
import ChartPointModifier from '../utils/ChartPointModifier';
import ChartPainter from '../utils/ChartPainter';
import LabelPainter from '../utils/LabelPainter';

const MAIN_LINE_WIDTH = 5;

class MainChart extends Component {
  mainChart = React.createRef();

  labelLayer = React.createRef();

  graphData = {
    slicedTimestamps: [],
    slicedLines: [],
    modifiedTimestamps: [],
    modifiedLines: []
  };

  componentDidMount() {
    this.resize();
    window.addEventListener('resize', this.resize);
  }

  componentDidUpdate() {
    this.resize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }

  resize = () => {
    this.updateMainChart();
    this.updateLabelLayer();
  };

  updateMainChart = () => {
    const canvas = this.mainChart.current;
    const parentDiv = canvas.parentElement;
    canvas.width = parentDiv.offsetWidth;
    if (canvas.getContext) {
      const ctx = canvas.getContext('2d');
      const {
        timestamps,
        lines,
        colors,
        linesVisibility,
        leftCoefficient,
        rightCoefficient,
        isNightMode,
        isAnimated,
        animateChart,
        stopAnimation,
        initialMax,
        isFirstLoading,
        setMaxChartValue
      } = this.props;
      const borderWidth = getComputedStyle(parentDiv)
        .getPropertyValue('border-width')
        .replace('px', '');
      this.graphData.slicedTimestamps = ChartPointModifier.sliceMainTimestamps(timestamps, leftCoefficient, rightCoefficient);
      this.graphData.slicedLines = ChartPointModifier.sliceMainLines(lines, leftCoefficient, rightCoefficient, linesVisibility);
      const max = ChartPointModifier.getMaxValueInLinePoints(this.graphData.slicedLines, linesVisibility);
      if (max !== initialMax && !isAnimated && !isFirstLoading) {
        animateChart(max);
      } else if (max === initialMax && isAnimated) {
        stopAnimation(max);
      }
      if (isFirstLoading) {
        setMaxChartValue(max);
      }
      this.graphData.modifiedTimestamps = ChartPointModifier.modifyTimestamps(this.graphData.slicedTimestamps, canvas.width, borderWidth);
      this.graphData.modifiedLines = ChartPointModifier.modifyLines(this.graphData.slicedLines, canvas.height, linesVisibility, initialMax);
      ChartPainter.paintCoordinateGrid(ctx, canvas.height, canvas.width, initialMax, this.graphData.slicedTimestamps, isNightMode);
      ChartPainter.paintChart(ctx, this.graphData.modifiedTimestamps, this.graphData.modifiedLines, colors, canvas.height, MAIN_LINE_WIDTH);
    }
  };

  updateLabelLayer = () => {
    const canvas = this.labelLayer.current;
    const parentDiv = canvas.parentElement;
    canvas.width = parentDiv.offsetWidth;
  };

  hideGraphLabel = (e) => {
    const canvas = this.labelLayer.current;
    if (canvas.getContext) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    e.stopPropagation();
    e.preventDefault();
  };

  showGraphLabel = (e) => {
    if (e.button === 0 || e.touches) {
      const canvas = this.labelLayer.current;
      if (canvas.getContext) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const isTouch = !!e.touches;
        const event = isTouch ? e.touches[0] : e;
        const { colors, isNightMode } = this.props;
        const {
          slicedTimestamps, slicedLines, modifiedTimestamps, modifiedLines
        } = this.graphData;
        const { pageX, target } = event;
        const offsetX = pageX - target.getBoundingClientRect().left;
        if (offsetX > 0 || offsetX < canvas.width) {
          const graphLabelOptions = {
            ctx: ctx,
            offsetX: offsetX,
            canvasHeight: canvas.height,
            canvasWidth: canvas.width,
            slicedTimestamps: slicedTimestamps,
            slicedLines: slicedLines,
            modifiedTimestamps: modifiedTimestamps,
            modifiedLines: modifiedLines,
            colors: colors,
            chartLineWidth: MAIN_LINE_WIDTH,
            isNightMode: isNightMode
          };
          LabelPainter.printGraphLabel(graphLabelOptions);
        }
      }
    }
    e.stopPropagation();
    e.preventDefault();
  };

  render() {
    const { height } = this.props;
    return (
      <div className={'main-canvas-container'}>
        <canvas ref={this.mainChart}
                height={height}>
          <strong>Sorry, It looks as though your browser does not support the canvas tag...</strong>
        </canvas>
        <canvas ref={this.labelLayer}
                height={height}
                className={'label-layer'}
                onMouseDown={this.showGraphLabel}
                onMouseMove={this.showGraphLabel}
                onMouseUp={this.hideGraphLabel}
                onTouchStart={this.showGraphLabel}
                onTouchMove={this.showGraphLabel}
                onTouchEnd={this.hideGraphLabel}>
        </canvas>
      </div>
    );
  }
}

export default MainChart;
