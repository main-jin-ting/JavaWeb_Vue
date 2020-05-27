<template>
  <div class="info-form">
    <el-form ref="infoForm" :model="infoForm" size="small" label-width="100px">
      <el-form-item label="广告标题" prop="title" :rules="[{
                    required: true, message: '广告标题不能为空', trigger: 'blur'
                  },{min: 2, max: 100, message: '广告标题长度在2 到 100 个字符', trigger: 'blur'}]">
        <el-input maxlength="20" clearable v-model="infoForm.title" size="small" placeholder="请输入广告标题"/>
      </el-form-item>
      <el-form-item label="所属广告位" prop="sortId" :rules="{
                    required: true, message: '所属广告位不能为空', trigger: 'change'
                  }">
        <el-select filterable clearable v-model="infoForm.sortId" size="small" placeholder="-请选择-">
          <el-option v-for="item in sortList" :key="item.id" :label="item.name" :value="item.id"/>
        </el-select>
      </el-form-item>
      <el-form-item label="广告图片">
        <uploadImage :isCompress="true" ref="uploadImage" v-model="infoForm.cover" :img="infoForm.cover"
                      v-on:addImage="addImage" :limit=1
                      v-on:removeImage="removeImage"></uploadImage>
      </el-form-item>
      <el-form-item label="广告描述" prop="description" :rules="[
                {min: 0, max: 150, message: '广告描述不超过200个字符', trigger: 'blur'}]">
        <el-input maxlength="150" clearable v-model="infoForm.description" type="textarea" rows="3" size="small" placeholder="请输入广告描述"/>
      </el-form-item>
      <el-form-item label="广告类型" prop="type" :rules="{
                    required: true, message: '广告类型不能为空', trigger: 'change'
                  }">
        <el-select filterable clearable v-model="infoForm.type" size="small" placeholder="请选择广告类型">
          <el-option v-for="(value,key) in typeList" :key="key" :label="value" :value="parseInt(key)"/>
        </el-select>
      </el-form-item>
      <el-form-item label="广告地址" prop="url">
        <el-input clearable v-model="infoForm.url" size="small" placeholder="请输入广告地址"/>
      </el-form-item>
      <el-form-item label="广告宽度" prop="width">
        <el-input-number size="small" v-model="infoForm.width"></el-input-number>
      </el-form-item>
      <el-form-item label="广告高度" prop="height">
        <el-input-number size="small" v-model="infoForm.height"></el-input-number>
      </el-form-item>
      <el-form-item label="开始时间">
        <el-date-picker
          clearable
          size="small"
          v-model="infoForm.startTime"
          type="datetime"
          placeholder="选择开始时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="结束时间">
        <el-date-picker
          clearable
          size="small"
          v-model="infoForm.endTime"
          type="datetime"
          placeholder="选择结束时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="状态">
        <el-switch v-model="infoForm.status" :active-value="1" :inactive-value="2" size="small"/>
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
  import adApi from '@/api/apps/ad'
  import uploadImage from '@/components/uploadImage'
  import moment from "moment"

  export default {
    name: "ad",
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
      typeList:{
        type:Array,
        default(){
          return {};
        }
      },
      sortList:{
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
    components: {uploadImage},
    methods: {
      // 移除图片
      removeImage(){
        this.infoForm.cover = ''
      },
      // 添加图片
      addImage(...data){
        this.infoForm.cover = data[0]
      },
      // 提交表单
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let method = 'adAdd'
            if (this.infoForm.id) {
              method = 'adEdit'
            }
            this.addBtnLoading = true
            // 开始时间
            let infoForm = JSON.parse(JSON.stringify(this.infoForm))
            if (infoForm.startTime && infoForm.startTime.length > 0) {
              infoForm.startTime = moment(new Date(infoForm.startTime)).format('YYYY-MM-DD HH:mm:ss')
            }
            // 结束时间
            if (infoForm.endTime && infoForm.endTime.length > 0) {
              infoForm.endTime = moment(new Date(infoForm.endTime)).format('YYYY-MM-DD HH:mm:ss')
            }
            adApi[method](infoForm).then(res => {
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
