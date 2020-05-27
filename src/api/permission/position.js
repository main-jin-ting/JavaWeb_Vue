import axios from '../api'

/**
 * API接口
 */
export default {

  // 获取岗位列表
  positionList(params) {
    return axios.post('/api/position/list', params)
  },

  // 添加岗位
  positionAdd(params) {
    return axios.post('/api/position/add', params)
  },

  // 编辑岗位
  positionEdit(params) {
    return axios.post('/api/position/edit', params)
  },

  // 获取岗位详情
  positionInfo(params) {
    return axios({
      method: "GET",
      url: '/api/position/info?id='+params.id,
      data: {}
    })
  },

  // 删除岗位
  positionDel(params) {
    return axios.post('/api/position/drop', params)
  },

  // 设置岗位状态
  positionStatus(params) {
    return axios.post('/api/position/setStatus', params)
  },

}
