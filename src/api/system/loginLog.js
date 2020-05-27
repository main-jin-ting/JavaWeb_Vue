import axios from '../api'

/**
 * API接口
 */
export default {

  // 获取登录日志列表
  loginLogList(params) {
    return axios.post('/api/loginlog/list', params)
  },

  // 删除登录日志
  loginLogDel(params) {
    return axios.post('/api/loginlog/drop', params)
  },
  
}
