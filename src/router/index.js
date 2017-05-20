import Vue from 'vue'
import Router from 'vue-router'
import auth from '../services/auth'
import Home from '@/components/Home'
import Login from '@/components/Login'
import Charts from '@/components/Charts'
import Tables from '@/components/Tables'
Vue.use(Router)

const routes = [
  {
    path: '/',
    name: 'login',
    component: Login,
    beforeEnter: auth.checkAuth
  }, {
    path: '/home',
    name: 'home',
    component: Home,
    beforeEnter: auth.requireAuth
  },
  {
    path: '/charts',
    name: 'charts',
    component: Charts
    // beforeEnter: auth.requireAuth
  },
   {
    path: '/tables',
    name: 'tables',
    component: Tables
    // beforeEnter: auth.requireAuth
  }
]

export default new Router({mode: 'history', routes})
