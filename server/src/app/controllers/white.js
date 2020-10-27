import { controller, get, post, put, del, permission, login } from '../../lib/router-permission';
import whiteServer from '../service/white.js';
import statusCode from '../../utils/status-code';
import send from 'koa-send';

// import compon from '../service/Components';
@controller('/white')
export class WhiteController {
	constructor() {}
@post('/mailCreate')
	async mailCreate(ctx){
		ctx.log.resourceDesc = '创建邮件';
		let data = ctx.data;
		console.log(data);
		data['user'] = ctx.user;
		let result = await whiteServer.mailCreate(data);
		console.log(result);
    	ctx.logging( '白名单邮件创建', '白名单管理', `创建了id为${result.id}白名单${data.sendType?data.cycle === 'month' ? '月度' :'周度' :''}${data.sendType ?  ' 周期 ': ' 单次 '}邮件。` );
		ctx.body = statusCode.SUCCESS_200('创建成功', result);
	}
	
@put('/whiteStopMail')
async whiteStopMail(ctx){
	ctx.log.resourceDesc = '逻辑删除邮件';
	let data = ctx.data;
	let result = await whiteServer.whiteStopMail(data);
	ctx.logging( '白名单邮件删除', '白名单管理', `删除了id为${data.id}白名单邮件。` );
	ctx.body = statusCode.SUCCESS_200('查找成功', result);
}
@put('/WhiteMailChange')
async WhiteMailChange(ctx){
	ctx.log.resourceDesc = '白名单邮件修改附件';
	let data = ctx.data;
	console.log(data);
	let result = await whiteServer.WhiteMailChange(data);
	ctx.logging( '白名单邮件修改', '白名单管理', `修改了id为${data.id}白名单邮件。` );
	ctx.body = statusCode.SUCCESS_200('查找成功', result);
}

@post('/mailRelatedUser')
async mailRelatedUser(ctx){
	ctx.log.resourceDesc = '创建邮件';
	let data = ctx.data;
	// console.log(data);
	let { roleId } =data; 
	data['user'] = ctx.user;
	let result = await whiteServer.mailRelatedUser(data);
	ctx.logging( '白名单用户添加', '白名单管理', `添加了用户${roleId.map(a=>a.id)}`);
	ctx.body = statusCode.SUCCESS_200('创建成功', result);
}
@del('/stopWhiteMail')
async stopWhiteMail(ctx){
	ctx.log.resourceDesc = '逻辑删除白名单用户';
	let data = ctx.data;
	// console.log(data);
	let result = await whiteServer.stopWhiteMail(data);
	// console.log(result);
	ctx.logging( '白名单用户停用', '白名单管理', `停用了 ${JSON.stringify(result[0])}`);
	ctx.body = statusCode.SUCCESS_200('创建成功', result);
}

@get('/whiteFindAll')
async whiteFindAll(ctx){
	ctx.log.resourceDesc = '查找全部邮件';
	let data = ctx.data;
	let result = await whiteServer.whiteFindAll(data);
	ctx.body = statusCode.SUCCESS_200('查找成功', result);
}

@get('/whiteFindName')
async whiteFindName(ctx){
	ctx.log.resourceDesc = '查找邮件名称';
	let data = ctx.data;
	let result = await whiteServer.whiteFindName(data);
	ctx.body = statusCode.SUCCESS_200('查找成功', result);
}


@get('/findTitle')
async findTitle(ctx){
	ctx.log.resourceDesc = '标题校验不可有重复标题';
	let data = ctx.data;
	let result = await whiteServer.findTitle(data);
	ctx.body = statusCode.SUCCESS_200('查找成功', result);
}


@get('/servernameComponents')
async servernameComponents(ctx){
	ctx.log.resourceDesc = '服务器筛选组件值';
	let data = ctx.query;
	let result = await whiteServer.servernameComponents(data);
	ctx.body = statusCode.SUCCESS_200('创建成功', result);
}
@get('/channelComponents')
async channelComponents(ctx){
	ctx.log.resourceDesc = '渠道筛选组件值';
	let data = ctx.query;
	let result = await whiteServer.channelComponents(data);
	ctx.body = statusCode.SUCCESS_200('创建成功', result);
}
@get('/find')
async find(ctx){
	ctx.log.resourceDesc = '点击查找';
	let data = ctx.query;
	let result = await whiteServer.find(data);
	ctx.body = statusCode.SUCCESS_200('创建成功', result);
}

@get('/recordLookup')
async recordLookup(ctx){
	ctx.log.resourceDesc = '白名单记录查找';
	let data = ctx.data;
	let result = await whiteServer.recordLookup(data);
	ctx.body = statusCode.SUCCESS_200('创建成功', result);
}


}
