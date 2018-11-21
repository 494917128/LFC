var http       = require('http'),
	url        = require('url'),
	util       = require('util'),
	querystring = require('querystring'),
	mysql      = require('mysql'),
	express    = require('express'),
	app        = express(),
	bodyParser = require('body-parser'),
	multer     = require('multer'),
	fs         = require("fs"),
	QcloudSms  = require("qcloudsms_js"), // 腾讯云短信
	appid      = 1400138444, // 腾讯云短信的appid
	appkey     = "43f06a5370f307c19328920596ad5820"; // 腾讯云短信的appkey

app.use('/images', express.static(__dirname + '/images'))
app.use('/video', express.static(__dirname + '/video'))
app.use(express.static('public'));
// 创建 application/x-www-form-urlencoded 编码解析
app.use(bodyParser.json({ extended: false }));

var pool = mysql.createPool({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'lfc'
});

function _Json(images_json) {
	return (images_json ? images_json.split(',') : [])	
}
// 时间戳转换
function add0(m){return m<10?'0'+m:m }
function format(shijianchuo){
	if (typeof shijianchuo == 'string') {
		shijianchuo = Number(shijianchuo)
	}
	var time = new Date(shijianchuo);
	var y = time.getFullYear();
	var m = time.getMonth()+1;
	var d = time.getDate();
	var h = time.getHours();
	var mm = time.getMinutes();
	var s = time.getSeconds();
	return y+'-'+add0(m)+'-'+add0(d)+' '+add0(h)+':'+add0(mm)+':'+add0(s);
}
//发送短信
let sendNote = (phoneNumbers, params) => {
	// params = ["5678", "1"];//数组具体的元素个数和模板中变量个数必须一致
	
	var templateId = 192515; // 短信模板ID，需要在短信应用中申请
	var SmsSign = "LFC"; // 签名
	var qcloudsms = QcloudSms(appid, appkey);// 实例化QcloudSms
	var ssender = qcloudsms.SmsSingleSender();

	// 设置请求回调处理, 这里只是演示，用户需要自定义相应处理回调
	function callback(err, res, resData) {
	    if (err) {
	        console.log("err: ", err);
	    } else {
	        console.log("request data: ", res.req);
	        console.log("response data: ", resData);
	    }
	}
	// 签名参数未提供或者为空时，会使用默认签名发送短信
	ssender.sendWithParam(86, phoneNumbers, templateId, params, SmsSign, "", "", callback); 
}
var timeoutCode

let query = function( sql ) {
  // 返回一个 Promise
  return new Promise(( resolve, reject ) => {
    pool.getConnection(function(err, connection) {
      if (err) {
      	throw err;
        reject( err )
      } else {
        connection.query(sql, ( err, res, fields) => {

          if ( err ) {
            reject( err )
          } else {
            resolve( res )
          }
          // 结束会话
          connection.release()
        })
      }
    })
  })
}

// 查找数据
let selectData = (table,inner,where,pageStart,pageSize,like={},order={})=>{
	order[table+'.update_time'] = "DESC"
    var _INNER='';
    var _WHERE='';
    var _ORDER='';
    var _LIKE ='';
    var _LIMIT='';
    for(var k0 in inner){
      //多个筛选条件使用  
      _INNER+=" INNER JOIN "+k0+" ON "+table+"."+inner[k0]+"="+k0+"."+inner[k0];
      // _WHERE+= k2+"="+where[k2];
    }
    for(var k2 in where){
      //多个筛选条件使用  
      _WHERE+=table+'.'+k2+"='"+where[k2]+"' AND ";
      // _WHERE+= k2+"="+where[k2];
    }
    _WHERE=_WHERE.slice(0,-5);
    for(var k3 in like){
      //多个筛选条件使用  
      _LIKE+=k3+" LIKE '%"+like[k3]+"%' OR ";
    }
    _LIKE=_LIKE.slice(0,-4);
    for(var k4 in order){
      _ORDER+=k4+" "+order[k4]+",";
    }
    _ORDER=_ORDER.slice(0,-1)
    if (pageSize) {
    	_LIMIT = ' LIMIT '+pageStart+','+pageSize
    }
    var sql_where = _WHERE||_LIKE?' WHERE '+_WHERE+_LIKE:'';
    var sql="SELECT * FROM "+table+_INNER+sql_where+" ORDER BY "+_ORDER+_LIMIT;
	return query(sql);
}
let selectLength = async (table,inner,where,like={})=>{
    var _INNER='';
    var _WHERE='';
    var _LIKE ='';
    for(var k0 in inner){
      //多个筛选条件使用  
      _INNER+=" INNER JOIN "+k0+" ON "+table+"."+inner[k0]+"="+k0+"."+inner[k0];
      // _WHERE+= k2+"="+where[k2];
    }
    for(var k2 in where){
      //多个筛选条件使用  
      _WHERE+=table+'.'+k2+"='"+where[k2]+"' AND ";
      // _WHERE+= k2+"="+where[k2];
    }
    _WHERE=_WHERE.slice(0,-5);
	for(var k3 in like){
      //多个筛选条件使用  
      _LIKE+=k3+" LIKE '%"+like[k3]+"%' OR ";
    }
    _LIKE=_LIKE.slice(0,-4);
    var sql_where = _WHERE||_LIKE?' WHERE '+_WHERE+_LIKE:'';
    var sql="SELECT count(*) FROM "+table+_INNER+sql_where;
    var length = await query(sql)
	return length[0]['count(*)'];
}
// 插入一条数据
let insertData = (table,datas)=>{
	// 每次添加设置个默认时间
	var new_time = new Date().getTime()
	datas.update_time = new_time
	datas.add_time = new_time
	var fields='';
	var values='';
	for( var k in datas){
		fields+=k+',';
		values=values+"'"+datas[k]+"',"
	}
	fields=fields.slice(0,-1);
	values=values.slice(0,-1);
	var sql="INSERT INTO "+table+'('+fields+') VALUES('+values+')';
	return query(sql)
}
// 更新数据
let updateData = function(table,sets,where,callback){
	// 每次添加设置个修改时间
	sets.update_time = new Date().getTime()
    var _SETS='';
    var _WHERE='';
    var keys='';
    var values='';
    for(var k in sets){
        _SETS+=k+"='"+sets[k]+"',";
    }
    _SETS=_SETS.slice(0,-1);
    for(var k2 in where){
       _WHERE+=k2+"='"+where[k2]+"' AND ";
      // _WHERE+= k2+"="+where[k2];
    }
    _WHERE=_WHERE.slice(0,-5);
    // UPDATE user SET Password='321' WHERE UserId=12
    //update table set username='admin2',age='55'   where id="5";
    var sql="UPDATE "+table+' SET '+_SETS+' WHERE '+_WHERE;
	return query(sql);
}
// 删除一条数据
let deleteData = function(table,where){
    var _WHERE='';
    for(var k2 in where){
      //多个筛选条件使用  
      _WHERE+=k2+"='"+where[k2]+"' AND ";
      // _WHERE+= k2+"="+where[k2];
    }
    _WHERE=_WHERE.slice(0,-5);
    // DELETE  FROM user WHERE UserId=12  注意UserId的数据类型要和数据库一致
    var sql="DELETE FROM "+table+' WHERE '+_WHERE;
	return query(sql);
}

