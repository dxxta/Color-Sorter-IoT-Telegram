import "reflect-metadata";
import "@libs/logging";

import {
  PORT,
  testDBConnection,
  testBrokerConnection,
  testBotConnection,
  testSocketConnection,
} from "@libs/config";
import { defineRoutes } from "@modules/routes";
import { loggingHandler } from "@src/middlewares/logging.middleware";
import { notFound } from "@src/middlewares/not_found.middleware";
import { corsHandler } from "@src/middlewares/header.middleware";
import { defineConsumers } from "@modules/consumers";
import http from "http";
import express from "express";
import helmet from "helmet";

import MainController from "@controllers/main.controller";
import MainConsumer from "@consumers/main.consumer";
import { anyMessage } from "./listeners/messages/any.message";

export const Application = express();
export const HttpServer = http.createServer(Application);

export const Main = async (): Promise<void> => {
  try {
    logging.log("Logging & Configuration");
    logging.divider();

    Application.use(loggingHandler);
    Application.use(express.urlencoded({ extended: true }));
    Application.use(express.json());
    Application.use(corsHandler);
    Application.use(
      helmet({
        hidePoweredBy: true,
      })
    );

    logging.log("Check Database, Broker, Bot Connection");
    logging.divider();

    testDBConnection();
    testBotConnection();
    testBrokerConnection();
    testSocketConnection(HttpServer);

    logging.log("Define Controller Routing");
    logging.divider();

    defineRoutes([MainController], Application);
    defineConsumers([MainConsumer]);

    anyMessage();

    logging.log("Define Routing Error");
    logging.divider();

    Application.use(notFound);
    HttpServer.listen(PORT, () => {
      logging.log(`Server started on port ${PORT}`);
      logging.divider();
    });
  } catch (error) {
    logging.error(error);
  }
};

export const Shutdown = (callback: any) =>
  HttpServer && HttpServer.close(callback);

Main();
