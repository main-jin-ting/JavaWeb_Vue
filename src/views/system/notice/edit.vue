<template>
  <div class="info-form">
    <el-form ref="infoForm" :model="infoForm" size="small" label-width="100px">
      <el-form-item label="通知标题" prop="title" :rules="[{
                    required: true, message: '通知标题名称不能为空', trigger: 'blur'
                  },{min: 2, max: 20, message: '通知标题长度在2 到 20 个字符', trigger: 'blur'}]">
        <el-input maxlength="20" clearable v-model="infoForm.title" size="small" placeholder="请输入通知标题"/>
      </el-form-item>
      <el-form-item label="通知来源" prop="source" :rules="{
                    required: true, message: '通知来源不能为空', trigger: 'change'
                  }">
        <el-select filterable clearable v-model="infoForm.source" size="small"
                   placeholder="请选择通知来源">
          <el-option v-for="(value,key) in sourceList" :key="key" :label="value" :value="parseInt(key)"/>
        </el-select>
      </el-form-item>
      <el-form-item label="是否置顶">
        <span v-show="infoForm.isTop == 1" style="color: #666">是</span>
        <span v-show="infoForm.isTop == 2" style="color: #666">否</span>
        <el-switch v-model="infoForm.isTop" :active-value="1" :inactive-value="2" size="small"/>
      </el-form-item>
      <el-form-item label="状态">
        <span v-show="infoForm.status == 1" style="color: #666">已发布</span>
        <span v-show="infoForm.status == 2" style="color: #666">未发布</span>
        <el-switch v-model="infoForm.status" :active-value="1" :inactive-value="2" size="small"/>
      </el-form-item>
      <el-form-item label="通知内容">
        <quill-editor 
              v-model="infoForm.content" 
              ref="myQuillEditor" 
              :options="editorOption" 
              @blur="onEditorBlur($event)" 
              @focus="onEditorFocus($event)"
              @change="onEditorChange($event)">
          </quill-editor>
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
  import noticeApi from '@/api/system/notice'

  export default {
    name: "notice",
    data() {
      return {
        addBtnLoading: false,
        editorOption: {}
      }
    },
    props: {
      infoForm: {
        type: Object,
        default() {
          return {};
        }
      },
      // 来源
      sourceList:{
        type:Array,
        default(){
          return {};
        }
      },
    },
    computed: {
      editor() {
          return this.$refs.myQuillEditor.quill;
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
            let method = 'noticeAdd'
            if (this.infoForm.id) {
              method = 'noticeEdit'
            }
            this.addBtnLoading = true
            noticeApi[method](this.infoForm).then(res => {
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