// 后台操作，需要adminId
let isAdmin = async function(admin_id){
	if (!admin_id) {
		return false
	} else {
		let is_admin = await selectLength('lfc_users', {}, { user_id: admin_id, is_admin: '1' })
		if (!is_admin) {
			return false
		} else {
			return true
		}
	}
}

app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    res.header("Access-Control-Allow-Methods","POST,GET");
    // res.header("Content-Type", "application/json;charset=utf-8;multipart/form-data");
    if(req.method=="OPTIONS") res.send(204);/*让options请求快速返回*/
    else next();
})


var file = multer({ dest: '/tmp/'}).array('image'),
  files = multer({ dest: '/tmp/'}).array('image[]'),
  video = multer({ dest: '/tmp/'}).array('video')
// 上传图片
app.post('/uploadFile', file, async function (req, res) {
	var data     = {},
		file     = req.files[0]
 
   console.log(req.files);  // 上传的文件信息

    var des_file = __dirname + '/images/user/' + file.originalname;
	try { 
		var flie_data = fs.readFileSync(file.path);
		fs.writeFileSync(des_file, flie_data);
		data.image = 'images/user/' + file.originalname
		res.json({
			state: 1,
			msg: '上传成功',
			data: data
		})
	} catch (err) { 
		res.json({
			state: 0,
			msg: '上传失败'
		})
	}
  console.log( response );
})
app.post('/uploadVideo', video, async function (req, res) {
	var data     = {},
		file     = req.files[0]
 
   console.log(req.files);  // 上传的文件信息

    var des_file = __dirname + '/video/' + file.originalname;
	try { 
		var flie_data = fs.readFileSync(file.path);
		fs.writeFileSync(des_file, flie_data);
		data.video = 'video/' + file.originalname
		res.json({
			state: 1,
			msg: '上传成功',
			data: data
		})
	} catch (err) { 
		res.json({
			state: 0,
			msg: '上传失败'
		})
	}
})

// 获取验证码
app.post('/getCode', async function (req, res) {
	var data     = {},
		mobile   = req.body.mobile;

    if ( !mobile ) {
	    res.json({
	        state: 0,
	        msg: '请填写手机号'
	    })
    } else if ( mobile.length != 11 ) {
	    res.json({
	        state: 0,
	        msg: '手机号格式错误'
	    })
    } else {
    	var code="";
    	var time=5;
		for(var i=0;i<4;i++){
			code+=Math.floor(Math.random()*10)
		}
		// sendNote(mobile, [code])
		await deleteData('lfc_user_code',{
			mobile: mobile,
		})

		let insert = await insertData('lfc_user_code', {
			mobile: mobile,
			code: code,
		})
	    if (insert.insertId) {
	    	// 有效期300秒
			setTimeoutCode = setTimeout(()=>{
				deleteData('lfc_user_code', { code_id: insert.insertId })
			},time*60000)
		    res.json({
		        state: 1,
		        msg: '发送成功'
		    })
	    }
    }
})

// 注册
app.post('/register', async function (req, res) {
	var data     = {},
		name     = req.body.name,
		mobile   = req.body.mobile,
		code     = req.body.code,
		password = req.body.password;
    if ( !name ) {
	    res.json({
	        state: 0,
	        msg: '请填写昵称'
	    })
    } else if ( !mobile ) {
	    res.json({
	        state: 0,
	        msg: '请填写手机号'
	    })
    } else if ( mobile.length != 11 ) {
	    res.json({
	        state: 0,
	        msg: '手机号格式错误'
	    })
    } else if ( !password ) {
	    res.json({
	        state: 0,
	        msg: '请填写密码'
	    })
    } else if ( !code ) {
	    res.json({
	        state: 0,
	        msg: '请填写验证码'
	    })
    } else {
    	let code_list = await selectData('lfc_user_code', {}, { mobile: mobile, code: code }),
    		code_length = await selectLength('lfc_user_code', {}, { mobile: mobile, code: code })
    	if (code_length) {
			clearTimeout(timeoutCode)
			deleteData('lfc_user_code', { code_id: code_list[0].code_id })
			// 判断手机号是否已经注册
			let list = await selectData('lfc_users', {}, { mobile: mobile })

		    if (list.length != 0) {
			    res.json({
			        state: 0,
			        msg: '该手机号已经注册'
			    })
		    } else {
		    	var addUser = await insertData('lfc_users',{
		    		user_name: name,
		    		mobile: mobile,
		    		user_password: password
		    	})
				if (addUser.insertId) {
				    res.json({
				        state: 1,
				        msg: '注册成功'
				    })
				}
		    }
		} else {
		    res.json({
		        state: 0,
		        msg: '验证码错误'
		    })
		}
    }
})

