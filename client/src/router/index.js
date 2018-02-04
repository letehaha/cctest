import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/auth/Login'
import Signup from '@/components/auth/Signup'
import Calendar from '@/components/Calendar'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/signup',
      name: 'Signup',
      component: Signup
    },
    {
      path: '/',
      name: 'Calendar',
      component: Calendar
    }
  ]
})
