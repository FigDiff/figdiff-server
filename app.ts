import express, { Express } from "express";
import dotenv from "dotenv";

import appLoader from "./src/loaders";

dotenv.config();

const app: Express = express();

(async () => {
  await appLoader(app);
})();

export default app;
