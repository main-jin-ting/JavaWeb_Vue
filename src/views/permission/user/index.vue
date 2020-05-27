<template>
  <div class="app-container">
    <el-tabs type="border-card">
      <el-form :inline="true" :model="searchParam" class="demo-form-inline head-form">
          <el-form-item label="人员名称">
            <el-input clearable v-model="searchParam.name" size="small" placeholder="请输入人员名称"
                      style="width: 200px"/>
          </el-form-item>
          <el-form-item>
            <el-button :loading="tableLoading" @click="search" size="small" icon="el-icon-search" type="primary">搜索
            </el-button>
            <el-button @click="userInfo()" size="small" icon="el-icon-plus" type="primary">添加人员
            </el-button>
            <el-button icon="el-icon-date" @click="batchDel()" size="small" class="add">批量删除</el-button>
            <el-button icon="el-icon-setting" @click="batchCache()" size="small" class="add">重置缓存</el-button>
            <el-button @click="initSearchParam();search()" icon="el-icon-refresh-right"
                       type="primary" size="small"
                       style="background-color: #fff; border: 1px solid #ccc ; color: #666">清空
            </el-button>
          </el-form-item>
        </el-form>
        <el-table stripe ref="table" :height="tableHeight" v-loading="tableLoading"
                  :data="userList" border row-key="id">
          <el-table-column show-overflow-tooltip type="selection" align="center"/>
          <el-table-column show-overflow-tooltip prop="id" label="ID" align="center" width="80"/>
          <el-table-column show-overflow-tooltip prop="realname" label="姓名" align="center" width="120"/>
          <el-table-column show-overflow-tooltip prop="avatar" label="头像" align="center" width="80">
            <template slot-scope="{row}">
              <el-avatar :size="30" :src="row.avatar" @error="errorHandler">
                <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"/>
              </el-avatar>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="gender" label="性别" align="center" width="100">
            <template slot-scope="{row}">
              <el-tag v-if="row.gender === 1" type="" size="small">男</el-tag>
              <el-tag v-if="row.gender === 2" type="success" size="small">女</el-tag>
              <el-tag v-if="row.gender === 3" type="warning" size="small">保密</el-tag>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="levelName" label="职级" align="center" width="100 "/>
          <el-table-column show-overflow-tooltip prop="positionName" label="岗位" align="center" width="100"/>
          <el-table-column show-overflow-tooltip prop="deptName" label="部门" align="center" width="200"/>
          <el-table-column show-overflow-tooltip prop="mobile" label="手机号" align="center" width="120"/>
          <el-table-column show-overflow-tooltip prop="email" label="邮箱" align="center" width="180"/>
          <el-table-column show-overflow-tooltip prop="status" label="状态" align="center" width="120">
            <template slot-scope="{row}">
              {{ row.status === 1 ? '正常' : '禁用' }}
              <el-switch v-if="!isuser||btnFunc.some(btn=>btn=='status')" v-model="row.status" :active-value="1"
                         :inactive-value="2" size="small"
                         @change="setStatus(row)"/>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="sort" label="排序" align="center" width="100"/>
          <el-table-column show-overflow-tooltip prop="createUser" label="添加人" align="center" width="150"/>
          <el-table-column show-overflow-tooltip prop="createTime" label="添加时间" align="center" width="180"/>
          <el-table-column v-if="isuser||(btnFunc.filter(value=>value=='edit'||value=='drop').length>0)" label="操作" width="180" align="center" fixed="right">
            <template slot-scope="scoped">
              <el-row>
                <el-tooltip v-if="isuser||btnFunc.some(btn=>btn=='edit')" class="item" effect="dark" content="编辑" placement="bottom">
                  <el-button type="primary" size="mini" icon="el-icon-edit" @click="userInfo(scoped.row)"/>
                </el-tooltip>
                <el-tooltip v-if="!isuser||btnFunc.some(btn=>btn=='drop')" class="item" effect="dark" content="删除" placement="bottom">
                  <el-button :loading="delBtnLoading" type="danger" size="mini" class="el-icon-delete" @click="userDel(scoped.row)"/>
                </el-tooltip>
                <el-tooltip v-if="!isuser||btnFunc.some(btn=>btn=='resetPwd')" class="item" effect="dark" content="重置密码" placement="bottom">
                  <el-button :loading="resetPwdLoading" icon="el-icon-setting" type="primary" size="mini" class="reset" @click="resetPwd(scoped.row)">
                  </el-button>
                </el-tooltip>
                <el-tooltip v-if="!isuser||btnFunc.some(btn=>btn=='setRules')" class="item" effect="dark" content="独立权限" placement="bottom">
                  <el-button type="success" size="mini" icon="el-icon-share" @click="setPermission(scoped.row)">权限
                  </el-button>
                </el-tooltip>
              </el-row>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <div  class="page-current">
          <el-pagination
            background
            :current-page="currentPage"
            :page-size="pageSize"
            prev-text="上一页"
            next-text="下一页"
            layout="total, prev, pager, next, jumper"
            style="display: inline-block;"
            :total="count"
            @current-change="handlePageChange"/>
        </div>
    </el-tabs>

    <!-- 编辑表单 -->
    <el-dialog :close-on-press-escape="false" :close-on-click-modal="false" center :visible.sync="addDialogVisible" class="menu-dialog" :title="dialogTitle+'人员'">
      <editForm ref="editForm" :infoForm="infoForm" :levelList="levelList" :positionList="positionList" :roleList="roleList" :filterDeptList="filterDeptList" style="width: 100%" @submit="submit" @closeWin="closeWin"></editForm>
    </el-dialog>

    <!-- 权限设置表单 -->
    <el-dialog :close-on-press-escape="false" :close-on-click-modal="false" :center="true" v-loading="treeLoading" class="menu-dialog" :visible.sync="menuVisible" title="设置权限">
      <permissionForm ref="treeForm" :infoForm="infoForm" :checkedKeys="checkedKeys" :menuList="menuList" style="width: 100%" @submit="submit" @closeWin="closeWin"/>
    </el-dialog>

  </div>
