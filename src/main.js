import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'
import './plugins/element.js'
import '@/styles/icons/iconfont.css'
import '@/styles/common.scss'
import '@/styles/normalize.css'
import '@/permission'
import '@/utils/directives'
import {loadding,updatePublic} from './utils/dialogUtils'
Vue.config.productionTip = false
Vue.use(Viewer)
Viewer.setDefaults({
  Options: { 'inline': true, 'button': true, 'navbar': true, 'title': true, 'toolbar': true, 'tooltip': true, 'movable': true, 'zoomable': true, 'rotatable': true, 'scalable': true, 'transition': true, 'fullscreen': true, 'keyboard': true, 'url': 'data-source' }
})

Vue.mixin(loadding)
Vue.mixin(updatePublic)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
