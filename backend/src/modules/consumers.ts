import { TOPIC_HANDLER, KEY_HANDLER } from "@libs/constant";

export async function defineConsumers(controllers: any) {
  for (let i = 0; i < controllers.length; i++) {
    const controller = new controllers[i]();
    const key_handlers = Reflect.getMetadata(KEY_HANDLER, controller);
    const topic: string = Reflect.getMetadata(
      TOPIC_HANDLER,
      controller.constructor
    );

    const keys: string[] = Array.from(key_handlers.keys());
    for (let j = 0; j < keys.length; j++) {
      const key = keys[j];
      const topic_name = `${topic}/${key}`;
      if (!key) return;

      const handler = key_handlers.get(key);
      broker.on("connect", () => {
        broker.subscribe(topic_name, (err) => {
          if (err) {
            logging.error("broker", err);
          }
        });

        broker.on("message", (topic, message) => {
          if (topic == topic_name) {
            handler({ message: message.toString(), topic: topic_name });
          }
        });
      });
      logging.log("listener", topic_name, handler, "loaded");
    }

    process.on("exit", () => {
      broker.end(() => {
        logging.log("broker successfully closed");
      });
    });
  }
}
