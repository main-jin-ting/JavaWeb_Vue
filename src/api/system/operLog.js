import axios from '../api'

/**
 * 操作日志API
 */
export default {

  // 获取操作日志列表
  operLogList(params) {
    return axios.post('/api/operlog/list', params)
  },

  // 删除操作日志
  operLogDel(params) {
    return axios.post('/api/operlog/drop', params)
  },
  
}
