<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/logo.png" alt />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <!-- 左侧菜单折叠按钮 -->
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!-- 侧边栏菜单区域 注意在这里改变背景颜色 -->
        <!-- active-text-color="#409EFF"：修改选中的高亮颜色 -->
        <!-- unique-opened：是否只保持一个子菜单的展开 -->
        <!-- :collapse-transition="false"：取消动画效果 -->
        <!-- :default-active="activePath"：根据路由，点击高亮 -->
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409EFF"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="activePath"
        >
          <!-- 一级菜单 -->
          <!-- :index="item.id：这个是 element-UI规定的属性（要求字符串格式） -->
          <!-- 这个属性可以用来 指定路由规则 作为每个选项卡的唯一标识 -->
          <el-submenu :index="item.id + ''" v-for="item in menulist" :key="item.id">
            <!-- 一级菜单的模板区域 -->
            <template slot="title">
              <!-- 动态绑定图标 根据data()中声明的字体图标对象 和 菜单id 进行赋值 -->
              <i :class="iconsObj[item.id]"></i>
              <!-- 渲染文本 -->
              <span>{{item.authName}}</span>
            </template>

            <!-- 二级菜单 -->
            <!-- @click="saveNavState('/' + subItem.path)"：点击获取路由并保存到sessionstorage -->
            <el-menu-item
              :index="'/' + subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
              @click="saveNavState('/' + subItem.path)"
            >
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容主体 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      // 左侧菜单数据
      menulist: [],
      // 所有一级菜单对应的图标项对象
      iconsObj: {
        '125': 'iconfont icon-user',
        '103': 'iconfont icon-tijikongjian',
        '101': 'iconfont icon-shangpin',
        '102': 'iconfont icon-danju',
        '145': 'iconfont icon-baobiao'
      },
      // 是否折叠
      isCollapse: false,
      // 被激活的链接地址
      activePath: ''
    }
  },
  created() {
    // 在created阶段请求左侧菜单数据
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath') // 指定高亮
  },
  methods: {
    // 退出登录
    logout() {
      // 清空本地会话存储的令牌 token
      window.sessionStorage.clear()
      // 重定向到登录页
      this.$router.push('/login')
    },
    // 获取所有的菜单
    async getMenuList() {
      // 发送请求获取左侧菜单数据
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menulist = res.data
      // console.log(res)
    },
    // 点击按钮，切换菜单的折叠与展开
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    },
    // 保存链接的激活状态
    saveNavState(activePath) {
      // 保存到sessionstorage
      window.sessionStorage.setItem('activePath', activePath)
      // 对 menu中的 这个属性，进行重新赋值，就是根据路由决定高亮的属性
      this.activePath = activePath
    }
  }
}
</script>

<style lang="less" scoped>
// 此处的标签可以直接当作类名使用
.home-container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  // 头部采用flex布局，实现左右分离
  display: flex;
  justify-content: space-between;
  // 去除默认左内边距
  padding-left: 0;
  // 每一个模块纵向居中对齐
  align-items: center;
  color: #fff;
  font-size: 20px;
  div {
    // 左侧的div也要采取 flex布局
    display: flex;
    // 纵向居中对齐
    align-items: center;
    span {
      margin-left: 15px;
    }
    img {
      width: 20%;
    }
  }
}

.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: none;
  }
}

.el-main {
  background-color: #eaedf1;
}

.iconfont {
  margin-right: 10px;
}

.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  // 每个字母之间的间距
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>
