<template>
  <div class="list-container">
    <el-tabs type="border-card">
      <el-form :inline="true" :model="searchParam" class="demo-form-inline head-form">
          <el-form-item label="菜单名称">
            <el-input clearable v-model="searchParam.name" size="small" placeholder="请输入菜单名称"
                      style="width: 200px"/>
          </el-form-item>
          <el-form-item>
            <el-button :loading="tableLoading" @click="search" size="small" icon="el-icon-search" type="primary">搜索
            </el-button>
            <el-button @click="menuInfo()" size="small" icon="el-icon-plus" type="primary">添加菜单
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
                  :data="menuList"
                  border row-key="id">
          <el-table-column show-overflow-tooltip prop="id" label="ID" align="center" width="100"/>
          <el-table-column show-overflow-tooltip prop="name" label="名称" align="center"/>
          <el-table-column show-overflow-tooltip prop="url" label="URL地址" align="center"/>
          <el-table-column show-overflow-tooltip prop="icon" label="图标" align="center" width="100">
            <template slot-scope="{row}">
              <svg-icon v-if="row.icon" :iconClass='row.icon' className='icon'></svg-icon>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="type" label="类型" align="center" width="100">
            <template slot-scope="{row}">
              <el-tag v-if="row.type === 1" type="" size="small">目录</el-tag>
              <el-tag v-if="row.type === 2" type="success" size="small">菜单</el-tag>
              <el-tag v-if="row.type === 3" type="warning" size="small">按钮</el-tag>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="status" label="状态" align="center" width="120">
            <template slot-scope="{row}">
              <span v-show="row.status ==1" style="color: #666">显示</span>
              <span v-show="row.status ==2" style="color: #666">隐藏</span>
              <el-switch v-if="isAdmin||btnFunc.some(btn=>btn=='status')" v-model="row.status" :active-value="1"
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
                <el-button type="primary" size="mini" icon="el-icon-edit" @click="menuInfo(scope.row)"/>
              </el-tooltip>
              <el-tooltip v-if="isAdmin||btnFunc.some(btn=>btn=='drop')" class="item" effect="dark" content="删除" placement="bottom">
                <el-button :loading="delBtnLoading" type="danger" size="mini" class="el-icon-delete" @click="menuDel(scope.row)"/>
              </el-tooltip>
              <el-button v-if="scope.row.type <= 2 && (isAdmin||btnFunc.some(btn=>btn=='add'))" type="primary" size="mini" icon="el-icon-plus" 
                @click="addChilds(scope.row)" class="add">添加子级
              </el-button>
            </template>
          </el-table-column>
        </el-table>
    </el-tabs>

    <!-- 编辑表单 -->
    <el-dialog :close-on-press-escape="false" :close-on-click-modal="false" center :visible.sync="addDialogVisible" :title="dialogTitle+'菜单'">
      <editForm ref="editForm" :infoForm="infoForm" :filterMenuList="filterMenuList" style="width: 100%" @selectIcon="selectIcon" @submit="submit" @closeWin="closeWin"></editForm>
    </el-dialog>

    <!-- 选择图标 -->
    <el-dialog :close-on-press-escape="false" :close-on-click-modal="false" class="font-dialog" :visible.sync="fontVisible" title="选择图标">
      <el-input style="width: 50%;margin-left: 10px" placeholder="" v-model="searchValue">
        <el-button slot="append" icon="el-icon-search"></el-button>
      </el-input>
      <div class="icon-box">
        <div @click="IconSelectClick(value)" :title="value" class="icon-item" :key="index"
             v-for="(value,index) in menuIcon.filter(value=>value.indexOf(searchValue)>-1)">
          <svg-icon :iconClass='value' className='icon'></svg-icon>
        </div>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import menuApi from '@/api/permission/menu'
  import editForm from './edit'

  export default {
    name: "menus",
    data() {
      return {
        tableLoading: true,
        // 显示编辑角色弹框
        addDialogVisible: false,
        searchParam: {
          name: '',
        },
        menuList: [],
        delBtnLoading: false,
        addBtnLoading: false,
        infoForm: {
          name: '',
          pid: 0,
          type: 2,
          status: 1,
          sort: 1,
          icon: '',
        },
        loading: false,
        tableHeight: document.body.clientHeight - 200,
        btnFunc: [],
        isAdmin: false,
        filterMenuList: [],
        dialogTitle: '添加',
        // ICON
        fontVisible: false,
        menuIcon: [],
        searchValue: '',
      }
    },
    components: {editForm},
    created() {
      const {btnFunc, isAdmin} = this.$store.state.user
      this.btnFunc = btnFunc
      this.isAdmin = isAdmin

      // 图标
      let req = require.context('../../../assets/icons', false, /\.svg$/)
      let menuIcon = []
      req.keys().map(item => {
        menuIcon.push(item.replace(/.svg/g, "").replace(/.\//g, ""))
      })
      this.menuIcon = menuIcon
    },
    watch: {
    },
    mounted() {
      this.tableLoading = true
      this.getMenuList()
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
          pid: 0,
          type: 2,
          status: 1,
          sort: 1,
          icon: '',
        }
      },
      // 获取列表
      getMenuList() {
        let searchParam = JSON.parse(JSON.stringify(this.searchParam))
        menuApi.menuList(searchParam).then(res => {
          this.menuList = res.data
          this.tableLoading = false
        }).catch(e => {
          this.menuList = []
          this.tableLoading = false
        })
      },
      // 获取编辑数据
      menuInfo(data){
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
            menuApi.menuInfo({id: data.id}).then(res => {
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
        let filerList = JSON.parse(JSON.stringify(this.menuList))
        this.findFilterList(filerList, id)
        this.filterMenuList = filerList
      },
      findFilterList(list, id) {
        for (let i = list.length - 1; i >= 0; i--) {
          if (list[i].type > 2 || list[i].id == id) {
            list.splice(i, 1)
          } else {
            if (list[i].children && list[i].children.length > 0) {
              this.findFilterList(list[i].children)
            }
          }
        }
      },
      // 添加节点
      addFunc(data){
        
      },
      // 删除记录
      menuDel(data) {
        this.$confirm('您确定要删除菜单吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.delBtnLoading = true
          menuApi.menuDel({id: data.id}).then(res => {
            this.$message({
              type: 'success',
              message: '删除成功！'
            })
            this.delBtnLoading = false
            this.tableLoading = true
            this.getMenuList()
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
        this.tableLoading = true
        this.$refs.table.bodyWrapper.scrollTop = 0;
        this.getMenuList()
      },
      // 提交表单后逻辑处理
      submit(type) {
        if (type == 0) {
          // 添加
          this.search()
        } else {
          // 编辑
          this.tableLoading=true
          this.getMenuList()
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
      },
      // 选择图标
      selectIcon(){
        this.fontVisible = true
        this.searchValue = ''
      },
      // 选择图标ICON
      IconSelectClick(value) {
        this.infoForm.icon = value
        this.fontVisible = false
      },

    }
  }
</script>

<style lang="less">
  .list-container {
    width: 100%;

    .svg-icon {
      width: 20px;
      height: 20px;
      background-color: #eeeeee;
    }

    .font-dialog {
      .el-dialog__body {
        padding: 10px 10px;
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

    .icon-box {
      display: flex;
      flex-wrap: wrap;

      .icon-item {
        border: 1px solid #eeeeee;
        width: 41px;
        height: 42px;
        margin-top: 10px;
        line-height: 42px;
        font-size: 18px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-left: 10px;
      }

      .icon-item:hover {
        border: 1px solid #409eff;
        cursor: pointer;
        color: #409eff;
      }
    }
  }
</style>
