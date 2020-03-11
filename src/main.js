import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import store from './store'
import http from './utils/http'
import components from './components/components.js'
import '@/assets/css/global.css'
import VeLine from 'v-charts/lib/line.common'
import VeHistogram from 'v-charts/lib/histogram.common'

Vue.prototype.$axios = http

Vue.config.productionTip = false

Vue.use(components)
Vue.use(ElementUI, {
    size: 'small',
    zIndex: 3000
})
Vue.component(VeLine.name, VeLine)
Vue.component(VeHistogram.name, VeHistogram)

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
})