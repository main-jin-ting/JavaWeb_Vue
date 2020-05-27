// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import store from './vuex/index'
import router from './router'

Vue.config.productionTip = false

import 'element-ui/lib/theme-chalk/index.css'
import ElementUI from 'element-ui';

Vue.use(ElementUI);

import VueWechatTitle from 'vue-wechat-title';

Vue.use(VueWechatTitle)

import 'babel-polyfill'
import Es6Promise from 'es6-promise'

require('es6-promise').polyfill()
Es6Promise.polyfill()

require('./assets/js/filter')
import './assets/icons'

import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'
import $ from 'jquery'
import { resetForm, download } from "@/api/common/utils";

// 全局方法挂载
Vue.prototype.download = download
Vue.prototype.resetForm = resetForm
Vue.prototype.msgSuccess = function (msg) {
  this.$message({ showClose: true, message: msg, type: "success" });
}
Vue.prototype.msgError = function (msg) {
  this.$message({ showClose: true, message: msg, type: "error" });
}
Vue.prototype.msgInfo = function (msg) {
  this.$message.info(msg);
}

Vue.use(Viewer, {
  defaultOptions: {
    zIndex: 9999,
    url: "data-source",
    title: true,
    view: function (e) {
      setTimeout(function () {
        $('.viewer-canvas img').css('height',(document.body.clientHeight-150)+'px')
      },100)
      if(e.detail.originalImage.title){
        $('.viewer-title').hide()
        $('.viewer-new-title').remove()
        $('.viewer-footer').prepend('<div class="viewer-new-title">'+e.detail.originalImage.title+'</div>')
        setTimeout(function () {
          $('.viewer-title').html(e.target.innerText)
        },100)
      }
    },
  }
})

import VueLazyload from 'vue-lazyload'

Vue.use(VueLazyload, {
  preLoad: 1.3,
  error: require('./assets/img/404.jpg'),
  loading: require('./assets/img/loading.svg'),
  attempt: 1,
  listenEvents: ['scroll']
})

// 富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
  
Vue.use(VueQuillEditor)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App)
})
