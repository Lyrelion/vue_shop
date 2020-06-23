module.exports = {
    root: true,
    env: {
        node: true
    },
    'extends': [
        'plugin:vue/essential',
        '@vue/standard'
    ],
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        // 禁用语法规则（eslint 方法前面需要加空格，太丑了，所以禁用）'space-before-function-paren': 0
        // 文件格式化：ctrl + alt + 反斜线\，用在诸如 login.vue 等文件上
        // .prettierrc：定义语法规则，注意这是 json格式文件
        'space-before-function-paren': 0
    },
    parserOptions: {
        parser: 'babel-eslint'
    }
}