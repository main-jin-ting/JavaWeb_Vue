<template>
  <div class="info-form">
    <el-form ref="infoForm" :model="infoForm" size="small" label-width="100px">
      <el-form-item label="推荐名称" prop="name" :rules="[{
                    required: true, message: '推荐名称不能为空', trigger: 'blur'
                  },{min: 2, max: 20, message: '推荐名称长度在2 到 20 个字符', trigger: 'blur'}]">
        <el-input maxlength="20" clearable v-model="infoForm.name" size="small" placeholder="请输入推荐名称"/>
      </el-form-item>
      <el-form-item label="所属站点" prop="itemId" :rules="{
                    required: true, message: '所属站点不能为空', trigger: 'change'
                  }">
        <el-select filterable clearable v-model="infoForm.itemId" size="small" placeholder="-请选择站点-">
          <el-option v-for="item in itemList" :key="item.id" :label="item.name" :value="item.id"/>
        </el-select>
      </el-form-item>
      <el-form-item label="位置描述" prop="locDesc" :rules="[{
                    required: true, message: '位置描述不能为空', trigger: 'blur'
                  },{min: 2, max: 255, message: '位置描述长度在2 到 255 个字符', trigger: 'blur'}]">
        <el-input maxlength="20" clearable v-model="infoForm.locDesc" size="small" placeholder="请输入位置描述"/>
      </el-form-item>
      <el-form-item label="位置编号" prop="locId">
        <el-input maxlength="50" clearable v-model="infoForm.locId" size="small" placeholder="请输入位置编号"/>
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
  import layoutDescApi from '@/api/apps/layoutDesc'

  export default {
    name: "layoutDesc",
    data() {
      return {
        addBtnLoading: false,
      }
    },
    props: {
      infoForm: {
        type: Object,
        default() {
          return {};
        }
      },
      // 接收参数
      itemList:{
        type:Array,
        default(){
          return []
        }
      },
    },
    created() {
    },
    mounted() {
    },
    methods: {
      // 提交表单
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let method = 'layoutDescAdd'
            if (this.infoForm.id) {
              method = 'layoutDescEdit'
            }
            this.addBtnLoading = true
            layoutDescApi[method](this.infoForm).then(res => {
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
