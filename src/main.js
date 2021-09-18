import Vue from 'vue/dist/vue.js';
import VueRouter from 'vue-router';
import app from "@/views/App";

Vue.use(VueRouter);

const router = new VueRouter({
  history: true,
  mode: 'history',
  routes: [
    //{ path: '/', name: 'app', component: app }
  ]
})

new Vue({
  el: '#app',
  render: h => h(App),
  router: router,
});


/*
import Vue from 'vue'
import App from './views/App.vue'

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
*/
