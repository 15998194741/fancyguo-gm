import UserDao from '../dao/user';
import BaseService from '../../lib/base-service';
import statusCode from '../../utils/status-code';
const jwt = require('jsonwebtoken');
const secret = require('../../config/secret.json');
const bcrypt = require('bcryptjs');
const request = require('request');
const jwtSimple = require('jwt-simple');
const util = require('util');

const verify = util.promisify(jwt.verify);

import logUtil from '../../utils/logs';
import { dbSequelize } from '../../config';
import Cp from '../../utils/Cp';
const Sequelize = require('sequelize');

function packTokenByUser(user, password) {
	if (user == null || user === undefined) {
		throw statusCode.ERROR_403('用户不存在');
	}
	if (!user.password) {
		throw statusCode.ERROR_403('请点击使用青果统一登录方式进行登录');
	}
	if (!bcrypt.compareSync(password, user.password)) {
		throw statusCode.ERROR_403('用户名或密码错误');
	}
	user.password = '';
	const token = jwt.sign(user, secret.sign, { expiresIn: secret.tokenExpiresTime });
	return {
		id: user.id,
		username: user.username,
		nickName: user.nickName,
		avatar: user.avatar,
		token: token
	};
}


class UserServer extends BaseService{
	constructor() {
		super(UserDao);
	}
  
