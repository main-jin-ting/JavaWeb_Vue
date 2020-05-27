import axios from '../api'

/**
 * API接口
 */
export default {

  // 获取字典列表
  dicList(params) {
    return axios.post('/api/dic/list', params)
  },

  // 添加字典
  dicAdd(params) {
    return axios.post('/api/dic/add', params)
  },

  // 编辑字典
  dicEdit(params) {
    return axios.post('/api/dic/edit', params)
  },

  // 获取字典详情
  dicInfo(params) {
    return axios({
      method: "GET",
      url: '/api/dic/info?id='+params.id,
      data: {}
    })
  },

  // 删除字典
  dicDel(params) {
    return axios.post('/api/dic/drop', params)
  },
  
  // 设置状态
  dicStatus(params) {
    return axios.post('/api/dic/setStatus', params)
  },

  // 获取字典类型
  getDicTypeList(params) {
    return axios.post('/api/dictype/getDicTypeList', params)
  }

}
