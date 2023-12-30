import { RouteRecordRaw } from "vue-router";
import {
  DefaultEnmus,
  defaultRoutes,
  getDefaultRoutes,
} from "./modules/default.routes";
import { PerssionEnums, perssionRoutes } from "./modules/perssion.routes";

// 类型
const allEnum = {
  ...DefaultEnmus,
  ...PerssionEnums,
};

type RouterPathItem = {
  path: string;
  name: string;
};

type RouterPath = {
  [key in keyof typeof allEnum]: RouterPathItem;
};

// 处理
const allRoutes: RouteRecordRaw[] = [...defaultRoutes];

const routePaths = {} as RouterPath;
const routeCacheList: string[] = [];

// 递归获取路由信息
function getRouteInfo(
  routes_: RouteRecordRaw[],
  paths: RouterPath,
  prefix?: string
) {
  for (let i = 0; i < routes_.length; i++) {
    const item = routes_[i];
    const currentPath = prefix ? prefix + item.path : item.path;
    paths[item.name as any] = {
      path: currentPath,
      name: item.name,
    } as RouterPathItem;
    if (item.meta?.isCache) {
      // 如果设置了缓存进入缓存列表
      routeCacheList.push(item.name as string);
    }
    if (item.children && item.children.length >= 1) {
      // 有子路由继续添加
      const lastPrefix = currentPath == "/" ? currentPath : currentPath + "/";
      getRouteInfo(item.children, paths, lastPrefix); // 当前路径就是这些子路由的父路径也就是前缀了,为了拼接需要手动添加一个/
    }
  }
}
let tempRoutes = JSON.parse(JSON.stringify(getDefaultRoutes(perssionRoutes)));

getRouteInfo(tempRoutes, routePaths);

export { routePaths, allRoutes, routeCacheList };