// 登录
app.post('/login', async function (req, res) {
	var data     = {},
		is_admin = req.body.is_admin,
		mobile   = req.body.mobile,
		password = req.body.password;
    if ( !mobile ) {
	    res.json({
	        state: 0,
	        msg: '请填写手机号'
	    })
    } else if ( mobile.length != 11 ) {
	    res.json({
	        state: 0,
	        msg: '手机号格式错误'
	    })
    } else if ( !password ) {
	    res.json({
	        state: 0,
	        msg: '请填写密码'
	    })
    } else {
		// 判断手机号是否已经注册
		let _WHERE = { mobile: mobile }
			if (is_admin) { _WHERE.is_admin = is_admin }
		let list = await selectData('lfc_users', {}, _WHERE)
	    if ( list.length != 1 ) {
		    res.json({
		        state: 0,
		        msg: is_admin?'不是管理员，无法登陆':'该账号未注册，请先注册'
		    })
		} else if ( list[0].user_password != password ) {
		    res.json({
		        state: 0,
		        msg: '密码错误'
		    })
	    } else {
	    	data.user_id = list[0].user_id
		    res.json({
		        state: 1,
		        msg: '登录成功',
		        data: data
		    })
	    }
    }
})

// 忘记密码
app.post('/forgetPassword', async function (req, res) {
	var data     = {},
		mobile   = req.body.mobile,
		code     = req.body.code,
		password = req.body.password;
    if ( !mobile ) {
	    res.json({
	        state: 0,
	        msg: '请填写手机号'
	    })
    } else if ( mobile.length != 11 ) {
	    res.json({
	        state: 0,
	        msg: '手机号格式错误'
	    })
    } else if ( !password ) {
	    res.json({
	        state: 0,
	        msg: '请填写密码'
	    })
    } else if ( !code ) {
	    res.json({
	        state: 0,
	        msg: '请填写验证码'
	    })
    } else {
		let list = await selectData('lfc_users', {}, { mobile: mobile })
	    if ( list.length != 1 ) {
		    res.json({
		        state: 0,
		        msg: '该账号未注册，请先注册'
		    })
	    } else {
	    	let code_list = await selectData('lfc_user_code', {}, { mobile: mobile, code: code }),
	    		code_length = await selectLength('lfc_user_code', {}, { mobile: mobile, code: code })

	    	if (code_length) {
				clearTimeout(timeoutCode)
				deleteData('lfc_user_code', { code_id: code_list[0].code_id })
		    	let update = await updateData('lfc_users', { user_password: password }, { mobile: mobile })
			    res.json({
			        state: 1,
			        msg: '密码修改成功'
			    })
			} else {
			    res.json({
			        state: 0,
			        msg: '验证码错误'
			    })
			}
	    }

    }
})


// 获取用户信息
app.post('/getUserInfo', async function (req, res) {
	var data     = {},
		user_id  = req.body.user_id;
    if ( !user_id ) {
	    res.json({
	        state: 0,
	        msg: '缺少参数'
	    })
    } else {
		let list = await selectData('lfc_users', {}, { user_id: user_id }),
	    	address_define = await selectData('lfc_user_address', {}, { user_id: user_id, is_default: '1' }),
	    	address_num = await selectLength('lfc_user_address', {}, { user_id: user_id }),
	    	collect_length = await selectLength('lfc_media_collect', {}, { user_id: user_id })
	    if ( list.length != 1 ) {
		    res.json({
		        state: 0,
		        msg: '该账号未注册，请先注册'
		    })
	    } else {
	    	if (address_define.length) {
			    data.address_default = {
			    	id: address_define[0].address_id,
			    	consignee: address_define[0].consignee,
			    	prov: address_define[0].prov,
			    	city: address_define[0].city,
			    	district: address_define[0].district,
			    	address: address_define[0].address,
			    	zipcode: address_define[0].zipcode,
			    	tel: address_define[0].tel
			    }
	    	}

		    data.mobile = list[0].mobile
		    data.user_image = list[0].user_image
		    data.user_name = list[0].user_name
		    data.address_num = address_num
		    data.collect_length = collect_length

		    res.json({
		        state: 1,
		        msg: '请求成功',
		        data: data
		    })
	    }
    }
})

// 更改用户信息
app.post('/updateUserInfo', async function (req, res) {
	var data          = {},
		user_id       = req.body.user_id,
		user_name     = req.body.name || '',
		mobile        = req.body.mobile,
		code          = req.body.code,
		password      = req.body.password,
		new_password  = req.body.new_password,
		user_image    = req.body.image

    if ( !user_id ) {
	    res.json({
	        state: 0,
	        msg: '缺少参数'
	    })
    } else {
    	let _UPDATE = {},
	    	list = await selectData('lfc_users', {}, { user_id: user_id }),
	    	list_length = await selectLength('lfc_users', {}, { user_id: user_id })
    	if (!list_length) {
		    res.json({
		        state: 0,
		        msg: '无该账号'
		    })
		    return;
		}

    	if (user_name) {
    		_UPDATE.user_name = user_name
    	} else if (mobile && code) {
	    	let code_list = await selectData('lfc_user_code', {}, { mobile: mobile, code: code }),
	    		code_length = await selectLength('lfc_user_code', {}, { mobile: mobile, code: code })

	    	if (code_length) {
				clearTimeout(timeoutCode)
				deleteData('lfc_user_code', { code_id: code_list[0].code_id })

				var mobile_length = await selectLength('lfc_users', {}, { mobile: mobile })
				if (mobile_length) {
				    res.json({
				        state: 0,
				        msg: '该手机号已经被注册，无法重复注册'
				    })
				} else {
					_UPDATE.mobile = mobile
				}
			} else {
			    res.json({
			        state: 0,
			        msg: '验证码错误'
			    })
			    return;
			}
    	} else if (password && new_password) {
	    	if ( list[0].user_password != password ) {
			    res.json({
			        state: 0,
			        msg: '旧密码错误'
			    })
			    return;
	    	} else {
				_UPDATE.user_password = new_password
	    	}
    	} else if (user_image) {
			_UPDATE.user_image = user_image
    	} else {
			    res.json({
			        state: 0,
			        msg: '缺少参数'
			    })
    	}
    	await updateData('lfc_users', _UPDATE, { user_id: user_id })
		res.json({
		    state: 1,
		    msg: '修改成功',
		})
    }
})

// 获取内容
app.post('/getContent', async function (req, res) {
	var data = [],
		type = req.body.type;
    if ( !type ) {
	    res.json({
	        state: 0,
	        msg: '缺少参数'
	    })
    } else {
	    let list = await selectData('lfc_content_'+type, {}, {})
	    if ( list.length == 0 ) {
		    res.json({
		        state: 0,
		        msg: '无内容'
		    })
	    } else {
		    
		    list.map((item, index)=>{
		    	if (item.content_title) {
		    		data.push({ title: item.content_title, text: [item.content_text] })
		    	} else {
		    		data[data.length - 1].text.push(item.content_text)
		    	}
		    })

		    res.json({
		        state: 1,
		        msg: '请求成功',
		        data: data
		    })
	    }
    }
})

