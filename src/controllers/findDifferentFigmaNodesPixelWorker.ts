const { parentPort, workerData } = require("worker_threads");

const { flattenFigmaData, figmaBuff, screenShotBuff, width, start, end } =
  workerData;

interface diffPixel {
  x: number;
  y: number;
}

type Point = { x: number; y: number };

interface AbsoluteBoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
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

const isPointInsideBoundingBox = (
  point: Point,
  boundingBox: AbsoluteBoundingBox | undefined,
): boolean => {
  if (!boundingBox) {
    return false;
  }
  const { x, y } = point;
  const { x: bx, y: by, width: bw, height: bh } = boundingBox;

  return bx <= x && x <= bx + bw && by <= y && y <= by + bh;
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

const differentFigmaNodes: Box[] = [];

if (diffPixels.length > 0) {
  const points: Point[] = diffPixels;
  const includedBoundingBoxes: Box[] = flattenFigmaData
    .filter((node: FigmaNode) => node.absoluteBoundingBox !== undefined)
    .filter((node: FigmaNode) =>
      points.some((point: Point) =>
        isPointInsideBoundingBox(point, node.absoluteBoundingBox!),
      ),
    )
    .map((node: FigmaNode) => ({
      id: node.id,
      absoluteBoundingBox: node.absoluteBoundingBox!,
      type: node.type,
      childrenIds: node.children?.map((child: FigmaNode) => child.id) ?? [],
    }));

  const skipIds = new Set<string>();
  const processedBoundingBoxes = new Set<string>();
  const fullFrameNode = includedBoundingBoxes[0];
  const roundedBoundingBoxes = new Map();

  includedBoundingBoxes.forEach((box, index) => {
    if (box.type === "VECTOR") {
      if (box.id) {
        skipIds.add(box.id);
      }
      return;
    }

    const roundedX = Math.round((box.absoluteBoundingBox?.x || 0) * 10) / 10;
    const roundedY = Math.round((box.absoluteBoundingBox?.y || 0) * 10) / 10;
    const roundedWidth =
      Math.round((box.absoluteBoundingBox?.width || 0) * 10) / 10;
    const roundedHeight =
      Math.round((box.absoluteBoundingBox?.height || 0) * 10) / 10;
    const roundedKey = [roundedX, roundedY, roundedWidth, roundedHeight].join(
      ",",
    );

    if (roundedBoundingBoxes.has(roundedKey)) {
      if (box.id) {
        skipIds.add(box.id);
      }
      return;
    }

    roundedBoundingBoxes.set(roundedKey, box.id);

    if (
      (roundedHeight === fullFrameNode.absoluteBoundingBox?.height ||
        roundedWidth === fullFrameNode.absoluteBoundingBox?.width) &&
      box.id
    ) {
      skipIds.add(box.id);
    }

    if (box.type === "FRAME" && box.childrenIds && box.childrenIds.length > 0) {
      const childrenHeights = box.childrenIds
        .map(
          (id) =>
            includedBoundingBoxes.find((b) => b.id === id)?.absoluteBoundingBox
              ?.height,
        )
        .filter((height) => height !== undefined) as number[];

      const parentHeight = box.absoluteBoundingBox?.height;

      if (childrenHeights.every((height) => height === parentHeight)) {
        box.id && skipIds.add(box.id);
      }
    }

    if (
      (box.absoluteBoundingBox?.height ===
        fullFrameNode.absoluteBoundingBox?.height ||
        box.absoluteBoundingBox?.width ===
          fullFrameNode.absoluteBoundingBox?.width) &&
      box.id
    ) {
      skipIds.add(box.id);
    }
  });

  for (const box of includedBoundingBoxes) {
    if (!box.id || skipIds.has(box.id)) {
      console.error(
        `Skipping image creation for node ${box.id}: it is a child node of a group or the ID is undefined.`,
      );
      continue;
    }

    const boundingBoxKey = `${box.absoluteBoundingBox?.x},${box.absoluteBoundingBox?.y},${box.absoluteBoundingBox?.width},${box.absoluteBoundingBox?.height}`;

    if (processedBoundingBoxes.has(boundingBoxKey)) {
      continue;
    }

    try {
      differentFigmaNodes.push(box);
      processedBoundingBoxes.add(boundingBoxKey);
    } catch (error) {
      console.error(`Failed to process box for node ${box.id}: ${error}`);
    }
  }
}

parentPort?.postMessage({ differentFigmaNodes, diffPixels });
