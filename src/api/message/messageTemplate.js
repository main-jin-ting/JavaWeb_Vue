import axios from '../api'

/**
 * API接口
 */
export default {

  // 获取消息模板列表
  messageTemplateList(params) {
    return axios.post('/api/messagetemplate/list', params)
  },

  // 添加消息模板
  messageTemplateAdd(params) {
    return axios.post('/api/messagetemplate/add', params)
  },

  // 编辑消息模板
  messageTemplateEdit(params) {
    return axios.post('/api/messagetemplate/edit', params)
  },

  // 获取消息模板详情
  messageTemplateInfo(params) {
    return axios({
      method: "GET",
      url: '/api/messagetemplate/info?id='+params.id,
      data: {}
    })
  },

  // 删除消息模板
  messageTemplateDel(params) {
    return axios.post('/api/messagetemplate/drop', params)
  },

  // 设置消息模板状态
  messageTemplateStatus(params) {
    return axios.post('/api/messagetemplate/setStatus', params)
  },

  // 获取参数列表
  getParamList(params) {
    return axios.post('/api/messagetemplate/getParamList', params)
  },
  
}
