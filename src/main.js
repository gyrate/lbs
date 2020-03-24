import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import * as Element from 'element-ui'
// import VueCodemirror from 'vue-codemirror'

import filters from '@/filters/index'
import '@/assets/common.scss'
import '@/assets/element-font/index.css'

Object.keys(filters).forEach((key) => {
  Vue.filter(key, filters[key])
})

Vue.use(Element)

Vue.config.productionTip = false

// import 'codemirror/mode/javascript/javascript.js'
// import 'codemirror/mode/htmlmixed/htmlmixed.js'
// import 'codemirror/lib/codemirror.css'
// import 'codemirror/theme/duotone-light.css'
// Vue.use(VueCodemirror, {
//   options: {
//     tabSize: 4,
//     mode: 'htmlmixed',
//     theme: 'duotone-light',
//     lineNumbers: true,
//     line: true
//   }
// })

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
