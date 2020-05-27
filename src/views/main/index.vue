<template>
  <div class="main-index" style="position: relative">
    2222
  </div>
</template>

<script>
</script>

<style lang="less">
  .main-index{
    .selectCity{
      position: absolute;
      z-index: 999;
      top: 20px;
      left: 20px;
    }
    .btn{
      position: absolute;
      bottom: 20px;
      right: 20px;
      padding: 0 10px;
      cursor:pointer;
      background-color: #f2f5f6;
      box-shadow: 0 0 6px rgba(0,0,0, .12);
      text-align: center;
      line-height: 40px;
      color: #1989fa;
      z-index: 999;
    }
    .index-map {
      width: 100%;
      height: 100%;
      border: 1px solid #DCDFE6;
      box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .12), 0 0 6px 0 rgba(0, 0, 0, .04);
      .amap-marker-label{
        padding: 0!important;
        font-size: 14px!important;
        line-height: 18px!important;
      }
    }
  }

</style>
