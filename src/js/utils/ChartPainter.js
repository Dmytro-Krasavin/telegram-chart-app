/* eslint-disable no-plusplus */

const CHART_DISPLAY_HEIGHT_COEFFICIENT = 0.9;
const X_AXIS_LINES_NUMBER = 6;
const DATE_LABELS_NUMBER = 6;
const GRID_COLOR = '#EBEBEB';
const TEXT_COLOR = '#7B9EA8';
const TEXT_FONT = '30px Helvetica';
const TEXT_MARGIN = 10;
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

  paintCoordinateGrid = (ctx, canvasHeight, canvasWidth, max, slicedTimestamps) => {
    ctx.save();
    ctx.lineWidth = GRID_LINE_WIDTH;
    ctx.strokeStyle = GRID_COLOR;
    ctx.font = TEXT_FONT;
    ctx.fillStyle = TEXT_COLOR;
    this.paintXAxis(ctx, canvasHeight, canvasWidth, max);
    // this.paintDateLabels(ctx, canvasWidth, slicedTimestamps);
    ctx.restore();
  };

  paintXAxis = (ctx, canvasHeight, canvasWidth, max) => {
    const step = canvasHeight / X_AXIS_LINES_NUMBER;
    let posY = canvasHeight - step + GRID_LINE_WIDTH;

    const marginBottom = ((1 - CHART_DISPLAY_HEIGHT_COEFFICIENT) * canvasHeight) / 2;
    for (let i = 0; i < X_AXIS_LINES_NUMBER + GRID_LINE_WIDTH; i++) {
      let modifiedPosY = canvasHeight - posY;
      const compressedPosY = modifiedPosY * CHART_DISPLAY_HEIGHT_COEFFICIENT + marginBottom;
      ctx.beginPath();
      ctx.moveTo(0, compressedPosY);
      ctx.lineTo(canvasWidth, compressedPosY);
      ctx.stroke();

      const valueY = Math.floor(((((posY - GRID_LINE_WIDTH) / canvasHeight) * max) / CHART_DISPLAY_HEIGHT_COEFFICIENT) + GRID_LINE_WIDTH);

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

  paintDateLabels = (ctx, canvasWidth, slicedTimestamps) => {
    const step = canvasWidth / DATE_LABELS_NUMBER;
  };

  formatDate = (date) => {
    const day = date.getDate();
    const monthIndex = date.getMonth();
    const year = date.getFullYear();
    return '' + day + '-' + MONTH_NAMES[monthIndex] + '-' + year;
  };
}

export default new ChartPainter();
