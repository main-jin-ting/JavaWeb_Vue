import axios from '../api'

/**
 * API接口
 */
export default {

  // 获取定时任务列表
  crontabList(params) {
    return axios.post('/api/crontab/list', params)
  },

  // 添加定时任务
  crontabAdd(params) {
    return axios.post('/api/crontab/add', params)
  },

  // 编辑定时任务
  crontabEdit(params) {
    return axios.post('/api/crontab/edit', params)
  },

  // 获取定时任务详情
  crontabInfo(params) {
    return axios({
      method: "GET",
      url: '/api/crontab/info?id='+params.id,
      data: {}
    })
  },

  // 删除定时任务
  crontabDel(params) {
    return axios.post('/api/crontab/drop', params)
  },

  // 设置定时任务状态
  crontabStatus(params) {
    return axios.post('/api/crontab/setStatus', params)
  },
  
}
