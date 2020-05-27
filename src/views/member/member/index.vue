<template>
  <div class="app-container">
    <el-tabs type="border-card">
      <el-form :inline="true" :model="searchParam" class="demo-form-inline head-form">
          <el-form-item label="会员手机">
            <el-input clearable v-model="searchParam.mobile" size="small" placeholder="请输入会员手机号"/>
          </el-form-item>
          <el-form-item>
            <el-button :loading="tableLoading" @click="search" size="small" icon="el-icon-search" type="primary">搜索
            </el-button>
            <el-button @click="memberInfo()" size="small" icon="el-icon-plus" type="primary">添加会员
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
                  :data="memberList" border row-key="id">
          <el-table-column show-overflow-tooltip type="selection" align="center"/>
          <el-table-column show-overflow-tooltip prop="id" label="ID" align="center" width="80"/>
          <el-table-column show-overflow-tooltip prop="realname" label="会员姓名" align="center"/>
          <el-table-column show-overflow-tooltip prop="nickname" label="会员昵称" align="center"/>
          <el-table-column show-overflow-tooltip prop="avatar" label="头像" align="center" width="80">
            <template slot-scope="{row}">
              <el-avatar :size="30" :src="row.avatar">
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
          <el-table-column show-overflow-tooltip prop="mobile" label="手机号码" align="center"/>
          <el-table-column show-overflow-tooltip prop="status" label="状态" align="center" width="120">
            <template slot-scope="{row}">
              {{ row.status === 1 ? '正常' : '禁用' }}
              <el-switch v-if="!isAdmin||btnFunc.some(btn=>btn=='status')" v-model="row.status" :active-value="1"
                         :inactive-value="2" size="small"
                         @change="setStatus(row)"/>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="device" label="设备类型" align="center" width="100">
            <template slot-scope="{row}">
              <el-tag v-if="row.device === 1" type="" size="small">苹果</el-tag>
              <el-tag v-if="row.device === 2" type="success" size="small">安卓</el-tag>
              <el-tag v-if="row.device === 3" type="warning" size="small">WAP站</el-tag>
              <el-tag v-if="row.device === 4" type="info" size="small">PC站</el-tag>
              <el-tag v-if="row.device === 5" type="danger" size="small">马甲</el-tag>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="source" label="来源" align="center" width="100">
            <template slot-scope="{row}">
              <el-tag v-if="row.source === 1" type="" size="small">注册会员</el-tag>
              <el-tag v-if="row.source === 2" type="success" size="small">马甲会员</el-tag>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="createTime" label="注册时间" align="center" width="180"/>
          <el-table-column show-overflow-tooltip prop="loginTime" label="最近登录时间" align="center" width="180"/>
          <el-table-column show-overflow-tooltip prop="loginCount" label="登录次数" align="center" width="100"/>
          <el-table-column show-overflow-tooltip prop="loginStatus" label="登录状态" align="center" width="100">
            <template slot-scope="{row}">
              <el-tag v-if="row.loginStatus === 1" type="" size="small">登录</el-tag>
              <el-tag v-if="row.loginStatus === 2" type="success" size="small">登出</el-tag>
            </template>
          </el-table-column>
          <el-table-column v-if="isAdmin||(btnFunc.filter(value=>value=='edit'||value=='drop').length>0)" label="操作" width="120" align="center" fixed="right">
            <template slot-scope="scoped">
              <el-row>
                <el-tooltip v-if="isAdmin||btnFunc.some(btn=>btn=='edit')" class="item" effect="dark" content="编辑" placement="bottom">
                  <el-button type="primary" size="mini" icon="el-icon-edit" @click="memberInfo(scoped.row)"/>
                </el-tooltip>
                <el-tooltip v-if="!isAdmin||btnFunc.some(btn=>btn=='drop')" class="item" effect="dark" content="删除" placement="bottom">
                  <el-button :loading="delBtnLoading" type="danger" size="mini" class="el-icon-delete" @click="memberDel(scoped.row)"/>
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
    <el-dialog :close-on-press-escape="false" :close-on-click-modal="false" center :visible.sync="addDialogVisible" :title="dialogTitle+'级别'">
      <editForm ref="editForm" :infoForm="infoForm" :deviceList="deviceList" style="width: 100%" @submit="submit" @closeWin="closeWin"></editForm>
    </el-dialog>

  </div>
