import axios from '../api'

/**
 * API接口
 */
export default {

  // 获取推荐描述列表
  layoutDescList(params) {
    return axios.post('/api/layoutdesc/list', params)
  },

  // 添加推荐描述
  layoutDescAdd(params) {
    return axios.post('/api/layoutdesc/add', params)
  },

  // 编辑推荐描述
  layoutDescEdit(params) {
    return axios.post('/api/layoutdesc/edit', params)
  },

  // 获取推荐描述详情
  layoutDescInfo(params) {
    return axios({
      method: "GET",
      url: '/api/layoutdesc/info?id='+params.id,
      data: {}
    })
  },

  // 删除推荐描述
  layoutDescDel(params) {
    return axios.post('/api/layoutdesc/drop', params)
  },

  // 获取站点列表
  getItemList(params) {
    return axios.post('/api/item/getItemList', params)
  },
  
}
