<template>
  <div class="list-container">
    <el-tabs type="border-card">
      <el-form :inline="true" :model="searchParam" class="demo-form-inline head-form">
          <el-form-item label="栏目名称">
            <el-input clearable v-model="searchParam.name" size="small" placeholder="请输入栏目名称"
                      style="width: 200px"/>
          </el-form-item>
          <el-form-item>
            <el-button :loading="tableLoading" @click="search" size="small" icon="el-icon-search" type="primary">搜索
            </el-button>
            <el-button @click="cateInfo()" size="small" icon="el-icon-plus" type="primary">添加栏目
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
                  :data="cateList.slice((currentPage - 1) * pageSize, currentPage * pageSize)"
                  border row-key="id">
          <el-table-column show-overflow-tooltip prop="id" label="ID" align="center" width="100"/>
          <el-table-column show-overflow-tooltip prop="name" label="栏目名称" align="center"/>
          <el-table-column show-overflow-tooltip prop="cover" label="站点图片" align="center" width="80">
            <template slot-scope="{row}">
              <el-avatar :size="30" :src="row.cover">
                <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"/>
              </el-avatar>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="itemName" label="所属站点" align="center"/>
          <el-table-column show-overflow-tooltip prop="pinyin" label="拼音(全拼)" align="center"/>
          <el-table-column show-overflow-tooltip prop="code" label="拼音(简拼)" align="center"/>
          <el-table-column show-overflow-tooltip prop="status" label="状态" align="center" width="120">
            <template slot-scope="{row}">
              {{ row.status === 1 ? '正常' : '停用' }}
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
          <el-table-column v-if="isAdmin||(btnFunc.filter(value=>value=='edit'||value=='drop'||value=='add').length>0)" label="操作" width="180" fixed="right">
            <template slot-scope="scope">
              <el-tooltip v-if="isAdmin||btnFunc.some(btn=>btn=='edit')" class="item" effect="dark" content="编辑" placement="bottom">
                <el-button type="primary" size="mini" icon="el-icon-edit" @click="cateInfo(scope.row)"/>
              </el-tooltip>
              <el-tooltip v-if="isAdmin||btnFunc.some(btn=>btn=='drop')" class="item" effect="dark" content="删除" placement="bottom">
                <el-button :loading="delBtnLoading" type="danger" size="mini" class="el-icon-delete" @click="cateDel(scope.row)"/>
              </el-tooltip>
              <el-button v-if="scope.row.pid === 0 && (isAdmin||btnFunc.some(btn=>btn=='add'))" type="primary" size="mini" icon="el-icon-plus" 
                @click="addChilds(scope.row)" class="add">添加子级
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <div class="page-current">
          <el-pagination
            :current-page="currentPage"
            :page-size="pageSize"
            prev-text="上一页"
            next-text="下一页"
            layout="total, prev, pager, next, jumper"
            style="display: inline-block;"
            background
            @current-change="handlePageChange"
            :total="count"/>
        </div>
    </el-tabs>

    <!-- 编辑表单 -->
    <el-dialog :close-on-press-escape="false" :close-on-click-modal="false" center :visible.sync="addDialogVisible" :title="dialogTitle+'栏目'">
      <editForm ref="editForm" :infoForm="infoForm" :filterCateList="filterCateList" :itemList="itemList" style="width: 100%" @submit="submit" @closeWin="closeWin"></editForm>
    </el-dialog>

  </div>
</template>

