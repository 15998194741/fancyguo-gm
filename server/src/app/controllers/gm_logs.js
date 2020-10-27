import { controller, get, post, put, del, permission, login } from '../../lib/router-permission';
import statusCode from '../../utils/status-code';
import gmLogsService from '../service/gm_logs';

@controller('/gm/logs')
export class gmLogsController {
    @get('/classification')
	async create(ctx) {
		ctx.log.resourceDesc = '获取日志选项';
		let data = ctx.data;
		data['user'] = ctx.user;
		let result = await gmLogsService.classification(data);
		ctx.body = statusCode.SUCCESS_200('创建成功', result);
	}
    
    @get('/querydata')
    async querydata(ctx) {
    	ctx.log.resourceDesc = '获取日志';
    	let data = ctx.data;
    	let result = await gmLogsService.querydata(data);
    	ctx.body = statusCode.SUCCESS_200('创建成功', result);
    }
	
}