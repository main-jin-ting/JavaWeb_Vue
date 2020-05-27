import axios from '../api'

/**
 * API接口
 */
export default {

  // 获取友链列表
  linkList(params) {
    return axios.post('/api/link/list', params)
  },

  // 添加友链
  linkAdd(params) {
    return axios.post('/api/link/add', params)
  },

  // 编辑友链
  linkEdit(params) {
    return axios.post('/api/link/edit', params)
  },

  // 获取友链详情
  linkInfo(params) {
    return axios({
      method: "GET",
      url: '/api/link/info?id='+params.id,
      data: {}
    })
  },

  // 删除友链
  linkDel(params) {
    return axios.post('/api/link/drop', params)
  },

  // 设置友链状态
  linkStatus(params) {
    return axios.post('/api/link/setStatus', params)
  },
  
  // 获取参数列表
  getParamList(params) {
    return axios.post('/api/link/getParamList', params)
  },

  // 获取栏目列表
  getCateList(params) {
    return axios.post('/api/itemcate/getCateList', params)
  },

}
