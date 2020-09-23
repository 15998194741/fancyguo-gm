import { dbSequelize } from '../config';
const Sequelize = require('sequelize');

const jwt = require('jsonwebtoken');
const secret = require('../config/secret');
const util = require('util');
const verify = util.promisify(jwt.verify);
const statusCode = require('../utils/status-code');
export default async (ctx, next) => {
	let ip = ctx.request.headers['x-forwarded-for'] || ctx.request.headers['x-real-ip'];
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
	let gameid = ctx.request.headers['gameid'];
	if ( token=== undefined ) {
		ctx.body = statusCode.ERROR_590('权限异常');
		return false;
	}else{
		try{
			let user =  await verify(token, secret.sign);
			ctx.user = user;
			ctx.user.ip = ip;
			ctx.logging = (  instructions, classification, message )=>{
				let sql  = `
				INSERT into gm_logs 
				(user_id,ip,nick_name,instructions,classification,"text",game_id)
				VALUES
				('${user['id']}','${ip}','${user['nickName']}','${instructions}','${classification}','${message}','${gameid}')`; 
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
