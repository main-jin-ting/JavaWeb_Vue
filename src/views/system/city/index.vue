<template>
  <div class="list-container">
    <el-tabs type="border-card">
      <el-form :inline="true" :model="searchParam" class="demo-form-inline head-form">
          <el-form-item label="城市名称">
            <el-input clearable v-model="searchParam.name" size="small" placeholder="请输入城市名称"
                      style="width: 200px"/>
          </el-form-item>
          <el-form-item>
            <el-button :loading="tableLoading" @click="search" size="small" icon="el-icon-search" type="primary">搜索
            </el-button>
            <el-button @click="cityInfo()" size="small" icon="el-icon-plus" type="primary">添加城市
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
                  :data="citytList.slice((currentPage - 1) * pageSize, currentPage * pageSize)"
                  border row-key="id">
          <el-table-column show-overflow-tooltip prop="id" label="ID" align="center" width="100"/>
          <el-table-column show-overflow-tooltip prop="name" label="城市名称" align="center"/>
          <el-table-column show-overflow-tooltip prop="citycode" label="城市编码" align="center" width="100"/>
          <el-table-column show-overflow-tooltip prop="type" label="级别" align="center" width="100">
            <template slot-scope="{row}">
              <el-tag v-if="row.level === 1" type="" size="small">省</el-tag>
              <el-tag v-if="row.level === 2" type="success" size="small">市</el-tag>
              <el-tag v-if="row.level === 3" type="warning" size="small">区/县</el-tag>
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
                <el-button type="primary" size="mini" icon="el-icon-edit" @click="cityInfo(scope.row)"/>
              </el-tooltip>
              <el-tooltip v-if="isAdmin||btnFunc.some(btn=>btn=='drop')" class="item" effect="dark" content="删除" placement="bottom">
                <el-button :loading="delBtnLoading" type="danger" size="mini" class="el-icon-delete" @click="cityDel(scope.row)"/>
              </el-tooltip>
              <el-button v-if="scope.row.level <= 2 && (isAdmin||btnFunc.some(btn=>btn=='add'))" type="primary" size="mini" icon="el-icon-plus" 
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
    <el-dialog :close-on-press-escape="false" :close-on-click-modal="false" center :visible.sync="addDialogVisible" :title="dialogTitle+'城市'">
      <editForm ref="editForm" :infoForm="infoForm" :filtercityList="filtercityList" style="width: 100%" @submit="submit" @closeWin="closeWin"></editForm>
    </el-dialog>

  </div>
</template>

<script>
  import cityApi from '@/api/system/city'
  import editForm from './edit'

  export default {
    name: "city",
    data() {
      return {
        // 当前页
        currentPage: 1,
        // 总条数
        count: 0,
        // 每页条数
        pageSize: 5,
        tableLoading: true,
        // 显示编辑角色弹框
        addDialogVisible: false,
        searchParam: {
          name: '',
        },
        citytList: [],
        delBtnLoading: false,
        addBtnLoading: false,
        infoForm: {
          name: '',
          pid: 0,
          hasChild: 2,
          sort: 1,
        },
        loading: false,
        tableHeight: document.body.clientHeight - 245,
        btnFunc: [],
        isAdmin: false,
        filtercityList: [],
        dialogTitle: '添加',
      }
    },
    components: {editForm},
    created() {
      const {btnFunc, isAdmin} = this.$store.state.user
      this.btnFunc = btnFunc
      this.isAdmin = isAdmin
      // this.pageSize = parseInt((document.body.clientHeight - 245) / 50)
    },
    watch: {
    },
    mounted() {
      this.tableLoading = true
      this.getCityList()
    },
    methods: {
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
          hasChild: 2,
          pid: 0,
          sort: 1,
        }
      },
      // 获取列表
      getCityList() {
        let searchParam = JSON.parse(JSON.stringify(this.searchParam))
        searchParam.pageIndex = this.currentPage
        searchParam.pageSize = this.pageSize
        cityApi.cityList(searchParam).then(res => {
          this.citytList = res.data.records
          this.count = res.data.total
          this.tableLoading = false
        }).catch(e => {
          this.count = 0
          this.citytList = []
          this.tableLoading = false
        })
      },
      // 获取编辑数据
      cityInfo(data){
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
            cityApi.cityInfo({id: data.id}).then(res => {
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
        let filerList = JSON.parse(JSON.stringify(this.citytList))
        this.findFilterList(filerList, id)
        this.filtercityList = filerList
      },
      findFilterList(list, id) {
        for (let i = list.length - 1; i >= 0; i--) {
          if (list[i].hasChild != 1 || list[i].id == id) {
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
        this.getCityList()
      },
      // 分页
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`)
      },
      // 删除记录
      cityDel(data) {
        this.$confirm('您确定要删除城市吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.delBtnLoading = true
          cityApi.cityDel({id: data.id}).then(res => {
            this.$message({
              type: 'success',
              message: '删除成功！'
            })
            this.delBtnLoading = false
            this.tableLoading = true
            this.getCityList()
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
        this.getCityList()
      },
      // 提交表单后逻辑处理
      submit(type) {
        if (type == 0) {
          // 添加
          this.search()
        } else {
          // 编辑
          this.tableLoading=true
          this.getCityList()
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
