import axios from '../api'

/**
 * API接口
 */
export default {
  
  // 获取部门列表
  depList(params) {
    return axios.post('/api/dep/list', params)
  },

  // 添加部门
  depAdd(params) {
    return axios.post('/api/dep/add', params)
  },

  // 编辑部门
  depEdit(params) {
    return axios.post('/api/dep/edit', params)
  },

  // 获取部门详情
  depInfo(params) {
    return axios({
      method: "GET",
      url: '/api/dep/info?id='+params.id,
      data: {}
    })
  },

  // 删除部门
  depDel(params) {
    return axios.post('/api/dep/drop', params)
  },

}


