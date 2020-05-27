import axios from '../api'

/**
 * API接口
 */
export default {

  // 获取人员列表
  userList(params) {
    return axios.post('/api/user/list',params)
  },

  // 添加人员
  userAdd(params) {
    return axios.post('/api/user/add',params)
  },

  // 编辑人员
  userEdit(params) {
    return axios.post('/api/user/edit',params)
  },

  // 获取人员详情
  userInfo(params) {
    return axios({
      method: "GET",
      url: '/api/user/info?id='+params.id,
      data: {}
    })
  },
  

  // 删除人员
  userDel(params) {
    return axios.post('/api/user/drop',params)
  },

  // 设置状态
  userStatus(params) {
    return axios.post('/api/user/setStatus',params)
  },

  // 重置密码
  userResetPwd(params) {
    return axios.post('/api/user/resetPwd',params)
  },

  // 获取职级列表
  getLevelList(params){
    return axios.post('/api/level/getLevelList', params)
  },

  // 获取岗位列表
  getPositionList(params) {
    return axios.post('/api/position/getPositionList', params)
  },

  // 获取部门列表
  getDeptList(params) {
    return axios.post('/api/dep/getDeptList', params)
  },

  // 获取角色列表
  getRoleList(params){
    return axios.post('/api/role/getRoleList', params)
  },

  // 设置权限
  userRules(params) {
    return axios.post('/api/user/setRules',params)
  },

}


