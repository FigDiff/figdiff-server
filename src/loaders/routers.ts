import { Express } from "express";
import figmaDataRouter from "../routes/figmaData";

const routerLoader = async (app: Express) => {
  app.use("/", figmaDataRouter);
};

export default routerLoader;
