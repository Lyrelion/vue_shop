<template>
  <div class="login_container">
    <!-- 登录盒子 -->
    <div class="login_box">
      <!-- 头像 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="我的头像" />
      </div>
      <!-- 登录表单区域 -->
      <!-- 运行后报错，因为element是按需导入的
      需要在 plugins/element.js 导入需要的内容 import {……}from 'element-ui'
      然后通过 Vue.use(xxx)实现全局可用-->
      <!-- 数据绑定：:model="loginForm" -->
      <!-- 数据验证规则绑定：:rules="loginFormRules" -->
      <!-- ref="loginFormRef"：表单的实例对象，通过表单实例对象 调用表单方法，比如重置表单 -->
      <!-- resetFields：对整个表单进行重置，将所有字段值重置为初始值并移除校验结果 -->
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginFormRules"
        label-width="0px"
        class="login_form"
      >
        <!-- 用户名 -->
        <!-- 添加校验规则：prop="username" -->
        <el-form-item prop="username">
          <!-- prefix-icon：前置字符图标，在element官网上查看 -->
          <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            prefix-icon="iconfont icon-3702mima"
            type="password"
          ></el-input>
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 登录表单的数据绑定对象
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      // 表单的验证规则对象
      loginFormRules: {
        // 验证用户名是否合法
        username: [
          { required: true, message: '请输入登录名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        // 验证密码是否合法
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 点击重置按钮，重置登录表单
    resetLoginForm() {
      // console.log(this); // 这里的 this指向表单实例对象，里面有很多属性，refs就是其中之一
      // 表单实例对象loginFormRef 里包含了重置方法
      // 表单在重置后，自动清空提示文本，恢复默认用户名/用户密码
      this.$refs.loginFormRef.resetFields()
    },
    login() {
      // 表单实例方法中的验证规则：validate(布尔值，回调函数)
      // valid：布尔值，判断用户名密码是否符合规则
      // 向服务器发送请求之前，必须提前验证数据的合法性
      this.$refs.loginFormRef.validate(async (valid) => {
        // 如果不符合规则，直接返回
        if (!valid) return
        // 异步axios接收请求结果，并对结果进行解构 传送请求路径、请求参数
        const { data: res } = await this.$http.post('login', this.loginForm)
        if (res.meta.status !== 200) return this.$message.error('登录失败！')
        this.$message.success('登录成功')
        // 1. 将登录成功之后服务器传回来的的 token，保存到客户端的 sessionStorage 中
        //   1.1 项目中出了登录之外的其他API接口，必须在登录之后才能访问
        //   1.2 token 只应在当前网站打开期间生效，所以将 token 保存在 sessionStorage 中
        window.sessionStorage.setItem('token', res.data.token)
        // 2. 通过编程式导航跳转到后台主页，路由地址是 /home
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login_container {
  // 布局容器
  background-color: #2b4b6b;
  height: 100%;
}

.login_box {
  // 登录区大盒子 居中 圆角边框
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  .avatar_box {
    // less语法 头像区盒子
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    // 给盒子添加圆角
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    // 让盒子居中
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    img {
      // 让图片充满盒子，添加圆角
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
}

.login_form {
  // 表单区盒子
  position: absolute;
  // 让表单区整体贴近下边框
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  // 改成 css盒子，否则增加 padding会超出父盒子
  box-sizing: border-box;
}

.btns {
  // 按钮采用流式布局，右对齐
  display: flex;
  justify-content: flex-end;
}
</style>
