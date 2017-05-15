// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuex from 'vuex';
import VueLeaflet from './index'
// import '../node_modules/leaflet/dist/leaflet.css';

Vue.config.productionTip = false

Vue.use(Vuex);
const store = new Vuex.Store();
// Vue.use(VueLeaflet.plugin, store);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
