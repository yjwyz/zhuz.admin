import { defineStore } from "pinia";
import {
  menusApi,
  registerApi,
  setAvatarApi,
  userinfoApi,
} from "./perssion.api";
import { filterPerssionRoutes, getCacheList } from "./perssion.utils";
import { perssionRoutes } from "../../plugins/router/modules/perssion.routes";
import {
  defaultRoutes,
  getDefaultRoutes,
  getHomeRotue,
} from "../../plugins/router/modules/default.routes";
import { RouteRecordName, RouteRecordRaw } from "vue-router";
import router from "../../plugins/router/router";
import { routePaths } from "../../plugins/router/paths";
import { UserInfoApiRes } from "./perssion.type";
import { loginApi } from "../../views/Login/login.api";
import { LoginApiParam, RegisterApiParam } from "../../views/Login/login.type";

const userPerssionStore = defineStore("perssionStore", {
  state: () => {
    return {
      sidebarRouters: [] as RouteRecordRaw[],
      cacheRoutes: [] as RouteRecordName[],
      isInitRoutes: false,
      token: "",
      userinfo: {} as UserInfoApiRes,
    };
  },
  actions: {
    // 获取用户信息
    async getUserInfo() {
      const result = await userinfoApi();
      this.userinfo = result.data;
    },
    // 修改头像
    async setAvatar_(formData: FormData) {
      const result = await setAvatarApi(formData);
      this.userinfo.avatar = result.data;
    },
    // 登录
    async login(formData: LoginApiParam) {
      localStorage.clear();
      const result = await loginApi(formData);
      this.token = result.data;
      router.push(routePaths.home.path);
    },
    // 注册
    async register(formData: RegisterApiParam) {
      const result = await registerApi(formData);
      return result;
    },
    // 退出登录
    loginOut() {
      localStorage.clear();
      this.$reset();
      router.replace(routePaths.login.path);
    },
    // 初始化路由
    async initPerssionRoutes() {
      this.getUserInfo();
      const res = await menusApi();
      const filterRoutes = filterPerssionRoutes(res.data, perssionRoutes);
      let routes = defaultRoutes;
      if (filterRoutes.length) {
        routes = getDefaultRoutes(filterRoutes);
      }

      this.cacheRoutes = getCacheList(routes);

      this.sidebarRouters = filterRoutes;

      this.sidebarRouters.unshift(getHomeRotue());
      return routes;
    },
  },
  persist: {
    storage: localStorage,
    paths: ["token"],
  },
});

export default userPerssionStore;
