import { CHART_DISPLAY_HEIGHT_COEFFICIENT, LINE_JOIN } from './constants';

const paintChart = (ctx, timestamps, lines, colors, canvasHeight, lineWidth) => {
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

export default paintChart;
