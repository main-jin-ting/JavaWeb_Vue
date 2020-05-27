<template>
  <div class="info-form">
    <el-form ref="infoForm" :model="infoForm" size="small" label-width="100px">
      <el-form-item prop="locId" label="推荐栏目">
        <el-select v-model="infoForm.locId" filterable placeholder="请选择推荐栏目">
          <el-option
            v-for="item in layoutDescList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="推荐类型" prop="type" :rules="{
                    required: true, message: '推荐类型不能为空', trigger: 'change'
                  }">
        <el-select filterable clearable v-model="infoForm.type" size="small"
                   placeholder="请选择推荐类型">
          <el-option v-for="(value,key) in typeList" :key="key" :label="value" :value="parseInt(key)"/>
        </el-select>
      </el-form-item>
      <el-form-item label="选择推荐" prop="typeId">
        <el-input maxlength="50" clearable disabled="" v-model="infoForm.typeId" size="small" placeholder="请选择推荐"/>
      </el-form-item>
      <el-form-item label="推荐图片">
        <uploadImage :isCompress="true" ref="uploadImage" v-model="infoForm.image" :img="infoForm.image"
                      v-on:addImage="addImage" :limit=1
                      v-on:removeImage="removeImage"></uploadImage>
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
  import layoutApi from '@/api/apps/layout'
    import uploadImage from '@/components/uploadImage'

  export default {
    name: "layout",
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
      // 推荐类型
      typeList:{
        type:Array,
        default(){
          return {};
        }
      },
      // 布局描述
      layoutDescList:{
        type:Array,
        default(){
          return []
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
            let method = 'layoutAdd'
            if (this.infoForm.id) {
              method = 'layoutEdit'
            }
            this.addBtnLoading = true
            layoutApi[method](this.infoForm).then(res => {
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