// 获取商品分类
app.post('/getProductClassify', async function (req, res) {
	var data = {};

	let list = await selectData('lfc_product_classify', {}, {})

	if ( list.length == 0 ) {
	    res.json({
	        state: 0,
	        msg: '无内容'
	    })
	} else {
		data.list = [];
		for (var i = 0, len = list.length; i < len; i++) {
			data.list.push({
				id: list[i].classify_id,
				name: list[i].classify_name,
				image: list[i].classify_image,
				video: list[i].classify_video,
			})
		}
	    res.json({
	        state: 1,
	        msg: '请求成功',
	        data: data
	    })
	}
})

// 获取商品类型
app.post('/addProductClassify', async function (req, res) {
	var data           = {},
		admin_id       = req.body.admin_id,
		classify_name  = req.body.classify_name
		classify_video = req.body.classify_video

	if (!await isAdmin(admin_id)){ res.json({ state: 0, msg: '不是管理员，无法操作' }); return; }


	let insert = await insertData('lfc_product_classify', {}, { classify_name: classify_name, classify_video: classify_video })
	if ( insert.insertId ) {
	    res.json({
	        state: 1,
	        msg: '上传成功',
	    })
	} else {
	    res.json({
	        state: 0,
	        msg: '上传失败',
	    })
	}
})

// 获取商品类型
app.post('/getProductType', async function (req, res) {
	var data        = {},
		classify_id = req.body.classify_id

	let list = await selectData('lfc_product_type', {}, { classify_id: classify_id })

	if ( list.length == 0 ) {
	    res.json({
	        state: 0,
	        msg: '该标签下无类型'
	    })
	} else {
		data.list = [];
		for (var i = 0, len = list.length; i < len; i++) {
			data.list.push({
				id: list[i].type_id,
				name: list[i].type_name,
			})
		}
	    res.json({
	        state: 1,
	        msg: '请求成功',
	        data: data
	    })
	}
})

// 获取商品列表
app.post('/getProductList', async function (req, res) {
	var data        = {},
		pageSize    = 8,
		page        = req.body.page || 1,
		classify_id = req.body.classify_id || 0,
		type_id     = req.body.type_id || 0,
		search      = req.body.search || '',
		pageStart   = (page-1) * pageSize

	let _INNER = { lfc_product_classify: 'classify_id' },
		_WHERE = { },
		_LIKE = { }
		if (classify_id && type_id) {
			_WHERE = { classify_id: classify_id }
			_WHERE = { type_id: type_id }
		}
		if (search) {
			_LIKE = { 'lfc_product.product_name': search, 'lfc_product_classify.classify_name': search }
		}
	let list = await selectData('lfc_product', _INNER, _WHERE, pageStart, pageSize, _LIKE),
		totalCount = await selectLength('lfc_product', _INNER, _WHERE, _LIKE)

	if ( totalCount == 0 ) {
	    res.json({
	        state: 0,
	        msg: page==1?'未搜索到内容':'无更多内容'
	    })
	} else {
		data.page = {
			page: page, // 当前页数
			totalCount: totalCount, // 总数量323/10
			TotalPage: Math.ceil(totalCount/pageSize), // 总页数
			pageSize: pageSize, // 一页的数量
		}
		data.list = [];
		for (var i = 0, len = list.length; i < len; i++) {
			data.list.push({
				id: list[i].product_id,
				name: list[i].product_name,
				image: list[i].product_images.split(',')[0],
				classify_name: list[i].classify_name,
				classify_image: list[i].classify_image,
				price: list[i].price,
				is_new: list[i].is_new
			})
		}

	    res.json({
	        state: 1,
	        msg: '请求成功',
	        data: data
	    })
	}
})

// 获取商品信息
app.post('/getProduct', async function (req, res) {
	var data        = {},
		product_id  = req.body.product_id,
		user_id     = req.body.user_id || 0

    if ( !product_id ) {
	    res.json({
	        state: 0,
	        msg: '参数错误'
	    })
    } else {
		let list = await selectData('lfc_product', {}, { product_id: product_id }),
			wishlist = await selectData('lfc_user_wishlist', {}, { product_id: product_id, user_id: user_id }),
			is_wish = wishlist.length ? wishlist[0].wish : 0,
			size = await selectData('lfc_size', {}, { product_id: product_id }, '', '', {}, { size_id: 'ASC' }),
			size_type = await selectData('lfc_size_type', {}, { product_id: product_id })

		if ( list.length == 0 ) {
		    res.json({
		        state: 0,
		        msg: '没有该商品'
		    })
		} else {
			data.id = list[0].product_id
			data.name = list[0].product_name
			data.imgs = _Json(list[0].product_images)
			data.price = list[0].price
			data.type = _Json(list[0].product_type)
			data.is_new = list[0].is_new
			data.is_wish = is_wish
			
			var sizes = {}
			sizes.unit = size
			sizes.list = []
			for (var i = 0, len = size_type.length; i < len; i++) {
				let sizes_value = await selectData('lfc_size_table', {}, { type_id: size_type[i].type_id }, '', '', {}, { size_id: 'ASC' })
				var sizes_list = []
				sizes.list.push({
					type: size_type[i].type_name,
					list: sizes_value
				})
			}
			data.sizes = sizes

		    res.json({
		        state: 1,
		        msg: '请求成功',
		        data: data
		    })
		}
	}
})

// 设置加入(移除)愿望清单
app.post('/setWishlist', async function (req, res) {
	var data = {},
		user_id = req.body.user_id,
		product_id = req.body.product_id

    if ( !product_id ) {
	    res.json({
	        state: 0,
	        msg: '参数错误'
	    })
	} else if ( !user_id ) {
	    res.json({
	        state: 0,
	        msg: '请登录后再添加愿望清单'
	    })
    } else {
		let list = await selectData('lfc_user_wishlist', {}, { product_id: product_id, user_id: user_id })
		if ( list.length == 0 ) {
			await insertData('lfc_user_wishlist',{
				product_id: product_id,
				user_id: user_id,
				wish: '1',
			})
		    res.json({
		        state: 1,
		        msg: '请求成功',
		        data: 1
		    })
		} else {
			await deleteData('lfc_user_wishlist', { product_id: product_id, user_id: user_id })
		    res.json({
		        state: 1,
		        msg: '请求成功',
		        data: 0
		    })
		}
	}
})

