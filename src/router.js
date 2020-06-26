import Vue from 'vue'
import Router from 'vue-router'

// import Login from './components/Login.vue'
const Login = () =>
    import ( /* webpackChunkName: "login_home_welcome" */ './components/Login.vue')
    // import Home from './components/Home.vue'
const Home = () =>
    import ( /* webpackChunkName: "login_home_welcome" */ './components/Home.vue')
    // import Welcome from './components/Welcome.vue'
const Welcome = () =>
    import ( /* webpackChunkName: "login_home_welcome" */ './components/Welcome.vue')

// import Users from './components/user/Users.vue'
const Users = () =>
    import ( /* webpackChunkName: "Users_Rights_Roles" */ './components/user/Users.vue')
    // import Rights from './components/power/Rights.vue'
const Rights = () =>
    import ( /* webpackChunkName: "Users_Rights_Roles" */ './components/power/Rights.vue')
    // import Roles from './components/power/Roles.vue'
const Roles = () =>
    import ( /* webpackChunkName: "Users_Rights_Roles" */ './components/power/Roles.vue')

// import Cate from './components/goods/Cate.vue'
const Cate = () =>
    import ( /* webpackChunkName: "Cate_Params" */ './components/goods/Cate.vue')
    // import Params from './components/goods/Params.vue'
const Params = () =>
    import ( /* webpackChunkName: "Cate_Params" */ './components/goods/Params.vue')

// import GoodsList from './components/goods/List.vue'
const GoodsList = () =>
    import ( /* webpackChunkName: "GoodsList_Add" */ './components/goods/List.vue')
    // import Add from './components/goods/Add.vue'
const Add = () =>
    import ( /* webpackChunkName: "GoodsList_Add" */ './components/goods/Add.vue')

// import Order from './components/order/Order.vue'
const Order = () =>
    import ( /* webpackChunkName: "Order_Report" */ './components/order/Order.vue')
    // import Report from './components/report/Report.vue'
const Report = () =>
    import ( /* webpackChunkName: "Order_Report" */ './components/report/Report.vue')

Vue.use(Router)

const router = new Router({
    routes: [
        { path: '/', redirect: '/login' },
        { path: '/login', component: Login },
        {
            // 路由导航守卫控制访问权限
            // 如果用户没有登陆，但是直接通过 URl访问需要权限的网页，需要重新导航到登录页面
            path: '/home',
            component: Home,
            // 将 home页面 重定向到 welcome组件，并将之作为子路由
            redirect: '/welcome',
            children: [
                { path: '/welcome', component: Welcome },
                // 用户路由
                { path: '/users', component: Users },
                // 权限路由
                { path: '/rights', component: Rights },
                // 角色路由
                { path: '/roles', component: Roles },
                // 商品分类路由
                { path: '/categories', component: Cate },
                // 分类参数路由
                { path: '/params', component: Params },
                // 商品列表展示路由
                { path: '/goods', component: GoodsList },
                // 添加商品路由
                { path: '/goods/add', component: Add },
                // 订单路由
                { path: '/orders', component: Order },
                // 报表路由
                { path: '/reports', component: Report }
            ]
        }
    ]
})

// 挂载路由导航守卫 beforeEach 接收回调函数
router.beforeEach((to, from, next) => {
    // to 将要访问的路径
    // from 代表从哪个路径跳转而来
    // next 是一个函数，表示放行
    //     next()  放行    next('/login')  强制跳转
    // 如果用户要访问登录页面，不需要验证，直接调用 next()进行放行
    if (to.path === '/login')
        return next()
            // 前面没有 return出去，说明用户访问了有权限的页面
            // 需要获取token，根据是否有 token，决定是否强制跳转到登录页
            // 有 token 证明是 登录状态，可以进行操作，没有 token 就说明未登录，发生跳转
    const tokenStr = window.sessionStorage.getItem('token') // 存储会话中的 token属性值
    if (!tokenStr)
        return next('/login') // 如果不存在 token ，直接强制跳转到 登录界面
    next() // 如果前面没有强制跳转到登录页面，说明存在token，予以放行
})

export default router