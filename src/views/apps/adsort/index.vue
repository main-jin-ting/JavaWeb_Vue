<template>
  <div class="adSort-container">
    <el-tabs type="border-card">
      <el-form :inline="true" :model="searchParam" class="demo-form-inline head-form">
          <el-form-item label="广告位名称">
            <el-input clearable v-model="searchParam.name" size="small" placeholder="请输入广告位名称"
                      style="width: 200px"/>
          </el-form-item>
          <el-form-item>
            <el-button :loading="tableLoading" @click="search" size="small" icon="el-icon-search" type="primary">搜索
            </el-button>
            <el-button @click="adSortInfo()" size="small" icon="el-icon-plus" type="primary">添加广告位
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
                  :data="adSortList" border row-key="id">
          <el-table-column show-overflow-tooltip type="selection" align="center"/>
          <el-table-column show-overflow-tooltip prop="id" label="ID" align="center" width="80"/>
          <el-table-column show-overflow-tooltip prop="name" label="广告位名称" align="center"/>
          <el-table-column show-overflow-tooltip prop="description" label="广告位描述/编号" align="center">
            <template slot-scope="{row}">
              {{ row.description }} >> {{ row.locId }}
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="cateName" label="栏目名称" align="center"/>
          <el-table-column show-overflow-tooltip prop="platform" label="目标平台" align="center" width="100">
            <template slot-scope="{row}">
              <el-tag v-if="row.platform === 1" type="" size="small">PC网站</el-tag>
              <el-tag v-if="row.platform === 2" type="success" size="small">WAP站</el-tag>
              <el-tag v-if="row.platform === 3" type="warning" size="small">小程序</el-tag>
              <el-tag v-if="row.platform === 4" type="danger" size="small">APP应用</el-tag>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="sort" label="排序" align="center" width="100"/>
          <el-table-column show-overflow-tooltip prop="createUser" label="添加人" align="center" width="150"/>
          <el-table-column show-overflow-tooltip prop="createTime" label="添加时间" align="center" width="180"/>
          <el-table-column v-if="isAdmin||(btnFunc.filter(value=>value=='edit'||value=='drop').length>0)" label="操作" width="120" align="center" fixed="right">
            <template slot-scope="scoped">
              <el-row>
                <el-tooltip v-if="isAdmin||btnFunc.some(btn=>btn=='edit')" class="item" effect="dark" content="编辑" placement="bottom">
                  <el-button type="primary" size="mini" icon="el-icon-edit" @click="adSortInfo(scoped.row)"/>
                </el-tooltip>
                <el-tooltip v-if="!isAdmin||btnFunc.some(btn=>btn=='drop')" class="item" effect="dark" content="删除" placement="bottom">
                  <el-button :loading="delBtnLoading" type="danger" size="mini" class="el-icon-delete" @click="adSortDel(scoped.row)"/>
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
    <el-dialog :close-on-press-escape="false" :close-on-click-modal="false" center :visible.sync="addDialogVisible" :title="dialogTitle+'广告位'">
      <editForm ref="editForm" :infoForm="infoForm" :filterCateList="filterCateList" :platformList="platformList" style="width: 100%" @submit="submit" @closeWin="closeWin"></editForm>
    </el-dialog>

  </div>
</template>

<script>
  import adSortApi from '@/api/apps/adSort'
  import editForm from './edit'

  export default {
    name: "adSort",
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
          name: '',
        },
        adSortList: [],
        cateList: [],
        platformList: [],
        filterCateList: [],
        infoForm: {
          name: '',
          sort: 125
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
      this.getAdSortList()
      // 获取基础数据
      this.queryData()
    },
    watch: {

    },
    methods: {
      // 异步获取数据
      async queryData(){
        // 获取基础数据
        await this.getParamList()
        // 获取栏目列表
        await this.getCateList()
      },
      // 初始化搜索条件
      initSearchParam() {
        this.searchParam = {
          name: '',
        }
      },
      // 获取数据列表
      getAdSortList() {
        let searchParam = JSON.parse(JSON.stringify(this.searchParam))
        searchParam.pageIndex = this.currentPage
        searchParam.pageSize = this.pageSize
        adSortApi.adSortList(searchParam).then(res => {
          this.adSortList = res.data.records
          this.count = res.data.total
          this.tableLoading = false
        }).catch(e => {
          this.adSortList = []
          this.tableLoading = false
        })
      },
      // 获取编辑数据
      adSortInfo(data){
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
            adSortApi.adSortInfo({id: data.id}).then(res => {
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
          sort: 125
        }
      },
      // 删除记录
      adSortDel(data) {
        this.$confirm('您确定要删除广告位吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.delBtnLoading = true
          adSortApi.adSortDel({id: data.id}).then(res => {
            this.$message({
              type: 'success',
              message: '删除成功！'
            })
            this.delBtnLoading = false
            this.tableLoading = true
            this.getAdSortList()
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
      // 获取栏目列表
      getCateList() {
        adSortApi.getCateList().then(res => {
          this.cateList = res.data
          this.initFilterList()
        }).catch(e => {
          this.cateList = []
        })
      },
      initFilterList(id) {
        let filerList = JSON.parse(JSON.stringify(this.cateList))
        this.findFilterList(filerList, id)
        this.filterCateList = filerList
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
      // 获取基础数据
      getParamList() {
        adSortApi.getParamList().then(res => {
          const {platform_list} = res.data
          this.platformList = platform_list ? platform_list : {}
        }).catch(e => {
          this.platformList = {}
        })
      },
      handlePageChange(val) {
        this.currentPage = val
        this.tableLoading = true
        this.$refs.table.bodyWrapper.scrollTop = 0;
        this.getAdSortList()
      },
      // 搜索
      search() {
        this.currentPage = 1
        this.tableLoading = true
        this.$refs.table.bodyWrapper.scrollTop = 0;
        this.getAdSortList()
      },
      // 提交表单后逻辑处理
      submit(type) {
        if (type == 0) {
          // 添加
          this.search()
        } else {
          // 编辑
          this.tableLoading=true
          this.getAdSortList()
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
  .adSort-container {
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
