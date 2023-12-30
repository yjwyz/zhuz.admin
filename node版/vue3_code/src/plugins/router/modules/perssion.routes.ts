import { RouteRecordRaw } from "vue-router";

export const perssionRoutes: RouteRecordRaw[] = [
  {
    path: "system",
    name: "system",
    component: () => import("@/views/System/System.vue"),
    redirect: "/system/menus",
    meta: {
      uuid: "system",
      title: "系统管理",
    },
    children: [
      {
        path: "users",
        name: "usermanage",
        component: () => import("@/views/System/User/User.vue"),
        meta: {
          icon: "setting",
          uuid: "systemusermana",
          title: "用户管理",
        },
      },
      {
        path: "menus",
        name: "menus",
        component: () => import("@/views/System/Menu/Menu.vue"),
        meta: {
          icon: "setting",
          uuid: "systemmenus",
          title: "菜单管理",
        },
      },
      {
        path: "rolemanage",
        name: "rolemanage",
        component: () => import("@/views/System/Role/Role.vue"),
        meta: {
          uuid: "systemcrolemanage",
          title: "角色管理",
        },
      },
    ],
  },
];

export enum PerssionEnums {
  menus,
  rolemanage,
  usermanage,
}
