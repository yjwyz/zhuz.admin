import { RouteRecordRaw } from "vue-router";
import Layout from "../../../views/Layout/Layout.vue";

export const notFoundRoute = {
  path: "/:pathMatch(.*)*",
  name: "NotFound",
  component: () => import("../../../views/NotFound.vue"),
};

export const getHomeRotue = () => {
  return {
    path: "",
    name: "home",
    component: "" as any,
    meta: {
      title: "首页",
      uuid: "home_",
      icon: "home",
      affix: true,
      isCache: true,
    },
  } as RouteRecordRaw;
};

export function getDefaultRoutes(addRoutes: RouteRecordRaw[] = []) {
  let home = getHomeRotue();
  home.component = () => import("../../../views/Home/Home.vue");
  return [
    {
      path: "/",
      component: Layout,
      name: "layout",
      children: [home, ...addRoutes],
    },
    {
      path: "/login",
      name: "login",
      component: () => import("../../../views/Login/Login.vue"),
      meta: {
        isCache: true,
        title: "登录",
        affix: false,
        uuid: "login",
      },
    },
  ] as RouteRecordRaw[];
}

export const defaultRoutes: RouteRecordRaw[] = getDefaultRoutes();

export enum DefaultEnmus {
  home,
  login,
}
