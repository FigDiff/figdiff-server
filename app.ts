import dotenv from "dotenv";

dotenv.config();

import express, { Express } from "express";

import appLoader from "./src/loaders";

const app: Express = express();

(async () => {
  await appLoader(app);
})();

export default app;
