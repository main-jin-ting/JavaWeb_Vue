import axios from '../api'

/**
 * 通用js方法封装处理
 */
export default {
  
  // 上传图片
  upload(params) {
    return axios({
      method: "POST",
      url: '/api/upload/uploadImage',
      data: params,
      timeout: 1000000,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },
}

// 下载文件
export function download(fileName) {
  console.log(11111)
  window.location.href = "/api/common/download?fileName=" + encodeURI(fileName) + "&delete=" + true;
}

// 表单重置
export function resetForm(refName) {
	if (this.$refs[refName]) {
		this.$refs[refName].resetFields();
	}
}
