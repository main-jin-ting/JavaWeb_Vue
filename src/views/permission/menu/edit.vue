<template>
  <div class="info-form">
    <el-form ref="infoForm" :model="infoForm" size="small" label-width="100px">
      <el-form-item label="菜单名称" prop="name" :rules="[{
                    required: true, message: '菜单名称名称不能为空', trigger: 'blur'
                  },
                  {min: 2, max: 20, message: '菜单名称长度在2 到 20 个字符', trigger: 'blur'}]">
        <el-input maxlength="20" clearable v-model="infoForm.name" size="small" placeholder="请输入菜单名称"/>
      </el-form-item>
      <el-form-item prop="pid" label="上级菜单">
        <el-cascader
          :disabled="infoForm.disable"
          placeholder="请选择上级菜单"
          v-model="infoForm.pid"
          ref="refHandle"
          :options="filterMenuList"
          :props="{ checkStrictly: true ,value:'id',label:'name'}"
        ></el-cascader>
      </el-form-item>
      <el-form-item label="菜单地址" prop="url" :rules="[{
                    required: true, message: '菜单地址不能为空', trigger: 'blur'
                  },
                  {min: 1, max: 30, message: '长度在1 到 30 个字符', trigger: 'blur'}]">
        <el-input maxlength="30" clearable v-model="infoForm.url" size="small" placeholder="请输入菜单地址"/>
      </el-form-item>
      <el-form-item label="图标" prop="icon" :rules="[
                {min: 0, max: 50, message: '不超过 50 个字符', trigger: 'blur'}]">
        <el-input maxlength="50" clearable v-model="infoForm.icon" size="small" placeholder="请输入图标">
          <el-button @click="selectIcon()" slot="append">搜索图标</el-button>
        </el-input>
      </el-form-item>
      <el-form-item label="权限" prop="permission" :rules="[{
                required: true, message: '权限不能为空', trigger: 'blur'
              },
            {min: 1, max: 50, message: '长度在1 到 50 个字符', trigger: 'blur'}]">
        <el-input maxlength="50" clearable v-model="infoForm.permission" size="small" placeholder="请输入权限"/>
      </el-form-item>
      <el-form-item label="备注" prop="note" :rules="[
            {min: 0, max: 200, message: '备注长度不超过 200 个字符', trigger: 'blur'}]">
        <el-input maxlength="200" clearable v-model="infoForm.remark" type="textarea" rows="3" size="small" placeholder="请输入内容"/>
      </el-form-item>
      <el-form-item label="类型">
        <el-radio-group v-model="infoForm.type">
          <el-radio :label="1">目录</el-radio>
          <el-radio :label="2">菜单</el-radio>
          <el-radio :label="3">按钮</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否显示">
        <span v-show="infoForm.status == 1" style="color: #666">显示</span>
        <span v-show="infoForm.status == 2" style="color: #666">隐藏</span>
        <el-switch v-model="infoForm.status" :active-value="1" :inactive-value="2" size="small"/>
      </el-form-item>
      <el-form-item label="公共权限">
        <span v-show="infoForm.isPublic == 1" style="color: #666">是</span>
        <span v-show="infoForm.isPublic == 2" style="color: #666">否</span>
        <el-switch v-model="infoForm.isPublic" :active-value="1" :inactive-value="2" size="small"/>
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input-number size="small" v-model="infoForm.sort"></el-input-number>
      </el-form-item>
    </el-form>
    <div style="text-align: center">
      <el-button icon="el-icon-document-add" :loading="addBtnLoading" type="primary" size="medium" @click="submitForm('infoForm')">提交
      </el-button>
      <el-button icon="el-icon-back" style="margin-left: 15px" size="medium" @click="closeWin('infoForm')">关闭
      </el-button>
    </div>

    
  </div>
</template>

<script>
  import menuApi from '@/api/permission/menu'

  export default {
    name: "menus",
    data() {
      return {
        addBtnLoading: false,
        // // ICON
        // fontVisible: false,
        // menuIcon: [],
        // searchValue: '',
      }
    },
    props: {
      // 参数接收
      infoForm: {
        type: Object,
        default() {
          return {};
        }
      },
      // 参数接收
      filterMenuList: {},
    },
    created() {
      
    },
    mounted() {
    },
    methods: {
      // 选择图标
      selectIcon(){
         this.$emit('selectIcon')
      },
      // 提交表单
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let method = 'menuAdd'
            if (this.infoForm.id) {
              method = 'menuEdit'
            }
            this.addBtnLoading = true
            menuApi[method](this.infoForm).then(res => {
              this.addBtnLoading = false
              this.$refs[formName].resetFields()
              this.$message({
                type: 'success',
                message: this.infoForm.id ? '修改成功' : '添加成功'
              })
              if (this.infoForm.id) {
                // 编辑
                this.$emit('submit',1)
              }else{
                // 添加
                this.$emit('submit',0)
              }
              // 调动关闭窗体方法
              this.$emit('closeWin')
            }).catch(e => {
              this.addBtnLoading = false
            })
          }
        })
      },
      // 关闭窗体
      closeWin() {
        this.$refs['infoForm'].resetFields()
        this.$emit('closeWin')
      }
    }
  }
</script>

<style lang="less">
  
</style>
