import { createApp } from "vue";
// import "animate.css/animate.min.css";
import "./styles/index.scss";
import App from "./App.vue";
import pinia from "./plugins/pinia/pinia";
import router from "./plugins/router/router";
// svg
import "virtual:svg-icons-register";
import SvgIcon from "@/plugins/svgicon/svgicon.vue";

const app = createApp(App);
app.component("svg-icon", SvgIcon);
app.use(pinia).use(router).mount("#app");
