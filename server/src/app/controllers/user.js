import { controller, get, post, put, del, permission, login } from '../../lib/router-permission';
import UserServer from '../service/user';
import statusCode from '../../utils/status-code';
import Ta from '../../utils/requests';

const jwt = require('jsonwebtoken');
const util = require('util');
const verify = util.promisify(jwt.verify);
const secret = require('../../config/secret');

// import compon from '../service/Components';
@controller('/user')
export class UserController {
	constructor() {}

	@get('/permission')
	async findUser(ctx) {
		ctx.log.resourceDesc = '根据id查找数据';
		let user = ctx.user;
		// console.log(ctx.data);
		// console.log(ctx.query);
	
		let result = await UserServer.findUser(user.id, ctx.data.game, user.loginType);
		ctx.body = statusCode.SUCCESS_200('查找成功', result);
	}
	@get('/qf')
	async qf(ctx) {
		ctx.log.resourceDesc = '根据id查找数据';
		let result = await Ta.tasql('select  sid,roleid,level,channel,force,role_gender,onlinesum,machine  from v_event_49   limit 100');
		ctx.body = statusCode.SUCCESS_200('查找成功', result);
	}
	@get('/token')
	async toekn(ctx) {
		ctx.log.resourceDesc = '返回用户姓名 头像 花名';
		let token =ctx.request.headers['fancy-guo-login-token'];
		let user =  await verify(token, secret.sign);
		// let result = await Ta.tasql('select * from v_event_49  limit 0');
		// console.log(user);
		// ctx.body = statusCode.SUCCESS_200('查找成功', user);
		ctx.body = statusCode.SUCCESS_200('查找成功', {'username':user.username, 'avatar':user.avatar || 'https://wp.fancyguo.com/image/wp/version/head_portrait3.png', 'nickname':user.nickName, alias:user.alias || '小可爱'});
	}
	@post('/createUser')
	async createUser(ctx){
		let data = ctx.request.body;
		let resData =await UserServer.createUser(data);
		let res = jwt.sign(resData[0][0], secret.sign, {expiresIn:'1y'});
		ctx.body = statusCode.SUCCESS_200('登录成功', res);
		ctx.cookies.set('fancy-guo-login-token', res);
	}
	@post('/login')
	async login(ctx){
		let data = ctx.request.body;
		// let res = jwt.sign(data, secret.sign, {expiresIn:'1h'});
		let res =await UserServer.login(data);
		ctx.cookies.set('fancy-guo-login-token', res);
		// ctx.body = statusCode.SUCCESS_200(res?'登录成功':'登录失败', res?{token:res}:undefined);
		ctx.body ={
			code : res ? 200 :202,
			message:res?'登录成功':'登录失败',
			data:res ? {token:res}:undefined
		};
		//  statusCode.SUCCESS_200(res?'登录成功':'登录失败', res?{token:res}:undefined);
	}















































	


  @get('/findAll')
	async findAll(ctx) {
		ctx.log.resourceDesc = '查找全部数据';
		const result = await UserServer.findAll();
		ctx.body = statusCode.SUCCESS_200('查找成功', result);
	}
  @get('findById/:id')
  async findById(ctx) {
  	ctx.log.resourceDesc = '根据id查找数据';
  	const result = await UserServer.findById(ctx.params.id);
  	ctx.body = statusCode.SUCCESS_200('查找成功', result);
  }
 
  @post('/')
  async create(ctx) {
  	ctx.log.resourceDesc = '新增数据';
  	const result = await UserServer.create(ctx.body);
  	ctx.body = statusCode.SUCCESS_200('新增成功', result);
  }
  // 本地登录
  @post('/login/native')
  async loginNative(ctx) {
  	ctx.log.resourceDesc = '本地登录操作';
  	const data = ctx.request.body;
  	const user = await UserServer.loginNative(data.username, data.password);
  	ctx.body = statusCode.SUCCESS_200('登录成功', user);
  }
  // 第三方登录接口
  @post('/login/other')
  async loginOther(ctx) {
  	const token = ctx.request.body.token;
  	ctx.response.status = 200;
  	const result = await AuthUserService.loginOther(token);
  	ctx.body = statusCode.SUCCESS_200('登录成功', result);
  }
  @put('/')
  async update(ctx) {
  	ctx.log.resourceDesc = '修改数据';
  	const result = await UserServer.updateById(ctx.body.id);
  	ctx.body = statusCode.SUCCESS_200('修改成功', result);
  }
  @del('/')
  async delete(ctx) {
  	ctx.log.resourceDesc = '逻辑删除数据';
  	const result = await UserServer.logicDeleteById(ctx.body.id);
  	ctx.body = statusCode.SUCCESS_200('修改成功', result);
  }
    
}
