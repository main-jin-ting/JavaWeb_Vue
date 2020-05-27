import axios from '../api'

/**
 * API接口
 */
export default {

  // 获取配置分组列表
  configGroupList(params) {
    return axios.post('/api/configgroup/list', params)
  },

  // 添加配置分组
  configGroupAdd(params) {
    return axios.post('/api/configgroup/add', params)
  },

  // 编辑配置分组
  configGroupEdit(params) {
    return axios.post('/api/configgroup/edit', params)
  },

  // 获取配置分组详情
  configGroupInfo(params) {
    return axios({
      method: "GET",
      url: '/api/configgroup/info?id='+params.id,
      data: {}
    })
  },

  // 删除配置分组
  configGroupDel(params) {
    return axios.post('/api/configgroup/drop', params)
  },
  
}
