import dotenv from "dotenv";

import express, { Express } from "express";

import appLoader from "./src/loaders";

dotenv.config();

const app: Express = express();

(async () => {
  await appLoader(app);
})();

export default app;
