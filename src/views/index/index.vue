<template>
  <div class="index-box">
    <el-menu
      unique-opened
      :collapse="isCollapse"
      router
      :default-active="$route.path"
      class="el-menu-vertical-demo left-menu"
      background-color="#304156"
      text-color="#bfcbd9"
      active-text-color="#409EFF">
      <el-menu-item style="text-align: center" index="/">
        <img style="width: 32px;height: 32px;margin-right: 8px;background: rgb(28,56,49)"
             src="../../assets/img/logo.png">
        <span style="color: #fff;font-weight: 600;">JavaWeb后台框架</span>
      </el-menu-item>
      <el-tooltip class="item" effect="dark" content="首页" placement="right">
        <el-menu-item index="/index">
          <svg-icon iconClass='home' className='icon'></svg-icon>
          <span>首页</span></el-menu-item>
      </el-tooltip>
      <el-submenu :key="index" v-for="(item,index) in filterMenuList" :index="item.name">
        <template slot="title">
          <svg-icon :iconClass='item.icon' className='icon'></svg-icon>
          <span>{{item.name}}</span>
        </template>
        <el-menu-item v-if="item.children" :key="index" v-for="(child,index) in item.children" :index="child.url">
          <template slot="title">
            <svg-icon v-if="child.icon" :iconClass='child.icon' className='icon'></svg-icon>
            <span>{{child.name}}</span>
          </template>
        </el-menu-item>
      </el-submenu>
    </el-menu>
    <div class="box-right">
      <div class="box-right-head">
        <div class="right-head-top">
          <div>
            <i @click="isCollapse=!isCollapse" :class="isCollapse?'el-icon-s-unfold':'el-icon-s-fold'"></i>
            <el-breadcrumb separator="/">
              <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
              <el-breadcrumb-item :key="index" v-for="(item,index) in getBreadcrumb">{{item}}</el-breadcrumb-item>
            </el-breadcrumb>
          </div>
          <div class="peo">
            <div>{{getInfo?getInfo.realname:''}}</div>
            <el-popover
              placement="bottom-start"
              width="100"
              trigger="hover">
              <el-menu
                default-active="2"
                class="el-menu-vertical-demo">
                <el-menu-item @click="proClick(1)">个人中心</el-menu-item>
                <el-menu-item @click="proClick(2)">注销</el-menu-item>
              </el-menu>
              <el-button slot="reference"><img v-if="getInfo" v-lazy="getInfo.avatar"></el-button>
            </el-popover>
          </div>
        </div>
        <div class="right-head-center">
          <el-tag style=" cursor:pointer;" @click="tagClick(1)" :style="{color:getIsIndex?void(0):'black'}"
                  :color="getIsIndex?void(0):'#fff'" size="medium">首页
          </el-tag>
          <el-tag @click="tagClick(2,item)" @close="closeClick(item)" :style="{color:item.isSelect?void(0):'black'}"
                  :color="item.isSelect?void(0):'#fff'" class="tag-box" :key="index" v-for="(item,index) in getTagList"
                  closable size="medium">{{item.title}}
          </el-tag>
        </div>
      </div>
      <div :style="{height:height+'px'}" class="route-box">
        <router-view v-if="browser" v-wechat-title="$route.meta.title"></router-view>
        <transition v-else name="fade">
          <router-view v-wechat-title="$route.meta.title"></router-view>
        </transition>
      </div>
    </div>
    <el-dialog :close-on-press-escape="false" :close-on-click-modal="false" ref="dialogForm" top="3vh" center class="home-dialog" :visible.sync="visible"
               title="个人中心">
      <el-tabs v-model="activeName" type="border-card">
        <el-tab-pane label="个人配置" name="config">
          <el-form ref="configForm" :model="configForm" size="small" label-width="100px"
                   style="width: 50%" class="form">
            <el-form-item label="头像">
              <uploadImage :isCompress="true" ref="uploadImage" v-model="configForm.avatar" :img="configForm.avatar"
                           v-on:addImage="addImage" :limit=1
                           v-on:removeImage="removeImage"></uploadImage>
            </el-form-item>
            <el-form-item label="用户名">
              <el-input :disabled="true" clearable v-model="configForm.username" size="small" placeholder="请输入用户名"/>
            </el-form-item>
            <el-form-item label="姓名">
              <el-input clearable v-model="configForm.realName" size="small" placeholder="请输入姓名"/>
            </el-form-item>
            <el-form-item label="手机" prop="mobile" :rules="{
                    required: true, message: '手机不能为空', trigger: 'blur'
                  }">
              <el-input clearable v-model="configForm.mobile" size="small" placeholder="请输入手机"/>
            </el-form-item>
            <el-form-item>
              <el-button :loading="addBtnLoading" type="primary" size="small"
                         @click="submitForm('configForm',1)">立即提交
              </el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="修改密码" name="password">
          <el-form ref="passwordForm" :model="passwordForm" size="small" label-width="100px"
                   style="width: 50%" class="form">
            <el-form-item label="原密码" prop="oldPassword" :rules="[
          {required: true, message: '原密码不能为空', trigger: 'blur'},
          {min: 6, max: 20, message: '长度6-20位', trigger: 'blur'}
          ]">
              <el-input show-password type="password" clearable v-model="passwordForm.oldPassword" size="small"
                        placeholder="请输入原密码"/>
            </el-form-item>
            <el-form-item label="新密码" prop="password" :rules="[
          {required: true, message: '新密码不能为空', trigger: 'blur'},
          {min: 6, max: 20, message: '长度6-20位', trigger: 'blur'}
          ]">
              <el-input show-password type="password" clearable v-model="passwordForm.password" size="small"
                        placeholder="请输入新密码"/>
            </el-form-item>
            <el-form-item label="确认新密码" prop="rePassword" :rules="[
          {required: true, message: '确认新密码不能为空', trigger: 'blur'},
          {min: 6, max: 20, message: '长度6-20位', trigger: 'blur'}
          ]">
              <el-input show-password type="password" clearable v-model="passwordForm.rePassword" size="small"
                        placeholder="请输入确认新密码"/>
            </el-form-item>
            <el-form-item>
              <el-button :loading="addBtnLoading" type="primary" size="small"
                         @click="submitForm('passwordForm',2)">立即提交
              </el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="操作日志" name="log">
          <el-form :inline="true" :model="searchParam" class="demo-form-inline head-form">
            <el-form-item label="关键词">
              <el-input clearable v-model="searchParam.keyword" size="small" placeholder="ID或名称" style="width: 150px"/>
            </el-form-item>
            <el-form-item label="日期范围">
              <el-date-picker
                style="width: 220px"
                size="small"
                clearable
                value-format="yyyy-MM-dd"
                v-model="searchParam.time"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button @click="searchClick" size="small" icon="el-icon-search" type="primary">搜索</el-button>
              <el-button icon="el-icon-refresh-right"
                         type="primary" size="small"
                         style="background-color: #fff; border: 1px solid #ccc ; color: #666">清空
              </el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>

