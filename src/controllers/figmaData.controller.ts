import { NextFunction, Request, Response } from "express";
import { Worker, isMainThread } from "worker_threads";
import sharp from "sharp";
import puppeteer from "puppeteer";
import path from "path";
import fs from "fs";

import fetchFigmaJson from "../utils/fetchFigmaJson";
import fetchFigmaPng from "../utils/fetchFigmaPng";
import flattenFigmaNodes from "../utils/flattenFigmaNodes";
import wait from "../utils/wait";
import {
  FIGMA_FILE_KEY_INDEX,
  FIGMA_NODE_ID_INDEX,
} from "../constants/figmaUrlConstants";
import { updateProgress } from "../routes/progressBarSSE";

interface AbsoluteBoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Box {
  id?: string;
  absoluteBoundingBox?: AbsoluteBoundingBox;
  type?: string;
  childrenIds?: string[];
}

interface WorkerResult {
  differentFigmaNodes: Box[];
  diffPixels: { x: number; y: number }[];
}

const figmaDataController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { figmaUrl, accessToken, tabUrl } = req.body as {
      figmaUrl: string;
      accessToken: string;
      tabUrl: string;
    };

    if (!accessToken) {
      res.status(403).send({ message: "Not Authorized" });
      return;
    }

    updateProgress(20, "분석 준비중입니다");

    const urlArray = figmaUrl.split("/");
    const fileKey = urlArray[FIGMA_FILE_KEY_INDEX];
    const nodeId = urlArray[FIGMA_NODE_ID_INDEX].slice(
      urlArray[FIGMA_NODE_ID_INDEX].indexOf("=") + 1,
      urlArray[FIGMA_NODE_ID_INDEX].indexOf("&"),
    ).replace("-", ":");

    if (!fileKey) {
      throw new Error("Invalid Figma URL: missing file ID");
    } else if (!nodeId) {
      throw new Error("Invalid Figma URL: missing node ID");
    }

    const figmaJson = await fetchFigmaJson(fileKey, nodeId, accessToken);
    const figmaPngBuffer = await fetchFigmaPng(fileKey, nodeId, accessToken);

    const flattenFigmaData = flattenFigmaNodes(figmaJson);

    if (
      figmaJson.nodes[nodeId].document.absoluteBoundingBox.x !== 0 ||
      figmaJson.nodes[nodeId].document.absoluteBoundingBox.y !== 0
    ) {
      const differentX = figmaJson.nodes[nodeId].document.absoluteBoundingBox.x;
      const differentY = figmaJson.nodes[nodeId].document.absoluteBoundingBox.y;

      for (let i = 0; i < flattenFigmaData.length; i++) {
        flattenFigmaData[i].absoluteBoundingBox.x -= differentX;
        flattenFigmaData[i].absoluteBoundingBox.y -= differentY;
      }
    }

    const figmaImage = sharp(figmaPngBuffer[0]);
    const { width: figmaWidth, height: figmaHeight } =
      await figmaImage.metadata();

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(tabUrl, { waitUntil: "networkidle2" });
    await page.setViewport({
      width: figmaWidth as number,
      height: figmaHeight as number,
    });

    await wait(1000);

    updateProgress(30, "분석 준비중입니다");

    const screenshotBuffer = await page.screenshot({ type: "png" });

    await browser.close();

    const figmaImageRaw = await sharp(figmaPngBuffer[0])
      .raw()
      .toColourspace("srgb")
      .ensureAlpha()
      .toBuffer({ resolveWithObject: true });

    const screenshotImageRaw = await sharp(screenshotBuffer)
      .raw()
      .toColourspace("srgb")
      .ensureAlpha()
      .toBuffer({ resolveWithObject: true });

    const { info: figmaImageInfo } = figmaImageRaw;
    const { info: screenshotImageInfo } = screenshotImageRaw;

    if (
      figmaImageInfo.width !== screenshotImageInfo.width ||
      figmaImageInfo.height !== screenshotImageInfo.height
    ) {
      throw new Error("Images have different dimensions");
    }

    const reSizeScreenShotPngArray = new Uint8ClampedArray(
      screenshotImageRaw.data,
    );
    const reSizeFigmaPngArray = new Uint8ClampedArray(figmaImageRaw.data);

    const workerPath = path.resolve(__dirname, "worker.js");
    const NUM_WORKERS = 4;

    updateProgress(40, "분석 준비중입니다");

    const { differentFigmaNodes, diffPixels }: WorkerResult = await new Promise(
      (resolve, reject) => {
        if (isMainThread) {
          const diffNodeChunks: Box[][] = [];
          const diffPixelChunks: { x: number; y: number }[][] = [];

          const totalPixels = figmaImageInfo.width * figmaImageInfo.height;
          const chunkSize = Math.ceil(totalPixels / NUM_WORKERS);
          let completedWorkers = 0;

          for (let i = 0; i < NUM_WORKERS; i++) {
            const start = i * chunkSize;
            const end = Math.min((i + 1) * chunkSize, totalPixels);

            const workerData = {
              path: path.resolve(
                __dirname,
                "findDifferentFigmaNodesPixelWorker.ts",
              ),
              flattenFigmaData,
              screenShotBuff: reSizeScreenShotPngArray,
              figmaBuff: reSizeFigmaPngArray,
              width: figmaWidth,
              start,
              end,
            };

            updateProgress(50 + i * 10, "다른 좌표를 찾고 있습니다!");

            const worker = new Worker(workerPath, { workerData });

            worker.on("message", ({ differentFigmaNodes, diffPixels }) => {
              diffNodeChunks.push(differentFigmaNodes);
              diffPixelChunks.push(diffPixels);

              completedWorkers++;

              if (completedWorkers === NUM_WORKERS) {
                const mergedDiffNodePixel = diffNodeChunks.flat();
                const mergedDiffPixels = diffPixelChunks.flat();
                worker.terminate();

                resolve({
                  differentFigmaNodes: mergedDiffNodePixel,
                  diffPixels: mergedDiffPixels,
                });
              }
            });

            worker.on("error", (err) => {
              console.error(`Worker encountered an error: ${err.message}`);
              reject(err);
            });

            worker.on("exit", (code) => {
              if (code !== 0) {
                console.error(`Worker stopped with exit code ${code}`);
                reject(new Error(`Worker stopped with exit code ${code}`));
              }
            });
          }
        }
      },
    );

    const square = Buffer.from(
      '<svg width="5" height="5"><rect width="5" height="5" fill="red" /></svg>',
    );

    const annotatedImage = await sharp(figmaPngBuffer[0])
      .composite(
        diffPixels.map((pixel) => ({
          input: square,
          top: Math.floor(pixel.y - 2.5),
          left: Math.floor(pixel.x - 2.5),
        })),
      )
      .png()
      .toBuffer();

    fs.writeFileSync("annotatedImage.png", annotatedImage);

    updateProgress(90, "다른 좌표를 찾고 있습니다!");

    let newNodeId = "";

    for (let i = 0; i < differentFigmaNodes.length; i++) {
      newNodeId += `${differentFigmaNodes[i].id},`;

      if (i === differentFigmaNodes.length - 1) {
        newNodeId = newNodeId.slice(0, -1);
      }
    }

    const imagesArray = await fetchFigmaPng(fileKey, newNodeId, accessToken);

    updateProgress(100, "분석 완료하였습니다!");

    res.status(200).send({
      figmaWidth,
      figmaHeight,
      imagesArray,
      screenshotBuffer,
      differentFigmaNodes,
    });
  } catch (err) {
    next(err);
  }
};

export default figmaDataController;
