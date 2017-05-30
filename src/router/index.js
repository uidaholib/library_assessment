import Vue from 'vue'
import Router from 'vue-router'
import auth from '../services/auth'
import Home from '@/components/Home'
import Login from '@/components/Login'
import Charts from '@/components/Charts'
import Tables from '@/components/Tables'
Vue.use(Router)

const scrollBehavior = (to, from, savedPosition) => {
  if (to.hash) {
    return {
      selector: to.hash
    }
  }
}

const routes = [
  // {
  //   path: '/',
  //   name: 'login',
  //   component: Login,
  //   beforeEnter: auth.checkAuth
  // },
  {
    path: '/',
    name: 'home',
    component: Home,
    // beforeEnter: auth.requireAuth
    beforeEnter: auth.checkLoginStatus
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

export default new Router({mode: 'history', scrollBehavior, routes})
