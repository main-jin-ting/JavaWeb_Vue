<template>
  <el-drawer
    class="noticeDetail"
    title="公告详情"
    :visible.sync="visible"
    direction="rtl"
    :size="drawerWidth"
    :before-close="handleClose"
  >
    <div class="header">
      <div>{{data.title}}</div>
      <div>
        <span>发布人：{{data.publishUserName}}</span><span>发布时间：{{data.publishTime}}</span>
      </div>
    </div>
    <div v-html="data.content"></div>
    <el-button
      style="margin-top: 10px"
      v-if="data.attachment"
      @click="dowxText(data.attachment)"
      size="small"
      type="primary"
      icon="el-icon-upload"
    >下载附件
    </el-button>
    <div style="text-align: center">
      <el-button
        icon="el-icon-back"
        style="margin-left: 15px"
        size="medium"
        @click="handleClose"
      >返回
      </el-button>
    </div>
  </el-drawer>
</template>

<script>
  import api from '@/api/work/notice'

  export default {
    name: "noticeDetail",
    data() {
      return {
        drawerWidth: document.body.clientWidth - 190 + "px",
        data:{}
      }
    },
    props: {
      visible: {
        type: Boolean,
        default() {
          return false
        }
      },
      noticeId: {
        type: Number,
        default() {
          return 0
        }
      }
    },
    created() {
      this.getInfo()
    },
    methods: {
      dowxText(path){
        window.open(path)
      },
      handleClose(){
        this.$emit('handleClose')
      },
      getInfo() {
        api.info(this.noticeId).then(res => {
          this.data=res.data
        }).catch(e => {
          this.data={}
        });
      }
    }
  }
</script>

<style lang="less">
  .noticeDetail {
    p{
      margin: 0;
    }
    .header{
      text-align: center;
      margin-bottom: 30px;
      >div:first-child{
        font-size: 18px;
        line-height: 20px;
        font-weight: bold;
      }
      >div:last-child{
        font-size: 14px;
        color: #999999;
        margin-top: 15px;
        line-height: 16px;
        >span{
          margin-left: 30px;
        }
      }
    }
  }
</style>
