<template>
  <div class="operLog-container">
    <el-tabs type="border-card">
      <el-form :inline="true" :model="searchParam" class="demo-form-inline head-form">
          <el-form-item label="日志标题">
            <el-input clearable v-model="searchParam.title" size="small" placeholder="请输入日志标题"
                      style="width: 200px"/>
          </el-form-item>
          <el-form-item>
            <el-button :loading="tableLoading" @click="search" size="small" icon="el-icon-search" type="primary">搜索
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
                  :data="operLogList" border row-key="id">
          <el-table-column show-overflow-tooltip type="selection" align="center"/>
          <el-table-column show-overflow-tooltip prop="id" label="ID" align="center" width="80"/>
          <el-table-column show-overflow-tooltip prop="title" label="日志标题" align="center"/>
          <el-table-column show-overflow-tooltip prop="businessType" label="业务类型" align="center" width="100">
            <template slot-scope="{row}">
              <el-tag v-if="row.businessType === 0" type="" size="small">其他</el-tag>
              <el-tag v-if="row.businessType === 1" type="" size="small">新增</el-tag>
              <el-tag v-if="row.businessType === 2" type="success" size="small">修改</el-tag>
              <el-tag v-if="row.businessType === 3" type="warning" size="small">删除</el-tag>
              <el-tag v-if="row.businessType === 5" type="danger" size="small">导出数据</el-tag>
              <el-tag v-if="row.businessType === 6" type="info" size="small">导入模板</el-tag>
              <el-tag v-if="row.businessType === 7" type="info" size="small">强退</el-tag>
              <el-tag v-if="row.businessType === 8" type="danger" size="small">生成代码</el-tag>
              <el-tag v-if="row.businessType === 9" type="success" size="small">清空数据</el-tag>
              <el-tag v-if="row.businessType === 10" type="success" size="small">设置状态</el-tag>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="method" label="方法名称" align="center"/>
          <el-table-column show-overflow-tooltip prop="requestMethod" label="请求方式" align="center"/>
          <el-table-column show-overflow-tooltip prop="operatorType" label="操作类型" align="center" width="100">
            <template slot-scope="{row}">
              <el-tag v-if="row.businessType === 0" type="warning" size="small">其他</el-tag>
              <el-tag v-if="row.operatorType === 1" type="" size="small">后台用户</el-tag>
              <el-tag v-if="row.operatorType === 2" type="success" size="small">手机端用户</el-tag>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="operUrl" label="操作地址" align="center" width="200"/>
          <el-table-column show-overflow-tooltip prop="operIp" label="主机IP" align="center" width="120"/>
          <el-table-column show-overflow-tooltip prop="operLocation" label="操作地点" align="center" width="150"/>
          <el-table-column show-overflow-tooltip prop="status" label="状态" align="center">
            <template slot-scope="{row}">
              <el-tag v-if="row.status === 0" type="warning" size="small">正常</el-tag>
              <el-tag v-if="row.status === 1" type="" size="small">异常</el-tag>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="operParam" label="请求参数" align="center" width="200"/>
          <el-table-column show-overflow-tooltip prop="jsonResult" label="返回结果" align="center" width="200"/>
          <el-table-column show-overflow-tooltip prop="errorMsg" label="错误信息" align="center"/>
          <el-table-column show-overflow-tooltip prop="operName" label="操作人员" align="center"/>
          <el-table-column show-overflow-tooltip prop="createTime" label="创建时间" align="center" width="180"/>
          <el-table-column v-if="isAdmin||(btnFunc.filter(value=>value=='drop').length>0)" label="操作" width="120" align="center" fixed="right">
            <template slot-scope="scoped">
              <el-row>
                <el-tooltip v-if="!isAdmin||btnFunc.some(btn=>btn=='drop')" class="item" effect="dark" content="删除" placement="bottom">
                  <el-button :loading="delBtnLoading" type="danger" size="mini" class="el-icon-delete" @click="operLogDel(scoped.row)"/>
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

  </div>
</template>

<script>
  import operLogApi from '@/api/system/operLog'

  export default {
    name: "operLog",
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
        // 搜索条件
        searchParam: {
          title: '',
        },
        operLogList: [],
        loading: false,
        tableHeight: document.body.clientHeight - 245,
        btnFunc: [],
        isAdmin: false,
      }
    },
    created() {
      const {btnFunc, isAdmin} = this.$store.state.user
      this.btnFunc = btnFunc
      this.isAdmin = isAdmin
    },
    mounted() {
      // 开启加载动画
      this.tableLoading = true
      // 获取数据列表
      this.getOperLogList()
    },
    watch: {
    },
    methods: {
      // 初始化搜索条件
      initSearchParam() {
        this.searchParam = {
          title: '',
        }
      },
      // 获取数据列表
      getOperLogList() {
        let searchParam = JSON.parse(JSON.stringify(this.searchParam))
        searchParam.pageIndex = this.currentPage
        searchParam.pageSize = this.pageSize
        operLogApi.operLogList(searchParam).then(res => {
          this.operLogList = res.data.records
          this.count = res.data.total
          this.tableLoading = false
        }).catch(e => {
          this.operLogList = []
          this.tableLoading = false
        })
      },
      // 删除记录
      operLogDel(data) {
        this.$confirm('您确定要删除登录吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.delBtnLoading = true
          operLogApi.operLogDel({id: data.id}).then(res => {
            this.$message({
              type: 'success',
              message: '删除成功！'
            })
            this.delBtnLoading = false
            this.tableLoading = true
            this.getOperLogList()
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
      handlePageChange(val) {
        this.currentPage = val
        this.tableLoading = true
        this.$refs.table.bodyWrapper.scrollTop = 0;
        this.getOperLogList()
      },
      // 搜索
      search() {
        this.currentPage = 1
        this.tableLoading = true
        this.$refs.table.bodyWrapper.scrollTop = 0;
        this.getOperLogList()
      },
    }
  }
</script>

<style lang="less">
  .operLog-container {
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
