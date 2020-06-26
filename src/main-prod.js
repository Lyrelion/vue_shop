// 发布模式入口文件
import Vue from 'vue'
import App from './App.vue'
import router from './router'
// 导入字体图标
import './assets/fonts/iconfont.css'
// 导入全局样式表
import './assets/css/global.css'
import TreeTable from 'vue-table-with-tree-grid'

// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'

// 导入 NProgress 包对应的JS和CSS
import NProgress from 'nprogress'

import axios from 'axios'
// 配置请求的跟路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
    // 在 request 拦截器中，展示进度条 NProgress.start()
axios.interceptors.request.use(config => {
        // console.log(config)
        NProgress.start()
        config.headers.Authorization = window.sessionStorage.getItem('token')
            // 在最后必须 return config
        return config
    })
    // 在 response 拦截器中，隐藏进度条 NProgress.done()
axios.interceptors.response.use(config => {
    NProgress.done()
    return config
})
Vue.prototype.$http = axios

Vue.config.productionTip = false

Vue.component('tree-table', TreeTable)
    // 将富文本编辑器，注册为全局可用的组件
Vue.use(VueQuillEditor)
    // 定义全局过滤器 每个组件都可以调用
Vue.filter('dateFormat', function(originVal) {
    const dt = new Date(originVal) // 接收后台传来的时间

    const y = dt.getFullYear()
        // padStart(2, '0')：字符串补充方法，总长度为几位，如果长度不足，用什么字符补充
    const m = (dt.getMonth() + 1 + '').padStart(2, '0')
    const d = (dt.getDate() + '').padStart(2, '0')

    const hh = (dt.getHours() + '').padStart(2, '0')
    const mm = (dt.getMinutes() + '').padStart(2, '0')
    const ss = (dt.getSeconds() + '').padStart(2, '0')

    // 模板字符串
    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')