import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import * as Element from 'element-ui'

import filters from '@/filters/index'
import '@/assets/common.scss'
import '@/assets/element-font/index.css'

Object.keys(filters).forEach((key) => {
  Vue.filter(key, filters[key])
})

Vue.use(Element)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
