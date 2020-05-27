<template>
  <div class="info-form">
    <el-form ref="infoForm" :model="infoForm" size="small" label-width="100px">
      <el-form-item label="部门名称" prop="name" :rules="[{
                    required: true, message: '部门名称名称不能为空', trigger: 'blur'
                  },{min: 2, max: 20, message: '部门名称长度在2 到 20 个字符', trigger: 'blur'}]">
        <el-input maxlength="20" clearable v-model="infoForm.name" size="small" placeholder="请输入部门名称"/>
      </el-form-item>
      <el-form-item prop="pid" label="上级部门">
          <el-cascader
            :disabled="infoForm.disable"
            placeholder="无"
            v-model="infoForm.pid"
            ref="refHandle"
            :options="filterDepList"
            :props="{ checkStrictly: true ,value:'id',label:'name'}"
          ></el-cascader>
        </el-form-item>
      <el-form-item label="有无子级">
          <el-switch v-model="infoForm.hasChild" :active-value="1" :inactive-value="2" size="small"/>
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
  import depApi from '@/api/permission/dep'

  export default {
    name: "dep",
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
      filterDepList: {},
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
            let method = 'depAdd'
            if (this.infoForm.id) {
              method = 'depEdit'
            }
            this.addBtnLoading = true
            depApi[method](this.infoForm).then(res => {
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
