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
		let result = await Components.allserverstop(form.server, form.gameid, form.showstatus, form.merge);
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
}