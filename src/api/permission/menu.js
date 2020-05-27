import axios from '../api'

/**
 * API接口
 */
export default {

  // 获取菜单列表
  menuList(params) {
    return axios.post('/api/menu/list',params)
  },

  // 添加菜单
  menuAdd(params) {
    return axios.post('/api/menu/add',params)
  },

  // 编辑菜单
  menuEdit(params) {
    return axios.post('/api/menu/edit',params)
  },

  // 获取菜单详情
  menuInfo(params) {
    return axios({
      method: "GET",
      url: '/api/menu/info?id='+params.id,
      data: {}
    })
  },

  // 删除菜单
  menuDel(params) {
    return axios.post('/api/menu/del',params)
  },
  
  // 设置状态
  menuStatus(params) {
    return axios.post('/api/menu/setStatus',params)
  }
}
