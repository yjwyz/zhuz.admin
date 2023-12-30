import { defineStore } from "pinia";
import defaultSettings from "./settings.utils";
import { DefaultSettingsType } from "./settings.type";

const { sideTheme } = defaultSettings as unknown as DefaultSettingsType;

const useSettingsStore = defineStore("settingsstore", {
  state: () => ({
    title: "",
    sideTheme: sideTheme,
    isCollapse: false,
  }),
  actions: {},
  persist: {
    storage: localStorage,
    paths: ["isCollapse"],
  },
});

export default useSettingsStore;