</template>

<script>
  import memberApi from '@/api/member/member'
  import editForm from './edit'

  export default {
    name: "member",
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
        searchParam: {
          mobile: '',
        },
        status: [{
          value: 1,
          label: '正常'
        }, {
          value: 2,
          label: '禁用'
        }],
        memberList: [],
        deviceList: [],
        infoForm: {
          name: '',
          status: 1,
          device: 5,
          source: 2,
        },
        loading: false,
        tableHeight: document.body.clientHeight - 245,
        btnFunc: [],
        isAdmin: false,
        dialogTitle: "添加",
      }
    },
    components: {editForm},
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
      this.getMemberList()
      // 获取参数
      this.getParamList()
    },
    watch: {
    },
    methods: {
      // 异步获取数据
      async queryData(){
        // 获取设备类型
        await this.getParamList()
      },
      // 初始化搜索条件
      initSearchParam() {
        this.searchParam = {
          mobile: '',
        }
      },
      // 获取数据列表
      getMemberList() {
        let searchParam = JSON.parse(JSON.stringify(this.searchParam))
        searchParam.pageIndex = this.currentPage
        searchParam.pageSize = this.pageSize
        memberApi.memberList(searchParam).then(res => {
          this.memberList = res.data.records
          this.count = res.data.total
          this.tableLoading = false
        }).catch(e => {
          this.memberList = []
          this.tableLoading = false
        })
      },
      // 获取编辑数据
      memberInfo(data){
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
            memberApi.memberInfo({id: data.id}).then(res => {
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
          mobile: '',
          status: 1,
          device: 5,
          source: 2,
          gender: 1,
        }
      },
      // 删除记录
      memberDel(data) {
        this.$confirm('您确定要删除级别吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.delBtnLoading = true
          memberApi.memberDel({id: data.id}).then(res => {
            this.$message({
              type: 'success',
              message: '删除成功！'
            })
            this.delBtnLoading = false
            this.tableLoading = true
            this.getMemberList()
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
      // 获取参数
      getParamList() {
        memberApi.getParamList().then(res => {
          const {device_list} = res.data
          this.deviceList = device_list ? device_list : {}
        }).catch(e => {
          this.deviceList = {}
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
          memberApi.setStatus(params).then(res => {
            this.$message({
              type: 'success',
              message: '操作成功！'
            })
            this.getMemberList()
          }).catch(e => {
            let memberList = JSON.parse(JSON.stringify(this.memberList))
            for (let i = 0; i < memberList.length; i++) {
              if (memberList[i].id == data.id) {
                memberList[i].status = data.status == 1 ? 2 : 1
              }
            }
            this.memberList = Object.assign([], memberList)
            this.tableLoading = false
          })
        }).catch(() => {
          let memberList = JSON.parse(JSON.stringify(this.memberList))
          for (let i = 0; i < memberList.length; i++) {
            if (memberList[i].id == data.id) {
              memberList[i].status = data.status == 1 ? 2 : 1
            }
          }
          this.memberList = Object.assign([], memberList)
          this.$message({
            type: 'info',
            message: '已取消该操作！'
          })
        })
      },
      handlePageChange(val) {
        this.currentPage = val
        this.tableLoading = true
        this.$refs.table.bodyWrapper.scrollTop = 0;
        this.getMemberList()
      },
      // 搜索
      search() {
        this.currentPage = 1
        this.tableLoading = true
        this.$refs.table.bodyWrapper.scrollTop = 0;
        this.getMemberList()
      },
      // 提交表单后逻辑处理
      submit(type) {
        if (type == 0) {
          // 添加
          this.search()
        } else {
          // 编辑
          this.tableLoading=true
          this.getMemberList()
          this.$refs.table.bodyWrapper.scrollTop = 0;
          this.addDialogVisible = false
        }
      },
      // 关闭窗体
      closeWin() {
        console.log("关闭")
        // 调用初始化表单方法
        this.initInfoForm()
        // 设置弹窗不可见
        this.addDialogVisible = false
      }
    }
  }
</script>

<style lang="less">
  .app-container {
    width: 100%;

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
