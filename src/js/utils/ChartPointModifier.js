const CHART_HEIGHT_COEFFICIENT = 0.9;
const BORDER_WIDTH = 2;

class ChartPointModifier {
  modifyTimestamps = (originalTimestamps, canvasWidth) => {
    const timestamps = originalTimestamps.slice();
    const label = timestamps.shift();
    const min = Math.min(...timestamps);
    const max = Math.max(...timestamps);
    const range = max - min;
    const modifiedTimestamps = timestamps.map(timestamp => ((timestamp - min) * (canvasWidth - BORDER_WIDTH) / range));
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
        const modifiedLine = lines.map(linePoint => (linePoint * canvasHeight * CHART_HEIGHT_COEFFICIENT) / max);
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
}

export default new ChartPointModifier();
