<template>
  <div id="app">
    <keep-alive>
      <router-view v-wechat-title="$route.meta.title" v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-wechat-title="$route.meta.title" v-if="!$route.meta.keepAlive"></router-view>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="less">
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    margin-top: 60px;
  }

  .el-tabs--border-card {
    /*height: 100%;*/
  }

  body,html{
    height: 100%;
    width: 100%;
    overflow: hidden;
    background-color: #f2f2f2;
  }

  .el-cascader--small {
    width: 100% !important;
  }

  .el-button--mini {
    padding: 5px 7px!important;
    font-size: 12px!important;
  }

  .el-button+.el-button {
    margin-left: 2px!important;
  }

  .el-dialog {
    width: 800px!important;
  }

  .el-form--inline .el-form-item{
    margin-bottom: 10px!important;
  }

  .el-select {
    width: 100%
  }

  .el-table--border th{
    background-color: #f2f2f2!important;
    color: #666666!important;
  }

  .page-current{
    text-align: center;
    padding: 15px 5px;
    padding-bottom: 0px;
  }

  .el-form-item__content{
    text-align: left!important;
  }

  a{text-decoration:none}

  img {
    background-color: #eeeeee;
    cursor: pointer;
  }

  .el-radio-button__orig-radio:disabled:checked+.el-radio-button__inner {
    color: #FFF!important;
    background-color: #409EFF!important;
    border-color: #409EFF!important;
  }

  .viewer-new-title {
    color: #ffffff;
    display: inline-block;
    font-size: 16px;
    line-height: 2;
    margin: 0 5% 5px;
    max-width: 90%;
    opacity: 0.8;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-transition: opacity 0.15s;
    transition: opacity 0.15s;
    white-space: nowrap;
  }

  // .el-tabs__header .el-tabs__item.is-active {
  //   color: #fff!important;
  //   background-color: #409eff!important;
  // }

  .el-dialog__header {
    background-color: #1890ff;
    padding: 12px 20px 10px!important;
    .el-dialog__title {
      color: #ffffff!important;
    }
    .el-dialog__headerbtn {
      top: 15px!important;
      .el-dialog__close{
        color: #ffffff!important;
      }
    }
  }


  .el-message-box{
    border: none!important;
    // .el-message-box__header {
    //   background-color: #1890ff;
    //   padding: 12px 15px 10px!important;
    //   .el-message-box__title {
    //     color: #ffffff!important;
    //     font-size: 17px!important;
    //   }
    //   .el-message-box__headerbtn {
    //     top: 12px!important;
    //     .el-message-box__close {
    //       color: #ffffff!important
    //     }
    //   }
    // }
  }

  .index-box .box-right .route-box {
    overflow-y: auto;
    overflow-x: hidden;
    padding: 10px !important;
  }

  .el-row {
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    margin-bottom: 10px;
  }

</style>
