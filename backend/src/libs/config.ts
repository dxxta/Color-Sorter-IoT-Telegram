import { DefaultArgs } from "@prisma/client/runtime/library";
import { PrismaClient } from "@prisma/client";
import { connect, MqttClient } from "mqtt";
import { EventEmitter } from "stream";
import { DefaultEventsMap, Socket, Server as ServerSocket } from "socket.io";
import TelegramBot from "node-telegram-bot-api";
import dotenv from "dotenv";
import path from "node:path";

// todo: setup env
dotenv.config();
const DEVELOPMENT_PATH = "development";
const ENV_PATH = process.env.NODE_ENV;
const DEVELOPMENT = ENV_PATH === DEVELOPMENT_PATH;
const PORT = process.env.PORT ?? 8880;

if (DEVELOPMENT) {
  dotenv.config({ path: path.join(__dirname, ".env", `.${DEVELOPMENT_PATH}`) });
} else {
  dotenv.config({ path: path.join(__dirname, ".env", `.${ENV_PATH}`) });
}

// todo: setup databse
const prisma = new PrismaClient({ log: ["query"] });
const testDBConnection = async () => {
  try {
    await prisma.$connect();
    logging.info("successfully connected to database");
  } catch (error) {
    logging.error("database failed to connect");
    process.exit(1);
  }
};

// todo: setup broker
const mqtt = connect(process.env.BROKER_URL as string);
const testBrokerConnection = async () => {
  try {
    mqtt.on("connect", () => {
      logging.info("successfully connected to broker");
    });
  } catch (error) {
    logging.error("broker failed to connect");
    process.exit(1);
  }
};

// todo: setup bot
const bot = new TelegramBot(process.env.TELEGRAM_TOKEN as string, {
  polling: true,
});
const testBotConnection = async () => {
  try {
    if (!bot.isPolling()) throw new Error();
    logging.info("successfully connected to bot");
  } catch (error) {
    logging.error("bot failed to connect");
    process.exit(1);
  }
};

// todo: setup socket
const socket_clients = new Map<
  string,
  Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
>();

const testSocketConnection = async (httpServer: any) => {
  try {
    const io = new ServerSocket(httpServer, { cors: { origin: "*" } });
    io.on("connection", (socket) => {
      socket_clients.set(socket.id, socket);
      logging.info(`connected to client socket ${socket.id}`);
    });
    io.on("disconnect", () => {
      logging.info("user disconnected");
    });
    globalThis.socket = io;
  } catch (error) {
    logging.error("socket failed to connect");
    process.exit(1);
  }
};

// todo: setup global definition
declare global {
  var eventEmitter: EventEmitter;
  var broker: MqttClient;
  var socket: ServerSocket;
  var socketClients: typeof socket_clients;
  var telegrambot: TelegramBot;
  var database: PrismaClient<
    {
      log: "query"[];
    },
    never,
    DefaultArgs
  >;
}

// todo: setup link the local and global variable
globalThis.database = prisma;
globalThis.broker = mqtt;
globalThis.socketClients = socket_clients;
globalThis.telegrambot = bot;
globalThis.eventEmitter = new EventEmitter();

export {
  testSocketConnection,
  testDBConnection,
  testBrokerConnection,
  testBotConnection,
  DEVELOPMENT,
  PORT,
};
