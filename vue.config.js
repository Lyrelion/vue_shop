// 该文件对项目的打包及发布过程 做自定义配置
// chainWebpack 自定义打包入口（链式）
// configWebpack 自定义打包入口（对象）
module.exports = {
  chainWebpack: config => {
    // 发布模式
    // entry找到默认的打包入口，调用clear则是删除默认的打包入口，add添加新的打包入口
    config.when(process.env.NODE_ENV === 'production', config => {
      config
        .entry('app')
        .clear()
        .add('./src/main-prod.js')

      // 使用 externals 设置排除项
      config.set('externals', {
        vue: 'Vue',
        'vue-router': 'VueRouter',
        axios: 'axios',
        lodash: '_',
        echarts: 'echarts',
        nprogress: 'NProgress',
        'vue-quill-editor': 'VueQuillEditor'
      })
      // 使用插件 首页内容定制：如果在发布模式 就把这玩意弄成 true
      config.plugin('html').tap(args => {
        // 添加参数isProd
        args[0].isProd = true
        return args
      })
    })

    // 开发模式
    config.when(process.env.NODE_ENV === 'development', config => {
      config
        .entry('app')
        .clear()
        .add('./src/main-dev.js')
      // 使用插件 首页内容定制：如果在发布模式 就把这玩意弄成 false
      config.plugin('html').tap(args => {
        // 添加参数isProd
        args[0].isProd = false
        return args
      })
    })
  }
}
