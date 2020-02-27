import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const layout = () =>
    import ('../views/layout/index');

export default new Router({
    mode: "history",
    base: process.env.BASE_URL,
    routes: [{
            path: '/',
            redirect: '/login'
        },
        {
            path: '/login',
            name: 'Login',
            component: () =>
                import ('../views/login/index')
        },
        {
            path: '/register',
            name: 'Register',
            component: () =>
                import ('../views/register/index')
        },
        {
            path: '/dashbord',
            component: layout,
            children: [{
                path: '/',
                name: 'Home',
                component: () =>
                    import ('../views/dashbord/index')
            }]
        },
        {
            path: '/sign',
            component: layout,
            children: [{
                path: '/',
                name: 'Sign',
                component: () =>
                    import ('../views/sys/sign/index')
            }]
        },
        {
            path: '/experience',
            component: layout,
            children: [{
                path: '/',
                name: 'Experience',
                component: () =>
                    import ('../views/sys/experience/index')
            }]
        },
        {
            path: '/exdetail',
            component: layout,
            children: [{
                path: '/',
                name: 'ExperienceDetail',
                component: () =>
                    import ('../views/sys/experience/detail/index')
            }]
        },
        {
            path: '/file',
            component: layout,
            children: [{
                path: '/',
                name: 'File',
                component: () =>
                    import ('../views/sys/file/index')
            }]
        },
        {
            path: '/knowledge',
            component: layout,
            children: [{
                path: '/',
                name: "Knowledge",
                component: () =>
                    import ('../views/sys/knowledge/index')
            }]
        },
        {
            path: '/addKnowledge',
            component: layout,
            children: [{
                path: '/',
                name: "AddKnowledge",
                component: () =>
                    import ('../views/sys/knowledge/add/index')
            }]
        },
        {
            path: '/knDetail',
            component: layout,
            children: [{
                path: '/',
                name: "knDetail",
                component: () =>
                    import ('../views/sys/knowledge/detail/index')
            }]
        }
    ]
})