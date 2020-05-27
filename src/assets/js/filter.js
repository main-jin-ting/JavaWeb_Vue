// import { City } from 'truck-lib'
import Vue from 'vue'

/**
 * 时间格式化
 */

Vue.filter('datetime', function (value, format) {
  if (value) {
    if (format) {
      return dateFtt(format, new Date(parseInt(value)))
    } else {
      return dateFtt("yyyy-MM-dd", new Date(parseInt(value)))
    }
  } else {
    return ''
  }
})

Vue.filter('filterName', function (value, data) {
  let filter = ''
  value = parseInt(value)
  for (let key in data) {
    if (key == value) {
      filter = data[key]
    }
  }
  return filter
})

Vue.filter('filterInList', function (value, data) {
  let filter = ''
  value = parseInt(value)
  let child = data.find(item => item.id == value)
  if (child) {
    filter = child.name
  }
  return filter
})

Vue.filter('filterStatus', function (value) {
  let filter = ''
  value = parseInt(value)
  switch (value) {
    case 1:
      filter = '正常'
      break
    case 2:
      filter = '停用'
      break
    default:
      filter = ''
  }
  return filter
})

function dateFtt(fmt, date) { //author: meizz
  var o = {
    "M+": date.getMonth() + 1,                 //月份
    "d+": date.getDate(),                    //日
    "h+": date.getHours(),                   //小时
    "m+": date.getMinutes(),                 //分
    "s+": date.getSeconds(),                 //秒
    "q+": Math.floor((date.getMonth() + 3) / 3), //季度
    "S": date.getMilliseconds()             //毫秒
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt))
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}






