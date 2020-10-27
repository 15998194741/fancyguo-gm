import { controller, get, post, put, del, permission, login } from '../../lib/router-permission';
import statusCode from '../../utils/status-code';
import MailService from '../service/mail';
@controller('/mail')
export class CharacterController {
    @get('/query')
	async querymail(ctx) {
		ctx.log.resourceDesc = '邮件查询';
		let data = ctx.data;
		let result = await MailService.queryByParms(data);
		ctx.body = statusCode.SUCCESS_200('查找成功', result);
	}
    @get('/getQueryAnnexOptions')
    async getQueryAnnexOptions(ctx) {
    	ctx.log.resourceDesc = '物品分类查询';
    	let data = ctx.query;
    	let result = await MailService.getQueryAnnexOptions(data);
    	ctx.body = statusCode.SUCCESS_200('查找成功', result);
    }
    @get('/getQueryAnnexOptionsLazy')
    async getQueryAnnexOptionsLazy(ctx) {
    	ctx.log.resourceDesc = '物品详细查询';
    	let data = ctx.query;
    	let result = await MailService.getQueryAnnexOptionsLazy(data);
    	ctx.body = statusCode.SUCCESS_200('查找成功', result);
    }
    @get('/getQueryAnnexServernames')
    async getQueryAnnexServernames(ctx) {
    	ctx.log.resourceDesc = '服务器全服查询';
    	let data = ctx.query;
    	let result = await MailService.getQueryAnnexServernames(data);
    	ctx.body = statusCode.SUCCESS_200('查找成功', result);
    }
    @get('/getPlaformChannelToservername')
    async getPlaformChannelToservername(ctx) {
    	ctx.log.resourceDesc = '根据平台客户端查询服务器名';
    	let data = ctx.query;
    	let result = await MailService.getPlaformChannelToservername(data);
    	ctx.body = statusCode.SUCCESS_200('查找成功', result);
    }
    @post('/postMailToCreate')
    async postMailToCreate(ctx) {
    	ctx.log.resourceDesc = '创建邮件';
    	let data = ctx.data;
    	let { sendTime } = data;
    	let result = await MailService.postMailToCreate(data);
    	let { id } = result;
    	ctx.logging( '邮件创建', '邮件管理', `创建了ID为 ${id} ,${sendTime?'及时':'定时'}发送的邮件 ` );
    	ctx.body = statusCode.SUCCESS_200('创建成功', result);
    }
    @get('/annexAllQuery')
    async annexAllQuery(ctx) {
    	ctx.log.resourceDesc = '附件查找';
    	let data = ctx.query;
    	let result = await MailService.annexAllQuery(data);
    	ctx.body = statusCode.SUCCESS_200('创建成功', result);
    }
	@get('/findServerName')
    async findServerName(ctx) {
    	ctx.log.resourceDesc = '附件查找';
    	let data = ctx.query;
    	let result = await MailService.findServerName(data);
    	ctx.body = statusCode.SUCCESS_200('创建成功', result);
    }
	@get('/stopMailSend')
	async stopMailSend(ctx) {
    	ctx.log.resourceDesc = '邮件取消定时发送';
		let data = ctx.query;
		let {id} = data;
		let result = await MailService.mailSendCancel(data);
    	ctx.logging( '邮件创建', '邮件管理', `创建了ID为 ${id} ,定时发送的邮件` );
    	ctx.body = statusCode.SUCCESS_200('停用成功', result);
	}
	@get('/maxID')
	async maxID(ctx) {
    	ctx.log.resourceDesc = '最大ID';
    	let data = ctx.query;
    	let result = await MailService.maxID(data);
    	ctx.body = statusCode.SUCCESS_200('查找成功', result);
	}
}