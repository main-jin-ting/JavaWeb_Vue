import axios from '../api'

/**
 * API接口
 */
export default {

  // 获取字典类型列表
  dicTypeList(params) {
    return axios.post('/api/dictype/list', params)
  },

  // 添加字典类型
  dicTypeAdd(params) {
    return axios.post('/api/dictype/add', params)
  },

  // 编辑字典类型
  dicTypeEdit(params) {
    return axios.post('/api/dictype/edit', params)
  },

  // 获取字典类型详情
  dicTypeInfo(params) {
    return axios({
      method: "GET",
      url: '/api/dictype/info?id='+params.id,
      data: {}
    })
  },

  // 删除字典类型
  dicTypeDel(params) {
    return axios.post('/api/dictype/drop', params)
  },
  
}