// 设置添加入购物车
app.post('/setShoppingBag', async function (req, res) {
	var data = {},
		user_id = req.body.user_id,
		product_id = req.body.product_id,
		size_id = req.body.size_id || 0,
		num = req.body.num

    if ( !product_id ) {
	    res.json({
	        state: 0,
	        msg: '参数错误'
	    })
	} else if ( !user_id ) {
	    res.json({
	        state: 0,
	        msg: '请登录后再添加购物车'
	    })
	} else if ( !num ) {
	    res.json({
	        state: 0,
	        msg: '请选择数量'
	    })
	} else if ( num<1) {
	    res.json({
	        state: 0,
	        msg: '请输入正确的数量'
	    })
    } else {
		let list = await selectData('lfc_user_bag', {}, { product_id: product_id, user_id: user_id, size_id: size_id, order_id: '0' })

	    if (list.length != 0) {
	    	// 当购物车已经有的时候，数量增加
			let _SET = { num: num+list[0].num },
	    		_WHERE = { product_id: product_id, user_id: user_id, size_id: size_id, order_id: 0 },
	    		update = await updateData('lfc_user_bag', _SET, _WHERE)

		    res.json({
		        state: 1,
		        msg: '成功加入购物车',
		    })
	    } else {
	    	let insert = await insertData('lfc_user_bag',{
	    		product_id: product_id,
	    		user_id: user_id,
	    		size_id: size_id,
	    		num: num,
	    	})
			if (insert.insertId) {
			    res.json({
			        state: 1,
			        msg: '成功加入购物车',
			    })
			}
		}
	}
})

// 获取购物车列表
app.post('/getShoppingBag', async function (req, res) {
	var data = {},
		// pageSize    = 8,
		// page        = req.body.page || 1,
		// pageStart   = (page-1) * pageSize,
		user_id = req.body.user_id

    if ( !user_id ) {
	    res.json({
	        state: 0,
	        msg: '请登录后再查看购物车'
	    })
    } else {
		// let totalCount = await selectLength('lfc_user_bag', {}, { user_id: user_id, order_id: '0' }),
		let list = await selectData('lfc_user_bag', 
				{ lfc_product: 'product_id', lfc_size: 'size_id' }, 
				{ user_id: user_id, order_id: '0' }, 
				// pageStart, pageSize
				)

		// data.page = {
		// 	page: page, // 当前页数
		// 	totalCount: totalCount, // 总数量323/10
		// 	TotalPage: Math.ceil(totalCount/pageSize), // 总页数
		// 	pageSize: pageSize, // 一页的数量
		// }
		data.list = [];
		for (var i = 0, len = list.length; i < len; i++) {
			data.list.push({
				id: list[i].bag_id,
				product_id: list[i].product_id,
				name: list[i].product_name,
				image: list[i].product_images.split(',')[0],
				price: list[i].price,
				size: list[i].size_name,
				num: list[i].num,
	    		total_price: (list[i].price * list[i].num).toFixed(2)
			})
		}
	    res.json({
	        state: 1,
	        msg: '请求成功',
	        data: data
	    })
	}
})

// 更改购物车数量
app.post('/updateShoppingBag', async function (req, res) {
	var data = {},
		id = req.body.id,
		num = req.body.num

    if ( !id || !num ) {
	    res.json({
	        state: 0,
	        msg: '参数错误'
	    })
    } else {
		let _INNER = { lfc_product: 'product_id'},
			_WHERE = { bag_id: id },
			list = await selectData('lfc_user_bag', _INNER, _WHERE)
	    if (list.length == 0) {
		    res.json({
		        state: 0,
		        msg: '无该商品'
		    })
	    } else {
			let _SET = { num: num },
	    		_WHERE = { bag_id: id },
	    		update = await updateData('lfc_user_bag', _SET, _WHERE),
	    		total_price = list[0].price * num
	    	data.total_price = total_price.toFixed(2)
		    res.json({
		        state: 1,
		        msg: '请求成功',
		        data: data
		    })
	    }
	}
})

// 删除购物车
app.post('/deleteShoppingBag', async function (req, res) {
	var data = {},
		id = req.body.id

    if ( !id ) {
	    res.json({
	        state: 0,
	        msg: '参数错误'
	    })
    } else {
		await deleteData('lfc_user_bag', { bag_id: id })
	    res.json({
	        state: 1,
	        msg: '请求成功',
	    })
	}
})

// 获取愿望清单列表
app.post('/getWishList', async function (req, res) {
	var data = {},
		pageSize    = 6,
		page        = req.body.page || 1,
		pageStart   = (page-1) * pageSize,
		user_id = req.body.user_id

    if ( !user_id ) {
	    res.json({
	        state: 0,
	        msg: '请登录后再查看愿望清单'
	    })
    } else {
		let totalCount = await selectLength('lfc_user_wishlist', {}, { user_id: user_id }),
			list = await selectData('lfc_user_wishlist', 
				{ lfc_product: 'product_id' }, 
				{ user_id: user_id }, pageStart, pageSize)

		data.list = [];
		data.page = {
			page: page, // 当前页数
			totalCount: totalCount, // 总数量323/10
			TotalPage: Math.ceil(totalCount/pageSize), // 总页数
			pageSize: pageSize, // 一页的数量
		}

		for (var i = 0, len = list.length; i < len; i++) {
			data.list.push({
				id: list[i].wish_id,
				product_id: list[i].product_id,
				name: list[i].product_name,
				image: list[i].product_images.split(',')[0],
				price: list[i].price.toFixed(2)
			})
		}
	    res.json({
	        state: 1,
	        msg: '请求成功',
	        data: data
	    })
	}
})

