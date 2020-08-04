import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import VueAxios from 'vue-axios'
import './plugins/element.js'
// import global style file
import './assets/css/global.css'
import ZkTable from 'vue-table-with-tree-grid'
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme
// import NProgress package including JS file and CSS file
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
// import fontawesome icons
import {
  library,
  dom
} from '@fortawesome/fontawesome-svg-core'
import {
  faUserSecret,
  faUserFriends,
  faCubes,
  faTasks,
  faStore,
  faChartLine,
  faPlusCircle
} from '@fortawesome/free-solid-svg-icons'
import {
  faFontAwesome
} from '@fortawesome/free-brands-svg-icons'
import {
  FontAwesomeIcon
} from '@fortawesome/vue-fontawesome'

library.add(faUserSecret, faFontAwesome, faUserFriends, faCubes, faTasks, faStore, faChartLine, faPlusCircle)
dom.watch()

// root request link
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
axios.defaults.timeout = 10000
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8'
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  NProgress.start()
  return config
})
axios.interceptors.response.use(config => {
  NProgress.done()
  return config
})
Vue.use(VueAxios, axios)
Vue.use(VueQuillEditor)
// Vue.prototype.$http = axios
Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.component('tree-table', ZkTable)
Vue.filter('dateFormat', function (rawDate) {
  const dateClass = new Date(rawDate)
  const year = dateClass.getFullYear()
  const month = (dateClass.getMonth() + 1 + '').padStart(2, '0')
  const day = (dateClass.getDate() + '').padStart(2, '0')
  const hour = (dateClass.getHours() + '').padStart(2, '0')
  const minute = (dateClass.getMinutes() + '').padStart(2, '0')
  const second = (dateClass.getSeconds() + '').padStart(2, '0')
  return `${month}-${day}-${year} ${hour}:${minute}:${second}`
})

Vue.config.productionTip = false

new Vue({
  router,
  axios,
  render: h => h(App)
}).$mount('#app')
