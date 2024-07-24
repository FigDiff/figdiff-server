const { parentPort, workerData } = require("worker_threads");

const { flattenFigmaData, figmaBuff, screenShotBuff, width, start, end } =
  workerData;

interface diffPixel {
  x: number;
  y: number;
}

interface Point {
  x: number;
  y: number;
}

interface FigmaNode {
  id: string;
  name: string;
  type: string;
  children?: FigmaNode[];
  absoluteBoundingBox: AbsoluteBoundingBox;
}

interface Box {
  id?: string;
  absoluteBoundingBox?: AbsoluteBoundingBox;
  type?: string;
  childrenIds?: string[];
}

interface AbsoluteBoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

const isPointInsideBoundingBox = (
  point: Point,
  boundingBox: AbsoluteBoundingBox,
): boolean => {
  return (
    point.x >= boundingBox.x &&
    point.x <= boundingBox.x + boundingBox.width &&
    point.y >= boundingBox.y &&
    point.y <= boundingBox.y + boundingBox.height
  );
};

const getBlockAverageColor = (
  buffer: Uint8ClampedArray,
  width: number,
  start: number,
  end: number,
  blockSize: number,
): number[] => {
  const averages: number[] = [];

  for (
    let y = start;
    y < end && y < buffer.length / 4 / width;
    y += blockSize
  ) {
    for (let x = 0; x < width; x += blockSize) {
      let rSum = 0,
        gSum = 0,
        bSum = 0,
        aSum = 0;
      let count = 0;

      for (let dy = 0; dy < blockSize && y + dy < end; dy++) {
        for (let dx = 0; dx < blockSize && x + dx < width; dx++) {
          const px = x + dx;
          const py = y + dy;
          const idx = (py * width + px) * 4;
          rSum += buffer[idx];
          gSum += buffer[idx + 1];
          bSum += buffer[idx + 2];
          aSum += buffer[idx + 3];
          count++;
        }
      }

      if (count > 0) {
        averages.push(rSum / count, gSum / count, bSum / count, aSum / count);
      }
    }
  }

  return averages;
};

const getDifferenceCoordinates = (
  figmaBuff: Uint8ClampedArray,
  screenShotBuff: Uint8ClampedArray,
  width: number,
  start: number,
  end: number,
): diffPixel[] => {
  const diffPixels: diffPixel[] = [];
  const threshold = 30;
  const blockSize = 5;

  const figmaAverages = getBlockAverageColor(
    figmaBuff,
    width,
    start,
    end,
    blockSize,
  );
  const screenShotAverages = getBlockAverageColor(
    screenShotBuff,
    width,
    start,
    end,
    blockSize,
  );

  for (let i = 0; i < figmaAverages.length; i += 4) {
    const r1 = figmaAverages[i];
    const g1 = figmaAverages[i + 1];
    const b1 = figmaAverages[i + 2];
    const a1 = figmaAverages[i + 3];

    const r2 = screenShotAverages[i];
    const g2 = screenShotAverages[i + 1];
    const b2 = screenShotAverages[i + 2];
    const a2 = screenShotAverages[i + 3];

    const diff = Math.sqrt(
      Math.pow(r2 - r1, 2) +
        Math.pow(g2 - g1, 2) +
        Math.pow(b2 - b1, 2) +
        Math.pow(a2 - a1, 2),
    );

    if (diff > threshold) {
      const blockIndex = i / 4;
      const blockX = blockIndex % (width / blockSize);
      const blockY = Math.floor(blockIndex / (width / blockSize));
      const x = blockX * blockSize;
      const y = blockY * blockSize;
      diffPixels.push({ x, y });
    }
  }

  return diffPixels;
};

const diffPixels = getDifferenceCoordinates(
  figmaBuff,
  screenShotBuff,
  width,
  start,
  end,
);

parentPort?.postMessage({ differentFigmaNodes, diffPixels });
