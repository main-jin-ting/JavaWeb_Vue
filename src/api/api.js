import axios from 'axios'
import Cookies from 'js-cookie';
import {Notification} from 'element-ui';
import store from '../vuex'


axios.defaults.timeout = 15000

//跨域请求，允许保存cookie
axios.defaults.withCredentials = true;

//返回其他状态吗
axios.defaults.validateStatus = function (status) {
  return status >= 200 && status <= 500; // 默认的
};


axios.interceptors.request.use(
  config => {
    config.headers['Content-Type'] = 'application/json;charset=UTF-8'
    config.headers['Authorization'] = Cookies.get('token') ? Cookies.get('token') : ''
    return config;
  },
  err => {
    return Promise.reject(err);
  }
);

axios.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    if (response.status == 200) {
      const res = response.data
      // if the custom code is not 20000, it is judged as an error.
      if (res.type == "application/octet-stream") {
        return res
      }
      if (res.code !== 200) {
        Notification.error({
          title: '错误',
          message: res.meta.msg,
          duration: 5 * 1000
        });
        if (res.code === 401 || res.code === 50008 || res.code === 50012 || res.code === 50014) {
          store.dispatch('user/resetToken').then(res => {
            location.reload()
          }).catch(e => {
          })
        } else {
          return Promise.reject(new Error(res.meta.msg || 'Error'))
        }
      } else {
        return res
      }
    } else {
      const res = response.data
      let error = res.meta ? res.meta.msg  : res
      if (response.status == 500) {
        error = '服务超时'
      }
      Notification.error({
        title: '错误',
        message: error
      });
      return Promise.reject(new Error(error))
    }
  },
  error => {
    Notification.error({
      title: '错误',
      message: '服务超时'
    });
    return Promise.reject(error)
  }
)

export default axios