// 获取用户收货地址
app.post('/getAddress', async function (req, res) {
	var data = {},
		pageSize    = 4,
		page        = req.body.page || 1,
		pageStart   = (page-1) * pageSize,
		user_id = req.body.user_id

    if ( !user_id ) {
	    res.json({
	        state: 0,
	        msg: '请登录后再查看地址'
	    })
    } else {
	    let list = await selectData('lfc_user_address', {}, { user_id: user_id }, pageStart, pageSize, {}, { is_default: 'DESC' }),
	    	totalCount = await selectLength('lfc_user_address', {}, { user_id: user_id })

		data.list = [];
		data.page = {
			page: page, // 当前页数
			totalCount: totalCount, // 总数量
			TotalPage: Math.ceil(totalCount/pageSize), // 总页数
			pageSize: pageSize, // 一页的数量
		}

		for (var i = 0, len = list.length; i < len; i++) {
			data.list.push({
				id: list[i].address_id,
				consignee: list[i].consignee,
				prov: list[i].prov,
				city: list[i].city,
				district: list[i].district,
				address: list[i].address,
				zipcode: list[i].zipcode,
				tel: list[i].tel,
				is_default: list[i].is_default,
			})
		}
	    res.json({
	        state: 1,
	        msg: '请求成功',
	        data: data
	    })
	}
})

// 添加用户收货地址
app.post('/setAddress', async function (req, res) {
	var data = {},
		user_id = req.body.user_id,
		consignee = req.body.consignee || '',
		prov = req.body.prov || '',
		city = req.body.city || '',
		district = req.body.district || '',
		address = req.body.address || '',
		zipcode = req.body.zipcode || '',
		tel = req.body.tel || '',
		is_default = req.body.is_default || '0',
		address_id = req.body.address_id || ''

    if ( !user_id ) {
	    res.json({
	        state: 0,
	        msg: '请登录后再添加地址'
	    })
    } else {
    	if (is_default) {
    		// 如果传入的为默认，则清除其他默认
			let _SET = { is_default: '0' },
	    		_WHERE = { user_id: user_id },
	    		update = await updateData('lfc_user_address', _SET, _WHERE)
    	}
    	if (address_id) {
    		// 如果有address_id代表是修改
			let _SET = { 
					consignee: consignee,
					prov: prov,
					city: city,
					district: district,
					district: district,
					tel: tel,
					is_default: is_default
				},
	    		_WHERE = { address_id: address_id },
	    		update = await updateData('lfc_user_address', _SET, _WHERE)

		    res.json({
		        state: 1,
		        msg: '修改成功',
		    })
    	} else {
    		await insertData('lfc_user_address',{
    			user_id: user_id,
    			consignee: consignee,
    			prov: prov,
    			city: city,
    			district: district,
    			address: address,
    			zipcode: zipcode,
    			tel: tel,
    			is_default: is_default
    		})

		    res.json({
		        state: 1,
		        msg: '添加成功',
		    })
    	}

	}
})

// 添加用户收货地址
app.post('/deleteAddress', async function (req, res) {
	var data = {},
		address_id = req.body.address_id

    if ( !address_id ) {
	    res.json({
	        state: 0,
	        msg: '缺少参数'
	    })
    } else {
		await deleteData('lfc_user_address', { address_id: address_id })
	    res.json({
	        state: 1,
	        msg: '删除成功',
	    })

	}
})

// 添加用户收货地址
app.post('/addOrder', async function (req, res) {
	var data = {},
		address_id = req.body.address_id,
		user_id = req.body.user_id,
		totalPrice = req.body.totalPrice || 0

    if ( !user_id ) {
	    res.json({
	        state: 0,
	        msg: '请登录后再购买'
	    })
    } else if ( !address_id ) {
	    res.json({
	        state: 0,
	        msg: '请选择收货地址'
	    })
    } else {
    	var order = await insertData('lfc_order',{
    		user_id: user_id,
    		address_id: address_id,
    		order_number: new Date().getTime(),
    		totalPrice: totalPrice,
    		order_type: 1
    	})
		if (order.insertId) {
			let _SET = { order_id: order.insertId },
				_WHERE = { user_id: user_id, order_id: '0' },
				update = await updateData('lfc_user_bag', _SET, _WHERE)
		    res.json({
		        state: 1,
		        msg: '添加成功',
		    })
		} else {
		    res.json({
		        state: 0,
		        msg: '添加失败',
		    })
		}
	}
})

// 获取订单
app.post('/getOrderList', async function (req, res) {
	var data        = {},
		pageSize    = 6,
		page        = req.body.page || 1,
		pageStart   = (page-1) * pageSize,
		user_id     = req.body.user_id

    if ( !user_id ) {
	    res.json({
	        state: 0,
	        msg: '请登录后再购买'
	    })
    } else {
		let totalCount = await selectLength('lfc_order', {}, { user_id: user_id }),
			list = await selectData('lfc_order', {}, { user_id: user_id }, pageStart, pageSize)

		data.page = {
			page: page, // 当前页数
			totalCount: totalCount, // 总数量
			TotalPage: Math.ceil(totalCount/pageSize), // 总页数
			pageSize: pageSize, // 一页的数量
		}
		data.list = []
		for (var i = 0,len = list.length; i < len; i++) {
			let item = list[i],
				products_list = await selectData('lfc_user_bag', { lfc_product: 'product_id' }, { order_id: item.order_id }),
				products = []

			for (var p = 0,len2 = products_list.length; p < len2; p++) {
				let product = products_list[p]
				products.push({
					id: product.product_id,
					name: product.product_name,
					images: _Json(product.product_images),
					price: product.price,
					num: product.num,
				})
			}

			data.list.push({
				id: item.order_id,
				type: item.order_type,
				order_number: item.order_number,
				totalPrice: item.totalPrice,
				products: products,
			})
		}


	    res.json({
	        state: 1,
	        msg: '请求成功',
	        data: data
	    })

	}
})

