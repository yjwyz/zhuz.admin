import "vue-router";

declare module "vue-router" {
  interface RouteMeta {
    isCache?: boolean;
    uuid: string;
    title: string;
    hidden?: boolean;
    order_num?: number;
    icon?: string;
  }
}
