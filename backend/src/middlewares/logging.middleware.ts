import { Request, Response, NextFunction } from "express";

export function loggingHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  logging.info(
    `Incomming - METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}] - IP Proxy: [${req.ip}]`
  );

  res.on("finish", () => {
    logging.info(
      `Result - METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}] - IP Proxy: [${req.ip}] - STATUS: [${res.statusCode}]`
    );
  });

  next();
}
