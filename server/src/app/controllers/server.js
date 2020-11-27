import { controller, get, post, put, del, permission, login } from '../../lib/router-permission';
import statusCode from '../../utils/status-code';
import Ta from '../../utils/requests';
import GmDictService from '../service/gm-dict';
import gmServerService from '../service/server';
import Components from '../service/Components';

@controller('/server')
export class UserController {
	constructor() {}

	@post('/create')
	async createserver(ctx) {
		// ctx.log.resourceDesc = '区服创建';
		let form = ctx.request.body;
		let result = await Components.createserver(form);
		ctx.body = statusCode.SUCCESS_200('创建成功', result);
	}
	//区服修改显示状态
	@put('/update')
	async updateserver(ctx) {
		ctx.log.resourceDesc = '区服更改';
		// console.log(ctx.request.body);
		
		let result = await Components.updateserver(ctx);
		
		
		
		ctx.body = statusCode.SUCCESS_200('查找成功', result);
	}
	@put('/allupdate')
	async allupdateserver(ctx) {
		ctx.log.resourceDesc = '区服批量操作';
		let form = ctx.request.body;
		// console.log(form);
		let result = await Components.updateserversnomerge(form.server, form.gameid, form.showstatus, form.merge);

		let {server, showstatus} = form;
		switch (+showstatus){
			case 1:showstatus = '空闲';break;
			case 2:showstatus = '繁忙';break;
			case 3:showstatus = '维护';break;
			case 4:showstatus = '爆满';break;
		}
		ctx.logging( '批量修改', '区服管理', `修改了区服id ${JSON.stringify(server.map(a=>a.id))} 状态为 ${showstatus}` );
		// let result = await  Ta.operating(form);
		ctx.body = statusCode.SUCCESS_200('查找成功', result);
	}
	@put('/stopall')
	async allserverstop(ctx) {
		ctx.log.resourceDesc = '区服批量停用';
		let form = ctx.request.body;
		// console.log(form);
		let result = await Components.allserverstop(form.server, form.gameid, form.because, form.showstatus, form.merge );
		let {server} = form;
		ctx.logging( '批量停用', '区服管理', `停用了区服id ${JSON.stringify(server.map(a=>a.id))}` );
		// let result = await  Ta.operating(form);
		ctx.body = statusCode.SUCCESS_200('查找成功', result);
	}
	@post('/stop')
	async stopserver(ctx){
		ctx.log.resourceDesc = '区服停用';
		let data = ctx.request.body;
		let result = await Components.stopserver(data);
		let {serverid} = data;
		ctx.logging( '区服停用', '区服管理', `停用了区服ID为 ${serverid} 的区服` );
		ctx.body = statusCode.SUCCESS_200('查找成功', result);
	}

	@post('/stopCancel')
	async stopCancel(ctx){
		ctx.log.resourceDesc = '区服取消停用';
		let data = ctx.request.body;
		let result = await Components.stopCancel(data);
		let {serverid} = data;
		ctx.logging( '区服停用', '区服管理', `取消停用区服ID为 ${serverid} 的区服` );
		ctx.body = statusCode.SUCCESS_200('查找成功', result);
	}
	@post('/setClientShow')
	async setClientShow(ctx){
		ctx.log.resourceDesc = '区服设置可见';
		let data = ctx.request.body;
		let result = await gmServerService.setClientShow(data);
		let {value} = data;
		ctx.logging( '区服停用', '区服管理', `设置区服ID为 ${value.map(a => a.serverid)} 的区服为可见` );
		ctx.body = statusCode.SUCCESS_200('查找成功', result);
	}

	


	//查看所有区服
	@get('/select/all')
	async findall(ctx) {
		ctx.log.resourceDesc = '根据id查找数据';
		let result = await Components.findall(ctx.query);
		ctx.body = statusCode.SUCCESS_200('查找成功', result);
	}


    @get('/selectserver/if')
	async findservers(ctx) {
    	let result = await Components.selectserver(ctx.data);
    	ctx.body = statusCode.SUCCESS_200('查找成功', result);
	}




	/**
	 *  根据游戏ID获取组件
	 * @param {gameid} ctx.query.code  游戏组件键值
	 * @param {gameid} ctx.query.gameid  游戏ID
	 */
	@get('/selectComponent')
    async findComponent(ctx) {
    	ctx.log.resourceDesc = '根据游戏ID 组件名称搜索 区服组件';
    	let query = ctx.query;
    	// console.log(query);
    	let result = await GmDictService.findcomponent(query);
    	ctx.body = statusCode.SUCCESS_200('查找成功', result);
    }
	/**
	 * 查找所有区服
	 * 
	 */

