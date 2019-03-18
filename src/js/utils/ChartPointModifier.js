class ChartPointModifier {
  chartHeightCoefficient = 0.9;

  modifyTimestamps = (originalTimestamps, canvasWidth) => {
    const timestamps = originalTimestamps.slice();
    const label = timestamps.shift();
    const min = Math.min(...timestamps);
    const max = Math.max(...timestamps);
    const range = max - min;
    const modifiedTimestamps = timestamps.map(timestamp => this.modifyTimestamp(timestamp, canvasWidth, min, range));
    modifiedTimestamps.unshift(label);
    return modifiedTimestamps;
  };

  modifyLines = (originalLines, canvasHeight, linesVisibility) => {
    const modifiedLines = [];
    const max = this.getMaxValueInLinePoints(originalLines, linesVisibility);
    originalLines.forEach(lineArray => {
      const lineLabel = lineArray[0];
      if (linesVisibility[lineLabel]) {
        const lines = lineArray.slice();
        const label = lines.shift();
        const modifiedLine = lines.map(linePoint => this.modifyLinePoint(linePoint, canvasHeight, max));
        modifiedLine.unshift(label);
        modifiedLines.push(modifiedLine);
      }
    });
    return modifiedLines;
  };

  getMaxValueInLinePoints = (originalLines, linesVisibility) => {
    let max = 0;
    originalLines.forEach(lineArray => {
      const lineLabel = lineArray[0];
      if (linesVisibility[lineLabel]) {
        const lines = lineArray.slice();
        const label = lines.shift();
        max = Math.max(...lines, max);
        lines.unshift(label);
      }
    });
    return max;
  };

  modifyLinePoint = (linePoint, canvasHeight, max) => (linePoint * canvasHeight * this.chartHeightCoefficient) / max;

  modifyTimestamp = (timestamp, canvasWidth, min, range) => ((timestamp - min) * canvasWidth) / range;
}

export default new ChartPointModifier();
