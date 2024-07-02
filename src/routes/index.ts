import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Boilerplate");
});

export default router;
