import { BASE_ROUTE, ROUTE_HANDLER } from "@libs/constant";
import { Express, RequestHandler, urlencoded, json } from "express";

export function defineRoutes(controllers: any, application: Express) {
  for (let i = 0; i < controllers.length; i++) {
    const controller = new controllers[i]();

    const routeHandlers: Map<
      keyof Express,
      Map<string, RequestHandler[]>
    > = Reflect.getMetadata(ROUTE_HANDLER, controller);

    const controllerPath: String = Reflect.getMetadata(
      BASE_ROUTE,
      controller.constructor
    );

    const methods = Array.from(routeHandlers.keys());

    for (let j = 0; j < methods.length; j++) {
      const method = methods[j];
      const routes = routeHandlers.get(method as keyof Express);

      if (routes) {
        const routeNames = Array.from(routes.keys());
        for (let k = 0; k < routeNames.length; k++) {
          const handlers = routes.get(routeNames[k]);
          if (handlers) {
            application[method as keyof Express](
              controllerPath + routeNames[k],
              urlencoded({ extended: true }),
              json(),
              handlers
            );
            logging.log(
              "loading route:",
              method,
              controllerPath + routeNames[k],
              handlers
            );
          }
        }
      }
    }
  }
}
