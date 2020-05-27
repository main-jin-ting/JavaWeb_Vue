<template>
  <div class="app-container">
    <el-tabs type="border-card">
      <el-form :inline="true" :model="searchParam" class="demo-form-inline head-form">
          <el-form-item label="表名称">
            <el-input clearable v-model="searchParam.tableName" size="small" placeholder="请输入表名称"
                      style="width: 200px" @keyup.enter.native="handleQuery"/>
          </el-form-item>
          <el-form-item label="表描述">
            <el-input clearable v-model="searchParam.tableComment" size="small" placeholder="请输入表描述"
                      style="width: 200px" @keyup.enter.native="handleQuery"/>
          </el-form-item>
          <el-form-item>
            <el-button :loading="tableLoading" @click="search" size="small" icon="el-icon-search" type="primary">搜索
            </el-button>
            <el-button @click="gentableInfo()" size="small" icon="el-icon-plus" type="primary">添加表
            </el-button>
            <el-button icon="el-icon-date" @click="batchDel()" size="small" class="add">批量删除</el-button>
            <el-button icon="el-icon-setting" @click="batchCache()" size="small" class="add">重置缓存</el-button>
            <el-button @click="initSearchParam();search()" icon="el-icon-refresh-right"
                       type="primary" size="small"
                       style="background-color: #fff; border: 1px solid #ccc ; color: #666">清空
            </el-button>
          </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              type="primary"
              icon="el-icon-download"
              size="small"
              @click="handleGenTable"
            >生成</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="info"
              icon="el-icon-upload"
              size="small"
              @click="openImportTable"
            >导入</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="success"
              icon="el-icon-edit"
              size="small"
              :disabled="single"
              @click="handleEditTable"
            >修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="small"
              :disabled="multiple"
              @click="handleDelete"
            >删除</el-button>
          </el-col>
        </el-row>

        <el-table stripe ref="table" :height="tableHeight" v-loading="tableLoading"
                  :data="gentableList" border row-key="id" @selection-change="handleSelectionChange">
          <el-table-column show-overflow-tooltip type="selection" align="center"/>
          <el-table-column show-overflow-tooltip prop="id" label="序号" align="center" width="80"/>
          <el-table-column show-overflow-tooltip prop="tableName" label="表名称" align="center"/>
          <el-table-column show-overflow-tooltip prop="tableComment" label="表描述" align="center"/>
          <el-table-column show-overflow-tooltip prop="className" label="实体类称" align="center"/>
          <el-table-column show-overflow-tooltip prop="tplCategory" label="使用模板" align="center"/>
          <el-table-column show-overflow-tooltip prop="packageName" label="包路径" align="center"/>
          <el-table-column show-overflow-tooltip prop="moduleName" label="所属模块" align="center"/>
          <el-table-column show-overflow-tooltip prop="businessName" label="业务名称" align="center"/>
          <el-table-column show-overflow-tooltip prop="functionName" label="业务标题" align="center"/>
          <el-table-column show-overflow-tooltip prop="createTime" label="创建时间" align="center" width="180"/>
          <el-table-column show-overflow-tooltip prop="updateTime" label="更新时间" align="center" width="180"/>
          <el-table-column v-if="isAdmin||(btnFunc.filter(value=>value=='edit'||value=='drop').length>0)" label="操作" width="200" align="center" fixed="right">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                icon="el-icon-edit"
                @click="handleEditTable(scope.row)"
              >编辑</el-button>
              <el-button
                type="text"
                size="small"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
                :loading="delBtnLoading"
              >删除</el-button>
              <el-button
                type="text"
                size="small"
                icon="el-icon-download"
                @click="handleGenTable(scope.row)"
                :loading="genBtnLoading"
              >生成代码</el-button>
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

    <!-- 导入业务表 -->
    <import-table ref="import" @ok="handleQuery" />

  </div>
</template>

<script>
  import gentableApi from '@/api/gentable/gentable'
  import importTable from "./importTable";
  import { downLoadZip } from "@/api/common/zipdownload";

  export default {
    name: "genTable",
    data() {
      return {
        // 选中数组
        ids: [],
        // 选中表数组
        tableNames: [],
        // 非单个禁用
        single: true,
        // 非多个禁用
        multiple: true,
        tableLoading: false,
        delBtnLoading: false,
        genBtnLoading: false,
        // 当前页
        currentPage: 1,
        // 总条数
        count: 0,
        // 每页条数
        pageSize: 10,
        searchParam: {
          tableName: '',
          tableComment: '',
        },
        gentableList: [],
        loading: false,
        tableHeight: document.body.clientHeight - 245,
        btnFunc: [],
        isAdmin: false,
      }
    },
    components: { importTable },
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
      this.getGenTableList()
    },
    watch: {
    },
    methods: {
      // 初始化搜索条件
      initSearchParam() {
        this.searchParam = {
          tableName: '',
          tableComment: '',
        }
      },
      // 获取数据列表
      getGenTableList() {
        let searchParam = JSON.parse(JSON.stringify(this.searchParam))
        searchParam.pageIndex = this.currentPage
        searchParam.pageSize = this.pageSize
        gentableApi.getGenTableList(searchParam).then(res => {
          this.gentableList = res.data
          this.count = res.data.total
          this.tableLoading = false
        }).catch(e => {
          this.gentableList = []
          this.tableLoading = false
        })
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.tableId);
        this.tableNames = selection.map(item => item.tableName);
        this.single = selection.length != 1;
        this.multiple = !selection.length;
      },
      handlePageChange(val) {
        this.currentPage = val
        this.tableLoading = true
        this.$refs.table.bodyWrapper.scrollTop = 0;
        this.getGenTableList()
      },
      // 搜索
      search() {
        this.currentPage = 1
        this.tableLoading = true
        this.$refs.table.bodyWrapper.scrollTop = 0;
        this.getGenTableList()
      },
      // 搜索
      handleQuery(){

      },
      // 修改
      handleEditTable(row) {
        const tableId = row.id || this.ids[0];
        this.$router.push({ path: "/gentable/edit", query: { tableId: tableId } });
      },
      // 生成
      handleGenTable(row) {
        this.$confirm('您确定要生成代码吗？生成后会覆盖原有的文件！', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.genBtnLoading = true
          const tableNames = row.tableName || this.tableNames.join(',');
          if (tableNames == "") {
            this.msgError("请选择要生成的数据");
            return;
          }
          gentableApi.generatorCode(tableNames).then(res => {
            this.$message({
              type: 'success',
              message: res.msg
            })
            this.genBtnLoading = false
            this.tableLoading = true
            this.getGenTableList()
          }).catch(e => {
            this.genBtnLoading = false
            this.msgError("代码生成异常");
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消代码生成'
          })
        })
        
      },
      // 删除
      handleDelete(data) {
        this.$confirm('您确定要删除字典类型吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.delBtnLoading = true
          gentableApi.genTableDel({id: data.id}).then(res => {
            this.$message({
              type: 'success',
              message: '删除成功！'
            })
            this.delBtnLoading = false
            this.tableLoading = true
            this.getGenTableList()
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
      // 导入业务表
      openImportTable() {
        this.$refs.import.show();
      },
    }
  }
</script>

<style lang="less" scoped>
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
