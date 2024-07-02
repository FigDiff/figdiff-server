import createError from "http-errors";
import { Request, Response, NextFunction, Express } from "express";

const errorHandlerLoader = async (app: Express) => {
  app.use((req: Request, res: Response, next: NextFunction) => {
    next(createError(404));
  });

  app.use((err: createError.HttpError, req: Request, res: Response) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    res.status(err.status || 500);
    res.json({ message: "hello" });
  });
};

export default errorHandlerLoader;
