const CHART_HEIGHT_COEFFICIENT = 0.9;

class ChartPointModifier {
  sliceMainTimestamps = (originalTimestamps, leftCoefficient, rightCoefficient) => {
    const timestamps = originalTimestamps.slice();
    const label = timestamps.shift();
    const startIndex = Math.ceil(timestamps.length * leftCoefficient);
    const endIndex = Math.floor(timestamps.length * (1 - rightCoefficient));
    const mainTimestamps = timestamps.slice(startIndex, endIndex);
    mainTimestamps.unshift(label);
    return mainTimestamps;
  };

  sliceMainLines = (originalLines, leftCoefficient, rightCoefficient) => {
    const modifiedMainLines = [];
    originalLines.forEach(lineArray => {
      const lines = lineArray.slice();
      const label = lines.shift();
      const startIndex = Math.ceil(lines.length * leftCoefficient);
      const endIndex = Math.floor(lines.length * (1 - rightCoefficient));
      const mainLines = lines.slice(startIndex, endIndex);
      mainLines.unshift(label);
      modifiedMainLines.push(mainLines);
    });
    return modifiedMainLines;
  };

  modifyTimestamps = (originalTimestamps, canvasWidth, borderWidth) => {
    const timestamps = originalTimestamps.slice();
    const label = timestamps.shift();
    const min = Math.min(...timestamps);
    const max = Math.max(...timestamps);
    const range = max - min;
    const modifiedTimestamps = timestamps.map(timestamp => ((timestamp - min) * (canvasWidth - (borderWidth * 2)) / range));
    modifiedTimestamps.unshift(label);
    return modifiedTimestamps;
  };

  modifyLines = (originalLines, canvasHeight, linesVisibility, max) => {
    const modifiedLines = [];
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
