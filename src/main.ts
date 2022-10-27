import '@/assets/css/tailwind.css';
import '@/assets/css/index.css';
import 'vue3-virtual-scroller/dist/vue3-virtual-scroller.css';

import { Web3Provider } from '@ethersproject/providers';
import { BarChart, LineChart, PieChart } from 'echarts/charts';
import {
  GridComponent,
  LegendComponent,
  MarkLineComponent,
  MarkPointComponent,
  PolarComponent,
  TitleComponent,
  ToolboxComponent,
  TooltipComponent
} from 'echarts/components';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { createApp } from 'vue';
import VueVirtualScroller from 'vue3-virtual-scroller';

import blocknative from '@/plugins/blocknative';
import { registerGlobalComponents } from '@/plugins/components';
import registerDirectives from '@/plugins/directives';
import i18n from '@/plugins/i18n';
import mixins from '@/plugins/mixins';
import router from '@/plugins/router';
// import initSentry from '@/plugins/sentry';
import vueQuery from '@/plugins/vueQuery';
import Web3Plugin from '@/services/web3/web3.plugin';
import store from '@/store';

import Root from './Root';

echarts.use([
  TitleComponent,
  TooltipComponent,
  CanvasRenderer,
  LineChart,
  GridComponent,
  LegendComponent,
  ToolboxComponent,
  MarkPointComponent,
  MarkLineComponent,
  PieChart,
  PolarComponent,
  BarChart
]);

// install plugins while creating the app instance for Root
const app = createApp(Root)
  .use(i18n) // locales
  .use(router) // different pages based on route
  .use(store) // global state management
  .use(blocknative)
  .use(vueQuery)
  .use(Web3Plugin, Web3Provider) // wallet management
  .mixin(mixins)
  .use(VueVirtualScroller);

// tell vue to detect clicks outside of the app element
registerDirectives(app);
// import these components so they can be used anywhere in the app without having to be reimported every file
registerGlobalComponents(app);
// initSentry(app);

// mount the app instance into container element
app.mount('#app');

export default app;
