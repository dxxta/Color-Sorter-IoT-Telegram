import { KEY_HANDLER } from "@libs/constant";

export function Key(route_key: string = "default") {
  return (target: any, key: string, descriptor: PropertyDescriptor) => {
    const route_handlers =
      Reflect.getMetadata(KEY_HANDLER, target) ?? new Map();

    if (!route_handlers.has(route_key)) {
      route_handlers.set(route_key, descriptor.value);
    }

    Reflect.defineMetadata(KEY_HANDLER, route_handlers, target);
  };
}
