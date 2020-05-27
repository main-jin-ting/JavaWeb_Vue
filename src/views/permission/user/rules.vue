<template>
  <div class="info-form">
    <el-tree
        ref="treeForm"
        :data="menuList"
        highlight-current
        check-strictly
        show-checkbox
        default-expand-all
        node-key="id"
        @check-change="handleCheckChange"
        :props="defaultProps">
    </el-tree>
    <div class="footer" style="text-align: center">
      <el-button icon="el-icon-document-add" :loading="addBtnLoading" type="primary" size="medium" @click="submitForm('treeForm')">提交
      </el-button>
      <el-button icon="el-icon-back" style="margin-left: 15px" size="medium" @click="closeWin('treeForm')">关闭
      </el-button>
    </div>
  </div>
</template>

<script>
  import userApi from '@/api/permission/user'

  export default {
    name: "user",
    data() {
      return {
        addBtnLoading: false,
        defaultProps: {
          children: 'children',
          label: 'name'
        },
      }
    },
    props: {
      infoForm: {
        type: Object,
        default() {
          return {};
        }
      },
      menuList:{
        type:Array,
        default(){
          return []
        }
      },
      checkedKeys: {
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
    methods: {
      handleCheckChange(data, checked, indeterminate) {
        if (!this.isTreeBl) {
          if (checked) {
            if (!this.checkedKeys.some(key => key == data.id)) {
              this.checkedKeys.push(data.id)
            }
            this.childNode(data.children)
            this.parentNode(data.pid)
          } else {
            for (let i = 0; i < this.checkedKeys.length; i++) {
              if (data.id == this.checkedKeys[i]) {
                this.checkedKeys.splice(i, 1)
                break
              }
            }
            this.childNode(data.children, 1)
          }
          this.isTreeBl = true
          this.$refs.treeForm.setCheckedKeys(this.checkedKeys);
          let me = this
          this.$nextTick(function () {
            me.isTreeBl = false
          })
        }
      },
      childNode(childList, type) {
        if (childList && childList.length > 0) {
          childList.map(item => {
            if (type) {
              for (let i = 0; i < this.checkedKeys.length; i++) {
                if (item.id == this.checkedKeys[i]) {
                  this.checkedKeys.splice(i, 1)
                  break
                }
              }
            } else {
              if (!this.checkedKeys.some(key => key == item.id)) {
                this.checkedKeys.push(item.id)
              }
            }
            this.childNode(item.children, type)
          })
        }
      },
      parentNode(pid, type) {
        if (pid) {
          this.findChild(this.menuList, pid, type)
        }
      },
      findChild(childList, pid, type) {
        let child = childList.find(item => item.id == pid)
        if (child) {
          if (!this.checkedKeys.some(key => key == child.id)) {
            this.checkedKeys.push(child.id)
            if (child.pid) {
              this.findChild(this.menuList, child.pid)
            }
          }
        } else {
          childList.map(item => {
            if (item.children && item.children.length > 0) {
              this.findChild(item.children, pid)
            }
          })
        }
      },
      // 提交表单
      submitForm() {
        this.addBtnLoading = true
        userApi.userRules({
          id: this.infoForm.id,
          rules: this.checkedKeys.length > 0 ? this.checkedKeys.join(',') : ''
        }).then(res => {
          // 提示信息
          this.$message({
            type: 'success',
            message: '权限保存成功！'
          })
          this.addBtnLoading = false
          // 事件回调
          this.$emit('submit',2)
          // 回调关闭窗体
          this.$emit('closeWin')
        }).catch(e => {
          this.addBtnLoading = false
        })
      },
      // 关闭窗体
      closeWin() {
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
