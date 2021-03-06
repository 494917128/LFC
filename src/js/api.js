﻿const globalData = {
	url: 'http://132.232.15.225:8080/lfc-ht/',
	image_url: 'http://lfc.com/api/v1/',
}

const setItem = (name, val) => { 
	if (val) {
		window.localStorage.setItem("LFC_"+name, val);
	}
}
const getItem = (name) => { 
	return window.localStorage.getItem("LFC_"+name)
}
const removeItem = (name) => { 
	return window.localStorage.removeItem("LFC_"+name)
}

const isPhone = (val='') => { 
	val = String(val)
	var reg    = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/,
		telReg = !!val.match(reg);
	return telReg
}
const isNum = (val='') => { 
	val = String(val)
	var reg    = /^[1-9]\d*$/,
		telReg = !!val.match(reg);
	return telReg
}

const request = ({ method = 'get', url, type = 'form', data = { }, params = { }, success, fail }) => {
	var access_token = getItem('access_token') || ''
	if (access_token) {
		url = url + '?access-token=' + access_token
	}

	if (method === 'get') {
		params = data
		data = { }
	}

	axios({
	  method,
	  url: globalData.url + url,
	  headers: {
	    'Content-Type': type=='json'?'application/json':'application/x-www-form-urlencoded'
	  },
	  params: params,
	  data: data,
      transformRequest: [function (data) {
        let ret = '',
        	i = 0
        for (let it in data) {
          if (i === 0) {
            ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it])
          } else {
            ret += '&' + encodeURIComponent(it) + '=' + encodeURIComponent(data[it])
          }
          i++
        }
        return ret
      }],
	}).then(function (response) {
		if (response.data.code == 0 || response.data.code == 200) {
			success && success(response.data)
		} else {
			alert(response.data.message || '错误')
		}
	}).catch(function (error) {
		fail && fail(error);
	});
}
const uploadFile = (event,success) => {
	let reader  = new FileReader(),
	  img1    = event.target.files[0], 
	  type    = img1.type,//文件的类型，判断是否是图片  
	  size    = img1.size,//文件的大小，判断图片的大小  
	  imgData = { accept: 'image/gif, image/jpeg, image/png, image/jpg' }
	if(imgData.accept.indexOf(type) == -1){  
	  alert('请选择我们支持的图片格式！');  
	  return false;  
	}  
	if(size>3145728){  
	  alert('请选择3M以内的图片！');  
	  return false;  
	}  
	let form = new FormData();   
	form.append('image',img1,img1.name);
	
	axios({
	  method: 'post',
	  url: globalData.url + 'uploadFile',
	  headers: {
	    'Content-Type': 'multipart/form-data'
	  },
	  data: form
	}).then(function (response) {
		if (response.data.state == 0) {
			alert(response.data.msg || '错误')
		} else {
			success && success(response.data)
		}
	}).catch(function (error) {
		alert('上传图片出错！'); 
	});

}

const getContent = ({_this, type, success}) => {
    request({
      url: 'getContent',
      data: {
        type: type,
      },
      success(res){
      	if (res.data) {
        	_this.page_data = res.data
      	}
        success && success()
      }
    })
}

module.exports = {
	setItem,
	getItem,
	removeItem,

	globalData,

	isPhone,
	isNum,

	request,
	uploadFile,
	getContent
}