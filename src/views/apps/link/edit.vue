<template>
  <div class="info-form">
    <el-form ref="infoForm" :model="infoForm" size="small" label-width="100px">
      <el-form-item label="友链名称" prop="name" :rules="[{
                    required: true, message: '友链名称名称不能为空', trigger: 'blur'
                  },{min: 2, max: 20, message: '友链名称长度在2 到 20 个字符', trigger: 'blur'}]">
        <el-input maxlength="20" clearable v-model="infoForm.name" size="small" placeholder="请输入友链名称"/>
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
      <el-form-item label="友链类型" prop="type" :rules="{
                    required: true, message: '友链类型不能为空', trigger: 'change'
                  }">
        <el-select filterable clearable v-model="infoForm.type" size="small"
                   placeholder="请选择友链类型">
          <el-option v-for="(value,key) in typeList" :key="key" :label="value" :value="parseInt(key)"/>
        </el-select>
      </el-form-item>
      <el-form-item label="友链平台" prop="platform" :rules="{
                    required: true, message: '友链平台不能为空', trigger: 'change'
                  }">
        <el-select filterable clearable v-model="infoForm.platform" size="small"
                   placeholder="请选择友链平台">
          <el-option v-for="(value,key) in platformList" :key="key" :label="value" :value="parseInt(key)"/>
        </el-select>
      </el-form-item>
      <el-form-item label="友链形式">
        <span v-show="infoForm.form == 1" style="color: #666">文字链接</span>
        <span v-show="infoForm.form == 2" style="color: #666">图片链接</span>
        <el-switch v-model="infoForm.form" :active-value="1" :inactive-value="2" size="small"/>
      </el-form-item>
      <el-form-item label="友链地址" prop="url" :rules="[{
                    required: true, message: '友链地址不能为空', trigger: 'blur'
                  }]">
        <el-input maxlength="30" clearable v-model="infoForm.url" size="small" placeholder="请输入友链地址"/>
      </el-form-item>
      <el-form-item label="栏目图片">
        <uploadImage :isCompress="true" ref="uploadImage" v-model="infoForm.cover" :img="infoForm.cover"
                      v-on:addImage="addImage" :limit=1
                      v-on:removeImage="removeImage"></uploadImage>
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
  import linkApi from '@/api/apps/link'
  import uploadImage from '@/components/uploadImage'

  export default {
    name: "links",
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
      platformList:{
        type:Array,
        default(){
          return {};
        }
      },
      // 参数接收
      filterCateList: {},
    },
    created() {
    },
    mounted() {
    },
    components: {uploadImage},
    methods: {
      // 移除图片
      removeImage(){
        this.infoForm.image = ''
      },
      // 添加图片
      addImage(...data){
        this.infoForm.image = data[0]
      },
      // 提交表单
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let method = 'linkAdd'
            if (this.infoForm.id) {
              method = 'linkEdit'
            }
            this.addBtnLoading = true
            linkApi[method](this.infoForm).then(res => {
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
