import axios from '../api'

/**
 * API接口
 */
export default {

  // 获取站点列表
  itemList(params) {
    return axios.post('/api/item/list', params)
  },

  // 添加站点
  itemAdd(params) {
    return axios.post('/api/item/add', params)
  },

  // 编辑站点
  itemEdit(params) {
    return axios.post('/api/item/edit', params)
  },

  // 获取站点详情
  itemInfo(params) {
    return axios({
      method: "GET",
      url: '/api/item/info?id='+params.id,
      data: {}
    })
  },

  // 删除站点
  itemDel(params) {
    return axios.post('/api/item/drop', params)
  },

  // 设置站点状态
  itemStatus(params) {
    return axios.post('/api/item/setStatus', params)
  },

  // 获取站点类型
  getItemTypeList(params){
    return axios.post('/api/item/getItemTypeList', params)
  },
  
}
