var domain = 'localhost'||window.location.host;
const globalData = {
	url: 'http://'+domain+':8080/',
	image_url: 'http://'+domain+':8080/',
}

const setItem = (name, val) => { 
	window.localStorage.setItem("LFC_"+name, val);
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

const request = ({method='post', url, type='json', data={}, success, fail}) => {
	axios({
	  method,
	  url: globalData.url + url,
	  headers: {
	    'Content-Type': type=='form'?'application/x-www-form-urlencoded;charset=UTF-8':'application/json;charset=UTF-8'
	  },
	  data
	}).then(function (response) {
		if (response.data.state == 0) {
			alert(response.data.msg || '错误')
		} else {
			success && success(response.data)
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