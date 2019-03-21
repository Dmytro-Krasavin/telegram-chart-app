/* eslint-disable no-plusplus */

const CHART_DISPLAY_HEIGHT_COEFFICIENT = 0.9;
const X_AXIS_LINES_NUMBER = 6;
// const DATE_LABELS_NUMBER = 6;
const GRID_COLOR = '#EBEBEB';
const TEXT_COLOR = '#7B9EA8';
const TEXT_FONT = '12px Helvetica';
const TEXT_MARGIN = 7;
const GRID_LINE_WIDTH = 1;

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
      ctx.moveTo(timestamps[1], lines[i][1]);
      for (let j = 2; j < lines[i].length; j++) {
        ctx.lineTo(timestamps[j], lines[i][j] * CHART_DISPLAY_HEIGHT_COEFFICIENT);
      }
      ctx.stroke();
    }
    ctx.restore();
  };

  paintCoordinateGrid = (ctx, canvasHeight, canvasWidth, max) => {
    ctx.save();
    ctx.lineWidth = GRID_LINE_WIDTH;
    ctx.strokeStyle = GRID_COLOR;
    const step = canvasHeight / X_AXIS_LINES_NUMBER;
    let posY = canvasHeight - step + 1;
    for (let i = 0; i < X_AXIS_LINES_NUMBER + 1; i++) {
      let modifiedPosY = canvasHeight - posY;
      ctx.beginPath();
      ctx.moveTo(0, modifiedPosY);
      ctx.lineTo(canvasWidth, modifiedPosY);
      ctx.stroke();

      const valueY = Math.floor((((posY - 1) / canvasHeight) * max) / CHART_DISPLAY_HEIGHT_COEFFICIENT);

      let displayedValue = valueY.toString();
      if (valueY > 1000) {
        displayedValue = `${(valueY / 1000).toFixed(1)}K`;
      }
      if (valueY > 1000000) {
        displayedValue = `${(valueY / 1000000).toFixed(1)}M`;
      }

      ctx.font = TEXT_FONT;
      ctx.fillStyle = TEXT_COLOR;
      ctx.fillText(displayedValue, 0, modifiedPosY - TEXT_MARGIN);
      posY -= step;
    }
    ctx.restore();
  };
}

export default new ChartPainter();
