import express from "express";
import multer from "multer";

import figmaDataController from "../controllers/figmaData.controller";

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

router.post("/figma-data", upload.single("screenshot"), figmaDataController);

export default router;
