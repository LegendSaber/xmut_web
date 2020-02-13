import carousel from './carousel/index.vue'
import backtop from './backtop/index.vue'

export default {
    install: (Vue) => {
        Vue.component('o-carousel', carousel)
        Vue.component('o-backtop', backtop)
    }
}