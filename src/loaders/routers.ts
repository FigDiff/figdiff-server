import { Express } from "express";
import figmaDataRouter from "../routes/figmaData";
import progressSSE from "../routes/progressBarSSE";

const routerLoader = async (app: Express) => {
  app.use("/", figmaDataRouter);
  app.use("/", progressSSE);
};

export default routerLoader;
