<template>
  <div class="form-container">
    <el-tabs type="border-card">
      <el-form :inline="true" :model="searchParam" class="demo-form-inline head-form">
          <el-form-item label="角色名称">
            <el-input clearable v-model="searchParam.name" size="small" placeholder="请输入角色名称"
                      style="width: 200px"/>
          </el-form-item>
          <el-form-item>
            <el-button :loading="tableLoading" @click="search" size="small" icon="el-icon-search" type="primary">搜索
            </el-button>
            <el-button @click="initSearchParam();search()" icon="el-icon-refresh-right"
                       type="primary" size="small"
                       style="background-color: #fff; border: 1px solid #ccc ; color: #666">清空
            </el-button>
          </el-form-item>
        </el-form>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button 
              @click="roleInfo()" 
              size="small" 
              icon="el-icon-plus" 
              type="primary"
            >新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="success"
              icon="el-icon-edit"
              size="small"
              :disabled="single"
              @click="roleInfo"
            >修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="small"
              :disabled="multiple"
              @click="roleDel"
            >删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="warning"
              icon="el-icon-download"
              size="small"
              @click="exportExcel()"
            >导出</el-button>
          </el-col>
        </el-row>
        <el-table stripe ref="table" :height="tableHeight" v-loading="tableLoading"
                  :data="roleList" border row-key="id" @selection-change="handleSelectionChange">
          <el-table-column show-overflow-tooltip type="selection" align="center"/>
          <el-table-column show-overflow-tooltip prop="id" label="ID" align="center" width="80"/>
          <el-table-column show-overflow-tooltip prop="name" label="名称" align="center"/>
          <el-table-column show-overflow-tooltip prop="status" label="状态" align="center" width="120">
            <template slot-scope="{row}">
              {{ row.status === 1 ? '正常' : '禁用' }}
              <el-switch v-if="!isAdmin||btnFunc.some(btn=>btn=='status')" v-model="row.status" :active-value="1"
                         :inactive-value="2" size="small"
                         @change="setStatus(row)"/>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="sort" label="排序" align="center" width="100"/>
          <el-table-column show-overflow-tooltip prop="createUser" label="添加人" align="center" width="150"/>
          <el-table-column show-overflow-tooltip prop="createTime" label="添加时间" align="center" width="180"/>
          <el-table-column show-overflow-tooltip prop="updateUser" label="更新人" align="center" width="150"/>
          <el-table-column show-overflow-tooltip prop="updateTime" label="更新时间" align="center" width="180"/>
          <el-table-column v-if="!isAdmin||(btnFunc.filter(value=>value=='edit'||value=='drop').length>0)" label="操作" width="150" align="center" fixed="right">
            <template slot-scope="scoped">
              <el-row>
                <el-tooltip v-if="!isAdmin||btnFunc.some(btn=>btn=='edit')" class="item" effect="dark" content="编辑" placement="bottom">
                  <el-button type="primary" size="mini" icon="el-icon-edit" @click="roleInfo(scoped.row)"/>
                </el-tooltip>
                <el-tooltip v-if="!isAdmin||btnFunc.some(btn=>btn=='drop')" class="item" effect="dark" content="删除" placement="bottom">
                  <el-button :loading="delBtnLoading" type="danger" size="mini" class="el-icon-delete" @click="roleDel(scoped.row)"/>
                </el-tooltip>
                <el-tooltip v-if="!isAdmin||btnFunc.some(btn=>btn=='setRules')" class="item" effect="dark" content="角色权限" placement="bottom">
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
    <el-dialog :close-on-press-escape="false" :close-on-click-modal="false" center :visible.sync="addDialogVisible" :title="dialogTitle+'角色'">
      <editForm ref="editForm" :infoForm="infoForm" style="width: 100%" @submit="submit" @closeWin="closeWin"/>
    </el-dialog>

    <!-- 权限设置表单 -->
    <el-dialog :close-on-press-escape="false" :close-on-click-modal="false" :center="true" v-loading="treeLoading" class="menu-dialog" :visible.sync="menuVisible" title="设置权限">
      <permissionForm ref="treeForm" :infoForm="infoForm" :checkedKeys="checkedKeys" :menuList="menuList" style="width: 100%" @submit="submit" @closeWin="closeWin"/>
    </el-dialog>

  </div>
