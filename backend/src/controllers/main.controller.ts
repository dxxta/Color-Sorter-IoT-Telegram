import { NextFunction, Request, Response } from "express";
import { Controller } from "@decorators/controller";
import { Router } from "@decorators/router";
import { responseWrapper } from "@libs/response";

@Controller()
class MainController {
  @Router("get", "/ping")
  getPing(req: Request, res: Response, next: NextFunction) {
    res.status(200).json(
      responseWrapper({
        success: true,
        message: "ping pong",
      })
    );
    return;
  }
  @Router("get", "/subscriber")
  async getSubscriber(req: Request, res: Response, next: NextFunction) {
    try {
      const skip: number = +(req.query.skip ?? 1) - 1;
      const take: number = +(req.query.take ?? 5);

      const [subscriber, subscriber_length] = await database.$transaction([
        database.forwarder.findMany({
          skip: skip * take,
          take,
        }),
        database.forwarder.count(),
      ]);

      if (!(subscriber_length > 0)) {
        res.status(404).json(
          responseWrapper({
            success: false,
            message: "Belum ada subscriber",
          })
        );
        return;
      }

      res.status(200).json(
        responseWrapper({
          success: true,
          result: subscriber,
          total: subscriber_length,
          pages: Math.ceil(subscriber_length / take),
        })
      );
    } catch (error) {
      next(error);
    }
  }
}

export default MainController;
