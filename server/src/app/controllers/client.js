import { controller, get, post, put, del, permission, login } from '../../lib/router-permission';
import statusCode from '../../utils/status-code';
import clientService from '../service/client';


@controller('/client')
export class CharacterController {
	@post('/create')
	async create(ctx) {
		ctx.log.resourceDesc = '版本创建';
		let data = ctx.data;
		data['user'] = ctx.user;
		let result = await clientService.create(data);
		ctx.body = statusCode.SUCCESS_200('创建成功', result);
	}
    @get('/find')
	async find(ctx) {
		ctx.log.resourceDesc = '查找';
		let data = ctx.data;
		let result = await clientService.find(data);
		ctx.body = statusCode.SUCCESS_200('查找成功', result);
	}
    @get('/channelfind')
    async channelfind(ctx){
    	ctx.log.resourceDesc = '渠道组件查找';
    	let data = ctx.data;
    	let result = await clientService.channelfind(data);
    	ctx.body = statusCode.SUCCESS_200('查找成功', result);
    }
    @get('/versionidall')
    async versionidall(ctx){
    	ctx.log.resourceDesc = '版本号查找';
    	let data = ctx.data;
    	let result = await clientService.versionidall(data);
    	ctx.body = statusCode.SUCCESS_200('查找成功', result);
    }
    @del('/stopClient')
    async stopClient(ctx){
    	ctx.log.resourceDesc = '版本停用';
    	let data = ctx.data;
    	data['user']=ctx.user;
    	let result = await clientService.stopClient(data);
    	ctx.body = statusCode.SUCCESS_200('查找成功', result);
    }
    @put('/changeClient')
    async changeClient(ctx){
    	ctx.log.resourceDesc = '版本修改';
    	let data = ctx.data;
    	data['user']=ctx.user;
    	let result = await clientService.changeClient(data);
    	ctx.body = statusCode.SUCCESS_200('查找成功', result);
    }


}