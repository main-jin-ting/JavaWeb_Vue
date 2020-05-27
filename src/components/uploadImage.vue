<template ref="uploadImage">
  <div v-loading="uploadLoading" class='finish_room'>
    <div class='finish_room2'>
      <div v-if="img" class='room_img'>
        <viewer style="height: 100%" :images="photo">
          <img :key="index" v-for="(src,index) in photo" v-lazy="src">
        </viewer>
        <div @click="deleteImg()" class="im-button">
          <div class="im-close"></div>
          <div class="im-close1"></div>
        </div>
      </div>
      <div v-if="!img" v-loading="loading" class='room_add_img'>
        <span><img src="../assets/img/add_img.png"></span>
        <input  :disabled="disabled" @change='add_img' type="file">
      </div>
    </div>
  </div>

</template>

<script>
  import utilsApi from '@/api/common/utils'
  export default {
    props: [
      'limit',
      'addUrl',
      'img',
      'disabled',
      'isCompress'
    ],
    data: function () {
      return {
        loading: false,
        photo:[],
        uploadLoading:false
      }
    },
    mounted() {
      if(this.img){
        this.photo.push(this.img)
      }
      this.limit = this.limit ? parseInt(this.limit) : 1
    },
    methods: {
      deleteImg() {
        this.photo = []
        this.$emit('removeImage')
      },
      compress(img) {
        var url = null;
        var canvas = document.createElement("canvas");
        var scale = img.height / img.width;
        canvas.width = 720;
        canvas.height = 720 * scale;


        var ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        url = canvas.toDataURL("image/jpeg");
        return url;

      },
      dataURItoBlob (dataURI) {
        let byteString = window.atob(dataURI.split(',')[1])
        let mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
        let ab = new ArrayBuffer(byteString.length)
        let ia = new Uint8Array(ab)
        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i)
        }
        return new window.Blob([ab], {type: mimeString})
      },
      add_img(event) {
        let file = event.target.files[0]
        if (/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(event.target.value)) {
          this.uploadLoading=true
          let reader = new FileReader()
          let self = this
          reader.readAsDataURL(file)
          let img = new Image;
          reader.onload = function (e) {
            img.src = this.result;
            img.onload = function () {
              let base = e.target.result
              let fileItem = file
              console.log(self.isCompress)
              if( self.isCompress){
                base = self.compress(img)
                fileItem =  self.dataURItoBlob(base)
              }
              let formdata = new window.FormData()
              formdata.append('file', fileItem,"image.png")
              formdata.append('action', 'test')
              formdata.append('name', 'admin')
              utilsApi.upload(formdata).then(res => {
                self.photo.push(base)
                event.target.value = ''
                self.$emit('addImage',res.data)
                self.uploadLoading=false
              }).catch(e => {
                event.target.value = ''
                self.uploadLoading=false
              })
            }
          }
        } else {
          this.$notify.error({
            title: '上传图片错误',
            message: '请上传gif|jpg|jpeg|png|GIF|JPG|PNG格式图片'
          })
        }
      }
    }
  }
</script>
<style scoped>
  .finish_room {
    width: 140px;
    height: 140px;
  }

  img {
    height: 100%;
  }

  .finish_room2 {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
  }

  .finish_room2 .margeImg {
    margin-left: 10px;
  }

  .finish_room2 .room_img {
    width: 100%;
    height: 100%;
    cursor: pointer;
    overflow: hidden;
    position: relative;
    text-align: center;
    background-color: rgba(0,0,0,.5);
  }

  .finish_room2 .room_img:before {
    /*content: "";*/
    /*width: 0;*/
    /*height: 100%;*/
    /*!*background: #000;*!*/
    /*padding: 14px 18px;*/
    /*position: absolute;*/
    /*top: 0;*/
    /*left: 50%;*/
    /*opacity: 0;*/
  }

  .finish_room2 .room_img:hover:before {
    width: 100%;
    left: 0;
    opacity: 0.5;
  }

  .finish_room2 .room_img .box-content {
    width: 100%;
    padding: 14px 18px;
    color: #fff;
    position: absolute;
    top: 38%;
    left: 0;
  }

  .finish_room2 .room_img .icon {
    padding: 0;
    margin: 0;
    list-style: none;
    margin-top: -20px;
  }

  .finish_room2 .room_img .icon li {
    display: inline-block;
  }

  .finish_room2 .room_img .icon li i {
    display: block;
    width: 40px;
    height: 40px;
    line-height: 40px;
    border-radius: 50%;
    font-size: 20px;
    font-weight: 700;
    color: #fff;
    margin-right: 25px;
    opacity: 0;
    transform: translateY(50px);
    transition: all 0.5s ease 0s;
  }


  @media only screen and (max-width: 990px) {
    .finish_room2 .room_img {
    }
  }

  .finish_room2 .deleteImg {
    color: red;
    position: absolute;
    top: 0px;
    left: 80px;
    cursor: pointer;
  }

  .finish_room2 .room_img img {
    cursor: pointer;
    width: 100%;
    height: 100%;
  }

  .finish_room2 > .room_img span {
    position: absolute;
    width: auto;
    height: auto;
    right: 5px;
    bottom: 3px;
  }

  .finish_room2 .im-button {
    position: absolute;
    top: -14px;
    right: -18px;
    width: 40px;
    height: 40px;
    cursor: pointer;
    border-radius: 50%;
    background-color: rgba(0, 0, 0, .5);
    opacity: 0;
  }

  .finish_room2 .room_img:hover .icon li i {
    opacity: 0.5;
  }

  .finish_room2 .room_img:hover img{
    opacity: 0.5;
  }


  .finish_room2 .room_img:hover .im-button {
    opacity: 1;
  }

  .finish_room2 .im-close {
    transform: rotate(-45deg);
    line-height: 0px;
    left: 6px;
    bottom: 13px;
    display: inline-block;
    width: 15px;
    height: 2px;
    background: #fff;
    position: absolute;
  }

  .finish_room2 .im-close1 {
    left: 5px;
    bottom: 13px;
    display: inline-block;
    width: 15px;
    height: 2px;
    background: #fff;
    position: absolute;
    transform: rotate(45deg);
  }

  .room_add_img {
    background-color: #eeeeee;
    width: 100%;
    height: 100%;
    cursor: pointer;
    border: 1px solid #e1e1e1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    position: relative;
    z-index: 10;
  }

  .room_add_img > span:nth-child(1) {
    margin-top: 63px;
    width: 40px;
    height: 40px;
    overflow: hidden;
  }

  .room_add_img > span:nth-child(2) {
    margin-bottom: 10px;
  }

  .room_add_img input {
    cursor: pointer;
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    z-index: 99999;
    opacity: 0;
  }
</style>
