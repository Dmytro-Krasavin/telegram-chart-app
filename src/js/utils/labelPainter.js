import {
  CHART_DISPLAY_HEIGHT_COEFFICIENT,
  CHART_NAME_TEXT_FONT,
  CIRCLE_END_ANGLE,
  CIRCLE_RADIUS,
  CIRCLE_START_ANGLE,
  DAY_BACKGROUND_COLOR,
  DAY_GRID_COLOR,
  DAYS_OF_WEEK,
  GRID_LINE_WIDTH,
  LABEL_BOX_HEIGHT_COEFFICIENT,
  LABEL_BOX_RADIUS_COEFFICIENT,
  LABEL_BOX_START_POS_COEFFICIENT,
  LABEL_BOX_WIDTH_COEFFICIENT,
  LABEL_LINE_WIDTH,
  MONTH_NAMES,
  NIGHT_BACKGROUND_COLOR,
  NIGHT_GRID_COLOR,
  TEXT_FONT,
  X_AXIS_LINES_NUMBER
} from './constants';

const formatDateWithDayOfWeek = (date) => {
  const dayOfWeekIndex = date.getDay();
  const day = date.getDate();
  const monthIndex = date.getMonth();
  return `${DAYS_OF_WEEK[dayOfWeekIndex]}, ${MONTH_NAMES[monthIndex]} ${day}`;
};

const printChartLabel = (options) => {
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

  // paint label line
  ctx.lineWidth = GRID_LINE_WIDTH;
  ctx.strokeStyle = isNightMode ? NIGHT_GRID_COLOR : DAY_GRID_COLOR;
  ctx.fillStyle = isNightMode ? NIGHT_BACKGROUND_COLOR : DAY_BACKGROUND_COLOR;
  ctx.beginPath();
  ctx.moveTo(timestampPosX, 0);
  ctx.lineTo(timestampPosX, endY);
  ctx.stroke();

  const startLabelContentPosY = (canvasHeight / (X_AXIS_LINES_NUMBER + 1)) * LABEL_BOX_START_POS_COEFFICIENT;
  const radius = startLabelContentPosY / LABEL_BOX_RADIUS_COEFFICIENT;
  ctx.lineWidth = LABEL_LINE_WIDTH;

  // paint label box
  const posY = LABEL_LINE_WIDTH;
  const width = slicedLines.length > 2 ? radius * slicedLines.length * LABEL_BOX_WIDTH_COEFFICIENT : radius * 2.5 * LABEL_BOX_WIDTH_COEFFICIENT;
  const height = radius * LABEL_BOX_HEIGHT_COEFFICIENT;
  ctx.beginPath();
  ctx.moveTo(timestampPosX, startLabelContentPosY);
  let displayedDatePosX;
  let displayedLabelPosX;
  if (index <= timestamps.length / 2) {
    displayedDatePosX = slicedLines.length > 2 ? timestampPosX + width * 0.25 : timestampPosX + width * 0.2;
    displayedLabelPosX = slicedLines.length > 2 ? timestampPosX + width * 0.1 : timestampPosX + width * 0.25;
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
    displayedDatePosX = slicedLines.length > 2 ? timestampPosX - width * 0.8 : timestampPosX - width;
    displayedLabelPosX = slicedLines.length > 2 ? timestampPosX - width : timestampPosX - width * 0.95;
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

  // paint date
  const date = new Date(slicedTimestamps[index]);
  ctx.font = TEXT_FONT;
  ctx.fillStyle = isNightMode ? DAY_BACKGROUND_COLOR : NIGHT_BACKGROUND_COLOR;
  ctx.fillText(formatDateWithDayOfWeek(date), displayedDatePosX, (posY + height) * 0.3);

  // paint chart values
  for (let i = 0; i < modifiedLines.length; i++) {
    const revertPosY = canvasHeight - modifiedLines[i][index];
    const compressedPosY = revertPosY * CHART_DISPLAY_HEIGHT_COEFFICIENT + margin;
    const lineLabel = slicedLines[i][0];
    ctx.lineWidth = chartLineWidth;
    ctx.strokeStyle = colors[lineLabel];

    // paint chart point border
    ctx.beginPath();
    ctx.moveTo(timestampPosX, compressedPosY);
    ctx.arc(timestampPosX, compressedPosY, CIRCLE_RADIUS, CIRCLE_START_ANGLE, CIRCLE_END_ANGLE);
    ctx.stroke();

    // paint chart point body
    ctx.fillStyle = isNightMode ? NIGHT_BACKGROUND_COLOR : DAY_BACKGROUND_COLOR;
    ctx.beginPath();
    ctx.moveTo(timestampPosX, compressedPosY);
    ctx.arc(timestampPosX, compressedPosY, CIRCLE_RADIUS - (chartLineWidth / 2), CIRCLE_START_ANGLE, CIRCLE_END_ANGLE);
    ctx.fill();

    // paint chart point value
    let displayedValue = slicedLines[i][index];
    if (displayedValue > 1000 && displayedValue < 1000000) {
      displayedValue = `${(displayedValue / 1000).toFixed(1)}K`;
    }
    if (displayedValue > 1000000) {
      displayedValue = `${(displayedValue / 1000000).toFixed(1)}M`;
    }
    ctx.fillStyle = colors[lineLabel];
    ctx.font = CHART_NAME_TEXT_FONT;
    ctx.fillText(displayedValue, i * startLabelContentPosY + displayedLabelPosX, (posY + height) * 0.6);
    ctx.font = TEXT_FONT;
    ctx.fillText(lineLabel, i * startLabelContentPosY + displayedLabelPosX, (posY + height) * 0.9);

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

export default printChartLabel;
