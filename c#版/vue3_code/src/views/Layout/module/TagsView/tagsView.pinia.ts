import { defineStore } from "pinia";
import { ITag, TagViewType } from "./tagsView.type";
import { getHomeRotue } from "../../../../plugins/router/modules/default.routes";
import router from "../../../../plugins/router/router";
import { routePaths } from "../../../../plugins/router/paths";

const useTagsViewStore = defineStore("tagsviewstore", {
  state: () => {
    return {
      sidebarOpened: true,
      tagsViewList: [] as TagViewType[],
    };
  },
  actions: {
    //添加
    addTagsViewList(tag: TagViewType) {
      const isFind = this.tagsViewList.find((item) => {
        return tag.fullPath === item.fullPath;
      });
      if (!isFind) {
        this.tagsViewList.push(tag);
      }
    },
    // 删除tag
    removeTagsView(payload: ITag) {
      if (payload.type === "index") {
        this.tagsViewList.splice(payload.index, 1);
        if (this.tagsViewList.length == 1) {
          // FIX:这里nextTick内返回首页,否则无效
          nextTick(() => {
            router.push("/");
          });
        }
      } else if (payload.type === "other") {
        this.tagsViewList.splice(
          payload.index + 1,
          this.tagsViewList.length - payload.index + 1
        );
        this.tagsViewList.splice(0, payload.index);
        if (payload.index != 0) {
          //list第一位加入删除了的首页tag
          const homeInfo = getHomeRotue();
          this.tagsViewList.unshift({
            fullPath: "/",
            meta: {
              title: (homeInfo.meta?.title as string) || "",
              uuid: (homeInfo.meta?.uuid as string) || "",
            },
            name: homeInfo.path,
            path: homeInfo.path,
            title: (homeInfo.meta?.title as string) || "",
          });
        }
        router.push(this.tagsViewList[this.tagsViewList.length - 1].fullPath);
      } else if (payload.type === "right") {
        this.tagsViewList.splice(
          payload.index + 1,
          this.tagsViewList.length - payload.index + 1
        );
        router.push(this.tagsViewList[this.tagsViewList.length - 1].fullPath);
      } else if (payload.type === "all") {
        this.tagsViewList = [];
        router.push(routePaths.home.path);
      }
    },
  },
  persist: {
    storage: localStorage,
    paths: ["tagsViewList"],
  },
});

export default useTagsViewStore;
