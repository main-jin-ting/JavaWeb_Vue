<template>
  <div class="info-form">
    <el-form ref="infoForm" :model="infoForm" size="small" label-width="100px">
      <el-form-item label="栏目名称" prop="name" :rules="[{
                    required: true, message: '栏目名称名称不能为空', trigger: 'blur'
                  },{min: 2, max: 20, message: '栏目名称长度在2 到 20 个字符', trigger: 'blur'}]">
        <el-input maxlength="20" clearable v-model="infoForm.name" size="small" placeholder="请输入栏目名称"/>
      </el-form-item>
      <el-form-item label="所属站点" prop="itemId" :rules="{
                    required: true, message: '所属站点不能为空', trigger: 'change'
                  }">
        <el-select filterable clearable v-model="infoForm.itemId" size="small" placeholder="-请选择站点-">
          <el-option v-for="item in itemList" :key="item.id" :label="item.name" :value="item.id"/>
        </el-select>
      </el-form-item>
      <el-form-item prop="pid" label="上级栏目">
        <el-cascader
          placeholder="无"
          v-model="infoForm.pid"
          ref="refHandle"
          :options="filterCateList"
          :props="{ checkStrictly: true ,value:'id',label:'name'}"
        ></el-cascader>
      </el-form-item>
      <el-form-item label="拼音(全拼)" prop="pinyin">
        <el-input maxlength="50" clearable v-model="infoForm.pinyin" size="small" placeholder="请输入拼音(全拼)"/>
      </el-form-item>
      <el-form-item label="拼音(简拼)" prop="code">
        <el-input maxlength="10" clearable v-model="infoForm.code" size="small" placeholder="请输入拼音(简拼)"/>
      </el-form-item>
      <el-form-item label="栏目图片">
        <uploadImage :isCompress="true" ref="uploadImage" v-model="infoForm.cover" :img="infoForm.cover"
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
  import cateApi from '@/api/apps/itemCate'
  import uploadImage from '@/components/uploadImage'

  export default {
    name: "itemCate",
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
      itemList:{
        type:Array,
        default(){
          return []
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
            let method = 'cateAdd'
            if (this.infoForm.id) {
              method = 'cateEdit'
            }
            this.addBtnLoading = true
            cateApi[method](this.infoForm).then(res => {
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
