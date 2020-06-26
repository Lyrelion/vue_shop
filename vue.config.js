// 该文件对项目的打包及发布过程 做自定义配置
// chainWebpack 自定义打包入口（链式）
// configWebpack 自定义打包入口（对象）
// 向外暴露配置项
module.exports = {
    chainWebpack: config => {
        // 发布模式
        // config.when(process.env.NODE_ENV === 'production'：判断当前所处模式
        config.when(process.env.NODE_ENV === 'production', config => {
            config // 下面是新增自己的打包入口文件
                .entry('app')
                .clear()
                .add('./src/main-prod.js') // 注意文件名

            // 排除某些文件，防止他们被打包造成文件过大的问题
            // 最后使用包 会直接去 windows查找并直接使用
            config.set('externals', {
                    vue: 'Vue',
                    'vue-router': 'VueRouter',
                    axios: 'axios',
                    lodash: '_',
                    echarts: 'echarts',
                    nprogress: 'NProgress',
                    'vue-quill-editor': 'VueQuillEditor'
                })
                // 首页内容定制：如果在发布模式 就把这玩意弄成 true
            config.plugin('html').tap(args => {
                args[0].isProd = true
                return args
            })
        })

        // 开发模式
        config.when(process.env.NODE_ENV === 'development', config => {
            config // 下面是新增自己的打包入口文件
                .entry('app')
                .clear()
                .add('./src/main-dev.js') // 注意文件名

            // 首页内容定制：如果在发布模式 就把这玩意弄成 false
            config.plugin('html').tap(args => {
                args[0].isProd = false
                return args
            })
        })
    }
}