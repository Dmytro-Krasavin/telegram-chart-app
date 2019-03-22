/* eslint-disable no-plusplus */

import { DAY_COLOR, NIGHT_COLOR } from '../containers/ChartContainer';

const CHART_DISPLAY_HEIGHT_COEFFICIENT = 0.9;
const MAIN_LINE_JOIN = 'round';
const X_AXIS_LINES_NUMBER = 6;
const DATE_LABELS_NUMBER = 6;
const GRID_COLOR_DAY = '#D4D6D7';
const GRID_COLOR_NIGHT = '#506273';
const TEXT_COLOR = '#7B9EA8';
const TEXT_FONT = '30px Helvetica';
const TEXT_MARGIN = 10;
const DATE_MARGIN = 60;
const GRID_LINE_WIDTH = 1;
const CIRCLE_RADIUS = 15;
const CIRCLE_START_ANGLE = 0;
const CIRCLE_END_ANGLE = 2 * Math.PI;
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'];

class ChartPainter {
  paintChart = (ctx, timestamps, lines, colors, canvasHeight, lineWidth) => {
    ctx.save();
    ctx.lineJoin = MAIN_LINE_JOIN;
    ctx.lineWidth = lineWidth;
    ctx.translate(0, canvasHeight);
    ctx.scale(1, -1);
    for (let i = 0; i < lines.length; i++) {
      const lineLabel = lines[i][0];
      ctx.strokeStyle = colors[lineLabel];
      ctx.beginPath();
      const marginBottom = ((1 - CHART_DISPLAY_HEIGHT_COEFFICIENT) * canvasHeight) / 2;
      const compressedStartPosY = lines[i][1] * CHART_DISPLAY_HEIGHT_COEFFICIENT + marginBottom;
      ctx.moveTo(timestamps[1], compressedStartPosY);
      for (let j = 2; j < lines[i].length; j++) {
        const compressedPosY = lines[i][j] * CHART_DISPLAY_HEIGHT_COEFFICIENT + marginBottom;
        ctx.lineTo(timestamps[j], compressedPosY);
      }
      ctx.stroke();
    }
    ctx.restore();
  };

  paintCoordinateGrid = (ctx, canvasHeight, canvasWidth, max, slicedTimestamps, isNightMode) => {
    ctx.save();
    ctx.lineWidth = GRID_LINE_WIDTH;
    ctx.strokeStyle = isNightMode ? GRID_COLOR_NIGHT : GRID_COLOR_DAY;
    ctx.fillStyle = TEXT_COLOR;
    this.paintXAxis(ctx, canvasHeight, canvasWidth, max);
    this.paintDateLabels(ctx, canvasHeight, canvasWidth, slicedTimestamps);
    ctx.restore();
  };

  paintXAxis = (ctx, canvasHeight, canvasWidth, max) => {
    ctx.font = TEXT_FONT;
    const step = canvasHeight / X_AXIS_LINES_NUMBER;
    let posY = canvasHeight - step + GRID_LINE_WIDTH;

    const marginBottom = ((1 - CHART_DISPLAY_HEIGHT_COEFFICIENT) * canvasHeight) / 2;
    for (let i = 0; i < X_AXIS_LINES_NUMBER + 1; i++) {
      let revertPosY = canvasHeight - posY;
      const compressedPosY = revertPosY * CHART_DISPLAY_HEIGHT_COEFFICIENT + marginBottom;
      ctx.beginPath();
      ctx.moveTo(0, compressedPosY);
      ctx.lineTo(canvasWidth, compressedPosY);
      ctx.stroke();

      const valueY = Math.floor(((((posY - GRID_LINE_WIDTH) * max / (canvasHeight * CHART_DISPLAY_HEIGHT_COEFFICIENT)))) + GRID_LINE_WIDTH);
      let displayedValue = valueY.toString();
      if (valueY > 1000 && valueY < 1000000) {
        displayedValue = `${(valueY / 1000).toFixed(1)}K`;
      }
      if (valueY > 1000000) {
        displayedValue = `${(valueY / 1000000).toFixed(1)}M`;
      }

      ctx.fillText(displayedValue, 0, compressedPosY - TEXT_MARGIN);
      posY -= step;
    }
  };

  paintDateLabels = (ctx, canvasHeight, canvasWidth, slicedTimestamps) => {
    ctx.font = TEXT_FONT;
    const label = slicedTimestamps.shift();
    const step = canvasWidth / DATE_LABELS_NUMBER;
    let posX = step / 2;
    for (let i = 0; i < DATE_LABELS_NUMBER; i++) {
      const index = Math.round((posX * slicedTimestamps.length) / canvasWidth);
      const date = new Date(slicedTimestamps[index]);
      const formattedDate = this.formatDate(date);
      ctx.fillText(formattedDate, posX - DATE_MARGIN, canvasHeight);
      posX += step;
    }
    slicedTimestamps.unshift(label);
  };

