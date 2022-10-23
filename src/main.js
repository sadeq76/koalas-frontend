//main styles
import "./assets/styles/reset.scss";
import "./assets/styles/icons.scss";
import "./assets/styles/components.scss";
import "./assets/styles/utilities.scss";
import "./assets/styles/animations.scss";

import { createApp } from "vue";
import App from "./App.vue";
import { createPinia } from "pinia";
import { router } from "./router/index.js";

//openlayers
import OpenLayersMap from 'vue3-openlayers'
import 'vue3-openlayers/dist/vue3-openlayers.css'

const app = createApp(App);
const pinia = createPinia();

app.use(router);
app.use(pinia);
app.use(OpenLayersMap)


app.mount("#app");

//resize app
const appDiv = document.getElementById("app").style;
appDiv.height = document.documentElement.clientHeight - 56 + "px";
window.addEventListener(
  "resize",
  () => (appDiv.height = document.documentElement.clientHeight - 56 + "px")
);
