// 开发模式入口文件
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入字体图标
import './assets/fonts/iconfont.css'
// 导入全局样式表
import './assets/css/global.css'
import TreeTable from 'vue-table-with-tree-grid'
// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
// 导入 NProgress
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import axios from 'axios'
// 配置请求的根路径
// 如果是发布环境，这里的路径就要改为服务器线上部署的地址
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 请求拦截器
axios.interceptors.request.use(config => {
  // console.log(config)
  // 添加进度条效果
  NProgress.start()
  // 每次请求发送之前，都要在请求头中加入token，从本地存储中获取
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
// 响应拦截器
axios.interceptors.response.use(config => {
  NProgress.done()
  return config
})
// 将 axios 挂载到vue原型上，这样全局都能通过 this.$http.xxx 引用
Vue.prototype.$http = axios
// 是否在控制台中提示当前位于开发/生产环境
Vue.config.productionTip = false

// 将树形组件，注册为全局可用的组件
Vue.component('tree-table', TreeTable)
// 将富文本编辑器，注册为全局可用的组件
Vue.use(VueQuillEditor)
// 全局过滤器，时间格式化处理
Vue.filter('dateFormat', function (originVal) {
  const dt = new Date(originVal)
  // padStart(2, '0')：字符串补充方法，总长度为几位，如果长度不足，用什么字符补充
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')
  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
