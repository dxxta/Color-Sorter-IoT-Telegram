import { BASE_ROUTE } from "@libs/constant";

export function Controller(base_route: string = "") {
  return (target: any) => {
    Reflect.defineMetadata(BASE_ROUTE, base_route, target);
  };
}
