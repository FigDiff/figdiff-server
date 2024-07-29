import express from "express";
import multer from "multer";
import multerS3 from "multer-s3";
import { S3Client } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";

import {
  getUserHistory,
  postUserHistory,
  deletePage,
  deleteTabUrl,
  deleteHistory,
} from "../controllers/history.controller";

const s3 = new S3Client({
  region: "ap-northeast-2",
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY as string,
    secretAccessKey: process.env.S3_SECRET as string,
  },
});

const upload = multer({
  storage: multerS3({
    s3,
    bucket: "figdiff",
    key: (req, file, cb) => {
      const uniqueKey = `${Date.now().toString()}-${uuidv4()}-${file.originalname}`;

      cb(null, uniqueKey);
    },
  }),
});

const router = express.Router();

router.get("/:userId", getUserHistory);
router.post("/:userId", upload.array("historyImages", 2), postUserHistory);
router.patch("/delete-page", deletePage);
router.patch("/delete-taburl", deleteTabUrl);
router.patch("/delete-history", deleteHistory);

export default router;
