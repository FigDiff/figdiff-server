import logger from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Express } from "express";

const expressLoader = async (app: Express) => {
  app.use(
    cors({
      origin: process.env.CLIENT_URL,
      credentials: true,
    }),
  );
  app.use(logger("dev"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
};

export default expressLoader;
