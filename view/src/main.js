import Vue from 'vue';
import layer from 'vue-layer';
import 'vue-layer/lib/vue-layer.css';
Vue.prototype.$layer = layer(Vue);

// import 'normalize.css/normalize.css'; // A modern alternative to CSS resets
// import 'element-ui/lib/theme-chalk/index.css';
import ElementUI from 'element-ui';
import locale from 'element-ui/lib/locale/lang/zh-CN'; // lang i18n
// // set ElementUI lang to EN

Vue.use(ElementUI, { locale });
import Contextmenu from 'vue-contextmenujs';
Vue.use(Contextmenu);
import '@/styles/index.scss'; // global css
// import Blob from '@/Excel/blob';
// import Export2Excel from '@/Excel/Export2Excel.js';
import App from './App';
import store from './store';
import router from './router';
// console.log('router: ', router);
// import particles from 'particles.js';
// Vue.use(particles);
// import VueParticles from 'vue-particles';
// Vue.use(VueParticles);
import '@/icons'; // icon
import '@/permission'; // permission control
// 注册全局指令
import directivePer from './directive/wp-per';
directivePer.install(Vue);
Vue.config.productionTip = false;

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
});
