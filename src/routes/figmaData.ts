import express from "express";

import figmaDataController from "../controllers/figmaData.controller";

const router = express.Router();

router.post("/figma-data", figmaDataController);

export default router;
