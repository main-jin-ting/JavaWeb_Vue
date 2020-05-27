import axios from '../api'

/**
 * API接口
 */
export default {

  // 获取广告位列表
  adSortList(params) {
    return axios.post('/api/adsort/list', params)
  },

  // 添加广告位
  adSortAdd(params) {
    return axios.post('/api/adsort/add', params)
  },

  // 编辑广告位
  adSortEdit(params) {
    return axios.post('/api/adsort/edit', params)
  },

  // 获取广告位详情
  adSortInfo(params) {
    return axios({
      method: "GET",
      url: '/api/adsort/info?id='+params.id,
      data: {}
    })
  },

  // 删除广告位
  adSortDel(params) {
    return axios.post('/api/adsort/drop', params)
  },

    
  // 获取参数列表
  getParamList(params) {
    return axios.post('/api/adsort/getParamList', params)
  },

  // 获取栏目列表
  getCateList(params) {
    return axios.post('/api/itemcate/getCateList', params)
  },
  
}
