import Vue from 'vue'
import Router from 'vue-router'

// 路由懒加载：当用户访问某路由时，才加载对应的组件
// 安装 @babel/plugin-systax-dynamic-import 包
// 在 babel.config.js 配置文件中 声明该插件
// 将路由改为 按需加载 的形式

// import Login from './components/Login.vue'
// import Home from './components/Home.vue'
// import Welcome from './components/Welcome.vue'
// import Users from './components/user/Users.vue'
// import Rights from './components/power/Rights.vue'
// import Roles from './components/power/Roles.vue'
// import Cate from './components/goods/Cate.vue'
// import Params from './components/goods/Params.vue'
// import GoodsList from './components/goods/List.vue'
// import Add from './components/goods/Add.vue'
// import Order from './components/order/Order.vue'
// import Report from './components/report/Report.vue'

const Login = () =>
  import(/* webpackChunkName: "login_home_welcome" */ './components/Login.vue')
const Home = () =>
  import(/* webpackChunkName: "login_home_welcome" */ './components/Home.vue')
const Welcome = () =>
  import(/* webpackChunkName: "login_home_welcome" */ './components/Welcome.vue')
const Users = () =>
  import(/* webpackChunkName: "Users_Rights_Roles" */ './components/user/Users.vue')
const Rights = () =>
  import(/* webpackChunkName: "Users_Rights_Roles" */ './components/power/Rights.vue')
const Roles = () =>
  import(/* webpackChunkName: "Users_Rights_Roles" */ './components/power/Roles.vue')
const Cate = () =>
  import(/* webpackChunkName: "Cate_Params" */ './components/goods/Cate.vue')
const Params = () =>
  import(/* webpackChunkName: "Cate_Params" */ './components/goods/Params.vue')
const GoodsList = () =>
  import(/* webpackChunkName: "GoodsList_Add" */ './components/goods/List.vue')
const Add = () =>
  import(/* webpackChunkName: "GoodsList_Add" */ './components/goods/Add.vue')
const Order = () =>
  import(/* webpackChunkName: "Order_Report" */ './components/order/Order.vue')
const Report = () =>
  import(/* webpackChunkName: "Order_Report" */ './components/report/Report.vue')

Vue.use(Router)

const router = new Router({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    {
      path: '/home',
      component: Home,
      redirect: '/welcome',
      children: [
        { path: '/welcome', component: Welcome },
        { path: '/users', component: Users },
        { path: '/rights', component: Rights },
        { path: '/roles', component: Roles },
        { path: '/categories', component: Cate },
        { path: '/params', component: Params },
        { path: '/goods', component: GoodsList },
        { path: '/goods/add', component: Add },
        { path: '/orders', component: Order },
        { path: '/reports', component: Report }
      ]
    }
  ]
})

// 如果用户没有登陆，直接通过 URl访问需要权限的网页，需要重新导航到登录页面

// 挂载路由导航守卫 beforeEach 接收回调函数
// to 将要访问的路径
// from 代表从哪个路径跳转而来
// next 是一个函数，表示放行
router.beforeEach((to, from, next) => {
  // 如果用户要访问登录页面，不需要验证，直接调用 next()进行放行
  if (to.path === '/login') { return next() }
  // 前面没有 return出去，说明用户访问了有权限的页面
  // 需要获取token，有 token 证明是 登录状态，可以进行操作，没有 token 就说明未登录，跳转至登录
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) { return next('/login') }
  // 如果前面没有强制跳转到登录页面，说明存在token，予以放行
  next()
})

export default router
