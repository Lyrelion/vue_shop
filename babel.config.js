// 项目发布阶段需要用到的 babel 插件
const prodPlugins = []
// 产品属于发布模式
if (process.env.NODE_ENV === 'production') {
  // 移除 console
  prodPlugins.push('transform-remove-console')
}

module.exports = {
  presets: ['@vue/app'],
  plugins: [
    [
      'component',
      {
        libraryName: 'element-ui',
        styleLibraryName: 'theme-chalk'
      }
    ],
    // 发布产品时候的插件数组
    ...prodPlugins,
    // 路由懒加载
    '@babel/plugin-syntax-dynamic-import'
  ]
}
