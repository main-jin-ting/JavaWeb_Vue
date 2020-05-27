import axios from '../api'

/**
 * API接口
 */
export default {
  
  // 获取城市列表
  cityList(params) {
    return axios.post('/api/city/list', params)
  },

  // 添加城市
  cityAdd(params) {
    return axios.post('/api/city/add', params)
  },

  // 编辑城市
  cityEdit(params) {
    return axios.post('/api/city/edit', params)
  },

  // 获取城市详情
  cityInfo(params) {
    return axios({
      method: "GET",
      url: '/api/city/info?id='+params.id,
      data: {}
    })
  },

  // 删除城市
  cityDel(params) {
    return axios.post('/api/city/drop', params)
  },

}


