import axios from '../api'

/**
 * API接口
 */
export default {

  // 获取消息列表
  messageList(params) {
    return axios.post('/api/message/list', params)
  },

  // 获取消息详情
  messageInfo(params) {
    return axios({
      method: "GET",
      url: '/api/message/info?id='+params.id,
      data: {}
    })
  },

  // 删除消息
  messageDel(params) {
    return axios.post('/api/message/drop', params)
  },

  // 设置消息状态
  messageStatus(params) {
    return axios.post('/api/message/setStatus', params)
  },
  
}
