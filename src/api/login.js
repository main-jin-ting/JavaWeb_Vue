import axios from './api'

/**
 * API接口
 */
export default {
  
  // 获取验证码
  captcha(params) {
    return axios.get('/api/login/captcha', JSON.stringify(params))
  },

  // 登录系统
  login(params) {
    return axios.post('/api/login/login', params)
  },

  // 获取登录信息
  getLoginInfo(params) {
    return axios.get('/api/login/getLoginInfo', JSON.stringify(params))
  },

  // 获取权限菜单
  authList(params) {
    return axios.get('/api/login/getMenuList', JSON.stringify(params))
  },

  // 退出登录
  logout(params) {
    return axios.get('/api/login/logout', JSON.stringify(params))
  },

  dashboard(params) {
    return axios({
      method: "GET",
      url: '/api/index/dashboard?type='+params.type,
      data: {}
    })
  },

  editPassword(params) {
    return axios.post('/api/login/editPassword',params)
  },
  profile(params) {
    return axios.post('/api/login/profile',params)
  },
  
}
