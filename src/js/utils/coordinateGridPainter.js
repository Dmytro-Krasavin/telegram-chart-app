import {
  CHART_DISPLAY_HEIGHT_COEFFICIENT,
  DATE_LABELS_NUMBER,
  DATE_MARGIN,
  DAY_GRID_COLOR,
  GRID_LINE_WIDTH,
  MONTH_NAMES,
  NIGHT_GRID_COLOR,
  TEXT_COLOR,
  TEXT_FONT,
  TEXT_MARGIN,
  X_AXIS_LINES_NUMBER
} from './constants';

const formatDate = (date) => {
  const day = date.getDate();
  const monthIndex = date.getMonth();
  return `${MONTH_NAMES[monthIndex]} ${day}`;
};

const paintDateLabels = (ctx, canvasHeight, canvasWidth, slicedTimestamps) => {
  ctx.font = TEXT_FONT;
  const label = slicedTimestamps.shift();
  const step = canvasWidth / DATE_LABELS_NUMBER;
  let posX = step / 2;
  for (let i = 0; i < DATE_LABELS_NUMBER; i++) {
    const index = Math.round((posX * slicedTimestamps.length) / canvasWidth);
    const date = new Date(slicedTimestamps[index]);
    const formattedDate = formatDate(date);
    ctx.fillText(formattedDate, posX - DATE_MARGIN, canvasHeight);
    posX += step;
  }
  slicedTimestamps.unshift(label);
};

const paintXAxis = (ctx, canvasHeight, canvasWidth, max) => {
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

    const valueY = Math.floor(((((posY - GRID_LINE_WIDTH) * max / (canvasHeight)))) + GRID_LINE_WIDTH);
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

const paintCoordinateGrid = (ctx, canvasHeight, canvasWidth, max, slicedTimestamps, isNightMode) => {
  ctx.save();
  ctx.lineWidth = GRID_LINE_WIDTH;
  ctx.strokeStyle = isNightMode ? NIGHT_GRID_COLOR : DAY_GRID_COLOR;
  ctx.fillStyle = TEXT_COLOR;
  paintXAxis(ctx, canvasHeight, canvasWidth, max);
  paintDateLabels(ctx, canvasHeight, canvasWidth, slicedTimestamps);
  ctx.restore();
};

export default paintCoordinateGrid;
