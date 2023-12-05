import { defineStore } from "pinia";

const useShareStore = defineStore("sharestore", {
  state: () => ({
    currentRoutePath: "",
    refreshNum: 0,
  }),
  actions: {
    refresh() {
      console.log("当前路由:", this.currentRoutePath);
      this.refreshNum = this.refreshNum + 1;
    },
  },
  persist: {
    storage: localStorage,
    paths: ["currentRoutePath"],
  },
});

export default useShareStore;