// 获取订单详情
app.post('/getOrderDetail', async function (req, res) {
	var data        = {},
		order_id    = req.body.order_id

    if ( !order_id ) {
	    res.json({
	        state: 0,
	        msg: '参数错误'
	    })
    } else {
		let list = await selectData('lfc_order', {}, { order_id: order_id })

		if (list.length != 1) {
		    res.json({
		        state: 1,
		        msg: '无该订单',
		    })
		} else {
			let item = list[0],
				products_list = await selectData('lfc_user_bag', { lfc_product: 'product_id' }, { order_id: item.order_id }),
				products = []

			for (var p = 0,len2 = products_list.length; p < len2; p++) {
				let product = products_list[p]
				products.push({
					id: product.product_id,
					name: product.product_name,
					images: _Json(product.product_images),
					price: product.price,
					num: product.num,
				})
			}
			var state
			if (item.order_type == 1) {
				state = '已付款'
			} else if (item.order_type == 2) {
				state = '已发货'
			}

			let address_list = await selectData('lfc_user_address', {}, { address_id: item.address_id }),
				address = {}

				if (address_list.length == 1) {
					address = {
						id: address_list[0].address_id,
						consignee: address_list[0].consignee,
						prov: address_list[0].prov,
						district: address_list[0].district,
						address: address_list[0].address,
						zipcode: address_list[0].zipcode,
						tel: address_list[0].tel,
					}
				}
				

			data = {
				id: item.order_id,
				type: item.order_type,
				order_number: item.order_number,
				totalPrice: item.totalPrice,
				products: products,
				address: address,
				state: state,
			}
		    res.json({
		        state: 1,
		        msg: '请求成功',
		        data: data
		    })

		}
	}
})

// 获取媒体列表
app.post('/getMediaList', async function (req, res) {
	var data        = {},
		search      = req.body.search || '',
		user_id     = req.body.user_id,
		myCollect   = req.body.myCollect,
		pageSize    = 8,
		page        = req.body.page || 1,
		pageStart   = (page-1) * pageSize

	var _LIKE = {},
		list = [],
		totalCount = 0
	if (search) {
		_LIKE = { 'lfc_media.media_text': search, 'lfc_users.user_name': search }
	}
	if (myCollect) { // 代表我的收藏
	    if ( !user_id ) {
		    res.json({
		        state: 0,
		        msg: '请登录后再查看我的收藏'
		    })
	    } else {
			list = await selectData('lfc_media_collect', { lfc_users: 'user_id', lfc_media: 'media_id' }, 
				{ user_id: user_id }, pageStart, pageSize, _LIKE)
	    	totalCount = await selectLength('lfc_media_collect', { lfc_users: 'user_id', lfc_media: 'media_id' }, 
				{ user_id: user_id }, _LIKE)
		}
	} else {
		list = await selectData('lfc_media', { lfc_users: 'user_id' }, {}, pageStart, pageSize, _LIKE),
		totalCount = await selectLength('lfc_media', { lfc_users: 'user_id' }, {}, _LIKE)
	}

	data.list = []
	data.page = {
		page: page, // 当前页数
		totalCount: totalCount, // 总数量
		TotalPage: Math.ceil(totalCount/pageSize), // 总页数
		pageSize: pageSize, // 一页的数量
	}
	for (var i = 0, len = list.length; i < len; i++) {
		let comment_length = await selectLength('lfc_media_comment', {}, { media_id: list[i].media_id }),
			like_length = await selectLength('lfc_media_like', {}, { media_id: list[i].media_id }),
			user_like = 0,
			user_collect = 0
		if (user_id) {
			user_like = await selectLength('lfc_media_like', {}, { media_id: list[i].media_id, user_id: user_id })
			user_collect = await selectLength('lfc_media_collect', {}, { media_id: list[i].media_id, user_id: user_id })
		}

		data.list.push({
			id: list[i].media_id,
			name: list[i].user_name,
			text: list[i].media_text,
			images: _Json(list[i].media_image),
			video: list[i].media_video,
			comment_length: comment_length,
			like_length: like_length,
			user_like: user_like,
			user_collect: user_collect,
			add_time: format(list[i].media_create),
		})
	}

	res.json({
	    state: 1,
	    msg: '请求成功',
	    data: data
	})
})

// 获取评论列表
app.post('/getCommentList', async function (req, res) {
	var data        = {},
		media_id    = req.body.media_id,
		user_id     = req.body.user_id,
		pageSize    = 8,
		page        = req.body.page || 1,
		pageStart   = (page-1) * pageSize

    if ( !media_id ) {
	    res.json({
	        state: 0,
	        msg: '参数错误'
	    })
    } else {
    	// 所有评论列表
		let list = await selectData('lfc_media_comment', { lfc_users: 'user_id' }, { media_id: media_id, parent_id: 0 }, pageStart, pageSize),
	    	totalCount = await selectLength('lfc_media_comment', { lfc_users: 'user_id' }, { media_id: media_id, parent_id: 0 })

		data.list = []
		data.page = {
			page: page, // 当前页数
			totalCount: totalCount, // 总数量
			TotalPage: Math.ceil(totalCount/pageSize), // 总页数
			pageSize: pageSize, // 一页的数量
		}
		for (var i = 0, len = list.length; i < len; i++) {
			let like_length = await selectLength('lfc_media_like', {}, 
					{ comment_id: list[i].comment_id }),
				user_like = 0
			if (user_id) {
				user_like = await selectLength('lfc_media_like', {}, 
					{ comment_id: list[i].comment_id, user_id: user_id })
			}
			// 获取第一页的双重评论
	    	let comment_pageSize    = 8,
				comment_page        = 1,
				comment_pageStart   = (comment_page-1) * comment_pageSize,
				comment_list        = await selectData('lfc_media_comment', { lfc_users: 'user_id' }, 
					{ parent_id: list[i].comment_id }, comment_pageStart, comment_pageSize ),
				comment_totalCount  = await selectLength('lfc_media_comment', { lfc_users: 'user_id' }, 
					{ parent_id: list[i].comment_id }),
				comment             = {}

			comment.page = {
				page: comment_page, // 当前页数
				totalCount: comment_totalCount, // 总数量
				TotalPage: Math.ceil(comment_totalCount/comment_pageSize), // 总页数
				pageSize: comment_pageSize, // 一页的数量
			}
			comment.list = []
			for (var p = 0, len2 = comment_list.length; p < len2; p++) {
				let comment_like_length = await selectLength('lfc_media_like', {}, 
						{ comment_id: comment_list[p].comment_id }),
					comment_user_like = 0
				if (user_id) {
					comment_user_like = await selectLength('lfc_media_like', {}, 
						{ comment_id: comment_list[p].comment_id, user_id: user_id })
				}

				comment.list.push({
					id: comment_list[p].comment_id,
					name: comment_list[p].user_name,
					text: comment_list[p].comment_text,
					like_length: comment_like_length,
					user_like: comment_user_like,
					add_time: format(comment_list[p].comment_create),
				})
		    }

			data.list.push({
				id: list[i].comment_id,
				name: list[i].user_name,
				text: list[i].comment_text,
				comment: comment,
				like_length: like_length,
				user_like: user_like,
				add_time: format(list[i].comment_create),
			})
		}

		res.json({
		    state: 1,
		    msg: '请求成功',
		    data: data
		})
	}
})

