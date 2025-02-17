/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from "@/plugins";
import { createApp } from "vue";
import { createPinia } from "pinia";
import { router } from "./routes";


// Components
import App from "./App.vue";

// Composables

const pinia = createPinia();
const app = createApp(App);

registerPlugins(app);

app.use(pinia);
app.use(router)
app.mount("#app");
