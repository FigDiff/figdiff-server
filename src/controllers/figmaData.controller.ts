import { NextFunction, Request, Response } from "express";

import fetchFigmaJson from "../utils/fetchFigmaJson";
import fetchFigmaPng from "../utils/fetchFigmaPng";
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
    const { figmaUrl, accessToken } = req.body as {
      figmaUrl: string;
      accessToken: string;
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

    const screenshotFile = req.file as Express.Multer.File;
    const figmaJson = await fetchFigmaJson(fileKey, nodeId, accessToken);

    await fetchFigmaPng(fileKey, nodeId, accessToken);

    res.status(200).send({ figmaJson, screenshotFile });
  } catch (err) {
    next(err);
  }
};

export default figmaDataController;