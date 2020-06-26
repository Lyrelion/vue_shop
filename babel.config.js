// 这是项目发布阶段需要用到的 babel 插件
// 下面代码的意思是发布阶段移除console,开发阶段不移除
const prodPlugins = []
if (process.env.NODE_ENV === 'production') { // 证明产品属于发布模式
    // 发布模式才需要移除 console，开发模式不需要
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