	async findUser(id, game, loginType) {
		game = game?`and a.game_name = '${game}'`:'';
		let gamenameAndId= `
		select a.id,a.game_name ,a.image_url as img from gm_game a join gm_purview b on b.gid = a.id where b.uids @> '${id}' and a.status = '1'  and b.status = '1'  ${game} limit 1
		`;
		
		let gamenameData  = await dbSequelize.query(gamenameAndId, {
			replacements:['active'], type:Sequelize.QueryTypes.SELECT
		});
		
		if(gamenameData.length === 0 ){
			throw {code:2000, message:'您没有这个权限。'};
		}
		let {0:{id:gameid, game_name:gamename, img:imgUrl}} = gamenameData;
		// with 
		// qwe as (select a.url,a.pid,a.name,d.game_name,d.id as gameid, a.id,b.grede , b.purview_id,c.uid,c.gid from gm_url a join gm_url_purview  b on  a.id = b.url_id  join gm_purview c on c.id = b.purview_id join gm_game d on d.id = c.gid where  c.uids @> '${id}' and d.id = '${gameid}' and d.status = 1 and b.grede !=827  order by id ),
		// asd as (select name,(select json_agg(concat('{"url":"',url,'","name":"',name,'","meta":"',grede,'"}')::jsonb) from qwe  where qwe.pid = d.id) as children from qwe as d where pid = 0 ORDER BY d.id)
		// select * from asd
		// ( case when  '${game}'::bool then '${game}'::int else (select a.id from gm_game a join gm_purview b on b.gid = a.id where b.uid = '${id}'::int  limit 1 ) end  )
		let routeSQl = `
				with qwe as (select a.icon,a.url,a.pid,a.name,d.game_name,d.id as gameid, a.id,b.grede , b.purview_id,c.uid,c.gid from gm_url a join gm_url_purview  b on  a.id = b.url_id  join gm_purview c on c.id = b.purview_id join gm_game d on d.id = c.gid where  c.uids @> '${id}' and d.id = '${gameid}' and d.status = 1 and b.grede != 827 and c.status = 1  and a.status = 1 order by id ),
					qwer as (select * from qwe a where (select count(*) > 1 from qwe b where b.id = a.id )),
					asd as (select * from qwe a where (select count(*) =  1 from qwe b where b.id = a.id )),
					zxc as (select * from qwer where grede = '1'),
					wer as (select * from qwer where id not in (select id from zxc )
					union 
					select * from qwer where id not in (select id from zxc )),
					sdf as (select url,pid,name,gameid,grede,id,icon from asd 
					union 
					select url,pid,name,gameid,grede,id,icon from zxc 
					union 
					select url,pid,name,gameid,grede,id,icon from wer ),
					ewq as (select * from sdf ORDER BY id )
					select icon,name,(select json_agg(concat('{"url":"',url,'","name":"',name,'","meta":"',grede,'"}')::jsonb) from ewq  where ewq.pid = d.id) as children from ewq as d where pid = 0 ORDER BY d.id
`;
		console.log(routeSQl);
		let routes = await dbSequelize.query(routeSQl, {
			replacements:['active'], type:Sequelize.QueryTypes.SELECT
		});
		let gamesql = `
		select string_to_array(string_agg(game_name, ','), ',')  as games from (
			select  DISTINCT game_name,b.id from gm_purview a join gm_game b on a.gid = b.id  where uids @> '${id}' and b.status = '1' and a.status = '1'   ORDER BY id 
		) a 
		`;
		let {0:{games}} = await dbSequelize.query(gamesql, {
			replacements:['active'], type:Sequelize.QueryTypes.SELECT
		});
		
		return {
			routes, games, gamename, gameid, imgUrl
		};
	}
	// return {routes, games, gamename:game, gameid:gameid.id};
	// 	let games, routes;
	// 	if(!loginType){
	// 		// console.log('内部登录');
	// 		games = await UserDao.findSqlByParamsToList('SELECT gm_game.game_name,gm_game.id from (gm_user LEFT JOIN gm_purview on gm_purview.uid=gm_user.id) LEFT JOIN gm_game on gm_game.id = gm_purview.gid where gm_user.id=:id ', {id});
	// 		game = game?game:games[0].game_name;
	// 		routes = await UserDao.findSqlByParamsToList('select gm_url_purview.grede AS meta,gm_url.name,gm_url.url,gm_url.id AS urlid,gm_url.pid  from (((gm_user LEFT JOIN gm_purview ON gm_purview.uid=gm_user.id) LEFT JOIN gm_game on gm_game.id= gm_purview.gid)LEFT JOIN gm_url_purview on gm_url_purview.purview_id = gm_purview.id )left join gm_url on gm_url.id = gm_url_purview.url_id where gm_user.id=:id and gm_game.game_name = :game', { id, game});
	// 		//内部登录选手
	// 	}else{
	// 		//外部登录选手
	// 		// console.log('外部登录');
	// 		games = await UserDao.findSqlByParamsToList(' SELECT gm_game.game_name,gm_game.id from (auth_user LEFT JOIN gm_purview on gm_purview.uid=auth_user.id) LEFT JOIN gm_game on gm_game.id = gm_purview.gid where auth_user.id=:id', {id});
	// 		game = game?game:games[0].game_name;
	// 		routes = await UserDao.findSqlByParamsToList('select gm_url_purview.grede AS meta,gm_url.name,gm_url.url,gm_url.id AS urlid,gm_url.pid  from (((auth_user LEFT JOIN gm_purview ON gm_purview.uid=auth_user.id) LEFT JOIN gm_game on gm_game.id= gm_purview.gid)LEFT JOIN gm_url_purview on gm_url_purview.purview_id = gm_purview.id )left join gm_url on gm_url.id = gm_url_purview.url_id where auth_user.id=:id and gm_game.game_name = :game', { id, game});
	// 	}
	// 	let routerfater = routes.map(val=>{
	// 		if(val.pid===0){
	// 			return { 'name': val.name, 'urlid':val.urlid, 'grede':val.grede};
	// 		}else{
	// 			return val;
	// 		}
	// 	});
	// 	routes = routerfater.filter(item => {
	// 		// 解构数据
	// 		let { pid } = item;
	// 		// 没有 pid 的都是一级菜单
	// 		if(!pid) { return true; }
      
	// 		let parent = routerfater.find(({ urlid }) => urlid === pid);
	// 		// 如果不存在创建数组
	// 		if(!parent.children) { parent.children = []; }
	// 		// 添加至父节点
	// 		if(parent.children.includes(item)) {
	// 			return false;
	// 		}else{
	// 			parent.children.push(item);
	// 		}
	// 	});
	// 	games= games.map(val => val.game_name);
	// 	let gameid = await UserDao.findSqlByParamsToOne('select id from gm_game where game_name=:gamename', {gamename:game});

	// 	routes.map(item => {
	// 		try{
	// 			item.children.sort((a, b) => a.urlid-b.urlid);
	// 		}catch{}
	// 		return {...item};
	// 	});
	// 	try{
	// 		routes.sort((a, b) => a.urlid-b.urlid);
	// 	}catch{}
	// 	// console.log(routes);
	// 	return {routes, games, gamename:game, gameid:gameid.id};
	// }
  


