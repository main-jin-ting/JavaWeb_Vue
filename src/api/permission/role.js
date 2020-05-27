import axios from '../api'

/**
 * API接口
 */
export default {

  // 获取角色列表
  roleList(params) {
    return axios.post('/api/role/list',params)
  },

  // 添加角色
  roleAdd(params) {
    return axios.post('/api/role/add',params)
  },

  // 编辑角色
  roleEdit(params) {
    return axios.post('/api/role/edit',params)
  },

  // 获取角色详情
  roleInfo(params) {
    return axios({
      method: "GET",
      url: "/api/role/info?id="+params.id,
      data: {}
    })
  },

  // 删除角色
  roleDel(params) {
    return axios.post('/api/role/del',params)
  },

  // 设置状态
  roleStatus(params) {
    return axios.post('/api/role/setStatus',params)
  },

  // 设置权限
  roleRules(params) {
    return axios.post('/api/role/setRules',params)
  },

  // 导出Excel
  exportExcel(params) {
    return axios({
      method: "GET",
      url: "/api/role/exportExcel",
      data: {}
    })
  },

}
