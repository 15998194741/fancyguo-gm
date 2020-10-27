import { type } from 'os';
import { controller, get, post, put, del, permission, login } from '../../lib/router-permission';
import statusCode from '../../utils/status-code';
import CDKService from '../service/cdk';
const path = require('path');
const fs = require('fs');
const sendflie = require('koa-send');

@controller('/cdk')
export class CDKController {
    @post('/createcdk')
	async createcdk(ctx) {
		ctx.log.resourceDesc = 'CDK创建';
		let data = ctx.request.body;
		console.log(data);
		let { quantity, type } = data;

		let result = await CDKService.createcdk(data);
    	ctx.logging( 'CDK生成', 'CDK管理', `生成了${quantity}个${+type===1 ?'唯一': +type === 2 ?'通用给':'互斥'}CDK。` );
		ctx.body = statusCode.SUCCESS_200('创建成功', result);
	}
	@get('/test')
    async test(ctx) {
    	ctx.log.resourceDesc = 'CDK创建';
    	let data = ctx.query;
    	let result = await CDKService.test(data);
    	ctx.body = statusCode.SUCCESS_200('创建成功', result);
    }
	@get('/cdkConvert')
	async cdkConvert(ctx) {
    	ctx.log.resourceDesc = 'CDK兑换';
    	let data = ctx.query;
    	let result = await CDKService.cdkConvert(data);
    	ctx.body = statusCode.SUCCESS_200('创建成功', result);
	}
	@get('/cdkCreateSchedule')
	async cdkCreateSchedule(ctx) {
    	ctx.log.resourceDesc = 'CDK创建进度查询';
    	let data = ctx.query;
    	let result = await CDKService.cdkCreateSchedule(data);
    	ctx.body = statusCode.SUCCESS_200('创建成功', result);
	}
	@get('/cdkFind')
	async cdkFind(ctx) {
    	ctx.log.resourceDesc = 'CDK创建进度查询';
    	let data = ctx.query;
    	let result = await CDKService.cdkFind(data);
    	ctx.body = statusCode.SUCCESS_200('创建成功', result);
	}
	@get('/cdkDownload')
	async  cdkDownload(ctx) {
		ctx.log.resourceDesc = 'CDKkey下载';
		let {data} = ctx;
		let { tablename } = data;
		let filename = `${tablename}.csv`;
		let filepath = `src/cdk/${filename}`;
		ctx.attachment(filepath);
		await sendflie(ctx, filepath);
		// let filepath = path.join(__dirname, `../../cdk/${filename}`);
		// console.log(filepath);
		// ctx.body = fs.createReadStream(filepath);
	}
	@get('/find')
	async find(ctx) {
    	ctx.log.resourceDesc = 'CDK查找';
    	let data = ctx.query;
    	let result = await CDKService.find(data);
    	ctx.body = statusCode.SUCCESS_200('查找成功', result);
	}
	
	@get('/detailsFind')
	async detailsFind(ctx) {
    	ctx.log.resourceDesc = 'CDK详情查找';
    	const data = ctx.data;
    	const result = await CDKService.detailsFind(data);
    	ctx.body = statusCode.SUCCESS_200('查找成功', result);
	}

	@get('/cdkkeyfind')
	async cdkkeyfind(ctx) {
		ctx.log.resourceDesc = 'CDK详情查找';
		const data = ctx.data;
		const result = await CDKService.cdkkeyfind(data);
		ctx.body = statusCode.SUCCESS_200('查找成功', result);
	}


	@get('/CDKFindByTypeOne')
	async CDKFindByTypeOne(ctx) {
    	ctx.log.resourceDesc = '唯一CDK查找';
    	let result = await CDKService.CDKFindByTypeOne(ctx.data);
    	ctx.body = statusCode.SUCCESS_200('查找成功', result);
	}
	
	@put('/CDKFindIdAndStop')
	async CDKFindIdAndStop(ctx) {
    	ctx.log.resourceDesc = '通过cdk的id停用cdk';
		let result = await CDKService.CDKFindIdAndStop(ctx.data);
		let { data:{id} } = ctx;
    	ctx.logging( 'CDK停用', 'CDK管理', `停用了id为${id}CDK。` );
    	ctx.body = statusCode.SUCCESS_200('查找成功', result);
	}
	
}