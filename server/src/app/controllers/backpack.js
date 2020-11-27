import { controller, get, post, put, del, permission, login } from '../../lib/router-permission';
import BackpackServer from '../service/backpack';
import statusCode from '../../utils/status-code';


// import compon from '../service/Components';
@controller('/backpack')
export class BackpackController {
	constructor() { }
	@get('/queryServer')
	async queryServer(ctx) {
		const data = ctx.query;
		const result = await BackpackServer.query(data);
		ctx.body = statusCode.SUCCESS_200('查找成功', result);
	}
	@get('/query')
	async query(ctx) {
		const data = ctx.query;
		const result = await BackpackServer.query(data);
		ctx.body = statusCode.SUCCESS_200('查找成功', result);
	}
	@post('/BackPackRecycle')
	async BackPackRecycle(ctx) {
		const data = ctx.request.body;
		const result = await BackpackServer.BackPackRecycle(data);
		ctx.body = statusCode.SUCCESS_200('回收成功', result);

    }

}
