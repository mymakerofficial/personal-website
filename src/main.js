import Vue from 'vue/dist/vue.js';
import VueRouter from 'vue-router';
import router from './router';
import Vuex from 'vuex';
import createStore from './vuex';
import App from './App';

Vue.use(VueRouter);
Vue.use(Vuex);

const store = createStore();

window.vuestore = store;

Vue.config.productionTip = false


new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')