  printGraphLabel = (options) => {
    const {
      ctx,
      offsetX,
      canvasHeight,
      canvasWidth,
      slicedTimestamps,
      slicedLines,
      modifiedTimestamps,
      modifiedLines,
      colors,
      chartLineWidth,
      isNightMode
    } = options;

    const timestamps = [...slicedTimestamps];
    const label = timestamps.shift();
    const margin = ((1 - CHART_DISPLAY_HEIGHT_COEFFICIENT) * canvasHeight) / 2;
    const endY = canvasHeight - margin;

    const step = canvasWidth / (timestamps.length - 1);
    const index = Math.round(offsetX / step) + 1;

    ctx.lineWidth = GRID_LINE_WIDTH;
    ctx.strokeStyle = isNightMode ? GRID_COLOR_NIGHT : GRID_COLOR_DAY;
    ctx.fillStyle = isNightMode ? NIGHT_COLOR : DAY_COLOR;
    ctx.beginPath();
    ctx.moveTo(modifiedTimestamps[index], 0);
    ctx.lineTo(modifiedTimestamps[index], endY);
    ctx.stroke();

    const startLabelContentPosY = canvasHeight / X_AXIS_LINES_NUMBER;
    ctx.beginPath();
    ctx.moveTo(modifiedTimestamps[index], startLabelContentPosY);
    ctx.lineTo(modifiedTimestamps[index] + 25, startLabelContentPosY - 25);
    ctx.lineTo(modifiedTimestamps[index] + 25, startLabelContentPosY - 75);
    ctx.quadraticCurveTo(modifiedTimestamps[index] + 25, startLabelContentPosY - 100, modifiedTimestamps[index] + 50, startLabelContentPosY - 100);
    ctx.lineTo(modifiedTimestamps[index] + 300, startLabelContentPosY - 100);
    ctx.quadraticCurveTo(modifiedTimestamps[index] + 325, startLabelContentPosY - 100, modifiedTimestamps[index] + 325, startLabelContentPosY - 75);
    ctx.lineTo(modifiedTimestamps[index] + 325, startLabelContentPosY + 100);
    ctx.quadraticCurveTo(modifiedTimestamps[index] + 325, startLabelContentPosY + 125, modifiedTimestamps[index] + 300, startLabelContentPosY + 125);
    ctx.lineTo(modifiedTimestamps[index] + 50, startLabelContentPosY + 125);
    ctx.quadraticCurveTo(modifiedTimestamps[index] + 25, startLabelContentPosY + 125, modifiedTimestamps[index] + 25, startLabelContentPosY + 100);
    ctx.lineTo(modifiedTimestamps[index] + 25, startLabelContentPosY + 25);
    ctx.lineTo(modifiedTimestamps[index], startLabelContentPosY);
    ctx.stroke();
    ctx.fill();

    for (let i = 0; i < modifiedLines.length; i++) {
      const revertPosY = canvasHeight - modifiedLines[i][index];
      const compressedPosY = revertPosY * CHART_DISPLAY_HEIGHT_COEFFICIENT + margin;
      const lineLabel = slicedLines[i][0];
      ctx.lineWidth = chartLineWidth;
      ctx.strokeStyle = colors[lineLabel];

      ctx.beginPath();
      ctx.moveTo(modifiedTimestamps[index], compressedPosY);
      ctx.arc(modifiedTimestamps[index], compressedPosY, CIRCLE_RADIUS, CIRCLE_START_ANGLE, CIRCLE_END_ANGLE);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(modifiedTimestamps[index], compressedPosY);
      ctx.arc(modifiedTimestamps[index], compressedPosY, CIRCLE_RADIUS - (chartLineWidth / 2), CIRCLE_START_ANGLE, CIRCLE_END_ANGLE);
      ctx.fill();

      if (index <= 1 || index >= modifiedTimestamps.length - 1) {
        ctx.lineWidth = chartLineWidth * 2;
        ctx.beginPath();
        ctx.moveTo(modifiedTimestamps[index], compressedPosY - CIRCLE_RADIUS);
        ctx.lineTo(modifiedTimestamps[index], compressedPosY + CIRCLE_RADIUS);
        ctx.stroke();
      }
    }

    timestamps.unshift(label);
  };

  formatDate = (date) => {
    const day = date.getDate();
    const monthIndex = date.getMonth();
    return `${MONTH_NAMES[monthIndex]} ${day}`;
  };

  formatDateWithDayOfWeek = (date) => {
    const dayOfWeekIndex = date.getDay();
    const day = date.getDate();
    const monthIndex = date.getMonth();
    return `${DAYS_OF_WEEK[dayOfWeekIndex]}, ${MONTH_NAMES[monthIndex]} ${day}`;
  };
}

export default new ChartPainter();
