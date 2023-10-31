import { createApp } from 'vue'
import '@codingame/monaco-vscode-language-pack-zh-hans'
import App from './App.vue'
import router from './router';
import Antd from 'ant-design-vue';

import { IonicVue } from '@ionic/vue';

import 'ant-design-vue/dist/reset.css';
/* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/core.css';
/* Basic CSS for apps built with Ionic */
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/vue/css/padding.css';
import '@ionic/vue/css/float-elements.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';
import '@ionic/vue/css/flex-utils.css';
import '@ionic/vue/css/display.css';

/* Theme variables */
import './theme/variables.css';

import './core/app'
import './core/styles/vscode-style-override.css'


const app = createApp(App)
  .use(IonicVue)
  .use(router)
  .use(Antd)

router.isReady().then(() => {
  app.mount('#app');
});