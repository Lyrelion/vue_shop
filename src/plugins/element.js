import Vue from 'vue'
// 进行elementui的按需导入
import {
  Button,
  Form,
  FormItem,
  Input,
  Message,
  Container,
  Header,
  Aside,
  Main,
  Menu,
  Submenu,
  MenuItem,
  Breadcrumb,
  BreadcrumbItem,
  Card,
  Row,
  Col,
  Table,
  TableColumn,
  Switch,
  Tooltip,
  Pagination,
  Dialog,
  MessageBox,
  Tag,
  Tree,
  Select,
  Option,
  Cascader,
  Alert,
  Tabs,
  TabPane,
  Steps,
  Step,
  CheckboxGroup,
  Checkbox,
  Upload
} from 'element-ui'
// 导入时间轴插件 这个插件在element-UI中没有
import Timeline from './timeline/index.js'
import TimelineItem from './timeline-item/index.js'
// 登录组件
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
// 主页布局组件
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
// 面包屑导航组件
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
// 卡片组件
Vue.use(Card)
// 栅格组件
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
// 开关组件
Vue.use(Switch)
// 悬浮提示组件
Vue.use(Tooltip)
// 分页组件
Vue.use(Pagination)
// 弹出框组件
Vue.use(Dialog)
Vue.use(Tag)
// 树形结构组件
Vue.use(Tree)
Vue.use(Select)
Vue.use(Option)
Vue.use(Cascader)
Vue.use(Alert)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Steps)
Vue.use(Step)
Vue.use(CheckboxGroup)
Vue.use(Checkbox)
Vue.use(Upload)
// 将时间轴插件注册为全局组件
Vue.use(Timeline)
Vue.use(TimelineItem)
// 全局挂载弹窗提示，可以通过 this.$message.xxx 使用，如 this.$message.error('登录失败')
Vue.prototype.$message = Message
// 确认取消提示框
Vue.prototype.$confirm = MessageBox.confirm
