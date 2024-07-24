import { NextFunction, Request, Response } from "express";
import sharp from "sharp";
import puppeteer from "puppeteer";

import fetchFigmaJson from "../utils/fetchFigmaJson";
import fetchFigmaPng from "../utils/fetchFigmaPng";
import flattenFigmaNodes from "../utils/flattenFigmaNodes";
import wait from "../utils/wait";
import {
  FIGMA_FILE_KEY_INDEX,
  FIGMA_NODE_ID_INDEX,
} from "../constants/figmaUrlConstants";

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

    const screenshotBuffer = await page.screenshot({ type: "png" });

    await browser.close();

    res.status(200).send({
      figmaWidth,
      figmaHeight,
    });
  } catch (err) {
    next(err);
  }
};

export default figmaDataController;
