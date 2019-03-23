import {
  CHART_DISPLAY_HEIGHT_COEFFICIENT,
  DATE_LABELS_NUMBER,
  DATE_MARGIN,
  DAY_GRID_COLOR,
  GRID_LINE_WIDTH,
  LINE_JOIN,
  MONTH_NAMES,
  NIGHT_GRID_COLOR,
  TEXT_COLOR,
  TEXT_FONT,
  TEXT_MARGIN,
  X_AXIS_LINES_NUMBER
} from './constants';

class ChartPainter {
  paintChart = (ctx, timestamps, lines, colors, canvasHeight, lineWidth) => {
    ctx.save();
    ctx.lineJoin = LINE_JOIN;
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
    ctx.strokeStyle = isNightMode ? NIGHT_GRID_COLOR : DAY_GRID_COLOR;
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

  formatDate = (date) => {
    const day = date.getDate();
    const monthIndex = date.getMonth();
    return `${MONTH_NAMES[monthIndex]} ${day}`;
  };
}

export default new ChartPainter();
