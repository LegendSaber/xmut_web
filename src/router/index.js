import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: "history",
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
      component: () => import('../views/layout/index'),
      children: [{
        path: '/',
        name: 'Home',
        component: () => import('../views/dashbord/index')
      }]
    }
  ]
})