<script>
  import store from '../../vuex'
  import uploadImage from '@/components/uploadImage'
  import userApi from '@/api/login'

  export default {
    name: "index",
    data() {
      return {
        isCollapse: false,
        visible:false,
        menuList: [],
        info: {},
        height: 0,
        roles: store.state.user.roles.filter(item => item.type == 2),
        filterMenuList: [],
        isShowMenu: true,
        browser:'',
        activeName: 'config',
        configForm: {
          photo: '',
          realName: '',
          mobile: '',
          avatar: ''
        },
        passwordForm: {
          oldPassword: '',
          password: '',
          rePassword: '',
        },
        searchParam: {
          keyword: '',
          time: ''
        },
        addBtnLoading: false,
        pageFlag: 0,
        // 当前页
        currentPage: 1,
        // 总条数
        count: 0,
        // 每页条数
        pageSize: 10,
        tableHeight: document.body.clientHeight - 305,
        tableLoading: false,
      }
    },
    created() {
      this.browser=this.isIE()
      this.height = document.body.clientHeight - 120
      this.filterMenu()
      this.pageSize = parseInt((document.body.clientHeight - 344) / 50)
      this.initConfig()
      this.initPassword()
      let that = this
      window.onresize = () => {
        return (() => {
          if (document.body.clientWidth < 1000) {
            that.isCollapse = true
          } else {
            that.isCollapse = false
          }
        })()
      }
    },
    computed: {
      getBreadcrumb() {
        return this.$store.state.user.breadcrumb
      },
      getTagList() {
        return this.$store.state.user.tagList
      },
      getIsIndex() {
        return this.$store.state.user.isIndexTag
      },
      getInfo() {
        return this.$store.state.user.info
      }
    },
    watch: {
      activeName(value) {
        if (value == 'config') {
          this.initConfig()
        } else if (value == 'password') {
          this.initPassword()
        } else {
          this.searchParam = {
            keyword: '',
            time: ''
          }
          this.searchClick()
        }
      }
    },
    components: {uploadImage},
    methods: {
      removeImage(){
        this.configForm.avatar = ''
      },
      addImage(...data){
        this.configForm.avatar = data[0]
      },
      initConfig() {
        let info = this.$store.state.user.info
        this.configForm = {
          id:info.id,
          avatar: info.avatar,
          username: info.username,
          mobile: info.mobile,
          realName: info.realname,
        }
      },
      initPassword() {
        let info = this.$store.state.user.info
        this.passwordForm = {
          id:info.id,
          oldPassword: '',
          password: '',
          rePassword: '',
        }
      },
      searchClick() {
        this.currentPage = 1
        this.searchLog()
      },

      searchLog() {

      },
      submitForm(formName, type) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.addBtnLoading=true
            if(type==2){
              userApi.editPassword(this.passwordForm).then(res => {
                this.addBtnLoading = false
                this.initPassword()
                this.$message({
                  type: 'success',
                  message: '修改密码成功'
                })
                store.dispatch('user/logout').then(res => {
                  this.$router.push({name: 'login'});
                })
              }).catch(e => {
                this.addBtnLoading = false
              })
            }else if(type==1){
              userApi.profile(this.configForm).then(res => {
                this.addBtnLoading = false
                this.$message({
                  type: 'success',
                  message: '修改个人信息成功'
                })
                store.dispatch('user/getInfo')
              }).catch(e => {
                this.addBtnLoading = false
              })
            }
          }
        })
      },
      isIE() {
        if(!!window.ActiveXObject || "ActiveXObject" in window){
          return true;
        }else{
          return false;
        }
      },
      proClick(type) {
        if (type == 1) {
          // 个人中心
          this.initConfig()
          this.initPassword()
          this.activeName='config'
          this.visible=true
        } else if (type == 2) {
          // 注销系统
          this.$confirm('您确定要注销登录吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            store.dispatch('user/logout').then(res => {
              this.$message({
                type: 'success',
                message: '注销成功！'
              })
              this.$router.push({name: 'login'});
            }).catch(e => {
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消注销'
            })
          })
        }
      },
      tagClick(type, data) {
        if (type == 1) {
          this.$router.push({name: 'index'});
        } else {
          this.$router.push({path: data.path});
        }
      },
      closeClick(data) {
        let tagList = JSON.parse(JSON.stringify(this.$store.state.user.tagList))
        if (tagList.length == 1) {
          store.dispatch('user/setTagList', [])
          this.$router.push({name: 'index'});
        } else {
          let index = 0
          for (let i = 0; i < tagList.length; i++) {
            if (tagList[i].id == data.id) {
              index = i
            }
          }
          if (!data.isSelect) {
            tagList.splice(index, 1)
            store.dispatch('user/setTagList', tagList)
          } else {
            if (index == tagList.length - 1) {
              tagList.splice(index, 1)
              store.dispatch('user/setTagList', tagList)
              this.$router.push({path: tagList[tagList.length - 1].path});
            } else {
              let path = tagList[index + 1].path
              tagList.splice(index, 1)
              store.dispatch('user/setTagList', tagList)
              this.$router.push({path: path});
            }
          }
        }
      },
      filterMenu() {
        let filterMenuList = []
        let roles = JSON.parse(JSON.stringify(store.state.user.roles))
        if (roles.length > 0) {
          let rootMenu = roles.filter(item => item.pid === 0 && item.type <= 2 && item.status == 1)
          rootMenu.sort(function (a, b) {
            return a.sort - b.sort
          })
          if (rootMenu.length > 0) {
            rootMenu.map(item => {
              let child = item
              this.childMenu(item, roles, child, item.url)
              filterMenuList.push(child)
            })
          }
        }
        this.filterMenuList = filterMenuList
      },
      childMenu(item, roles, child, url) {
        let list = roles.filter(role => role.pid === item.id && role.type <= 2 && role.status == 1)
        if (list.length > 0) {
          list.sort(function (a, b) {
            return a.sort - b.sort
          })
          child.children = list
          child.children.map(cc => {
            cc.url = url + cc.url
          })
        }
      },
    }
  }
