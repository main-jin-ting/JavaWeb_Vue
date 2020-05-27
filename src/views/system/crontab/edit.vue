<template>
  <div class="info-form">
    <el-form ref="infoForm" :model="infoForm" size="small" label-width="100px">
      <el-form-item label="任务标题" prop="title" :rules="[{
                    required: true, message: '任务标题不能为空', trigger: 'blur'
                  },{min: 2, max: 100, message: '任务标题长度在2 到 20 个字符', trigger: 'blur'}]">
        <el-input maxlength="100" clearable v-model="infoForm.title" size="small" placeholder="请输入任务标题"/>
      </el-form-item>
      <el-form-item label="执行表达式" prop="cron" :rules="[{
                    required: true, message: '执行表达式不能为空', trigger: 'blur'
                  },{min: 2, max: 100, message: '执行表达式长度在2 到 20 个字符', trigger: 'blur'}]">
        <el-input maxlength="100" clearable v-model="infoForm.cron" size="small" placeholder="请输入执行表达式"/>
      </el-form-item>
      <el-form-item label="延迟秒数/毫秒" prop="delay">
        <el-input-number size="small" v-model="infoForm.delay"></el-input-number>
      </el-form-item>
      <el-form-item label="间隔秒数/毫秒" prop="fixed">
        <el-input-number size="small" v-model="infoForm.fixed"></el-input-number>
      </el-form-item>
      <el-form-item label="任务状态">
        <span v-show="infoForm.status == 1" style="color: #666">正常</span>
        <span v-show="infoForm.status == 2" style="color: #666">停用</span>
        <el-switch v-model="infoForm.status" :active-value="1" :inactive-value="2" size="small"/>
      </el-form-item>
      <el-form-item label="备注" prop="note">
        <el-input clearable v-model="infoForm.note" type="textarea" rows="3" size="small" placeholder="请输入备注"/>
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
  import crontabApi from '@/api/system/crontab'

  export default {
    name: "crontab",
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
      }
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
            let method = 'crontabAdd'
            if (this.infoForm.id) {
              method = 'crontabEdit'
            }
            this.addBtnLoading = true
            crontabApi[method](this.infoForm).then(res => {
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
