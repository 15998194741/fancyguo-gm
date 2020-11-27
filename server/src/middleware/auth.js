import { json } from 'sequelize';
import { dbSequelize } from '../config';
const Sequelize = require('sequelize');
const jwt = require('jsonwebtoken');
const secret = require('../config/secret');
const util = require('util');
const verify = util.promisify(jwt.verify);
const statusCode = require('../utils/status-code');
const crypto = require('crypto');

export default async (ctx, next) => {
	let jump = [
		'/api/user/login',
		'/api/server/download',
		'/api/server/upload',
		'/api/user/token',
	];
	if(jump.some(a=> a===ctx.url)){
		return next();
	}
	// if(ctx.url === '/api/user/login'){
	
	// }
	// if(ctx.url === '/api/server/download' ){
	// 	return next();
	// }
	// if(ctx.url === '/api/server/upload' ){
	// 	return next();
	// }
	const getIp = (req) =>{
		return req.headers['x-forwarded-for'] || req.headers['x-real-ip'] ||req.socket.remoteAddress ||req.connection.remoteAddress; 
	};
	let ip = ctx.request.headers['X-Orig-IP'] ||  getIp(ctx.req) || ctx.ip || ctx.request.ip;
	
	try{
		for(let [key, value] of Object.entries(ctx.query)){
			if(key.slice(-2) === '[]'){
				ctx.query[key.slice(0, -2)] = value;
			}
			ctx.query[key] = value;
		}
		for(let [key, value] of Object.entries(ctx.request.body)){
			if(key.slice(-2) === '[]'){
				ctx.request.body[key.slice(0, -2)] = value;
			}
			ctx.request.body[key] = value;
		}

	}catch{

	}
	let token =ctx.request.headers['fancy-guo-login-token'];
	let gameid;
	try{
		 gameid = ctx.request.headers['1f13d01052ccfae35744098fa9a71439'];
		let privKey = `-----BEGIN RSA PRIVATE KEY-----
MIICXQIBAAKBgQDFWnl8fChyKI/Tgo1ILB+IlGr8ZECKnnO8XRDwttBbf5EmG0qV
8gs0aGkh649rb75I+tMu2JSNuVj61CncL/7Ct2kAZ6CZZo1vYgtzhlFnxd4V7Ra+
aIwLZaXT/h3eE+/cFsL4VAJI5wXh4Mq4Vtu7uEjeogAOgXACaIqiFyrk3wIDAQAB
AoGBAKdrunYlqfY2fNUVAqAAdnvaVOxqa+psw4g/d3iNzjJhBRTLwDl2TZUXImEZ
QeEFueqVhoROTa/xVg/r3tshiD/QC71EfmPVBjBQJJIvJUbjtZJ/O+L2WxqzSvqe
wzYaTm6Te3kZeG/cULNMIL+xU7XsUmslbGPAurYmHA1jNKFpAkEA48aUogSv8VFn
R2QuYmilz20LkCzffK2aq2+9iSz1ZjCvo+iuFt71Y3+etWomzcZCuJ5sn0w7lcSx
nqyzCFDspQJBAN3O2VdQF3gua0Q5VHmK9AvsoXLmCfRa1RiKuFOtrtC609RfX4DC
FxDxH09UVu/8Hmdau8t6OFExcBriIYJQwDMCQQCZLjFDDHfuiFo2js8K62mnJ6SB
H0xlIrND2+/RUuTuBov4ZUC+rM7GTUtEodDazhyM4C4Yq0HfJNp25Zm5XALpAkBG
atLpO04YI3R+dkzxQUH1PyyKU6m5X9TjM7cNKcikD4wMkjK5p+S2xjYQc1AeZEYq
vc187dJPRIi4oC3PN1+tAkBuW51/5vBj+zmd73mVcTt28OmSKOX6kU29F0lvEh8I
oHiLOo285vG5ZtmXiY58tAiPVQXa7eU8hPQHTHWa9qp6
-----END RSA PRIVATE KEY-----
`;
		const decrypt = (encrypted, key) => {
			// 注意，encrypted是Buffer类型
			return crypto.privateDecrypt(key, encrypted);
		};
		gameid = decrypt(Buffer.from(gameid, 'base64'), privKey).toString();
	}catch (e){
		console.log(e);
		let {message} =e;
		console.log(message);
		// throw {code:590, message:'你没有该系统使用权限'};
	}
	if ( token === undefined ) {
		throw {code:500, message:'权限异常'};
	}else{
		try{
			let user =  await verify(token, secret.sign);
			ctx.user = user;
			ctx.user.ip = ip;
			ctx.logging = (  instructions, classification, message )=>{
				let sql  = `
				INSERT into gm_logs 
				(user_id,ip,nick_name,instructions,classification,"text",game_id,alias,kwargs)
				VALUES
				('${user['id']}','${ip}','${user['nickName']|| ''}','${instructions}','${classification}','${message}','${gameid}','${user['alias'] || ''}','${JSON.stringify(ctx.data)}')`; 
				dbSequelize.query(sql, {
					replacements:['active'], type:Sequelize.QueryTypes.INSERT
				});
			};
			gameid?ctx.request.body['gameid'] = gameid:'';
			gameid?ctx.query['gameid'] = gameid:'';
		}catch{
			ctx.body = statusCode.ERROR_590('权限异常');
			return false;
		}
		await next();
	}
};
