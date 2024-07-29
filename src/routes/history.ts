import express from "express";
import upload from "../utils/upload";

import {
  getUserHistory,
  postUserHistory,
  deletePage,
  deleteTabUrl,
  deleteHistory,
} from "../controllers/history.controller";

const router = express.Router();

router.get("/:userId", getUserHistory);
router.post("/:userId", upload.array("historyImages", 2), postUserHistory);
router.patch("/delete-page", deletePage);
router.patch("/delete-taburl", deleteTabUrl);
router.patch("/delete-history", deleteHistory);

export default router;
