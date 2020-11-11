// // import BaseDao from '../../lib/base-dao';
// // import BaseService from '../../lib/base-service';
// // import { dbSequelize } from '../../config';
// // const UserModel = dbSequelize.import('./../models/user');
// // UserModel.sync({force: false});

// // class test extends BaseDao {
// // 	constructor() {
// // 		super(UserModel);
// // 	}

// // }

// // class component extends BaseService {
// // 	constructor() {
// // 		super(test);
// // 	}
// // 	async find(areaclothing){
// // 		let rep = await   test.findSqlByParamsToList('select values from gm_dict where code = :areaclothing', {areaclothing});
// // 		return rep;
// // 	}
// // }

// // export default new component();

// // import {}  from ''

// const pg = require('pg');
// const config = {
// 	user:'postgres',
// 	password:'Ll789456',
// 	database:'fancy',
// 	host:'106.75.7.83',
// 	port:5432,
// 	dialect: 'postgres',
// 	// 扩展属性
// 	idle: 10000, 
// 	acquire: 30000, 
// 	max: 5, 
// 	min: 0 
// };
// var pgPool = new pg.Pool(config);

// let a = pgPool.connect( (isErr, client, done) => {
// 	if (isErr) {
// 		console.log('connect query:' + isErr.message);
// 		return;
// 	}
// 	client.query('select * from gm_user;', [], function (isErr, rst) {
// 		done();
// 		if (isErr) {
// 			console.log('query error:' + isErr.message);
// 		} else {
// 			 Promise.resolve(rst.rows[0]);
// 		}
// 	});
// });

import UserDao from '../dao/user';
import BaseService from '../../lib/base-service';
import dayjs from 'dayjs';
const crypto = require('crypto');


