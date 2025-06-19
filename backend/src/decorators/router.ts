import { RouteHandler } from "@libs/routes";
import { ROUTE_HANDLER } from "@libs/constant";
import { Express, RequestHandler } from "express";

export function Router(
  method: keyof Express,
  path: string = "",
  ...middleware: RequestHandler[]
) {
  return (target: any, key: string, descriptor: PropertyDescriptor) => {
    const route_path = `${path}`;
    const route_handlers: RouteHandler =
      Reflect.getMetadata(ROUTE_HANDLER, target) ?? new Map();

    if (!route_handlers.has(method)) {
      route_handlers.set(method, new Map());
    }

    route_handlers
      .get(method)
      ?.set(route_path, [...middleware, descriptor.value]);

    Reflect.defineMetadata(ROUTE_HANDLER, route_handlers, target);
  };
}
