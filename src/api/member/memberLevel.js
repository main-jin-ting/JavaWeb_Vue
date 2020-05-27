import axios from '../api'

/**
 * API接口
 */
export default {

  // 获取会员级别列表
  memberLevelList(params) {
    return axios.post('/api/memberlevel/list', params)
  },

  // 添加会员级别
  memberLevelAdd(params) {
    return axios.post('/api/memberlevel/add', params)
  },

  // 编辑会员级别
  memberLevelEdit(params) {
    return axios.post('/api/memberlevel/edit', params)
  },

  // 获取会员级别详情
  memberLevelInfo(params) {
    return axios({
      method: "GET",
      url: '/api/memberlevel/info?id='+params.id,
      data: {}
    })
  },

  // 删除会员级别
  memberLevelDel(params) {
    return axios.post('/api/memberlevel/drop', params)
  },
  
}