// 获取二级评论列表
app.post('/getCommentTwo', async function (req, res) {
	var data        = {},
		media_id    = req.body.media_id,
		comment_id  = req.body.comment_id,
		user_id     = req.body.user_id,
		pageSize    = 8,
		page        = req.body.page || 1,
		pageStart   = (page-1) * pageSize

    if ( !comment_id || !media_id ) {
	    res.json({
	        state: 0,
	        msg: '参数错误'
	    })
    } else {
		let list = await selectData('lfc_media_comment', { lfc_users: 'user_id' }, { media_id: media_id, parent_id: comment_id }, pageStart, pageSize),
	    	totalCount = await selectLength('lfc_media_comment', { lfc_users: 'user_id' }, { media_id: media_id, parent_id: comment_id })

		data.list = []
		data.page = {
			page: page, // 当前页数
			totalCount: totalCount, // 总数量
			TotalPage: Math.ceil(totalCount/pageSize), // 总页数
			pageSize: pageSize, // 一页的数量
		}
		for (var i = 0, len = list.length; i < len; i++) {
			let like_length = await selectLength('lfc_media_like', {}, 
					{ comment_id: list[i].comment_id }),
				user_like = 0
			if (user_id) {
				user_like = await selectLength('lfc_media_like', {}, 
					{ comment_id: list[i].comment_id, user_id: user_id })
			}

			data.list.push({
				id: list[i].comment_id,
				name: list[i].user_name,
				text: list[i].comment_text,
				like_length: like_length,
				user_like: user_like,
				add_time: format(list[i].comment_create),
			})
		}

		res.json({
		    state: 1,
		    msg: '请求成功',
		    data: data
		})
	}
})

// 获取媒体详情
app.post('/getMediaDetail', async function (req, res) {
	var data        = {},
		media_id    = req.body.media_id,
		user_id     = req.body.user_id

    if ( !media_id ) {
	    res.json({
	        state: 0,
	        msg: '参数错误'
	    })
    } else {
		let list = await selectData('lfc_media', { lfc_users: 'user_id' }, { media_id: media_id }),
			item = list[0]

		let comment_length = await selectLength('lfc_media_comment', {}, { media_id: item.media_id })
		let like_length = await selectLength('lfc_media_like', {}, { media_id: item.media_id })
		let user_like = 0
		if (user_id) {
			user_like = await selectLength('lfc_media_like', {}, { media_id: item.media_id, user_id: user_id })
		}

		data = {
			id: item.media_id,
			name: item.user_name,
			text: item.media_text,
			images: _Json(item.media_image),
			video: item.media_video,
			comment_length: comment_length,
			like_length: like_length,
			user_like: user_like,
			add_time: format(item.media_create),
		}

		res.json({
		    state: 1,
		    msg: '请求成功',
		    data: data
		})
	}
})

// 评论
app.post('/addMediaComment', async function (req, res) {
	var data        = {},
		user_id     = req.body.user_id,
		media_id    = req.body.media_id,
		comment_id  = req.body.comment_id,
		text        = req.body.text

    if ( !user_id ) {
	    res.json({
	        state: 0,
	        msg: '请登录后再评论'
	    })
    } else if ( (!media_id && !comment_id) || !text ) {
	    res.json({
	        state: 0,
	        msg: '参数错误'
	    })
    } else {
    	let _INSERT = { 
				media_id: media_id,
				user_id: user_id,
				parent_id: '0',
				comment_text: text,
				comment_create: new Date().getTime(),
    		}
    	if (comment_id) {
    		_INSERT.parent_id = comment_id
    	}
   		let list = await insertData('lfc_media_comment', _INSERT)

		res.json({
		    state: 1,
		    msg: '评论成功',
		})
	}
})

// 点赞
app.post('/setMediaLike', async function (req, res) {
	var data        = {},
		user_id     = req.body.user_id,
		media_id    = req.body.media_id,
		comment_id  = req.body.comment_id

    if ( !user_id ) {
	    res.json({
	        state: 0,
	        msg: '请登录后再点赞'
	    })
    } else if ( !media_id ) {
	    res.json({
	        state: 0,
	        msg: '参数错误'
	    })
    } else {
    	let _WHERE = { media_id: media_id, user_id: user_id },
    		_INSERT = { 
				media_id: media_id,
				user_id: user_id,
				comment_id: '0',
    		}
    	if (comment_id) {
    		_WHERE.comment_id = comment_id
    		_WHERE.media_id = '0'
    		_INSERT.comment_id = comment_id
    		_INSERT.media_id = '0'
    	}
		let list = await selectData('lfc_media_like', {}, _WHERE)
		if ( list.length == 0 ) {
			await insertData('lfc_media_like',_INSERT)
		    res.json({
		        state: 1,
		        msg: '请求成功',
		        data: 1
		    })
		} else {
			await deleteData('lfc_media_like', _WHERE)
		    res.json({
		        state: 1,
		        msg: '请求成功',
		        data: 0
		    })
		}
	}
})

// 收藏
app.post('/setMediaCollect', async function (req, res) {
	var data        = {},
		user_id     = req.body.user_id,
		media_id    = req.body.media_id

    if ( !user_id ) {
	    res.json({
	        state: 0,
	        msg: '请登录后再收藏'
	    })
    } else if ( !media_id ) {
	    res.json({
	        state: 0,
	        msg: '参数错误'
	    })
    } else {
		let list = await selectData('lfc_media_collect', {}, { media_id: media_id, user_id: user_id })
		if ( list.length == 0 ) {
			await insertData('lfc_media_collect',{ 
				media_id: media_id,
				user_id: user_id,
    		})
		    res.json({
		        state: 1,
		        msg: '请求成功',
		        data: 1
		    })
		} else {
			await deleteData('lfc_media_collect', { media_id: media_id, user_id: user_id })
		    res.json({
		        state: 1,
		        msg: '请求成功',
		        data: 0
		    })
		}
	}
})

http.createServer(app).listen(8080);