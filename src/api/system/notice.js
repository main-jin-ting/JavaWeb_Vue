import axios from '../api'

/**
 * API接口
 */
export default {

  // 获取通知列表
  noticeList(params) {
    return axios.post('/api/notice/list', params)
  },

  // 添加通知
  noticeAdd(params) {
    return axios.post('/api/notice/add', params)
  },

  // 编辑通知
  noticeEdit(params) {
    return axios.post('/api/notice/edit', params)
  },

  // 获取通知详情
  noticeInfo(params) {
    return axios({
      method: "GET",
      url: '/api/notice/info?id='+params.id,
      data: {}
    })
  },

  // 删除通知
  noticeDel(params) {
    return axios.post('/api/notice/drop', params)
  },

  // 设置通知状态
  noticeStatus(params) {
    return axios.post('/api/notice/setStatus', params)
  },

  // 设置置顶
  noticeIsTop(params) {
    return axios.post('/api/notice/setIsTop', params)
  },

  // 获取参数列表
  getParamList(params) {
    return axios.post('/api/notice/getParamList', params)
  },
  
}