	@get('/selectAllServer')
	async selectAllServer(ctx){
		let result = await gmServerService.findAll();
		ctx.body = statusCode.SUCCESS_200('查找成功', result);
	}
	/**
	 * 
	 * 区服创建
	 */
	/**
  * 描述
  * @author 小鹿
  * @date 2020-11-05
  * @param {any} '/serverCreate'
  * @returns {any}
  */
	@post('/serverCreate')
	async serverCreate(ctx){
    	ctx.log.resourceDesc = '区服创建';
		let user = ctx.user;
		let data = ctx.data;
		let result = await gmServerService.serverCreate({data, user});
		ctx.logging( '创建区服', '区服管理', `创建了区服ID为 ${result['id']} 的区服 ` );
		ctx.body = statusCode.SUCCESS_200('创建成功', result);
	
	}
	/**
	 * 
	 * 区服按需查找
	 */
	@get('/findServer')
	async findServer(ctx){
		let findForm = ctx.data;
		let result = await gmServerService.serverFindByParam(findForm);
		ctx.body = statusCode.SUCCESS_200('查找', result);
	}
	@get('/findServerByID')
	async findServerByID(ctx){
		ctx.log.resourceDesc = '根据区服ID搜索';
		let findForm = ctx.query;
		let result = await gmServerService.findServerByID(findForm);
		ctx.body = statusCode.SUCCESS_200('查找', result);

	}

	@post('/mergeServer')
	async mergeServer(ctx){
		ctx.log.resourceDesc = '区服合并';
		let serverIDS = ctx.request.body;
		// console.log(serverIDS);
		let result = await gmServerService.mergeServer(serverIDS);
		ctx.logging( '区服合并', '区服管理', `合并了区服id ${serverIDS.map(a=>a.serverid ||a['id'] )}` );
		ctx.body = statusCode.SUCCESS_200('成功', result);
	}

	@post('/batchCreate')
	async batchCreate(ctx){
		ctx.log.resourceDesc = '区服批量创建';
		let data = ctx.request.body;
		let user = ctx.user;
		// console.log(serverIDS);
		let result = await gmServerService.batchCreate({data, user});
		ctx.logging( '区服合并', '区服管理', `合并了区服id ${data}` );
		ctx.body = statusCode.SUCCESS_200('成功', result);
	}

	@post('/clearIpAll')
	async clearIpAll(ctx) {
		// ctx.log.resourceDesc = '区服创建';
		let form = ctx.request.body;
		let {server} = form;
		let result = await gmServerService.clearIpAll(form);
		ctx.logging( '清空安全组', '区服管理', `清空了区服id${server.map(a=>a['serverid']||a['id'])}` );
		ctx.body = statusCode.SUCCESS_200('创建成功', result);
	}


