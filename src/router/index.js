import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const layout = () => import('../views/layout/index');

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      redirect: '/login'   
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/login/index')
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('../views/register/index')
    },
    {
      path: '/dashbord',
      component: layout,
      children: [{
        path: '/',
        name: 'Home',
        component: () => import('../views/dashbord/index')
      }]
    },
    {
      path: '/sign',
      component: layout,
      children: [{
        path: '/',
        name: 'Sign',
        component: () => import('../views/sys/sign/index')
      }]
    },
    {
      path: '/forum',
      component: layout,
      children: [{
        path: '/',
        name: 'Forum',
        component: () => import('../views/sys/forum/index')
      }]
    }
  ]
})
