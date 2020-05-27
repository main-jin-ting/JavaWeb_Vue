<template>
  <div class="info-form">
    <el-form ref="infoForm" :model="infoForm" size="small" label-width="100px">
      <el-form-item label="头像">
        <uploadImage :isCompress="true" ref="uploadImage" v-model="infoForm.avatar" :img="infoForm.avatar"
                      v-on:addImage="addImage" :limit=1
                      v-on:removeImage="removeImage"></uploadImage>
      </el-form-item>
      <el-form-item label="工号" prop="workNum" :rules="[{
                    required: true, message: '工号不能为空', trigger: 'blur'
                  },{min: 2, max: 20, message: '工号长度在2 到 20 个字符', trigger: 'blur'}]">
        <el-input maxlength="20" clearable v-model="infoForm.workNum" size="small" placeholder="请输入工号"/>
      </el-form-item>
      <el-form-item label="真实姓名" prop="realname" :rules="[{
                    required: true, message: '真实姓名不能为空', trigger: 'blur'
                  },{min: 2, max: 20, message: '真实姓名长度在2 到 20 个字符', trigger: 'blur'}]">
        <el-input maxlength="20" clearable v-model="infoForm.realname" size="small" placeholder="请输入真实姓名"/>
      </el-form-item>
      <el-form-item label="昵称" prop="nickname" :rules="[{
                    required: true, message: '昵称不能为空', trigger: 'blur'
                  },{min: 2, max: 20, message: '昵称长度在2 到 20 个字符', trigger: 'blur'}]">
        <el-input maxlength="20" clearable v-model="infoForm.nickname" size="small" placeholder="请输入昵称"/>
      </el-form-item>
      <el-form-item label="手机号码" prop="mobile" :rules="[
                    {required: true,validator: validatePhone, trigger: 'blur'}
                    ]">
        <el-input maxlength="11" clearable v-model="infoForm.mobile" size="small" placeholder="请输入手机号"/>
      </el-form-item>
      <el-form-item label="邮箱" prop="email" :rules="[
                    {required: true,validator: validateEmail, trigger: 'blur'}
                    ]">
        <el-input maxlength="30" clearable v-model="infoForm.email" size="small" placeholder="请输入邮箱"/>
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
      <el-form-item label="职级" prop="levelId" :rules="{
                    required: true, message: '所属职级不能为空', trigger: 'change'
                  }">
        <el-select filterable clearable v-model="infoForm.levelId" size="small" placeholder="-请选择-">
          <el-option v-for="item in levelList" :key="item.id" :label="item.name" :value="item.id"/>
        </el-select>
      </el-form-item>
      <el-form-item label="岗位" prop="positionId" :rules="{
                    required: true, message: '所属岗位不能为空', trigger: 'change'
                  }">
        <el-select filterable clearable v-model="infoForm.positionId" size="small" placeholder="-请选择-">
          <el-option v-for="item in positionList" :key="item.id" :label="item.name" :value="item.id"/>
        </el-select>
      </el-form-item>
      <el-form-item prop="deptId" label="所属部门">
        <el-cascader
          placeholder="请选择部门"
          v-model="infoForm.deptId"
          ref="refHandle"
          :options="filterDeptList"
          :props="{ checkStrictly: true ,value:'id',label:'name'}">
        </el-cascader>
      </el-form-item>
      <el-form-item label="登录账号" prop="username" :rules="[{
                    required: true, message: '登录账号不能为空', trigger: 'blur'
                  },
            {min: 2, max: 20, message: '长度在2 到 20 个字符', trigger: 'blur'}]">
        <el-input maxlength="20" clearable v-model="infoForm.username" size="small" placeholder="请输入登录账号"/>
      </el-form-item>
      <el-form-item label="备注" prop="note" :rules="[
                {min: 0, max: 200, message: '备注不超过200个字符', trigger: 'blur'}]">
        <el-input maxlength="200" clearable v-model="infoForm.note" type="textarea" rows="3" size="small" placeholder="请输入备注"/>
      </el-form-item>
      <el-form-item label="性别">
        <el-radio-group v-model="infoForm.gender">
          <el-radio :label="1">男</el-radio>
          <el-radio :label="2">女</el-radio>
          <el-radio :label="3">保密</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="状态">
        <el-switch v-model="infoForm.status" :active-value="1" :inactive-value="2" size="small"/>
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input-number size="small" v-model="infoForm.sort"></el-input-number>
      </el-form-item>
      <el-form-item label="所属角色" prop="roleIds">
        <el-checkbox-group v-model="infoForm.roleIds">
          <el-checkbox v-for="role in roleList" :label="role.id+''" :key="role.id">{{role.name}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </el-form>
    <div class="footer" style="text-align: center">
      <el-button icon="el-icon-document-add" :loading="addBtnLoading" type="primary" size="medium" @click="submitForm('infoForm')">提交
      </el-button>
      <el-button icon="el-icon-back" style="margin-left: 15px" size="medium" @click="closeWin('infoForm')">关闭
      </el-button>
    </div>
  </div>
</template>

<script>
  import userApi from '@/api/permission/user'
  import uploadImage from '@/components/uploadImage'

  export default {
    name: "user",
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
      // 邮箱验证
      var emailReg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
      var validateEmail = (rule, value, callback) => {
        if (value) {
          if (!emailReg.test(value)) {
            callback(new Error('请输入正确邮箱'));
          } else {
            callback();
          }
        } else {
          callback(new Error('邮箱必填'));
        }
      };
      return {
        // 手机号验证
        validatePhone: validatePhone,
        // 邮箱验证
        validateEmail: validateEmail,
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
      // 接收职级
      levelList:{
        type:Array,
        default(){
          return []
        }
      },
      // 接收岗位
      positionList:{
        type:Array,
        default(){
          return []
        }
      },
      // 接收角色
      roleList:{
        type:Array,
        default(){
          return []
        }
      },
      // 参数接收
      filterDeptList: {},
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
            // 角色数组转逗号分隔字符串
            let infoForm = JSON.parse(JSON.stringify(this.infoForm))
            if (infoForm.roleIds.length > 0) {
              infoForm.roleIds = infoForm.roleIds.join(',')
            } else {
              infoForm.roleIds = ''
            }
            // 部门处理
            if (infoForm.deptId) {
              if (Array.isArray(infoForm.deptId) && infoForm.deptId.length > 0) {
                infoForm.deptId = infoForm.deptId[infoForm.deptId.length - 1]
              } else if (infoForm.deptId.length == 0) {
                infoForm.deptId = 0
              }
            } else {
              infoForm.deptId = 0
            }
            this.addBtnLoading = true
            userApi[method](infoForm).then(res => {
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
  .footer {
    text-align: center;
    width: 100%;
    height: 60px;
    line-height: 60px;
    vertical-align: center;
  }
</style>
