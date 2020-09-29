import { controller, get, post, put, del, permission, login } from '../../lib/router-permission';
import statusCode from '../../utils/status-code';
import gmGameService from '../service/gm_game';

@controller('/gm/game')
export class gmGameController {
    @get('/list')
	async create(ctx) {
		ctx.log.resourceDesc = '获取游戏列表';
		let data = ctx.data;
		data['user'] = ctx.user;
		let result = await gmGameService.gameList(data);
		ctx.body = statusCode.SUCCESS_200('创建成功', result);
	}
	@get('/userList')
    async userList(ctx) {
    	ctx.log.resourceDesc = '获取用户';
    	let data = ctx.data;
    	let { id } = ctx.user;
    	if (+id !== 1 ){throw {code:500, message:'权限异常', user:ctx.user, url:ctx.url};}
    	let result = await gmGameService.gmUser(data);
    	ctx.body = statusCode.SUCCESS_200('查找成功', result);
    }
	@post('/creategame')
	async creategame(ctx) {
    	ctx.log.resourceDesc = '创建游戏';
    	let data = ctx.data;
		let { id } = ctx.user;
		if (+id !== 1 ){throw {code:500, message:'权限异常', user:ctx.user, url:ctx.url};}
		let result = await gmGameService.creategame(ctx);
		// ctx.logging( '创建游戏', '游戏管理', `创建了区服ID为 ${result['id']} 的区服 ` );
		
    	ctx.body = statusCode.SUCCESS_200('查找成功', result);
	}
	@put('/deleteGame')
	async deleteGame(ctx) {
    	ctx.log.resourceDesc = '删除游戏';
    	let data = ctx.data;
		let { id } = ctx.user;
		if (+id !== 1 ){throw {code:500, message:'权限异常', user:ctx.user, url:ctx.url};}
		let result = await gmGameService.deleteGame(data);
		// ctx.logging( '创建游戏', '游戏管理', `创建了区服ID为 ${result['id']} 的区服 ` );
    	ctx.body = statusCode.SUCCESS_200('删除成功', result);
	}
	@put('/changeGame')
	async changeGame(ctx) {
    	ctx.log.resourceDesc = '游戏更改';
		let { id } = ctx.user;
		if (+id !== 1 ){throw {code:500, message:'权限异常', user:ctx.user, url:ctx.url};}
		let result = await gmGameService.changeGame(ctx);
		// ctx.logging( '创建游戏', '游戏管理', `创建了区服ID为 ${result['id']} 的区服 ` );
    	ctx.body = statusCode.SUCCESS_200('修改成功', result);
	}
}