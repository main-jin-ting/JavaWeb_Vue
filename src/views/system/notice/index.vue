<template>
  <div class="notice-container">
    <el-tabs type="border-card">
      <el-form :inline="true" :model="searchParam" class="demo-form-inline head-form">
          <el-form-item label="通知标题">
            <el-input clearable v-model="searchParam.name" size="small" placeholder="请输入通知标题"
                      style="width: 200px"/>
          </el-form-item>
          <el-form-item>
            <el-button :loading="tableLoading" @click="search" size="small" icon="el-icon-search" type="primary">搜索
            </el-button>
            <el-button @click="noticeInfo()" size="small" icon="el-icon-plus" type="primary">添加职级
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
                  :data="noticeList" border row-key="id">
          <el-table-column show-overflow-tooltip type="selection" align="center"/>
          <el-table-column show-overflow-tooltip prop="id" label="ID" align="center" width="80"/>
          <el-table-column show-overflow-tooltip prop="title" label="通知名称" align="center"/>
          <el-table-column show-overflow-tooltip prop="sourceName" label="通知来源" align="center" width="150"/>
          <el-table-column show-overflow-tooltip prop="status" label="状态" align="center" width="150">
            <template slot-scope="{row}">
              {{ row.status === 1 ? '已发布' : '未发布' }}
              <el-switch v-if="!isAdmin||btnFunc.some(btn=>btn=='status')" v-model="row.status" :active-value="1"
                         :inactive-value="2" size="small"
                         @change="setStatus(row)"/>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="isTop" label="置顶" align="center" width="150">
            <template slot-scope="{row}">
              {{ row.status === 1 ? '已置顶' : '未置顶' }}
              <el-switch v-if="!isAdmin||btnFunc.some(btn=>btn=='istop')" v-model="row.isTop" :active-value="1"
                         :inactive-value="2" size="small"
                         @change="setIsTop(row)"/>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="createUser" label="添加人" align="center" width="150"/>
          <el-table-column show-overflow-tooltip prop="createTime" label="添加时间" align="center" width="180"/>
          <el-table-column show-overflow-tooltip prop="updateUser" label="更新人" align="center" width="150"/>
          <el-table-column show-overflow-tooltip prop="updateTime" label="更新时间" align="center" width="180"/>
          <el-table-column v-if="isAdmin||(btnFunc.filter(value=>value=='edit'||value=='drop').length>0)" label="操作" width="120" align="center" fixed="right">
            <template slot-scope="scoped">
              <el-row>
                <el-tooltip v-if="isAdmin||btnFunc.some(btn=>btn=='edit')" class="item" effect="dark" content="编辑" placement="bottom">
                  <el-button type="primary" size="mini" icon="el-icon-edit" @click="noticeInfo(scoped.row)"/>
                </el-tooltip>
                <el-tooltip v-if="!isAdmin||btnFunc.some(btn=>btn=='drop')" class="item" effect="dark" content="删除" placement="bottom">
                  <el-button :loading="delBtnLoading" type="danger" size="mini" class="el-icon-delete" @click="noticeDel(scoped.row)"/>
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
    <el-dialog :close-on-press-escape="false" :close-on-click-modal="false" center :visible.sync="addDialogVisible" :title="dialogTitle+'职级'">
      <editForm ref="editForm" :infoForm="infoForm" :sourceList="sourceList" style="width: 100%" @submit="submit" @closeWin="closeWin"></editForm>
    </el-dialog>

  </div>
</template>

<script>
  import noticeApi from '@/api/system/notice'
  import editForm from './edit'

  export default {
    name: "notice",
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
          title: '',
        },
        noticeList: [],
        sourceList: [],
        infoForm: {
          title: '',
          status: 1,
          isSend: 2,
          source: 1,
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
      this.getNoticeList()
      // 获取参数
      this.getParamList()
    },
    watch: {
    },
    methods: {
      // 异步获取数据
      async queryData(){
        // 获取基础数据
        await this.getParamList()
      },
      // 初始化搜索条件
      initSearchParam() {
        this.searchParam = {
          name: '',
        }
      },
      // 获取数据列表
      getNoticeList() {
        let searchParam = JSON.parse(JSON.stringify(this.searchParam))
        searchParam.pageIndex = this.currentPage
        searchParam.pageSize = this.pageSize
        noticeApi.noticeList(searchParam).then(res => {
          this.noticeList = res.data.records
          this.count = res.data.total
          this.tableLoading = false
        }).catch(e => {
          this.noticeList = []
          this.tableLoading = false
        })
      },
      // 获取编辑数据
      noticeInfo(data){
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
            noticeApi.noticeInfo({id: data.id}).then(res => {
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
          title: '',
          status: 1,
          isSend: 2,
          source: 1,
        }
      },
      // 删除记录
      noticeDel(data) {
        this.$confirm('您确定要删除职级吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.delBtnLoading = true
          noticeApi.noticeDel({id: data.id}).then(res => {
            this.$message({
              type: 'success',
              message: '删除成功！'
            })
            this.delBtnLoading = false
            this.tableLoading = true
            this.getNoticeList()
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
      // 获取基础数据
      getParamList() {
        noticeApi.getParamList().then(res => {
          const {source_list} = res.data
          this.sourceList = source_list ? source_list : {}
        }).catch(e => {
          this.sourceList = {}
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
          noticeApi.noticeStatus(params).then(res => {
            this.$message({
              type: 'success',
              message: '操作成功！'
            })
            this.getNoticeList()
          }).catch(e => {
            let noticeList = JSON.parse(JSON.stringify(this.noticeList))
            for (let i = 0; i < noticeList.length; i++) {
              if (noticeList[i].id == data.id) {
                noticeList[i].status = data.status == 1 ? 2 : 1
              }
            }
            this.noticeList = Object.assign([], noticeList)
            this.tableLoading = false
          })
        }).catch(() => {
          let noticeList = JSON.parse(JSON.stringify(this.noticeList))
          for (let i = 0; i < noticeList.length; i++) {
            if (noticeList[i].id == data.id) {
              noticeList[i].status = data.status == 1 ? 2 : 1
            }
          }
          this.noticeList = Object.assign([], noticeList)
          this.$message({
            type: 'info',
            message: '已取消该操作！'
          })
        })
      },
      // 设置置顶
      setIsTop(data){
        let params = {
          isTop: data.isTop,
          id: data.id
        }
        this.tableLoading = true
        noticeApi.noticeIsTop(params).then(res => {
          this.$message({
            type: 'success',
            message: '操作成功！'
          })
          this.getNoticeList()
        }).catch(e => {
          let noticeList = JSON.parse(JSON.stringify(this.noticeList))
          for (let i = 0; i < noticeList.length; i++) {
            if (noticeList[i].id == data.id) {
              noticeList[i].isTop = data.isTop == 1 ? 2 : 1
            }
          }
          this.noticeList = Object.assign([], noticeList)
          this.tableLoading = false
        })
      },
      handlePageChange(val) {
        this.currentPage = val
        this.tableLoading = true
        this.$refs.table.bodyWrapper.scrollTop = 0;
        this.getNoticeList()
      },
      // 搜索
      search() {
        this.currentPage = 1
        this.tableLoading = true
        this.$refs.table.bodyWrapper.scrollTop = 0;
        this.getNoticeList()
      },
      // 提交表单后逻辑处理
      submit(type) {
        if (type == 0) {
          // 添加
          this.search()
        } else {
          // 编辑
          this.tableLoading=true
          this.getNoticeList()
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
  .notice-container {
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
