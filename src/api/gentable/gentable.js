import axios from '../api'

/**
 * 代码生成器
 */
export default {

  // 获取待生成数据表
  getGenTableList(params) {
    return axios.post('/api/gentable/list', params)
  },

  // 获取数据库表
  genDbTableList(params) {
    return axios.post('/api/gentable/genDbTableList', params)
  },

  // 导入表结构
  importTable(params) {
    return axios.post('/api/gentable/importTable', params)
  },

  // 获取表详情信息
  getTableInfo(params){
    return axios({
      method: "GET",
      url: '/api/gentable/getTableInfo?tableId='+params.tableId,
      data: {}
    })
  },

  // 更新代码生成表信息
  updateGenTable(params){
    return axios.post('/api/gentable/updateGenTable', params)
  },

  // 删除业务表
  genTableDel(params) {
    return axios.post('/api/gentable/drop', params)
  },

  // 生成代码
  generatorCode(params) {
    return axios.post('/api/gentable/batchGenCode', params)
  },
  
}