</script>

<style lang="less">
  .fade-enter-active, .fade-leave-active {
    position: relative;
    will-change: transform;
    transition: all 500ms;
  }

  .fade-enter{
    position: fixed;
    opacity: 0;
    transform: translate3d(100%, 0, 0);
  }

  .fade-leave-active {
    height: 100%;
    width: 100%;
    opacity: 0;
    transform: translate3d(-100%, 0, 0);
    z-index: 1000;
  }
  .home-dialog{
    .el-dialog {
      width: 70% !important;
    }
  }

  /*.fade-leave-to {*/
  /*  transform: translateX(-100%);*/
  /*}*/

  .index-box {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    height: 100%;
    width: 100%;
    overflow: hidden;

    .el-input.is-disabled .el-input__inner {
      background-color: #ffffff!important;
      color: #333333!important;
    }

    .el-menu-item.is-active {
      color: #ffffff!important;
      background-color: #1890ff!important;
    }

    .el-menu-item:hover {
      color: #ffffff !important;
    }

    .el-menu-vertical-demo:not(.el-menu--collapse) {
      width: 200px;
      min-height: 400px;
      overflow-x: hidden;
    }

    .peo {
      display: flex;
      align-items: center;

      > div:first-child {
        margin-right: 15px;
      }
    }

    ::-webkit-scrollbar {
      width: 1px;
      height: 1px;
      background-color: rgba(0, 0, 0, 0.12);
    }

    .el-menu--collapse > .el-menu-item span, .el-menu--collapse > .el-submenu > .el-submenu__title span {
      height: 0;
      width: 0;
      overflow: hidden;
      visibility: hidden;
      display: inline-block;
    }

    .peo {
      .el-button {
        border: none;
        padding: 0;
      }

      img {
        width: 40px;
        height: 40px;
      }
    }

    .tag-box {
      margin-left: 5px;
      cursor: pointer;
    }

    .right-head-center {
      display: flex;
      padding: 0 20px;
      align-items: center;
      white-space: nowrap;
      position: relative;
      overflow: hidden;
    }

    .left-menu {
      float: left;
      height: 100%;
      overflow-y: auto;

      svg {
        height: 15px;
        width: 20px;
        margin-right: 10px;
      }
    }


    .el-submenu {
      text-align: left;
    }

    .el-menu-item {
      text-align: left;
    }

    .box-right {
      height: 100%;

      ::-webkit-scrollbar {
        width: 10px;
        height: 10px;
        background-color: #fff;
      }

      ::-webkit-scrollbar-thumb {
        border-radius: 5px;
        -webkit-box-shadow: inset005pxrgba(0, 0, 0, 0.2);
        background: rgba(0, 0, 0, 0.2);
      }

      .box-right-head {
        height: 80px;
        width: 100%;
        box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);
        background-color: #fff;
        .right-head-top {
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 20px;

          > div:first-child {
            display: flex;
            align-items: center;

            > i {
              font-size: 22px;
              cursor: pointer;
              margin-right: 15px;
            }
          }
        }
      }

      .route-box {
        overflow-y: auto;
        overflow-x: hidden;
        padding: 20px;
      }
    }
  }
</style>
