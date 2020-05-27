import axios from '../api'

/**
 * API接口
 */
export default {

  // 获取配置列表
  configList(params) {
    return axios.post('/api/config/list', params)
  },

  // 添加配置
  configAdd(params) {
    return axios.post('/api/config/add', params)
  },

  // 编辑配置
  configEdit(params) {
    return axios.post('/api/config/edit', params)
  },

  // 获取配置详情
  configInfo(params) {
    return axios({
      method: "GET",
      url: '/api/config/info?id='+params.id,
      data: {}
    })
  },

  // 删除配置
  configDel(params) {
    return axios.post('/api/config/drop', params)
  },

  // 获取配置分组
  getGroupList(params){
    return axios.post('/api/configgroup/getGroupList', params)
  },

  // 获取参数列表
  getParamList(params) {
    return axios.post('/api/config/getParamList', params)
  },
  
}
