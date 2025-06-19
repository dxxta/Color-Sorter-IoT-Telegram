import { TOPIC_HANDLER } from "@libs/constant";

export function Topic(topic_name: string) {
  return (target: any) => {
    Reflect.defineMetadata(TOPIC_HANDLER, topic_name, target);
  };
}
