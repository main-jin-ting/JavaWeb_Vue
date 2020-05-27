<template>
  <div class="message-container">
    <el-tabs type="border-card">
      <el-form :inline="true" :model="searchParam" class="demo-form-inline head-form">
          <el-form-item label="消息标题">
            <el-input clearable v-model="searchParam.title" size="small" placeholder="请输入消息标题"
                      style="width: 200px"/>
          </el-form-item>
          <el-form-item label="消息类型">
             <el-select v-model="searchParam.type" placeholder="请选择消息类型">
              <el-option
                v-for="item in typeList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
           <el-form-item label="发送状态">
             <el-select v-model="searchParam.sendStatus" placeholder="请选择发送状态">
              <el-option
                v-for="item in statusList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button :loading="tableLoading" @click="search" size="small" icon="el-icon-search" type="primary">搜索
            </el-button>
            <el-button @click="messageInfo()" size="small" icon="el-icon-plus" type="primary">添加消息
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
                  :data="messageList" border row-key="id">
          <el-table-column show-overflow-tooltip type="selection" align="center"/>
          <el-table-column show-overflow-tooltip prop="id" label="ID" align="center" width="80"/>
          <el-table-column show-overflow-tooltip prop="title" label="消息标题" align="center" width="200"/>
          <el-table-column show-overflow-tooltip prop="content" label="发送内容" align="center" />
          <el-table-column show-overflow-tooltip prop="receiver" label="接收人" align="center" width="100"/>
          <el-table-column show-overflow-tooltip prop="type" label="发送方式" align="center" width="100">
            <template slot-scope="{row}">
              <el-tag v-if="row.type === 1" type="" size="small">系统</el-tag>
              <el-tag v-if="row.type === 2" type="success" size="small">短信</el-tag>
              <el-tag v-if="row.type === 3" type="warning" size="small">邮件</el-tag>
              <el-tag v-if="row.type === 4" type="danger" size="small">微信</el-tag>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="sendStatus" label="发送状态" align="center" width="100">
            <template slot-scope="{row}">
              <el-tag v-if="row.sendStatus === 1" type="" size="small">已发送</el-tag>
              <el-tag v-if="row.sendStatus === 2" type="success" size="small">未发送</el-tag>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="sendTime" label="发送时间" align="center"/>
          <el-table-column show-overflow-tooltip prop="sendNum" label="发送次数" align="center" width="100"/>
          <el-table-column show-overflow-tooltip prop="createTime" label="添加时间" align="center" width="180"/>
          <el-table-column show-overflow-tooltip prop="note" label="备注" align="center"/>
          <el-table-column v-if="isAdmin||(btnFunc.filter(value=>value=='edit'||value=='drop').length>0)" label="操作" width="120" align="center" fixed="right">
            <template slot-scope="scoped">
              <el-row>
                <el-tooltip v-if="!isAdmin||btnFunc.some(btn=>btn=='drop')" class="item" effect="dark" content="删除" placement="bottom">
                  <el-button :loading="delBtnLoading" type="danger" size="mini" class="el-icon-delete" @click="messageDel(scoped.row)"/>
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
  import messageApi from '@/api/message/message'

  export default {
    name: "message",
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
          type: '',
          sendStatus: '',
        },
        messageList: [],
        loading: false,
        tableHeight: document.body.clientHeight - 245,
        btnFunc: [],
        isAdmin: false,
        // 消息类型
        typeList: [{
          value: 1,
          label: '系统'
        }, {
          value: 2,
          label: '短信'
        }, {
          value: 3,
          label: '邮件'
        }, {
          value: 4,
          label: '微信'
        }],
        // 发送状态
        statusList: [{
          value: 1,
          label: '已发送'
        }, {
          value: 2,
          label: '未发送'
        }],
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
      this.getMessageList()
    },
    watch: {
    },
    methods: {
      // 初始化搜索条件
      initSearchParam() {
        this.searchParam = {
          title: '',
          type: '',
          sendStatus: '',
        }
      },
      // 获取数据列表
      getMessageList() {
        let searchParam = JSON.parse(JSON.stringify(this.searchParam))
        searchParam.pageIndex = this.currentPage
        searchParam.pageSize = this.pageSize
        messageApi.messageList(searchParam).then(res => {
          this.messageList = res.data.records
          this.count = res.data.total
          this.tableLoading = false
        }).catch(e => {
          this.messageList = []
          this.tableLoading = false
        })
      },
      // 删除记录
      messageDel(data) {
        this.$confirm('您确定要删除消息吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.delBtnLoading = true
          messageApi.messageDel({id: data.id}).then(res => {
            this.$message({
              type: 'success',
              message: '删除成功！'
            })
            this.delBtnLoading = false
            this.tableLoading = true
            this.getMessageList()
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
        this.getMessageList()
      },
      // 搜索
      search() {
        this.currentPage = 1
        this.tableLoading = true
        this.$refs.table.bodyWrapper.scrollTop = 0;
        this.getMessageList()
      },
    }
  }
</script>

<style lang="less">
  .message-container {
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
