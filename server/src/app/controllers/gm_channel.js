import { controller, get, post, put, del, permission, login } from '../../lib/router-permission';
import statusCode from '../../utils/status-code';
import gmChannelService from '../service/gm_channel';

@controller('/gm/channel')
export class gmUserController {

    @post('/createchannel')
	async createchannel(ctx) {
    	ctx.log.resourceDesc = '创建渠道';
    	let { data } = ctx ;
    	let result = await gmChannelService.createchannel(data);
    	// ctx.logging( '创建游戏', '游戏管理', `创建了区服ID为 ${result['id']} 的区服 ` );
    	ctx.body = statusCode.SUCCESS_200('创建成功', result);
	}
    @get('/findChannel')
    async findChannel(ctx) {
    	ctx.log.resourceDesc = '判断渠道名和渠道id是否重复';
    	let data = ctx.data;
    	let result = await gmChannelService.findChannel(data);
    	ctx.body = statusCode.SUCCESS_200('查找成功', result);
    }
    @get('/findChannelById')
    async findChannelById(ctx) {
    	ctx.log.resourceDesc = '判断渠道名和渠道id是否重复';
    	let data = ctx.data;
    	let result = await gmChannelService.findChannelById(data);
    	ctx.body = statusCode.SUCCESS_200('查找成功', result);
    }

	
   
	@put('/deleteuserbyone')
    async deleteuserbyone(c){
    	c.log.resourceDesc = '逻辑删除单个用户';
    	let {data} = c;
    	let result = await gmChannelService.deleteuserbyone(data);
    	c.body = statusCode.SUCCESS_200('删除成功', result);
    }

    
    @put('/deleteChannel')
	async deleteChannel(c){
    	c.log.resourceDesc = '逻辑删除渠道';
    	let {data} = c;
    	let result = await gmChannelService.deleteChannel(data);
    	c.body = statusCode.SUCCESS_200('删除成功', result);
	}
    
    @put('/putChangeChannel')
    async putChangeChannel(c){
    	c.log.resourceDesc = '更改渠道信息';
    	let {data} = c;
    	let result = await gmChannelService.putChangeChannel(data);
    	c.body = statusCode.SUCCESS_200('删除成功', result);
    }
	
	@put('/forceDelete')
    async forceDelete(c){
    	c.log.resourceDesc = '强制删除';
    	let {data} = c;
    	let result = await gmChannelService.forceDelete(data);
    	c.body = statusCode.SUCCESS_200('删除成功', result);
    }
}



