// Vue & core libraries
import { createApp } from "vue";
import App from "/@/App.vue";
import store from "/@/store";

// Shared styles
import "finecss/dist/index.min.css";
import "/@/style.css";

createApp(App).use(store).mount("#app");
