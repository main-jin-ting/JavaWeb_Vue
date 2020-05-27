<template>
  <div class="info-form">
    <el-form ref="infoForm" :model="infoForm" size="small" label-width="100px">
      <el-form-item label="字典标题" prop="title" :rules="[{
                    required: true, message: '字典标题名称不能为空', trigger: 'blur'
                  },{min: 2, max: 20, message: '字典标题长度在2 到 20 个字符', trigger: 'blur'}]">
        <el-input maxlength="20" clearable v-model="infoForm.title" size="small" placeholder="请输入字典标题"/>
      </el-form-item>
      <el-form-item label="字典类型" prop="typeId" :rules="{
                    required: true, message: '所属字典类型不能为空', trigger: 'change'
                  }">
        <el-select filterable clearable v-model="infoForm.typeId" size="small" placeholder="-请选择-">
          <el-option v-for="item in typeList" :key="item.id" :label="item.name" :value="item.id"/>
        </el-select>
      </el-form-item>
      <el-form-item label="内部标签" prop="tag">
        <el-input maxlength="50" clearable v-model="infoForm.tag" size="small" placeholder="请输入内部标签"/>
      </el-form-item>
      <el-form-item label="字典值" prop="value" :rules="[
                {min: 0, max: 200, message: '字典值不超过200个字符', trigger: 'blur'}]">
        <el-input maxlength="200" clearable v-model="infoForm.value" type="textarea" rows="5" size="small" placeholder="请输入字典值"/>
      </el-form-item>
      <el-form-item label="字典状态">
        <span v-show="infoForm.status == 1" style="color: #666">显示</span>
        <span v-show="infoForm.status == 2" style="color: #666">隐藏</span>
        <el-switch v-model="infoForm.status" :active-value="1" :inactive-value="2" size="small"/>
      </el-form-item>
      <el-form-item label="备注" prop="note" :rules="[
                {min: 0, max: 200, message: '备注不超过200个字符', trigger: 'blur'}]">
        <el-input maxlength="200" clearable v-model="infoForm.note" type="textarea" rows="5" size="small" placeholder="请输入备注"/>
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
  import dicApi from '@/api/system/dic'

  export default {
    name: "dic",
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
      // 字典类型
      typeList: {
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
            let method = 'dicAdd'
            if (this.infoForm.id) {
              method = 'dicEdit'
            }
            this.addBtnLoading = true
            dicApi[method](this.infoForm).then(res => {
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
