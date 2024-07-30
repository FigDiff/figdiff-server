import express from "express";

const router = express.Router();

let progress = 0;
let stage = "분석 준비중입니다";
let optionalData: Buffer | null = null;

router.get("/progress", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const sendProgress = () => {
    res.write(`data: ${JSON.stringify({ progress, stage, optionalData })}\n\n`);
  };

  const interval = setInterval(sendProgress, 1000);

  req.on("close", () => {
    clearInterval(interval);
    res.end();
  });
});

export const updateProgress = (
  newProgress: number,
  newStage: string,
  newOptionalData?: Buffer,
) => {
  progress = newProgress;
  stage = newStage;
  if (newOptionalData) {
    optionalData = newOptionalData;
  } else {
    optionalData = null;
  }
};

export default router;
