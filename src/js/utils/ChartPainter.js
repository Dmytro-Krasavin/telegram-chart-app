/* eslint-disable no-plusplus */

const CHART_DISPLAY_HEIGHT_COEFFICIENT = 0.9;
const X_AXIS_LINES_NUMBER = 6;
const DATE_LABELS_NUMBER = 6;
const GRID_COLOR = '#EBEBEB';
const GRID_LINE_WIDTH = 1;

class ChartPainter {
  paintChart = (ctx, timestamps, lines, colors, lineWidth) => {
    ctx.lineWidth = lineWidth;
    for (let i = 0; i < lines.length; i++) {
      const lineLabel = lines[i][0];
      ctx.strokeStyle = colors[lineLabel];
      ctx.beginPath();
      ctx.moveTo(timestamps[1], lines[i][1]);
      for (let j = 2; j < lines[i].length; j++) {
        ctx.lineTo(timestamps[j], lines[i][j] * CHART_DISPLAY_HEIGHT_COEFFICIENT);
      }
      ctx.stroke();
    }
  };

  paintCoordinateGrid = (ctx, timestamps, modifiedTimestamps, lines, modifiedLines, canvasHeight, canvasWidth) => {
    ctx.lineWidth = GRID_LINE_WIDTH;
    ctx.strokeStyle = GRID_COLOR;
    const step = canvasHeight / (X_AXIS_LINES_NUMBER + 1);
    let posY = 0;
    for (let i = 0; i < X_AXIS_LINES_NUMBER; i++) {
      ctx.beginPath();
      ctx.moveTo(0, posY);
      ctx.lineTo(canvasWidth, posY);
      ctx.stroke();
      posY += step;
    }
  };
}

export default new ChartPainter();
