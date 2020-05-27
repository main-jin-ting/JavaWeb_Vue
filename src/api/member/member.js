import axios from '../api'

/**
 * API接口
 */
export default {

  // 获取会员列表
  memberList(params) {
    return axios.post('/api/member/list', params)
  },

  // 添加会员
  memberAdd(params) {
    return axios.post('/api/member/add', params)
  },

  // 编辑会员
  memberEdit(params) {
    return axios.post('/api/member/edit', params)
  },

  // 获取会员详情
  memberInfo(params) {
    return axios({
      method: "GET",
      url: '/api/member/info?id='+params.id,
      data: {}
    })
  },

  // 删除会员
  memberDel(params) {
    return axios.post('/api/member/drop', params)
  },

  // 设置状态
  memberStatus(params) {
    return axios.post('/api/member/setStatus', params)
  },

  // 获取参数
  getParamList(params){
    return axios.post('/api/member/getParamList', params)
  },
  
}
