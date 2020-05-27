import axios from '../api'

/**
 * API接口
 */
export default {

  // 获取站点列表
  cateList(params) {
    return axios.post('/api/itemcate/list', params)
  },

  // 添加站点
  cateAdd(params) {
    return axios.post('/api/itemcate/add', params)
  },

  // 编辑站点
  cateEdit(params) {
    return axios.post('/api/itemcate/edit', params)
  },

  // 获取站点详情
  cateInfo(params) {
    return axios({
      method: "GET",
      url: '/api/itemcate/info?id='+params.id,
      data: {}
    })
  },

  // 删除站点
  cateDel(params) {
    return axios.post('/api/itemcate/drop', params)
  },

  // 设置站点状态
  cateStatus(params) {
    return axios.post('/api/itemcate/setStatus', params)
  },

  // 获取站点列表
  getItemList(params) {
    return axios.post('/api/item/getItemList', params)
  },
  
}
