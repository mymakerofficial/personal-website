import Vue from 'vue/dist/vue.js';
import VueRouter from 'vue-router';
import router from './router';
import App from './App';

Vue.use(VueRouter);

Vue.config.productionTip = false


new Vue({
  render: h => h(App),
  router
}).$mount('#app')


/*
import Vue from 'vue'
import App from './views/Home.vue'

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
*/