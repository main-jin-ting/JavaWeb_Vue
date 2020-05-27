import axios from '../api'

/**
 * API接口
 */
export default {

  // 获取推荐列表
  layoutList(params) {
    return axios.post('/api/layout/list', params)
  },

  // 添加推荐
  layoutAdd(params) {
    return axios.post('/api/layout/add', params)
  },

  // 编辑推荐
  layoutEdit(params) {
    return axios.post('/api/layout/edit', params)
  },

  // 获取推荐详情
  layoutInfo(params) {
    return axios({
      method: "GET",
      url: '/api/layout/info?id='+params.id,
      data: {}
    })
  },

  // 删除推荐
  layoutDel(params) {
    return axios.post('/api/layout/drop', params)
  },

  // 获取栏目列表
  getLayoutDescList(params) {
    return axios.post('/api/layoutdesc/getLayoutDescList', params)
  },

  // 获取参数列表
  getParamList(params) {
    return axios.post('/api/layout/getParamList', params)
  },
  
}
