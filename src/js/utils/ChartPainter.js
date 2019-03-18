/* eslint-disable no-plusplus */
class ChartPainter {
  constructor(ctx) {
    this.ctx = ctx;
  }

  paintChart = (timestamps, lines, colors) => {
    for (let i = 0; i < lines.length; i++) {
      const lineLabel = lines[i][0];
      this.ctx.strokeStyle = colors[lineLabel];
      this.ctx.beginPath();
      this.ctx.moveTo(timestamps[1], lines[i][1]);
      for (let j = 2; j < lines[i].length; j++) {
        this.ctx.lineTo(timestamps[j], lines[i][j]);
      }
      this.ctx.stroke();
    }
  }
}

export default ChartPainter;