<script>
  import cateApi from '@/api/apps/itemCate'
  import editForm from './edit'

  export default {
    name: "cate",
    data() {
      return {
        // 当前页
        currentPage: 1,
        // 总条数
        count: 0,
        // 每页条数
        pageSize: 10,
        tableLoading: true,
        // 显示编辑角色弹框
        addDialogVisible: false,
        searchParam: {
          name: '',
        },
        cateList: [],
        itemList: [],
        delBtnLoading: false,
        addBtnLoading: false,
        infoForm: {
          name: '',
          pid: 0,
          status:1,
          sort: 1,
        },
        loading: false,
        tableHeight: document.body.clientHeight - 245,
        btnFunc: [],
        isAdmin: false,
        filterCateList: [],
        dialogTitle: '添加',
      }
    },
    components: {editForm},
    created() {
      this.pageSize = parseInt((document.body.clientHeight - 284) / 50)
      const {btnFunc, isAdmin} = this.$store.state.user
      this.btnFunc = btnFunc
      this.isAdmin = isAdmin
    },
    watch: {
    },
    mounted() {
      this.tableLoading = true
      // 获取栏目列表
      this.getCateList()
      // 获取基础数据
      this.queryData()
    },
    methods: {
      // 异步获取数据
      async queryData(){
        // 获取站点
        await this.getItemList()
      },
      // 初始化搜索条件
      initSearchParam() {
        this.searchParam = {
          name: '',
        }
      },
      // 初始化表单
      initInfoForm() {
        this.infoForm = {
          name: '',
          status:1,
          pid: 0,
          sort: 1,
        }
      },
      // 获取列表
      getCateList() {
        let searchParam = JSON.parse(JSON.stringify(this.searchParam))
        searchParam.pageIndex = this.currentPage
        searchParam.pageSize = this.pageSize
        cateApi.cateList(searchParam).then(res => {
          this.cateList = res.data.records
          this.count = res.data.total
          this.tableLoading = false
        }).catch(e => {
          this.count = 0
          this.cateList = []
          this.tableLoading = false
        })
      },
      // 获取职级
      getItemList() {
        cateApi.getItemList().then(res => {
          this.itemList = res.data ? res.data : []
        }).catch(e => {
          this.itemList = []
        })
      },
      // 获取编辑数据
      cateInfo(data){
        // 初始化表单
        this.initInfoForm()
        // 拉取数据
        let id = data == null ? 0 : data.id;
        this.initFilterList(id)
        // 显示弹窗
        this.addDialogVisible=true
        // 设置标题
        if (data == null) {
          this.dialogTitle = "添加";
          this.infoForm.disable = false
        } else {
          this.dialogTitle = "编辑";
          this.infoForm.disable = true
        }
        this.$nextTick(function () {
          try {
            cateApi.cateInfo({id: data.id}).then(res => {
              this.infoForm = res.data
              this.$refs.editForm.$refs['infoForm'].resetFields()
            }).catch(e => {
            })
          } catch (e) {

          }
        })
      },
      // 添加子级
      addChilds(data) {
        this.initInfoForm()
        this.initFilterList()
        // this.$refs.editForm.$refs['infoForm'].resetFields()
        this.addDialogVisible = true
        this.infoForm.pid = data.id ? data.id : 0
        this.infoForm.disable = false
      },
      initFilterList(id) {
        let filerList = JSON.parse(JSON.stringify(this.cateList))
        this.findFilterList(filerList, id)
        this.filterCateList = filerList
      },
      findFilterList(list, id) {
        for (let i = list.length - 1; i >= 0; i--) {
          if (list[i].pid > 0 || list[i].id == id) {
            list.splice(i, 1)
          } else {
            if (list[i].children && list[i].children.length > 0) {
              this.findFilterList(list[i].children)
            }
          }
        }
      },
      // 分页
      handlePageChange(val) {
        this.currentPage = val
        this.tableLoading = true
        this.$refs.table.bodyWrapper.scrollTop = 0;
        this.getCateList()
      },
      // 分页
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`)
      },
      // 删除记录
      cateDel(data) {
        this.$confirm('您确定要删除栏目吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.delBtnLoading = true
          cateApi.cateDel({id: data.id}).then(res => {
            this.$message({
              type: 'success',
              message: '删除成功！'
            })
            this.delBtnLoading = false
            this.tableLoading = true
            this.getCateList()
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
      // 搜索
      search() {
        this.currentPage = 1
        this.tableLoading = true
        this.$refs.table.bodyWrapper.scrollTop = 0;
        this.getCateList()
      },
      // 提交表单后逻辑处理
      submit(type) {
        if (type == 0) {
          // 添加
          this.search()
        } else {
          // 编辑
          this.tableLoading=true
          this.getCateList()
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
  .list-container {
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
