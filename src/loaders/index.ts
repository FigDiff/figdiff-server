import { Express } from "express";

import expressLoader from "./express";
import routerLoader from "./routers";
import errorHandlerLoader from "./errorHandler";

const appLoader = async (app: Express) => {
  await expressLoader(app);
  await routerLoader(app);
  await errorHandlerLoader(app);
};

export default appLoader;
