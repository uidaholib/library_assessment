import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Auth from '@/components/Auth'
import auth from '../services/auth'

Vue.use(Router)

const routes = [
  {
    path: '/',
    name: 'auth',
    component: Auth
  }, {
    path: '/home',
    name: 'home',
    component: Home,
    beforeEnter: auth.requireAuth
  }
]

export default new Router({
  mode: 'history',
  routes
})
