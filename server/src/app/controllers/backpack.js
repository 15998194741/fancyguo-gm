import { controller, get, post, put, del, permission, login } from '../../lib/router-permission';
import BackpackServer from '../service/backpack';
import statusCode from '../../utils/status-code';


// import compon from '../service/Components';
@controller('/backpack')
export class BackpackController {
	constructor() { }
	@get('/')
	async query(ctx) {
		const data = ctx.query;
		const result = await BackpackServer.query(data);
		ctx.body = statusCode.SUCCESS_200('µÇÂ¼³É¹¦', result);
	}

	

}
