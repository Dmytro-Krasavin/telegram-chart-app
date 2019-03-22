/* eslint-disable no-plusplus */

const CHART_DISPLAY_HEIGHT_COEFFICIENT = 0.9;
const X_AXIS_LINES_NUMBER = 6;
const DATE_LABELS_NUMBER = 6;
const GRID_COLOR_DAY = '#E8EAEB';
const GRID_COLOR_NIGHT = '#3D4B5A';
const TEXT_COLOR = '#7B9EA8';
const TEXT_FONT = '30px Helvetica';
const TEXT_MARGIN = 10;
const DATE_MARGIN = 60;
const GRID_LINE_WIDTH = 1;
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

class ChartPainter {
  paintChart = (ctx, timestamps, lines, colors, canvasHeight, lineWidth) => {
    ctx.save();
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
      let modifiedPosY = canvasHeight - posY;
      const compressedPosY = modifiedPosY * CHART_DISPLAY_HEIGHT_COEFFICIENT + marginBottom;
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

  formatDate = (date) => {
    const day = date.getDate();
    const monthIndex = date.getMonth();
    return `${MONTH_NAMES[monthIndex]} ${day} `;
  };
}

export default new ChartPainter();
