/* eslint-disable no-plusplus,no-param-reassign */

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
const DATE_MARGIN = 30;
const GRID_LINE_WIDTH = 1;
const LABEL_LINE_WIDTH = 3;
const CIRCLE_RADIUS = 15;
const CIRCLE_START_ANGLE = 0;
const CIRCLE_END_ANGLE = 2 * Math.PI;
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'];
const LABEL_BOX_START_POS_COEFFICIENT = 0.8;
const LABEL_BOX_RADIUS_COEFFICIENT = 4;
const LABEL_BOX_WIDTH_COEFFICIENT = 4.5;
const LABEL_BOX_HEIGHT_COEFFICIENT = 8;

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
    const timestampPosX = modifiedTimestamps[index];

    ctx.lineWidth = GRID_LINE_WIDTH;
    ctx.strokeStyle = isNightMode ? GRID_COLOR_NIGHT : GRID_COLOR_DAY;
    ctx.fillStyle = isNightMode ? NIGHT_COLOR : DAY_COLOR;
    ctx.beginPath();
    ctx.moveTo(timestampPosX, 0);
    ctx.lineTo(timestampPosX, endY);
    ctx.stroke();

    const startLabelContentPosY = (canvasHeight / (X_AXIS_LINES_NUMBER + 1)) * LABEL_BOX_START_POS_COEFFICIENT;
    const radius = (startLabelContentPosY) / LABEL_BOX_RADIUS_COEFFICIENT;
    ctx.lineWidth = LABEL_LINE_WIDTH;

    const posY = LABEL_LINE_WIDTH;
    const width = radius * slicedLines.length * LABEL_BOX_WIDTH_COEFFICIENT;
    const height = radius * LABEL_BOX_HEIGHT_COEFFICIENT;
    ctx.beginPath();
    ctx.moveTo(timestampPosX, startLabelContentPosY);
    let displayedDatePosX;
    if (index <= timestamps.length / 2) {
      displayedDatePosX = timestampPosX + width * 0.15;
      const posX = timestampPosX + radius;
      ctx.moveTo(posX + radius, posY);
      ctx.lineTo(posX + width - radius, posY);
      ctx.quadraticCurveTo(posX + width, posY, posX + width, posY + radius);
      ctx.lineTo(posX + width, posY + height - radius);
      ctx.quadraticCurveTo(posX + width, posY + height, posX + width - radius, posY + height);
      ctx.lineTo(posX + radius, posY + height);
      ctx.quadraticCurveTo(posX, posY + height, posX, posY + height - radius);
      ctx.lineTo(posX, (posY + height) * 2 / 3);
      ctx.lineTo(timestampPosX, (posY + height) / 2);
      ctx.lineTo(posX, (posY + height) / 3);
      ctx.lineTo(posX, posY + radius);
      ctx.quadraticCurveTo(posX, posY, posX + radius, posY);
    } else {
      displayedDatePosX = timestampPosX - width * 1.05;
      const posX = timestampPosX - radius;
      ctx.moveTo(posX - radius, posY);
      ctx.lineTo(posX - width + radius, posY);
      ctx.quadraticCurveTo(posX - width, posY, posX - width, posY + radius);
      ctx.lineTo(posX - width, posY + height - radius);
      ctx.quadraticCurveTo(posX - width, posY + height, posX - width + radius, posY + height);
      ctx.lineTo(posX - radius, posY + height);
      ctx.quadraticCurveTo(posX, posY + height, posX, posY + height - radius);
      ctx.lineTo(posX, (posY + height) * 2 / 3);
      ctx.lineTo(timestampPosX, (posY + height) / 2);
      ctx.lineTo(posX, (posY + height) / 3);
      ctx.lineTo(posX, posY + radius);
      ctx.quadraticCurveTo(posX, posY, posX - radius, posY);
    }
    ctx.stroke();
    ctx.fill();

    const date = new Date(slicedTimestamps[index]);
    ctx.font = TEXT_FONT;
    ctx.fillStyle = isNightMode ? DAY_COLOR : NIGHT_COLOR;
    ctx.fillText(this.formatDateWithDayOfWeek(date), displayedDatePosX, (posY + height) * 0.3);

    for (let i = 0; i < modifiedLines.length; i++) {
      const revertPosY = canvasHeight - modifiedLines[i][index];
      const compressedPosY = revertPosY * CHART_DISPLAY_HEIGHT_COEFFICIENT + margin;
      const lineLabel = slicedLines[i][0];
      ctx.lineWidth = chartLineWidth;
      ctx.strokeStyle = colors[lineLabel];

      ctx.beginPath();
      ctx.moveTo(timestampPosX, compressedPosY);
      ctx.arc(timestampPosX, compressedPosY, CIRCLE_RADIUS, CIRCLE_START_ANGLE, CIRCLE_END_ANGLE);
      ctx.stroke();

      ctx.fillStyle = isNightMode ? NIGHT_COLOR : DAY_COLOR;
      ctx.beginPath();
      ctx.moveTo(timestampPosX, compressedPosY);
      ctx.arc(timestampPosX, compressedPosY, CIRCLE_RADIUS - (chartLineWidth / 2), CIRCLE_START_ANGLE, CIRCLE_END_ANGLE);
      ctx.fill();

      if (index <= 1 || index >= modifiedTimestamps.length - 1) {
        ctx.lineWidth = chartLineWidth * 2;
        ctx.beginPath();
        ctx.moveTo(timestampPosX, compressedPosY - CIRCLE_RADIUS);
        ctx.lineTo(timestampPosX, compressedPosY + CIRCLE_RADIUS);
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
