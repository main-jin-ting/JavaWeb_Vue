<template>
  <div class="layout-container">
    <el-tabs type="border-card">
      <el-form :inline="true" :model="searchParam" class="demo-form-inline head-form">
          <el-form-item prop="locId" label="推荐位置">
              <el-select v-model="searchParam.locId" filterable placeholder="请选择推荐位置">
                <el-option
                  v-for="item in layoutDescList"
                  :key="item.locId"
                  :label="item.locDesc"
                  :value="item.itemId + ',' +item.locId">
                </el-option>
              </el-select>
            </el-form-item>
          <el-form-item>
            <el-button :loading="tableLoading" @click="search" size="small" icon="el-icon-search" type="primary">搜索
            </el-button>
            <el-button @click="layoutInfo()" size="small" icon="el-icon-plus" type="primary">添加推荐
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
                  :data="layoutList" border row-key="id">
          <el-table-column show-overflow-tooltip type="selection" align="center"/>
          <el-table-column show-overflow-tooltip prop="id" label="ID" align="center" width="80"/>
          <el-table-column show-overflow-tooltip prop="itemName" label="站点名称" align="center" width="120"/>
          <el-table-column show-overflow-tooltip prop="locName" label="推荐位置" align="center"/>
          <el-table-column show-overflow-tooltip prop="typeName" label="推荐类型" align="center" width="120"/>
          <el-table-column show-overflow-tooltip prop="typeDesc" label="推荐描述" align="center"/>
          <el-table-column show-overflow-tooltip prop="image" label="推荐图片" align="center" width="80">
            <template slot-scope="{row}">
              <el-avatar :size="30" :src="row.image">
                <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"/>
              </el-avatar>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="sort" label="排序" align="center" width="100"/>
          <el-table-column show-overflow-tooltip prop="createUser" label="添加人" align="center" width="150"/>
          <el-table-column show-overflow-tooltip prop="createTime" label="添加时间" align="center" width="180"/>
          <el-table-column v-if="isAdmin||(btnFunc.filter(value=>value=='edit'||value=='drop').length>0)" label="操作" width="120" align="center" fixed="right">
            <template slot-scope="scoped">
              <el-row>
                <el-tooltip v-if="isAdmin||btnFunc.some(btn=>btn=='edit')" class="item" effect="dark" content="编辑" placement="bottom">
                  <el-button type="primary" size="mini" icon="el-icon-edit" @click="layoutInfo(scoped.row)"/>
                </el-tooltip>
                <el-tooltip v-if="!isAdmin||btnFunc.some(btn=>btn=='drop')" class="item" effect="dark" content="删除" placement="bottom">
                  <el-button :loading="delBtnLoading" type="danger" size="mini" class="el-icon-delete" @click="layoutDel(scoped.row)"/>
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
    <el-dialog :close-on-press-escape="false" :close-on-click-modal="false" center :visible.sync="addDialogVisible" :title="dialogTitle+'推荐'">
      <editForm ref="editForm" :infoForm="infoForm" :layoutDescList="layoutDescList" :typeList="typeList" style="width: 100%" @submit="submit" @closeWin="closeWin"></editForm>
    </el-dialog>

  </div>
</template>

<script>
  import layoutApi from '@/api/apps/layout'
  import editForm from './edit'

  export default {
    name: "layout",
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
          itemId: '',
          locId: '',
        },
        layoutList: [],
        layoutDescList: [],
        typeList: [],
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
      this.getLayoutList()
      // 获取基础数据
      this.queryData()
    },
    watch: {
    },
    methods: {
      // 异步获取数据
      async queryData(){
        // 获取布局描述
        await this.getLayoutDescList()
        // 获取基础数据
        await this.getParamList()
      },
      // 初始化搜索条件
      initSearchParam() {
        this.searchParam = {
          itemId: '',
          locId: '',
        }
      },
      // 获取数据列表
      getLayoutList() {
        let searchParam = JSON.parse(JSON.stringify(this.searchParam))
        // 筛选位置
        if (this.searchParam.locId) {
          let itemArr = this.searchParam.locId.split(',');
          searchParam.itemId = itemArr[0];
          searchParam.locId = itemArr[1];
        }
        searchParam.pageIndex = this.currentPage
        searchParam.pageSize = this.pageSize
        layoutApi.layoutList(searchParam).then(res => {
          this.layoutList = res.data.records
          this.count = res.data.total
          this.tableLoading = false
        }).catch(e => {
          this.layoutList = []
          this.tableLoading = false
        })
      },
      // 获取编辑数据
      layoutInfo(data){
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
            layoutApi.layoutInfo({id: data.id}).then(res => {
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
      layoutDel(data) {
        this.$confirm('您确定要删除推荐吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.delBtnLoading = true
          layoutApi.layoutDel({id: data.id}).then(res => {
            this.$message({
              type: 'success',
              message: '删除成功！'
            })
            this.delBtnLoading = false
            this.tableLoading = true
            this.getLayoutList()
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
      // 获取基础参数
      getParamList() {
        layoutApi.getParamList().then(res => {
          const {type_list} = res.data
          this.typeList = type_list ? type_list : {}
        }).catch(e => {
          this.typeList = {}
        })
      },
      // 获取栏目列表
      getLayoutDescList() {
        layoutApi.getLayoutDescList().then(res => {
          this.layoutDescList = res.data
        }).catch(e => {
          this.layoutDescList = []
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
          layoutApi.layoutStatus(params).then(res => {
            this.$message({
              type: 'success',
              message: '操作成功！'
            })
            this.getLayoutList()
          }).catch(e => {
            let layoutList = JSON.parse(JSON.stringify(this.layoutList))
            for (let i = 0; i < layoutList.length; i++) {
              if (layoutList[i].id == data.id) {
                layoutList[i].status = data.status == 1 ? 2 : 1
              }
            }
            this.layoutList = Object.assign([], layoutList)
            this.tableLoading = false
          })
        }).catch(() => {
          let layoutList = JSON.parse(JSON.stringify(this.layoutList))
          for (let i = 0; i < layoutList.length; i++) {
            if (layoutList[i].id == data.id) {
              layoutList[i].status = data.status == 1 ? 2 : 1
            }
          }
          this.layoutList = Object.assign([], layoutList)
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
        this.getLayoutList()
      },
      // 搜索
      search() {
        debugger
        this.currentPage = 1
        this.tableLoading = true
        this.$refs.table.bodyWrapper.scrollTop = 0;
        this.getLayoutList()
      },
      // 提交表单后逻辑处理
      submit(type) {
        if (type == 0) {
          // 添加
          this.search()
        } else {
          // 编辑
          this.tableLoading=true
          this.getLayoutList()
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
  .layout-container {
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
