import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import { allRoutes } from "./paths";
import usePerssionStore from "../../common/perssion/perssion.pinia";
import { notFoundRoute } from "./modules/default.routes";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

const routes: RouteRecordRaw[] = [...allRoutes];

const router = createRouter({
  routes,
  history: createWebHashHistory(),
});
const whiteList = ["/login"];
router.beforeEach(async (to, _, next) => {
  NProgress.start();
  const store = usePerssionStore();
  if (store.token) {
    if (to.path === "/login") {
      next({ path: "/" });
      NProgress.done();
    } else {
      if (!store.isInitRoutes) {
        // 有token 非登录
        const accessRoutes = await store.initPerssionRoutes();
        console.log(accessRoutes);

        accessRoutes.forEach((route) => {
          router.addRoute(route);
        });
        // Fix: 必须在此处加404,否则刷新会直接进入404
        router.addRoute(notFoundRoute);
        store.isInitRoutes = true;
        next({ ...to, replace: true }); //路由进行重定向放行
      } else {
        next();
      }
    }
  } else {
    // 没有token
    if (whiteList.indexOf(to.path) !== -1) {
      // 在免登录白名单，直接进入
      next();
    } else {
      next(`/login?redirect=${to.fullPath}`); // 否则全部重定向到登录页
      NProgress.done();
    }
  }
});

router.afterEach(() => {
  NProgress.done();
});

export default router;
