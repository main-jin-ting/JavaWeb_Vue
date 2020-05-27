<template>
  <div class="info-form">
    <el-form ref="infoForm" :model="infoForm" size="small" label-width="100px">
      <el-form-item label="城市名称" prop="name" :rules="[{
                    required: true, message: '城市名称名称不能为空', trigger: 'blur'
                  },{min: 2, max: 20, message: '城市名称长度在2 到 20 个字符', trigger: 'blur'}]">
        <el-input maxlength="20" clearable v-model="infoForm.name" size="small" placeholder="请输入城市名称"/>
      </el-form-item>
      <el-form-item label="城市编码" prop="citycode">
        <el-input size="small" v-model="infoForm.citycode"/>
      </el-form-item>
      <el-form-item label="父地理编码" prop="pAdcode">
        <el-input size="small" v-model="infoForm.pAdcode"/>
      </el-form-item>
      <el-form-item label="地理编码" prop="adcode">
        <el-input size="small" v-model="infoForm.adcode"/>
      </el-form-item>
      <el-form-item label="城市经度" prop="lng">
        <el-input maxlength="30" clearable v-model="infoForm.lng" size="small" placeholder="请输入城市经度"/>
      </el-form-item>
      <el-form-item label="城市纬度" prop="lat">
        <el-input maxlength="30" clearable v-model="infoForm.lat" size="small" placeholder="请输入城市纬度"/>
      </el-form-item>
      <el-form-item label="级别">
        <el-radio-group v-model="infoForm.level">
          <el-radio :label="1">省</el-radio>
          <el-radio :label="2">市</el-radio>
          <el-radio :label="3">县/区</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input-number size="small" v-model="infoForm.sort"/>
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
  import cityApi from '@/api/system/city'

  export default {
    name: "city",
    data() {
      return {
        addBtnLoading: false,
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
      filtercityList: {},
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
            let method = 'cityAdd'
            if (this.infoForm.id) {
              method = 'cityEdit'
            }
            this.addBtnLoading = true
            cityApi[method](this.infoForm).then(res => {
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
