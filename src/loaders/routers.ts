import { Express } from "express";
import indexRouter from "../routes/index";

const routerLoader = async (app: Express) => {
  app.use("/", indexRouter);
};

export default routerLoader;
