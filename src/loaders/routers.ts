import { Express } from "express";
import figmaDataRouter from "../routes/figmaData";
import progressSSE from "../routes/progressBarSSE";
import historyRouter from "../routes/history";

const routerLoader = async (app: Express) => {
  app.use("/", figmaDataRouter);
  app.use("/", progressSSE);
  app.use("/", historyRouter);
};

export default routerLoader;
