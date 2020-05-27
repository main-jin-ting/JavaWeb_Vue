<template>
  <div class="info-form">
    <el-form ref="infoForm" :model="infoForm" size="small" label-width="100px">
      <el-form-item label="模板名称" prop="title" :rules="[{
                    required: true, message: '模板名称不能为空', trigger: 'blur'
                  },{min: 2, max: 20, message: '模板名称长度在2 到 20 个字符', trigger: 'blur'}]">
        <el-input maxlength="20" clearable v-model="infoForm.title" size="small" placeholder="请输入模板名称"/>
      </el-form-item>
      <el-form-item label="模板CODE" prop="code" :rules="[{
                    required: true, message: '模板CODE不能为空', trigger: 'blur'
                  },{min: 2, max: 20, message: '模板CODE长度在2 到 20 个字符', trigger: 'blur'}]">
        <el-input maxlength="20" clearable v-model="infoForm.code" size="small" placeholder="请输入模板名称"/>
      </el-form-item>
      <el-form-item label="模板类型" prop="type" :rules="{
                    required: true, message: '模板类型不能为空', trigger: 'change'
                  }">
        <el-select filterable clearable v-model="infoForm.type" size="small"
                   placeholder="请选择模板类型">
          <el-option v-for="(value,key) in typeList" :key="key" :label="value" :value="parseInt(key)"/>
        </el-select>
      </el-form-item>
      <el-form-item label="模板内容" v-if="infoForm.type==2 || infoForm.type==4" prop="content" :rules="[
                {min: 0, max: 200, message: '模板内容不超过500个字符', trigger: 'blur'}]">
        <el-input maxlength="500" clearable v-model="infoForm.content" type="textarea" rows="3" size="small" placeholder="请输入模板内容"/>
      </el-form-item>
      <el-form-item label="模板内容" v-if="infoForm.type==1 || infoForm.type==3">
        <quill-editor 
            v-model="infoForm.content" 
            ref="myQuillEditor" 
            :options="editorOption"
            @blur="onEditorBlur($event)" 
            @focus="onEditorFocus($event)"
            @change="onEditorChange($event)">
        </quill-editor>
      </el-form-item>
      <el-form-item label="状态">
        <el-switch v-model="infoForm.status" :active-value="1" :inactive-value="2" size="small"/>
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
  import messageTemplateApi from '@/api/message/messageTemplate'

  export default {
    name: "messageTemplate",
    data() {
      return {
        addBtnLoading: false,
        editorOption: {},
      }
    },
    props: {
      infoForm: {
        type: Object,
        default() {
          return {};
        }
      },
      // 模板类型
      typeList:{
        type:Array,
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
      // 准备编辑器
      onEditorReady(editor) {
        console.log("准备编辑器")
      },
      // 失去焦点事件
      onEditorBlur(){
        console.log("失去焦点事件")
      },
      // 获得焦点事件
      onEditorFocus(){
        console.log("获得焦点事件")
      },
      // 内容改变事件
      onEditorChange(){
        console.log("内容改变事件")
      },
      // 提交表单
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let method = 'messageTemplateAdd'
            if (this.infoForm.id) {
              method = 'messageTemplateEdit'
            }
            this.addBtnLoading = true
            messageTemplateApi[method](this.infoForm).then(res => {
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