class components extends BaseService{
	constructor() {
		super(UserDao);
	}
	async findcomponent(areaclothing) {
		let coms = await UserDao.findSqlByParamsToOne('select values from gm_dict where code = :code and gameid=:gameid', {areaclothing});
		return coms;
	}
	async findgametable(gamename){
		let gametable = await UserDao.findSqlByParamsToOne('SELECT values from gm_dict where code = :gamename', {gamename});
		return gametable;
	}
	async createserver(form){
		// form.client=JSON.stringify(form.client);
		// console.log(form.client);
		let a = form.client.map(item=>{
			return `'${item}'`;
		});
		let gametable = await UserDao.findSqlByParamsToOne(`INSERT into gm_server ( servername,ip,address,plaform,display,srttime,channel,gamename,serverid,gameid )values (:name,:ip_port,:address,:platform,:show_status,:open_time,array[${a}],:gamename,:id,:gameid)`, form);
		return gametable;
	}
	async findall(gameid){
		let serverall = await UserDao.findSqlByParamsToList('SELECT id,pid,serverid,servername,plaform,channel,display,load,srttime,ip,address,test,status from gm_server where gameid=:gameid', gameid);
		//筛选出相同得pid（合服ID）
		let pids =   [...new Set(serverall.map(({ pid }) => pid).filter(pid => pid))];
		//找到符合条件得记录
		let tree =   pids.map(pid => serverall.filter(({ pid: _pid }) => _pid === pid));
		// return tree;
		tree =  tree.map(children => {
			return {...children[0], 
				children:children.slice(1)
			};
		});
		return tree.concat(serverall.filter(({pid}) => !pid));
		// return [...new Set(serverall.map(({ pid }) => pid).filter(pid => pid))].map(pid => serverall.filter(({ pid: _pid }) => _pid === pid)).map(children => ({children})).concat(serverall.filter(({pid}) => !pid));
		// return serverall;
	}
	async updateserver(ctx){
		let form = ctx.request.body;
		let {  srttimeChange, displayChange, srttime } = form;
		form.srttime = dayjs(form.srttime).format('YYYY-MM-DD HH:mm:ss');
		let {id, serverid, ip, port} = form;

		if(srttimeChange){
		
			let url = `http://${ip}:${port}/gmswap/modifyStartTime?startTime=${new Date(srttime).getTime()}`;
			
			const axios = require('axios');
			let { data }  = await axios({
				method: 'get',
				url,
				headers:{
					Connection: 'close'
				}
					 }).catch(()=>({data:{code:500}})); 
			if(+data.code !== 200){	throw {message:'开服时间修改失败'};	}
			ctx.logging( '开服时间修改', '区服管理', `修改了区服id ${id||serverid} 时间为 ${form.srttime}` );
		}
		if(displayChange){
			let {display} = form;
			if(+display === 3 ){
				let url = `http://${ip}:${port}/gmswap/clearUser?all=1&roleid=`;
				const axios = require('axios');
				let { data }  = await axios({
					method: 'get',
					url,
					headers:{
						Connection: 'close'
					}
					 }).catch(()=>({data:{code:500}}));  
				if(+data.code !== 200){throw {message:'踢人下线失败'};}
			
			}
			switch (+display){
				case 1:display = '空闲';break;
				case 2:display = '繁忙';break;
				case 3:display = '维护';break;
				case 4:display = '爆满';break;
			}
			ctx.logging( '状态修改', '区服管理', `修改了区服id ${id||serverid} 状态为 ${display}` );
		}
		
	
		
		
		let gametable = await UserDao.findSqlByParamsToOne('update gm_server set display = :display,srttime=:srttime where  gameid=:gameid and serverid=:serverid returning *', form);
		return gametable;
	}
	async updateserversnomerge(forms, gameid, display, merge){
		let clearuser = false;
		if(+display === 3){clearuser = true;} 
		let c = async(ip, port) =>{
			let url = `http://${ip}:${port}/gmswap/clearUser?all=1&roleid=`;
			const axios = require('axios');
			let { data }  = await axios({
				method: 'get',
				url,
				headers:{
					Connection: 'close'
				}
					 }).catch(()=>({data:{code:500}}));  
			if(+data.code !== 200){throw {message:'踢人下线失败'};}
		};
		for(let form  of  forms){
			if(display === '0'){
				break;
			}
			let {ip, port} = form;
			clearuser? await c(ip, port):'';
			await UserDao.findSqlByParamsToOne('update gm_server set display = :display where  gameid=:gameid and serverid=:serverid and id=:id', {...form, gameid, display});
		}
		if(merge){
			let md5 = crypto.createHash('md5');
			md5.update(JSON.stringify(new Date().getTime()));
			let pid = md5.digest('hex');
			for(const iterator of forms) {
				await UserDao.findSqlByParamsToOne('update gm_server set pid = :pid where  gameid=:gameid and serverid=:serverid', {...iterator, gameid, pid});
			}
		}
		return true;
	}
	async stopserver(form){
		let a = '5';
		await UserDao.findSqlByParamsToOne('update gm_server set display = :a ,status = 0 where  gameid=:gameid and id=:id', {...form, a});
		return true;
	}
	async selectserver(parmas){
	  if(parmas.id === 'serverid') {
	    let res = await UserDao.findSqlByParamsToList('select * from gm_server where serverid=:serverid', parmas);
		  return res;
		}else if(parmas.id === 'pid') {
		  let res = await UserDao.findSqlByParamsToList('select * from gm_server where pid=:pid', parmas);
			return res;
		}
		let b = await UserDao.findSqlByParamsToList(`select * from gm_server where  plaform=${parmas.plaform} and gameid=${parmas.gameid} and ${parmas.client} and display=${parmas.showstatus} and ${parmas.data} `);
		return b;

	}
	async allserverstop(forms, gameid, display){

		for(let form  of  forms){
		

			await UserDao.findSqlByParamsToOne('update gm_server set status = 0 where  gameid=:gameid and serverid=:serverid and id=:id', {...form, gameid, display});
		}
		return true;
	}
}

export default new components();