	@post('/addIpSecurityGroup')
	async addIpSecurityGroup(ctx) {
		// ctx.log.resourceDesc = '区服创建';
		let form = ctx.request.body;
		let  { server, ip } = form;
		let result = await gmServerService.addIpSecurityGroup(form);
		ctx.logging( '添加安全组', '区服管理', `添加了区服id${server.map(a=>a['serverid']||a['id'])} 安全组为${ip.map(a=>a['ip'])}` );
		ctx.body = statusCode.SUCCESS_200('创建成功', result);
	}
	@get('/download')
	async download(ctx){
		const sendflie = require('koa-send');
		var fileName = 'serverCreate.xlsx';
		ctx.attachment(fileName);
		await sendflie(ctx, fileName, { root: __dirname  });
	}
	@post('/upload')
	async upload(ctx){
		const crypto = require('crypto');
    	const  path = require('path');
    	const fs = require('fs');
    	var md5sum = crypto.createHash('md5');
		var start = new Date().getTime();
		
		let { file } =  ctx.request.files;
		console.log(ctx.request.files);
		console.log(ctx.request.body);
		let {md5} = ctx.request.body;
    	// let { data : {  md5  } } = ctx;
		let { originalFilename } = file;
    	let name = file.name || originalFilename;
    	let fileFormat = name.replace(/^(.*)\.([a-zA-Z0-9]*)$/, '$2');
    	// let fileSlice = name.replace(/(.*)\.([a-zA-Z0-9]*)(-*)([0-9]*)/, '$3');
    	var md5Str;
    	let filePath = path.join(__dirname, `../../images/upload/${fileFormat}`, md5+'.'+fileFormat);
    	
    	// if(fileSlice){
    	// 	let fileSliceDirName = name.replace(/(.*)\.([a-zA-Z0-9]*)(-*)([0-9]*)/, '$1.$2');
    	// 	let dirPath = path.join(__dirname, `../../images/upload/user/cache/${fileSliceDirName}`);
    	// 	try{
    	// 		fs.accessSync(dirPath, fs.constants.R_OK | fs.constants.W_OK);
    	// 	}catch (e){
    	// 		dirPath = path.join(__dirname, '../../images/upload/user');
    	// 		fs.mkdirSync(dirPath);
    	// 		dirPath = path.join(__dirname, '../../images/upload/user/cache');
    	// 		fs.mkdirSync(dirPath);
    	// 		dirPath = path.join(__dirname, `../../images/upload/user/cache/${fileSliceDirName}`);
    	// 		fs.mkdirSync(dirPath);
    	// 	}
    	// 	let dirNamePath = path.join(__dirname, `../../images/upload/user/cache/${fileSliceDirName}/${name}`);
    	// 	try{
    	// 		fs.accessSync(dirNamePath, fs.constants.R_OK | fs.constants.W_OK);
    	// 		throw {message:false};
    	// 	}catch ({message}){
    	// 		if(!message){return {code:200, message:'文件上传成功'};}
    	// 	}
    	// 	filePath  =  path.join(__dirname, `../../upload/user/cache/${fileSliceDirName}/${name}`);
    	// }else {
			let dirPath = path.join(__dirname, `../../images/upload/${fileFormat}`);
	
    		try{
    			fs.accessSync(filePath, fs.constants.R_OK | fs.constants.W_OK);
    			throw {message:false};
    		}catch ({message}){
				console.log(message);
    			if(!message){return {code:200, message:'文件上传成功'};}
    		}
    		//判断文件类型是否存在
    		try{
    			fs.accessSync(dirPath, fs.constants.R_OK | fs.constants.W_OK);
    		}catch (e){
    			fs.mkdirSync(dirPath);
    		}
    		// let typeRestrictions = async (fileName, list, allow)=>{
    		// 	allow = allow === undefined ? true : allow;
    		// 	let fileFormat = fileName.replace(/^(.*)\.([a-zA-Z0-9]*)$/, '$2');
    		// 	let a = (Feedback) => {
    		// 		throw  allow ? Feedback :!Feedback;
    		// 	};
    		// 	list.some(a => a === fileFormat) ? a(false) : a(true);
    		// };
    		// //文件类型判断  
    		// let c = await typeRestrictions(name, ['jpg', 'png']).catch(a=>a);
    		// if(c){
    		// 	throw {message:'文件类型错误'};
    		// }
    	// }
    
    	//判断文件是否存在
    	
    	//文件类型校验函数 filename是文件名  list是允许的文件类型 allow为是否在list中 默认为true  在list内返回true
    	//返回true 为通过校验
    	
    	let uploadSize = 0;
    	let fileSize = file.size;
    	let fileSetsize =  ~~(file.size/100) > 64*1024 ? 64*1024: ~~(file.size/100);
    	fs.open(filePath, 'a', async(e, f)=>{
    		if(e){throw {code:500, message:e};}
    		const rs = fs.createReadStream(file.path, {
    			flags: 'r', //指定用什么模式打开文件，’w’代表写，’r’代表读，类似的还有’r+’、’w+’、’a’等
    			// encoding: 'utf8', //指定打开文件时使用编码格式，默认就是“utf8”，你还可以为它指定”ascii”或”base64”
    			fd: null, //fd属性默认为null，当你指定了这个属性时，createReadableStream会根据传入的fd创建一个流，忽略path。另外你要是想读取一个文件的特定区域，可以配置start、end属性，指定起始和结束（包含在内）的字节偏移
    			autoClose: true, //autoClose属性为true（默认行为）时，当发生错误或文件读取结束时会自动关闭文件描述符
    			// highWaterMark:32 * 1024, //文件一次读多少字节,默认 64*1024
    			highWaterMark:fileSetsize, //文件一次读多少字节,默认 64*1024
    		});
    		
				  rs.on('data', a =>{
    					uploadSize += a.byteLength;
    					md5sum.update(a);
    			//   console.log(uploadSize);
    			   console.log(`文件上传进度为${((uploadSize/fileSize)*100).toFixed(2)}%`);
    				fs.write(f, a, (e)=>{
    					if(e){console.log(e);}
    				});
				  });
    		rs.on('end', () => {
    			console.log('文件读取结束');
    			md5Str = md5sum.digest('hex').toLowerCase();
    			console.log('MD5码为：', md5Str);
    			fs.close(f, e => {
    				if(e){throw {code:500, message:e};}
    				if(md5Str !== md5){
    					fs.unlinkSync(filePath);
    					throw {code:500, message:'文件MD5校验失败'};
    				}
    				// console.log('文件写入完毕');
    				console.log('文件写入共耗时:'+(new Date().getTime()-start)/1000.00+'秒');
    				// a(ctx, {code:200, message:'文件写入共耗时:'+(new Date().getTime()-start)/1000.00+'秒'});
    			});
    		});
    	});
    	ctx.body = statusCode.SUCCESS_200('文件上传成功');
    	return ctx.body;
	}
}