</template>

<script>
  import userApi from '@/api/permission/user'
  import menuApi from '@/api/permission/menu'
  import editForm from './edit'
  import permissionForm from './rules'

  export default {
    name: "user",
    data() {
      return {
        tableLoading: false,
        // 当前页
        currentPage: 1,
        // 总条数
        count: 0,
        // 每页条数
        pageSize: 10,
        // 显示编辑角色弹框
        addBtnLoading: false,
        addDialogVisible: false,
        delBtnLoading: false,
        resetPwdLoading: false,
        // 搜索
        status: [{
          value: 1,
          label: '正常'
        }, {
          value: 2,
          label: '禁用'
        }],
        searchParam: {
          name: '',
        },
        userList: [],
        levelList: [],
        positionList: [],
        deptList: [],
        roleList: [],
        infoForm: {
          realname: '',
          gender: 1,
          status: 1,
          sort: 125,
          roleIds: [],
        },
        loading: false,
        tableHeight: document.body.clientHeight - 245,
        btnFunc: [],
        isuser: false,
        dialogTitle: "添加",
        menuVisible: false,
        treeLoading: false,
        menuList: [],
        checkedKeys: [],
        filterDeptList: [],
      }
    },
    components: {editForm,permissionForm},
    created() {
      const {btnFunc, isAdmin} = this.$store.state.user
      this.btnFunc = btnFunc
      this.isAdmin = isAdmin
      this.pageSize = parseInt((document.body.clientHeight - 344) / 50)
    },
    mounted() {
      // 开启加载动画
      this.tableLoading = true
      // 获取数据列表
      this.getUserList()
      // 获取基础数据
      this.queryData()
    },
    watch: {
    },
    methods: {
      // 图片加载失败处理
      errorHandler() {
        return true
      },
      // 异步获取数据
      async queryData(){
        // 获取职级
        await this.getLevelList()
        // 获取岗位
        await this.getPositionList()
        // 获取角色
        await this.getRoleList()
        // 获取部门
        await this.getDeptList()
      },
      // 初始化搜索条件
      initSearchParam() {
        this.searchParam = {
          name: '',
        }
      },
      // 获取数据列表
      getUserList() {
        let searchParam = JSON.parse(JSON.stringify(this.searchParam))
        searchParam.pageIndex = this.currentPage
        searchParam.pageSize = this.pageSize
        userApi.userList(searchParam).then(res => {
          this.userList = res.data.records
          this.count = res.data.total
          this.tableLoading = false
        }).catch(e => {
          this.userList = []
          this.tableLoading = false
        })
      },
      // 获取编辑数据
      userInfo(data){
        // 初始化表单
        this.initInfoForm()
        // 显示弹窗
        this.addDialogVisible=true
        // 设置标题
        if (data == null) {
          this.dialogTitle = "添加";
        } else {
        this.dialogTitle = "编辑";
        }
        this.$nextTick(function () {
          try {
            userApi.userInfo({id: data.id}).then(res => {
              let infoForm = JSON.parse(JSON.stringify(res.data))
              if (!infoForm.roleIds) {
                infoForm.roleIds = []
              } else {
                infoForm.roleIds = infoForm.roleIds.split(',')
              }
              this.infoForm = Object.assign({}, infoForm)
              this.$refs.editForm.$refs['infoForm'].resetFields()
            }).catch(e => {
            })
          } catch (e) {

          }
        })
      },
      // 初始化表单
      initInfoForm() {
        this.infoForm = {
          realname: '',
          gender: 1,
          status: 1,
          sort: 125,
          roleIds: [],
        }
      },
      // 删除记录
      userDel(data) {
        this.$confirm('您确定要删除人员吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.delBtnLoading = true
          userApi.userDel({id: data.id}).then(res => {
            this.$message({
              type: 'success',
              message: '删除成功！'
            })
            this.delBtnLoading = false
            this.tableLoading = true
            this.getUserList()
          }).catch(e => {
            this.delBtnLoading = false
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      // 重置密码
      resetPwd(data) {
        this.$confirm('确定要重置密码吗', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.resetPwdLoading = true
          userApi.userResetPwd({id: data.id}).then(res => {
            this.resetPwdLoading = false
            this.$message({
              type: 'success',
              message: '重置密码成功！'
            })
          }).catch(e => {
            this.resetPwdLoading = false
          })
        })
      },
      // 设置权限
      setPermission(data){
        let me = this
        me.checkedKeys = data.rulesList ? data.rulesList : []
        this.menuVisible = true
        this.$nextTick(function () {
          me.$refs.treeForm.$refs['treeForm'].setCheckedKeys(me.checkedKeys);
          me.infoForm = JSON.parse(JSON.stringify(data))
          if (me.menuList.length == 0) {
            me.queryMenuList()
          }
        })
      },
      queryMenuList() {
        // 设置分页
        menuApi.menuList({name:""}).then(res => {
          this.menuList = res.data ? res.data : []
          this.treeLoading = false
        }).catch(e => {
          this.menuList = []
          this.treeLoading = false
        })
      },
      // 设置状态
      setStatus(data) {
        var content = ''
        if (data.status === 1) {
          content = '确定要启用吗？'
        } else {
          content = '确定要禁用吗？'
        }
        this.$confirm(content, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params = {
            status: data.status,
            id: data.id
          }
          this.tableLoading = true
          userApi.userStatus(params).then(res => {
            this.$message({
              type: 'success',
              message: '操作成功！'
            })
            this.getUserList()
          }).catch(e => {
            let userList = JSON.parse(JSON.stringify(this.userList))
            for (let i = 0; i < userList.length; i++) {
              if (userList[i].id == data.id) {
                userList[i].status = data.status == 1 ? 2 : 1
              }
            }
            this.userList = Object.assign([], userList)
            this.tableLoading = false
          })
        }).catch(() => {
          let userList = JSON.parse(JSON.stringify(this.userList))
          for (let i = 0; i < userList.length; i++) {
            if (userList[i].id == data.id) {
              userList[i].status = data.status == 1 ? 2 : 1
            }
          }
          this.userList = Object.assign([], userList)
          this.$message({
            type: 'info',
            message: '已取消该操作！'
          })
        })
      },
      // 获取职级
      getLevelList() {
        userApi.getLevelList().then(res => {
          this.levelList = res.data ? res.data : []
        }).catch(e => {
          this.levelList = []
        })
      },
      // 获取岗位
      getPositionList() {
        userApi.getPositionList().then(res => {
          this.positionList = res.data ? res.data : []
        }).catch(e => {
          this.positionList = []
        })
      },
      // 获取角色列表
      getRoleList() {
        userApi.getRoleList().then(res => {
          this.roleList = res.data ? res.data : []
        }).catch(e => {
          this.roleList = []
        })
      },
      // 获取栏目列表
      getDeptList() {
        userApi.getDeptList().then(res => {
          this.deptList = res.data
          this.initFilterList()
        }).catch(e => {
          this.deptList = []
        })
      },
      initFilterList(id) {
        let filerList = JSON.parse(JSON.stringify(this.deptList))
        this.findFilterList(filerList, id)
        this.filterDeptList = filerList
      },
      findFilterList(list, id) {
        for (let i = list.length - 1; i >= 0; i--) {
          if (list[i].id == id) {
            list.splice(i, 1)
          } else {
            if (list[i].children && list[i].children.length > 0) {
              this.findFilterList(list[i].children)
            }
          }
        }
      },
      handlePageChange(val) {
        this.currentPage = val
        this.tableLoading = true
        this.$refs.table.bodyWrapper.scrollTop = 0;
        this.getUserList()
      },
      // 搜索
      search() {
        this.currentPage = 1
        this.tableLoading = true
        this.$refs.table.bodyWrapper.scrollTop = 0;
        this.getUserList()
      },
      // 提交表单后逻辑处理
      submit(type) {
        if (type == 0) {
          // 添加
          this.search()
        }  else if (type == 1) {
          // 编辑
          this.tableLoading=true
          this.getUserList()
          this.$refs.table.bodyWrapper.scrollTop = 0;
          this.addDialogVisible = false
        } else if (type == 2) {
          // 设置权限
          this.menuVisible = false
          this.tableLoading = true
          this.getUserList()
        }
      },
      // 关闭窗体
      closeWin() {
        console.log("关闭")
        // 调用初始化表单方法
        this.initInfoForm()
        // 设置弹窗不可见
        this.addDialogVisible = false
        // 权限设置弹窗不可见
        this.menuVisible = false
      },
      // 权限
      setPermission(data) {
        let me = this
        me.checkedKeys = data.rulesList ? data.rulesList : []
        this.menuVisible = true
        this.$nextTick(function () {
          me.$refs.treeForm.$refs['treeForm'].setCheckedKeys(me.checkedKeys);
          me.infoForm = JSON.parse(JSON.stringify(data))
          if (me.menuList.length == 0) {
            me.queryMenuList()
          }
        })
      },
      queryMenuList() {
        // 设置分页
        menuApi.menuList({name:""}).then(res => {
          this.menuList = res.data ? res.data : []
          this.treeLoading = false
        }).catch(e => {
          this.menuList = []
          this.treeLoading = false
        })
      },
    }
  }
</script>

<style lang="less">
  .app-container {
    width: 100%;

    .menu-dialog {
      .el-dialog__body {
        padding: 10px 10px;
        height: 500px;
        overflow-y: auto;
      }
    }

    .page-current {
      text-align: center;
      padding: 15px 5px;
      padding-bottom: 0px;

      .sure-page-btn {
        display: inline-block;
        height: 28px;
        line-height: 0;
        width: 46px;
        padding: 0;
        vertical-align: top;
      }
    }
  }

</style>
