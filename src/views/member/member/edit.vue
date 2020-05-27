<template>
  <div class="info-form">
    <el-form ref="infoForm" :model="infoForm" size="small" label-width="100px">
      <el-form-item label="头像">
        <uploadImage :isCompress="true" ref="uploadImage" v-model="infoForm.avatar" :img="infoForm.avatar"
                      v-on:addImage="addImage" :limit=1
                      v-on:removeImage="removeImage"></uploadImage>
      </el-form-item>
      <el-form-item label="会员姓名" prop="realname" :rules="[{
                    required: true, message: '真实姓名不能为空', trigger: 'blur'
                  },{min: 2, max: 20, message: '真实姓名长度在2 到 20 个字符', trigger: 'blur'}]">
        <el-input maxlength="20" clearable v-model="infoForm.realname" size="small" placeholder="请输入真实姓名"/>
      </el-form-item>
      <el-form-item label="会员昵称" prop="nickname" :rules="[{
                    required: true, message: '昵称不能为空', trigger: 'blur'
                  },{min: 2, max: 20, message: '昵称长度在2 到 20 个字符', trigger: 'blur'}]">
        <el-input maxlength="20" clearable v-model="infoForm.nickname" size="small" placeholder="请输入昵称"/>
      </el-form-item>
      <el-form-item label="手机号码" prop="mobile" :rules="[
                    {required: true,validator: validatePhone, trigger: 'blur'}
                    ]">
        <el-input maxlength="11" clearable v-model="infoForm.mobile" size="small" placeholder="请输入手机号"/>
      </el-form-item>
      <el-form-item label="出生日期">
        <el-date-picker
          style="width: 188px"
          placeholder="出生日期"
          clearable
          size="small"
          value-format="yyyy-MM-dd"
          v-model="infoForm.birthday">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="性别">
        <el-radio-group v-model="infoForm.gender">
          <el-radio :label="1">男</el-radio>
          <el-radio :label="2">女</el-radio>
          <el-radio :label="3">保密</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="状态">
        <span v-show="infoForm.status == 1" style="color: #666">正常</span>
        <span v-show="infoForm.status == 2" style="color: #666">禁用</span>
        <el-switch v-model="infoForm.status" :active-value="1" :inactive-value="2" size="small"/>
      </el-form-item>
      <el-form-item label="个人简介" prop="intro" :rules="[
                {min: 0, max: 200, message: '个人简介不超过200个字符', trigger: 'blur'}]">
        <el-input maxlength="200" clearable v-model="infoForm.intro" type="textarea" rows="3" size="small" placeholder="请输入个人简介"/>
      </el-form-item>
      <el-form-item label="个人签名" prop="signature" :rules="[
                {min: 0, max: 200, message: '个人签名不超过200个字符', trigger: 'blur'}]">
        <el-input maxlength="200" clearable v-model="infoForm.signature" type="textarea" rows="3" size="small" placeholder="请输入个人签名"/>
      </el-form-item>
      <el-form-item label="设备类型" prop="device" :rules="{
                    required: true, message: '设备类型不能为空', trigger: 'change'
                  }">
        <el-select filterable clearable v-model="infoForm.device" size="small"
                   placeholder="请选择设备类型">
          <el-option v-for="(value,key) in deviceList" :key="key" :label="value" :value="parseInt(key)"/>
        </el-select>
      </el-form-item>
      <el-form-item label="来源">
        <span v-show="infoForm.source == 1" style="color: #666">注册会员</span>
        <span v-show="infoForm.source == 2" style="color: #666">马甲会员</span>
        <el-switch v-model="infoForm.source" :active-value="1" :inactive-value="2" size="small"/>
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
  import memberApi from '@/api/member/member'
  import uploadImage from '@/components/uploadImage'

  export default {
    name: "member",
    data() {
      // 手机号验证
      var phoneReg = /^1\d{10}$/
      var validatePhone = (rule, value, callback) => {
        if (value) {
          if (!phoneReg.test(value)) {
            callback(new Error('请输入正确手机号码'));
          } else {
            callback();
          }
        } else {
          callback(new Error('手机号码必填'));
        }
      };
      return {
        addBtnLoading: false,
        // 手机号验证
        validatePhone: validatePhone,
      }
    },
    props: {
      infoForm: {
        type: Object,
        default() {
          return {};
        }
      },
      // 设备类型
      deviceList:{
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
        this.infoForm.avatar = ''
      },
      // 添加图片
      addImage(...data){
        this.infoForm.avatar = data[0]
      },
      // 提交表单
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let method = 'userAdd'
            if (this.infoForm.id) {
              method = 'userEdit'
            }
            this.addBtnLoading = true
            memberApi[method](this.infoForm).then(res => {
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
