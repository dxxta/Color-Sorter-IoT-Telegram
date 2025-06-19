import { Key } from "@decorators/key";
import { Topic } from "@decorators/topic";

@Topic("default")
class MainConsumer {
  @Key("logs")
  async default(args: any) {
    try {
      const log = {
        timestamp: new Date().toISOString(),
        message: args.message?.toLowerCase(),
      };
      const edited_message = `warna ${log.message} terdeteksi pada ${log.timestamp}`;

      eventEmitter.emit("logs", edited_message);
      socket.emit("logs", edited_message);

      let receiver: any[] = [];
      const forwarder_length = await database.forwarder.count();
      for (let index = 0; index < forwarder_length; index++) {
        const forwarder = await database.forwarder.findFirst({
          where: {
            id: {
              notIn: receiver?.length > 0 ? receiver : undefined,
            },
            is_listen: true,
          },
          skip: index,
          take: 1,
        });
        if (!forwarder) break;

        if (
          forwarder.colors.length > 0 &&
          !forwarder.colors.includes(log.message)
        ) {
          continue;
        }

        // todo: store to database
        await database.logs.create({
          data: {
            color: log.message,
            forwarder_id: forwarder.id,
          },
        });

        // todo: send to telegram for forwarder

        await telegrambot.sendMessage(forwarder.telegram_id, edited_message);
        receiver.push(forwarder.id);

        // todo: add delay
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    } catch (error) {
      logging.warn(`failed to send`, error);
    }
  }
}

export default MainConsumer;