</template>

<script>
  import roleApi from '@/api/permission/role'
  import menuApi from '@/api/permission/menu'
  import editForm from './edit'
  import permissionForm from './rules'

  export default {
    name: "role",
    data() {
      return {
        // 选中数组
        ids: [],
        // 非单个禁用
        single: true,
        // 非多个禁用
        multiple: true,
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
        roleList: [],
        infoForm: {
          name: '',
          status: 1,
          sort: 125
        },
        loading: false,
        tableHeight: document.body.clientHeight - 245,
        btnFunc: [],
        isAdmin: false,
        dialogTitle: '添加',
        menuVisible: false,
        treeLoading: false,
        menuList: [],
        checkedKeys: [],
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
      this.getRoleList()
    },
    watch: {
    },
    methods: {
      // 初始化搜索条件
      initSearchParam() {
        this.searchParam = {
          name: '',
        }
      },
      // 获取数据列表
      getRoleList() {
        let searchParam = JSON.parse(JSON.stringify(this.searchParam))
        searchParam.pageIndex = this.currentPage
        searchParam.pageSize = this.pageSize
        roleApi.roleList(searchParam).then(res => {
          this.roleList = res.data.records
          this.count = res.data.total
          this.tableLoading = false
        }).catch(e => {
          this.roleList = []
          this.tableLoading = false
        })
      },
      // 获取编辑数据
      roleInfo(data){
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
        const id = data.id || this.ids
        this.$nextTick(function () {
          try {
            roleApi.roleInfo({id: id}).then(res => {
              this.infoForm = res.data
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
          name: '',
          status: 1,
          sort: 125
        }
      },
      // 删除记录
      roleDel(data) {
        this.$confirm('您确定要删除角色吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.delBtnLoading = true
          const id = data.id || this.ids;
          roleApi.roleDel({id: id}).then(res => {
            this.$message({
              type: 'success',
              message: '删除成功！'
            })
            this.delBtnLoading = false
            this.tableLoading = true
            this.getRoleList()
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
          roleApi.roleStatus(params).then(res => {
            this.$message({
              type: 'success',
              message: '操作成功！'
            })
            this.getRoleList()
          }).catch(e => {
            let roleList = JSON.parse(JSON.stringify(this.roleList))
            for (let i = 0; i < roleList.length; i++) {
              if (roleList[i].id == data.id) {
                roleList[i].status = data.status == 1 ? 2 : 1
              }
            }
            this.roleList = Object.assign([], roleList)
            this.tableLoading = false
          })
        }).catch(() => {
          let roleList = JSON.parse(JSON.stringify(this.roleList))
          for (let i = 0; i < roleList.length; i++) {
            if (roleList[i].id == data.id) {
              roleList[i].status = data.status == 1 ? 2 : 1
            }
          }
          this.roleList = Object.assign([], roleList)
          this.$message({
            type: 'info',
            message: '已取消该操作！'
          })
        })
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.roleId)
        this.single = selection.length!=1
        this.multiple = !selection.length
      },
      // 导出Excel
      exportExcel(){
        this.$confirm('是否确认导出所有角色数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return roleApi.exportExcel();
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
      },
      handlePageChange(val) {
        this.currentPage = val
        this.tableLoading = true
        this.$refs.table.bodyWrapper.scrollTop = 0;
        this.getRoleList()
      },
      // 搜索
      search() {
        this.currentPage = 1
        this.tableLoading = true
        this.$refs.table.bodyWrapper.scrollTop = 0;
        this.getRoleList()
      },
      // 提交表单后逻辑处理
      submit(type) {
        if (type == 0) {
          // 添加
          this.search()
        } else if (type == 1) {
          // 编辑
          this.tableLoading=true
          this.getRoleList()
          this.$refs.table.bodyWrapper.scrollTop = 0;
          this.addDialogVisible = false
        } else if (type == 2) {
          // 设置权限
          this.menuVisible = false
          this.tableLoading = true
          this.getRoleList()
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
  .form-container {
    width: 100%;

    .el-tabs {
      height: 100%;
    }

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
