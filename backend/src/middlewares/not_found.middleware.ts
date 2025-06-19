import { Request, Response, NextFunction } from "express";

export function notFound(req: Request, res: Response, next: NextFunction) {
  const error = new Error("Not found");
  logging.warning(error);

  res.status(404).json({
    success: false,
    message: error.message,
  });
}
