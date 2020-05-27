<template>
  <div class="info-form">
    <el-form ref="infoForm" :model="infoForm" size="small" label-width="100px">
      <el-form-item label="站点名称" prop="name" :rules="[{
                    required: true, message: '站点名称名称不能为空', trigger: 'blur'
                  },{min: 2, max: 20, message: '站点名称长度在2 到 20 个字符', trigger: 'blur'}]">
        <el-input maxlength="20" clearable v-model="infoForm.name" size="small" placeholder="请输入站点名称"/>
      </el-form-item>
      <el-form-item label="站点类型" prop="type" :rules="{
                    required: true, message: '站点类型不能为空', trigger: 'change'
                  }">
        <el-select filterable clearable v-model="infoForm.type" size="small"
                   placeholder="请选择站点类型">
          <el-option v-for="(value,key) in typeList" :key="key" :label="value" :value="parseInt(key)"/>
        </el-select>
      </el-form-item>
      <el-form-item label="站点地址" prop="url" :rules="[{
                    required: true, message: '站点地址不能为空', trigger: 'blur'
                  }]">
        <el-input maxlength="30" clearable v-model="infoForm.url" size="small" placeholder="请输入站点地址"/>
      </el-form-item>
      <el-form-item label="二级域名">
        <span v-show="infoForm.isDomain == 1" style="color: #666">是</span>
        <span v-show="infoForm.isDomain == 2" style="color: #666">否</span>
        <el-switch v-model="infoForm.isDomain" :active-value="1" :inactive-value="2" size="small"/>
      </el-form-item>
      <el-form-item label="站点图片">
        <uploadImage :isCompress="true" ref="uploadImage" v-model="infoForm.image" :img="infoForm.image"
                      v-on:addImage="addImage" :limit=1
                      v-on:removeImage="removeImage"></uploadImage>
      </el-form-item>
      <el-form-item label="状态">
        <span v-show="infoForm.status == 1" style="color: #666">在用</span>
        <span v-show="infoForm.status == 2" style="color: #666">停用</span>
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
  import itemApi from '@/api/apps/item'
  import uploadImage from '@/components/uploadImage'

  export default {
    name: "item",
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
      // 接收参数
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
            let method = 'itemAdd'
            if (this.infoForm.id) {
              method = 'itemEdit'
            }
            this.addBtnLoading = true
            itemApi[method](this.infoForm).then(res => {
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
