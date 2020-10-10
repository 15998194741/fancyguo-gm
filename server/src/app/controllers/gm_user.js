import { controller, get, post, put, del, permission, login } from '../../lib/router-permission';
import statusCode from '../../utils/status-code';
import gmUserService from '../service/gm_user';

@controller('/gm/user')
export class gmUserController {
    @get('/list')
	async querylist(ctx) {
		ctx.log.resourceDesc = '获取用户列表';
		let data = ctx.data;
		data['user'] = ctx.user;
		let result = await gmUserService.querylist(data);
		ctx.body = statusCode.SUCCESS_200('创建成功', result);
	}

	@post('/createuser')
    async createuser(ctx) {
    	ctx.log.resourceDesc = '创建游戏';
    	let { data } = ctx ;
    	let result = await gmUserService.createuser(data);
    	// ctx.logging( '创建游戏', '游戏管理', `创建了区服ID为 ${result['id']} 的区服 ` );
    	ctx.body = statusCode.SUCCESS_200('创建成功', result);
    }
    @get('/findUser')
	async findUser(ctx){
		ctx.log.resourceDesc = '查找用户是否存在';
		let { data } = ctx ;
    	let result = await gmUserService.findUser(data);
    	// ctx.logging( '创建游戏', '游戏管理', `创建了区服ID为 ${result['id']} 的区服 ` );
    	ctx.body = statusCode.SUCCESS_200('查找成功', result);
	}
    @get('/findUserByParams')
    async findUserByParams(c){
    	c.log.resourceDesc = '根据条件查找用户';
    	let {data} = c;
    	let result = await gmUserService.findUserByParams(data);
    	c.body = statusCode.SUCCESS_200('查找成功', result);

    }
	@put('/deleteuserbyone')
    async deleteuserbyone(c){
    	c.log.resourceDesc = '逻辑删除单个用户';
    	let {data} = c;
    	let result = await gmUserService.deleteuserbyone(data);
    	c.body = statusCode.SUCCESS_200('删除成功', result);
    }
	@put('/putChangeUser')
	async putChangeUser(c){
    	c.log.resourceDesc = '修改单个用户';
    	let {data} = c;
    	let result = await gmUserService.putChangeUser(data);
    	c.body = statusCode.SUCCESS_200('删除成功', result);
	}

}



