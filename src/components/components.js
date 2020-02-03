import carousel from './carousel/index.vue'
import backtop from './backtop/index.vue'
import forum from './forum/index.vue'

export default {
    install:(Vue) => {
        Vue.component('o-carousel', carousel)
        Vue.component('o-backtop', backtop)
        Vue.component('o-forum', forum)
    }
}