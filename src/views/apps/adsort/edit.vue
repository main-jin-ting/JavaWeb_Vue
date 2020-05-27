<template>
  <div class="info-form">
    <el-form ref="infoForm" :model="infoForm" size="small" label-width="100px">
      <el-form-item label="广告位名称" prop="name" :rules="[{
                    required: true, message: '广告位名称不能为空', trigger: 'blur'
                  },{min: 2, max: 20, message: '广告位名称长度在2 到 20 个字符', trigger: 'blur'}]">
        <el-input maxlength="20" clearable v-model="infoForm.name" size="small" placeholder="请输入广告位名称"/>
      </el-form-item>
      <el-form-item label="友链平台" prop="platform" :rules="{
                    required: true, message: '友链平台不能为空', trigger: 'change'
                  }">
        <el-select filterable clearable v-model="infoForm.platform" size="small"
                   placeholder="请选择友链平台">
          <el-option v-for="(value,key) in platformList" :key="key" :label="value" :value="parseInt(key)"/>
        </el-select>
      </el-form-item>
      <el-form-item prop="cateId" label="所属栏目">
        <el-cascader
          placeholder="无"
          v-model="infoForm.cateId"
          ref="refHandle"
          :options="filterCateList"
          :props="{ checkStrictly: true ,value:'id',label:'name'}"
        ></el-cascader>
      </el-form-item>
      <el-form-item label="广告位描述" prop="description" :rules="[{
                    required: true, message: '广告位描述不能为空', trigger: 'blur'
                  },{min: 2, max: 255, message: '广告位描述长度在2 到 255 个字符', trigger: 'blur'}]">
        <el-input maxlength="20" clearable v-model="infoForm.description" size="small" placeholder="请输入广告位描述"/>
      </el-form-item>
      <el-form-item label="广告位置编号" prop="locId">
        <el-input maxlength="50" clearable v-model="infoForm.locId" size="small" placeholder="请输入广告位置编号"/>
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
  import adSortApi from '@/api/apps/adSort'

  export default {
    name: "adSort",
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
      platformList:{
        type:Array,
        default(){
          return [];
        }
      },
      // 参数接收
      filterCateList: {},
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
            let method = 'adSortAdd'
            if (this.infoForm.id) {
              method = 'adSortEdit'
            }
            this.addBtnLoading = true
            adSortApi[method](this.infoForm).then(res => {
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
