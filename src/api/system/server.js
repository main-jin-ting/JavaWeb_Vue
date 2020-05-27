import axios from '../api'

/**
 * 服务器监控API
 */
export default {

  // 获取操作日志列表
  getServer() {
    return axios.post('/api/server/list')
  },
  
}
