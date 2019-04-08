export const sliceMainTimestamps = (originalTimestamps, leftCoefficient, rightCoefficient) => {
  const timestamps = [...originalTimestamps];
  const label = timestamps.shift();
  const startIndex = Math.floor(timestamps.length * leftCoefficient);
  const endIndex = Math.ceil(timestamps.length * (1 - rightCoefficient));
  const mainTimestamps = timestamps.slice(startIndex, endIndex);
  mainTimestamps.unshift(label);
  return mainTimestamps;
};

export const sliceMainLines = (originalLines, leftCoefficient, rightCoefficient, linesVisibility) => {
  const modifiedMainLines = [];
  originalLines.forEach(lineArray => {
    const lineLabel = lineArray[0];
    if (linesVisibility[lineLabel]) {
      const lines = [...lineArray];
      const label = lines.shift();
      const startIndex = Math.floor(lines.length * leftCoefficient);
      const endIndex = Math.ceil(lines.length * (1 - rightCoefficient));
      const mainLines = lines.slice(startIndex, endIndex);
      mainLines.unshift(label);
      modifiedMainLines.push(mainLines);
    }
  });
  return modifiedMainLines;
};

export const modifyTimestamps = (originalTimestamps, canvasWidth, borderWidth) => {
  const timestamps = [...originalTimestamps];
  const label = timestamps.shift();
  const min = Math.min(...timestamps);
  const max = Math.max(...timestamps);
  const range = max - min;
  const modifiedTimestamps = timestamps.map(timestamp => ((timestamp - min) * (canvasWidth - (borderWidth * 2)) / range));
  modifiedTimestamps.unshift(label);
  return modifiedTimestamps;
};

export const modifyLines = (originalLines, canvasHeight, linesVisibility, max) => {
  const modifiedLines = [];
  originalLines.forEach(lineArray => {
    const lineLabel = lineArray[0];
    if (linesVisibility[lineLabel]) {
      const lines = [...lineArray];
      const label = lines.shift();
      const modifiedLine = lines.map(linePoint => (linePoint * canvasHeight) / max);
      modifiedLine.unshift(label);
      modifiedLines.push(modifiedLine);
    }
  });
  return modifiedLines;
};

export const getMaxValueInLinePoints = (originalLines, linesVisibility) => {
  let max = 0;
  originalLines.forEach(lineArray => {
    const lineLabel = lineArray[0];
    if (linesVisibility[lineLabel]) {
      const lines = [...lineArray];
      const label = lines.shift();
      max = Math.max(...lines, max);
      lines.unshift(label);
    }
  });
  return max;
};
