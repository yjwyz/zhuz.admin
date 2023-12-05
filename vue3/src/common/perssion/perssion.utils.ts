import { RouteRecordName, RouteRecordRaw } from "vue-router";
import { MenuApiRes } from "./perssion.type";

/**
 * 判断path是否为外链
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path: string) {
  return /^(https?:|mailto:|tel:)/.test(path);
}

/**
 * @description 筛选权限路由获取可用路由
 * @param {*} apiRoutes 接口路由数据
 * @param {*} perssionRoutes 前端路由 perssionRoutes 配置项
 * @returns {*}
 */
export function filterPerssionRoutes(
  apiRoutes: MenuApiRes[],
  perssionRoutes: RouteRecordRaw[]
) {
  const newRoutes: RouteRecordRaw[] = [];
  for (const perssionRoute of perssionRoutes) {
    if (perssionRoute.meta?.uuid && perssionRoute.meta?.uuid) {
      const item: RouteRecordRaw = {} as RouteRecordRaw;
      const croute = apiRoutes.find((v) => v.uuid == perssionRoute.meta?.uuid);
      if (croute) {
        item.component = perssionRoute.component;
        item.meta = perssionRoute.meta || {};
        item.meta.uuid = croute.uuid;
        item.meta.icon = croute.icon;
        item.meta.title = croute.menu_name;
        item.meta.isCache = croute.is_cache;
        item.meta.order_num = croute.order_num;
        item.meta.hidden = !croute.shown;
        item.name = perssionRoute.name;
        item.path = perssionRoute.path;
        if (perssionRoute.children && perssionRoute.children.length) {
          item.children = filterPerssionRoutes(
            apiRoutes,
            perssionRoute.children
          );
          item.children.sort((a, b) => {
            if (a.meta?.order_num && b.meta?.order_num) {
              return a.meta?.order_num - b.meta?.order_num;
            } else {
              return 0;
            }
          });
        }
        newRoutes.push(item);
      }
    }
  }
  newRoutes.sort((a, b) => {
    if (a.meta?.order_num && b.meta?.order_num) {
      return a.meta?.order_num - b.meta?.order_num;
    } else {
      return 0;
    }
  });
  return newRoutes;
}

/**
 * 获取当前路由中所有可缓存的name
 * @param routes 当前所有路由
 * @returns
 */
export function getCacheList(routes: RouteRecordRaw[]): RouteRecordName[] {
  const result: RouteRecordName[] = [];
  routes.forEach((route) => {
    if (route.meta?.isCache && route.name) {
      result.push(route.name);
    }
    if (route.children && route.children.length) {
      result.push(...getCacheList(route.children));
    }
  });
  return result;
}
