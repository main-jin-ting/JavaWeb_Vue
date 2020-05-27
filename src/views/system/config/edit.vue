<template>
  <div class="info-form">
    <el-form ref="infoForm" :model="infoForm" size="small" label-width="100px">
      <el-form-item label="配置标题：" prop="title" :rules="[{
                    required: true, message: '配置标题不能为空', trigger: 'blur'
                  },{min: 2, max: 20, message: '配置标题长度在2 到 20 个字符', trigger: 'blur'}]">
        <el-input maxlength="20" clearable v-model="infoForm.title" size="small" placeholder="请输入配置标题"/>
      </el-form-item>
      <el-form-item label="配置标签：" prop="tag" :rules="[{
                    required: true, message: '配置标签不能为空', trigger: 'blur'
                  }]">
        <el-input maxlength="100" clearable v-model="infoForm.tag" size="small" placeholder="请输入配置标签"/>
      </el-form-item>
      <el-form-item label="配置分组：" prop="groupId" :rules="{
                    required: true, message: '配置分组不能为空', trigger: 'change'
                  }">
        <el-select filterable clearable v-model="infoForm.groupId" size="small" placeholder="-请选择配置分组-">
          <el-option v-for="item in groupList" :key="item.id" :label="item.name" :value="item.id"/>
        </el-select>
      </el-form-item>
      <el-form-item label="配置类型：" prop="type" :rules="{
                    required: true, message: '配置类型不能为空', trigger: 'change'
                  }">
        <el-select filterable clearable v-model="infoForm.type" size="small"
                   placeholder="请选择配置类型">
          <el-option v-for="(value,key) in typeList" :key="key" :label="value" :value="key"/>
        </el-select>
      </el-form-item>
      <el-form-item label="配置值：" prop="value">
        <el-input clearable v-model="infoForm.value" type="textarea" rows="3" size="small" placeholder="请输入配置值"/>
      </el-form-item>
      <el-form-item label="配置项：" prop="options" :rules="[
                {min: 0, max: 255, message: '配置项不超过255个字符', trigger: 'blur'}]">
        <el-input maxlength="255" clearable v-model="infoForm.options" type="textarea" rows="3" size="small" placeholder="请输入配置项"/>
      </el-form-item>
      <el-form-item label="备注：" prop="note">
        <el-input clearable v-model="infoForm.note" type="textarea" rows="3" size="small" placeholder="请输入备注"/>
      </el-form-item>
      <el-form-item label="状态：">
        <el-switch v-model="infoForm.status" :active-value="1" :inactive-value="2" size="small"/>
      </el-form-item>
      <el-form-item label="排序：" prop="sort">
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
  import configApi from '@/api/system/config'

  export default {
    name: "config",
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
      groupList:{
        type:Array,
        default(){
          return []
        }
      },
      typeList:{
        type:Object,
        default(){
          return {};
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
            let method = 'configAdd'
            if (this.infoForm.id) {
              method = 'configEdit'
            }
            this.addBtnLoading = true
            configApi[method](this.infoForm).then(res => {
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