	async handelToken(token) {
		return jwt.verify(token, secret.sign, function(err, decode) {
			return new Promise((resolve, reject)=> {
				if (err) {
					reject(err);
				} else {
					resolve(decode);
				}
			});
		});
	}

	async loginNative(username, password) {
		// 判断用户是否存在 用户名
		let user;
		if ((user = await UserDao.findByParam({ username: username, status: 1 })).length > 0) {
			return packTokenByUser(user[0], password);
		} else if ((user = await UserDao.findByParam({ email: username, status: 1 })).length > 0) {
			return packTokenByUser(user[0], password);
		} else {
			throw statusCode.ERROR_403('用户不存在');
		}
	}

	async loginOther(token) {
		// 解析token
		const otherUser = await this.handelToken(token);
		// 判断 在本数据库中是否存在该用户
		let userList = await UserDao.findSqlByParamsToList('select * from auth_user where status != 0 and source = 2 and username = :username', { username: otherUser.username });
		// 判断当前用户是否存在重复数据
		for (let user of userList) {
			if (user.status === 2) {
				logUtil.debug(`[统一登陆][离职用户尝试登陆]${user.id}|${user.username}|${user.nickName}|${user.alias}`);
				throw statusCode.ERROR_592('离职用户尝试登陆');
			}
		}
		let user = userList[0];
		let newToken;
		if (!user) {
			// 未在WP用户中，
			throw statusCode.ERROR_593('请联系管理员同步您的用户信息到WP中');
		}
		newToken = jwt.sign(user, secret.sign, { expiresIn: secret.tokenExpiresTime });
		return {
			id: user.id,
			username: user.username,
			nickName: user.nickName,
			avatar: user.avatar,
			alias: user.alias,
			token: newToken
		};
	}
	async createUser(data){
		let {username, password} = data;
		let sql = `
		insert into auth_user
(username,"password")
values
('${username}', md5(encode('${password}','base64')) ) returning *
		`;
		let res;
		try{
			res = await dbSequelize.query(sql, {
				replacements:['active'], type:Sequelize.QueryTypes.INSERT
			});
		}catch ({message}){
			if(message === '重复键违反唯一约束"auth_user_username_key"'){
				throw {code:500, message:'用户名重复'};
			}
			throw {code:500, message};
		}
		
		return res;
	}
	async login(data){
		let {username, password} = data;
		let sql = `
		select * from auth_user where username = '${username}' and password = md5(encode('${password}', 'BASE64'))
		`;
		let res = await dbSequelize.query(sql, {
			replacements:['active'], type:Sequelize.QueryTypes.SELECT
		});
		
		if(res.length===1){
			res[0]['loginType'] = true;
			return 	jwt.sign(res[0], secret.sign, {expiresIn:'1y'});
		}

		//青果内部登录
		let fancyToken =  await this.fancyguoLogin(data);
		if(!fancyToken){return false;}
		let user =  await verify(fancyToken['data']['token'], secret.sign);
		let userSelectSql = `
		with qwe as (select   jsonb_array_elements_text(uids) as id  from gm_purview   ),
asd as (select a.* from gm_user a  where a.username = '${user.username}')
select * from asd where id::varchar in (select id from qwe GROUP BY id )
		`;
		// select a.* from gm_user a join gm_purview b on a.id=b.uid  where a.username = '${user.username}' 
		// union 
		// select a.* from gm_user a join gm_purview b on a.id=b.uid  where a.username = '${user.username}' 
		res = await dbSequelize.query(userSelectSql, {
			replacements:['active'], type:Sequelize.QueryTypes.SELECT
		});
		if(res.length === 1){
			res[0]['loginType'] = false;
			return 	jwt.sign(res[0], secret.sign, {expiresIn:'1y'});
		}

	}
	async fancyguoLogin(data){
		let {username, password} = data;
		const request = require('request');
		let res = await new Promise((res, rej)=>{
			request.post('https://fancyguo.com/auth/api/user/login', {
				body:JSON.stringify({
					username, 
					password,
					projectName:'fancydata'
				}),
				form:{
					username, 
					password,
					projectName:'fancydata'
				}
			}, (e, r, b)=>{
				b = JSON.parse(b);
				if(!e && +b.code === 200){
					res(b);
				}else if(!e){
					res(false);
				}
				rej(e);
			});
		});

		return res;
		
	}
	

}

export default new UserServer();