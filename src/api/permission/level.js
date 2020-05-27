import axios from '../api'

/**
 * API接口
 */
export default {

  // 获取职级列表
  levelList(params) {
    return axios.post('/api/level/list', params)
  },

  // 添加职级
  levelAdd(params) {
    return axios.post('/api/level/add', params)
  },

  // 编辑职级
  levelEdit(params) {
    return axios.post('/api/level/edit', params)
  },

  // 获取职级详情
  levelInfo(params) {
    return axios({
      method: "GET",
      url: '/api/level/info?id='+params.id,
      data: {}
    })
  },

  // 删除职级
  levelDel(params) {
    return axios.post('/api/level/drop', params)
  },

  // 设置职级状态
  levelStatus(params) {
    return axios.post('/api/level/setStatus', params)
  },
  
}
