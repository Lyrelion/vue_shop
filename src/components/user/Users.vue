<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <!-- 这两个放在栅格系统中 gutter：表示两个部分的分栏间隔 span：占得份数-->
      <el-row :gutter="20">
        <!-- 搜索占八分 -->
        <el-col :span="8">
          <!-- 给搜索框进行双向数据绑定 -->
          <!-- clearable：输入框多出一个x按钮 -->
          <!-- @clear="getUserList"：数据清空后会自动触发的事件（我们自定的，比如这里就是重新渲染列表） -->
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
            <!-- @click="getUserList"：点击按钮后，根据请求重新查询列表 -->
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <!-- 添加占四分 -->
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 用户列表区域 -->
      <!-- border：携带边框的表格，scripe：开启斑马纹效果 -->
      <el-table :data="userlist" border stripe>
        <!-- 给用户添加索引列 加一列 type="index"  -->
        <el-table-column type="index"></el-table-column>
        <!-- label指定列名、props指定接收后台参数的名字（数据源） -->
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <!-- 状态返回的是布尔值，无法直接在页面渲染，所以发生了数据结构改造 -->
        <!-- prop属性 和 作用域插槽 同时存在的情况下，props失效 -->
        <el-table-column label="状态">
          <!-- 作用于插槽：slot-scope="scope" -->
          <template slot-scope="scope">
            <!-- scope.row：拿到的是本行全部数据，这里只绑定 数据中的状态属性 -->
            <!-- <el-switch：switch开关 通过 v-model 将开关状态和自己的数据关联 -->
            <!-- 为了将开关状态保存到数据库，绑定了事件，传递参数就是本行作用域全部信息 -->
            <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <!-- 操作没有对应的数据源，所以去掉 props属性 -->
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <!-- 修改按钮 @click="showEditDialog(scope.row.id)"：点击弹出修改对话框 -->
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
            <!-- 删除按钮 -->
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.id)"></el-button>
            <!-- 分配角色按钮 effect="dark"：提示框颜色 placement="top"：提示框显示位置 :enterable="false"：鼠标离开后隐藏提示框-->
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <!-- @click="setRole(scope.row)"：点击后出现 分配角色对话框，把对应的角色id传入 -->
              <el-button type="warning" icon="el-icon-setting" size="mini" @click="setRole(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 Pagination分页 -->
      <!-- @size-change="handleSizeChange"：监听分页改变事件，@current-change="handleCurrentChange"：监听页码值 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[1, 2, 5, 10]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>

    <!-- 添加用户的对话框 -->
    <!-- :visible.sync="addDialogVisible"：控制对话框的显示和隐藏 -->
    <!-- @close="addDialogClosed"：对话框关闭之前要触发的事件，比如重置表单，防止提示信息依旧显示 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
      <!-- 内容主体区域 -->
      <!-- :model="addForm"：添加用户表单数据 :rules="addFormRules"：绑定验证规则 -->
      <!-- ref="addFormRef"：表示表单的引用，可以添加重置等方法 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
        <!-- prop="username"：是验证规则对应的属性 -->
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 对话框底部按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <!-- 点击取消按钮隐藏对话框，所以绑定这个值得改变 -->
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <!-- 点击确定 触发预校验事件 而不是直接提交 -->
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户的对话框 -->
    <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配角色的对话框 -->
    <el-dialog title="分配角色" :visible.sync="setRoleDialogVisible" width="50%" @close="setRoleDialogClosed">
      <div>
        <p>当前的用户：{{userInfo.username}}</p>
        <p>当前的角色：{{userInfo.role_name}}</p>
        <p>分配新角色：
          <!-- v-model="selectedRoleId"：双向绑定用户选择的值 -->
          <el-select v-model="selectedRoleId" placeholder="请选择">
            <!-- 遍历角色列表 每个item都是一个角色 获取每一项选择文本 把分配的角色id 绑到 data() -->
            <el-option v-for="item in rolesList" :key="item.id" :label="item.roleName" :value="item.id">
            </el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    // 验证邮箱的规则
    var checkEmail = (rule, value, cb) => {
      // 验证邮箱的正则表达式
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) {
        // 合法的邮箱
        return cb()
      }
      // 验证失败，抛出异常
      cb(new Error('请输入合法的邮箱'))
    }
    // 验证手机号的规则
    var checkMobile = (rule, value, cb) => {
      // 验证手机号的正则表达式
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法的手机号'))
    }

    return {
      // 获取用户列表的参数对象
      queryInfo: {
        query: '',
        // 当前的页数
        pagenum: 1,
        // 当前每页显示多少条数据
        pagesize: 2
      },
      // 定义用户列表
      userlist: [],
      // 定义总条数
      total: 0,
      // 控制添加用户对话框的显示与隐藏
      addDialogVisible: false,
      // 添加用户的表单数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 添加表单的验证规则对象
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '用户名的长度在3~10个字符之间',
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 15,
            message: '用户名的长度在6~15个字符之间',
            trigger: 'blur'
          }
        ],
        // validator:checkEmail 使用自定义校验规则
        // 在 data()中添加 箭头函数，就是所谓得自定义校验规则
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 控制修改用户对话框的显示与隐藏
      editDialogVisible: false,
      // 查询到的用户信息对象
      editForm: {},
      // 修改表单的验证规则对象
      editFormRules: {
        email: [
          { required: true, message: '请输入用户邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入用户手机', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 控制分配角色对话框的显示与隐藏
      setRoleDialogVisible: false,
      // 需要被分配角色的用户信息
      userInfo: {},
      // 所有角色的数据列表
      rolesList: [],
      // 已选中的角色Id值
      selectedRoleId: ''
    }
  },
  created() {
    // 初始化获得用户列表，在 method()中定义
    this.getUserList()
  },
  methods: {
    async getUserList() {
      // 发起 ajax请求，接收并重命名结果
      const { data: res } = await this.$http.get('users', {
        // 要传递的参数 params在 data()中定义
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取用户列表失败！')
      }
      // 控制台中打印 获取的结果
      console.log(res)
      // 没有 return出去，证明获取结果成功，给 用户列表、总条数赋值
      this.userlist = res.data.users
      this.total = res.data.total

    },
    // 监听 pagesize 改变的事件
    handleSizeChange(newSize) {
      // console.log(newSize)
      // 监听到视图层的分页数值改变 重新发送请求 渲染页面
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    // 监听 页码值 改变的事件
    handleCurrentChange(newPage) {
      console.log(newPage)
      // 监听到视图层的页码值改变 重新发送请求 渲染页面
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    // 监听 switch 开关状态的改变
    async userStateChanged(userinfo) {
      // 打印作用域插槽监听到的改变的用户信息
      console.log(userinfo)
      const { data: res } = await this.$http.put(
        // 转换为模板字符串，就可以动态绑定一些数据了
        `users/${userinfo.id}/state/${userinfo.mg_state}`
      )
      if (res.meta.status !== 200) {
        // 如果更新失败，就要取消用户做出的修改，就是取反，回归原来
        userinfo.mg_state = !userinfo.mg_state
        return this.$message.error('更新用户状态失败！')
      }
      this.$message.success('更新用户状态成功！')
    },
    // 监听添加用户对话框的关闭事件
    addDialogClosed() {
      // 重置表单，拿到表单的引用，调用重置方法
      this.$refs.addFormRef.resetFields()
    },
    // 点击按钮，添加新用户
    addUser() {
      // 拿到表单引用，添加预校验事件
      this.$refs.addFormRef.validate(async valid => {
        // 如果校验失败 直接打断程序
        if (!valid) 
            return
        // 如果校验通过，可以发起真正的添加用户的网络请求
        const { data: res } = await this.$http.post('users', this.addForm)
      
        if (res.meta.status !== 201) {
          this.$message.error('添加用户失败！')
        }

        this.$message.success('添加用户成功！')
        // 隐藏添加用户的对话框
        this.addDialogVisible = false
        // 重新获取用户列表数据
        this.getUserList()
      })
    },
    // 展示编辑用户的对话框
    async showEditDialog(id) { // 通过作用域插槽传来点击id
      // console.log(id)
      // 发送请求 动态添加路由 id ，获取结果并解构重命名
      const { data: res } = await this.$http.get('users/' + id)

      if (res.meta.status !== 200) {
        return this.$message.error('查询用户信息失败！')
      }
      // 没有报错，获取到的结果 添加到 数据模型中
      this.editForm = res.data
      // 点击修改按钮后，修改对话框变为可见
      this.editDialogVisible = true
    },
    // 监听修改用户对话框的关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 修改用户信息并提交
    editUserInfo() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) 
            return
        // 发起修改用户信息的数据请求
        const { data: res } = await this.$http.put(
          'users/' + this.editForm.id,
          {
            email: this.editForm.email,
            mobile: this.editForm.mobile
          }
        )

        if (res.meta.status !== 200) {
          return this.$message.error('更新用户信息失败！')
        }

        // 关闭对话框
        this.editDialogVisible = false
        // 刷新数据列表
        this.getUserList()
        // 提示修改成功
        this.$message.success('更新用户信息成功！')
      })
    },
    // 根据Id删除对应的用户信息
    async removeUserById(id) {
      
      // 弹框询问用户是否删除数据
      const confirmResult = await this.$confirm(
        '此操作将永久删除该用户, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
        // 这里必须捕获错误，否则点击取消按钮会报错
      ).catch(err => err)
      // $confirm：返回值是一个 promise，可以用 await/async进行优化
      // 如果用户确认删除，则返回值为字符串 confirm
      // 如果用户取消了删除，则返回值为字符串 cancel
      // console.log(confirmResult)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }

      const { data: res } = await this.$http.delete('users/' + id)

      if (res.meta.status !== 200) {
        return this.$message.error('删除用户失败！')
      }

      this.$message.success('删除用户成功！')
      // 删除成功后 要记得重新加载 新的用户列表
      this.getUserList()
    },
    // 展示分配角色的对话框
    async setRole(userInfo) {
      // 点击分配角色按钮的同时，获取到的用户信息，保存到data()中，给后面的对话框用
      this.userInfo = userInfo

      // 在展示对话框之前，获取所有角色的列表
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败！')
      }
      // 将获取到的数据结果，保存到 data()中给后面用 
      this.rolesList = res.data
      // 点击分配角色按钮后，将对话框状态转换为可见
      this.setRoleDialogVisible = true
    },
    // 点击确定按钮，分配角色
    async saveRoleInfo() {
      if (!this.selectedRoleId) {
        return this.$message.error('请选择要分配的角色！')
      }

      const { data: res } = await this.$http.put(
        `users/${this.userInfo.id}/role`,
        {
          rid: this.selectedRoleId
        }
      )

      if (res.meta.status !== 200) {
        return this.$message.error('更新角色失败！')
      }

      this.$message.success('更新角色成功！')
      // 刷新当前角色列表
      this.getUserList()
      // 隐藏当前弹出对话框
      this.setRoleDialogVisible = false
    },
    // 监听分配角色对话框的关闭事件，每次关闭后，都应重置一部分信息
    setRoleDialogClosed() {
      // 将用户选中的id进行清空
      this.selectedRoleId = ''
      // 将选中的用户信息进行清空
      this.userInfo = {}
    }
  }
}
</script>

<style lang="less" scoped>
</style>
