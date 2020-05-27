import axios from '../api'

/**
 * API接口
 */
export default {

  // 获取广告列表
  adList(params) {
    return axios.post('/api/ad/list', params)
  },

  // 添加广告
  adAdd(params) {
    return axios.post('/api/ad/add', params)
  },

  // 编辑广告
  adEdit(params) {
    return axios.post('/api/ad/edit', params)
  },

  // 获取广告详情
  adInfo(params) {
    return axios({
      method: "GET",
      url: '/api/ad/info?id='+params.id,
      data: {}
    })
  },

  // 删除广告
  adDel(params) {
    return axios.post('/api/ad/drop', params)
  },

  // 获取参数列表
  getParamList(params) {
    return axios.post('/api/link/getParamList', params)
  },

  // 获取广告位列表
  getSortList(params) {
    return axios.post('/api/adsort/getSortList', params)
  },
  
}
