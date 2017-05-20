// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueResource from 'vue-resource'
import Vuetify from 'vuetify'
 import store from './vuex/store'
import './assets/animate.css'

Vue.config.productionTip = false
Vue.use(VueResource);
Vue.use(Vuetify)


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
