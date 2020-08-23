<template>
  <!-- 角色列表组件页面 -->
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加角色按钮区域 -->
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>

      <!-- 角色列表区域 -->
      <!-- row-key="id" 是新特性，如果是嵌套的数据，rowkey 是必须添加的属性 -->
      <el-table :data="rolelist" border stripe>
        <!-- 展开列 type="expand"-->
        <el-table-column type="expand">
          <!-- 三层 for循环，渲染不同等级的的权限信息 -->
          <!-- 采用栅栏系统 el-row-el-col 一行分两列，第一列包含一级权限（占5份），第二列包含二级三级权限（占19份） -->
          <!-- 在el-row 行中遍历 scope.row.children 拿到不同的权限等级-->
          <!-- 在 el-tag 标签中 渲染拿到的权限：{{item1.authName}} -->
          <template slot-scope="scope">
            <!-- 绑定属性数组，底部边框都有，顶部边框只有第一行有 -->
            <el-row
              :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']"
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <!-- closable：可以移除的小图标-->
                <el-tag closable @close="removeRightById(scope.row, item1.id)">{{item1.authName}}</el-tag>
                <!-- 给 tag后面添加小图标 element小图标 -->
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级和三级权限 -->
              <el-col :span="19">
                <el-row
                  :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']"
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(scope.row, item2.id)"
                    >{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      closable
                      @close="removeRightById(scope.row, item3.id)"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 type="index-->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
            <!-- @click="showSetRightDialog(scope.row)"：点击展开授予权限的对话框 -->
            <!-- scope.row：会获取整个一行的角色信息 -->
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-setting"
              @click="showSetRightDialog(scope.row)"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 分配权限的对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%"
      @close="setRightDialogClosed"
    >
      <!-- 树形控件 -->
      <!-- :data="rightslist"：树形控件的数据源 :props="treeProps"：树形控件的属性绑定对象 -->
      <!-- show-checkbox：是否展示复选框 -->
      <!-- node-key="id"：每个节点选中后，自动绑定的值 -->
      <!-- default-expand-all：展开所有树形节点，默认为 false -->
      <!-- :default-checked-keys="defKeys"：默认选中的选项，接收值是数组 -->
      <!-- 思路：在点击分配权限按钮的同时，将所有id的值获取过来，并绑定在默认选中的选项数组里 -->
      <!-- @close="setRightDialogClosed"：每次关闭对话框，都应该清空三级节点数组，防止数组不断累积 -->
      <!-- ref="treeRef"：给树形结构添加引用名字，这样就可以调用树形结构对象下面的方法 -->
      <el-tree
        :data="rightslist"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defKeys"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <!-- 点击确定后，向服务器端发送请求 -->
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 所有角色列表数据
      rolelist: [],
      // 控制分配权限对话框的显示与隐藏
      setRightDialogVisible: false,
      // 所有权限的数据
      rightslist: [],
      // 树形控件的属性绑定对象
      treeProps: {
        // 指定看到的每一个属性对应的值
        label: 'authName',
        // 父子级节点通过使用哪个节点实现嵌套
        children: 'children'
      },
      // 设置树形控件中默认选中的内容
      defKeys: [],
      // 保存正在操作的角色id
      roleId: ''
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    // 获取所有角色的列表
    async getRolesList() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败！')
      }
      this.rolelist = res.data
      console.log(this.rolelist)
    },

    // 根据Id删除对应的权限
    async removeRightById(role, rightId) {
      // 弹框提示用户是否要删除
      const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch((err) => err)

      if (confirmResult !== 'confirm') {
        return this.$message.info('取消了删除！')
      }

      const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)

      if (res.meta.status !== 200) {
        return this.$message.error('删除权限失败！')
      }
      // 这样重新渲染 会导致展开列合上，影响用户体验
      // this.getRolesList()
      // 为了避免展开列合上，应该只给角色的某个属性重新进行赋值
      role.children = res.data
    },

    // 展示分配权限的对话框
    async showSetRightDialog(role) {
      // 获取当前即将分配角色的id，保存在 data()中，供后面弹窗调用
      this.roleId = role.id
      // 获取所有权限的数据 此时获取的是树形结构
      const { data: res } = await this.$http.get('rights/tree')

      if (res.meta.status !== 200) {
        return this.$message.error('获取权限数据失败！')
      }

      // 把获取到的权限数据保存到 data 中
      this.rightslist = res.data
      console.log(this.rightslist)

      // 递归获取三级节点的Id（角色信息，存储三级节点的数组）
      this.getLeafKeys(role, this.defKeys)
      // 点击分配权限按钮，将弹出框绑定属性设置为可以展示
      this.setRightDialogVisible = true
    },
    // 通过递归的形式，获取角色下所有三级权限的id，并保存到 defKeys 数组中
    // node就相当于一个完整的角色，里面包含很多层节点，递归获取不同的节点
    getLeafKeys(node, arr) {
      // 如果当前 node 节点不包含 children 属性，则是三级节点
      if (!node.children) {
        // 把当前节点的id 添加到三级节点id数组中
        return arr.push(node.id)
      }
      // 节点有children属性，继续遍历节点children数组，取出每一项，递归调用该方法
      node.children.forEach((item) => this.getLeafKeys(item, arr))
    },
    // 监听分配权限对话框的关闭事件
    setRightDialogClosed() {
      // 每次关闭对话框，都应该清空三级节点数组，防止数组不断累积，造成重复渲染
      this.defKeys = []
    },
    // 点击为角色分配权限
    async allotRights() {
      // 树形结构对象方法
      // getCheckedKeys()：获取存储所有全选节点的id值 的数组
      // getHalfCheckedKeys()：获取存储所有半选节点的id值 的数组
      // 通过扩展运算符[...[数组],...[数组]]将两个数组合并为一个数组
      const keys = [...this.$refs.treeRef.getCheckedKeys(), ...this.$refs.treeRef.getHalfCheckedKeys()]
      // 将获得的id数组 转换为 以逗号分割的字符串
      const idStr = keys.join(',')

      const { data: res } = await this.$http.post(
        // 注意：我们在弹出对话框中是拿不到角色id的
        // 需要在点击分配角色按钮时获取即将被分配角色的id，并保存到 data()中
        // 这样后面弹窗对话框中就可以调用 data()中拿到的角色id
        `roles/${this.roleId}/rights`,
        { rids: idStr }
      )

      if (res.meta.status !== 200) {
        return this.$message.error('分配权限失败！')
      }

      this.$message.success('分配权限成功！')
      // 分配权限成功后，要重新刷新角色获取列表
      this.getRolesList()
      // 分配权限成功后，要隐藏分配权限弹出框
      this.setRightDialogVisible = false
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
// 给展开列添加上边框（只有第一行需要太那家顶边框）
.bdtop {
  border-top: 1px solid #eee;
}
// 给展开列添加下边框
.bdbottom {
  border-bottom: 1px solid #eee;
}
// 纵向居中对齐，用在展开列中的各个项居中展示
.vcenter {
  display: flex;
  align-items: center;
}
</style>
