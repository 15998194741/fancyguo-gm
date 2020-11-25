import gmServerDao from '../dao/gm-server';
import { gmServerDO } from '../models/gm-server';
import BaseService from '../../lib/base-service';
import { dbSequelize } from '../../config';
const Sequelize = require('sequelize');
import dayjs from 'dayjs';
import Cp from '../../utils/Cp';
import { add } from 'ramda';
import { config } from 'bluebird';
class GmServerService extends BaseService{
	constructor() {
		super(gmServerDao, gmServerDO);
		this.gmServerDao=gmServerDao;
		this.gmServerDO = gmServerDO;
		// const  SenecaClient= require('../../xiaolu/senecaclient');
		// this.SenClient = new SenecaClient('127.0.0.1', 10002, 'tcp');
		let { a } = require('../../xiaolu/senecaclient');
		this.SenClient = a;
	}
  
	//区服按需查找
	async serverFindByParam(findForm) {
		console.log(findForm);
		let getType = data => Object.prototype.toString.call(data).split(' ')[1].slice(0, -1);
		let { plaform, display, load, gameid, test, srttime, channel, page, pagesize, mergeserver, key, value, clientshow, stopshow} = findForm;
		findForm = {
			display, load, gameid, test, clientshow, stopshow
		};
		console.log(findForm);
		let  whereObj = {};
		for (const key in findForm) {
			if(key === 'clientshow' && findForm[key] ){
				whereObj[key] = findForm[key];
				continue;
			}
			if(key === 'stopshow' && findForm[key] ){
				whereObj[key] = findForm[key];
				continue;
			}
			if (findForm[key] && findForm[key]!='0') {
				whereObj[key] = findForm[key];
			}
		}
		findForm = null;
		let where = [];
		if (whereObj){
			for( let [key, value] of Object.entries(whereObj)){
				where.push(`${key}='${value}'`); 
			}
			where = 'where '  + where.join(' and ');
			whereObj = null;
		}
		if(channel){
			where += getType(channel)==='String'?` and  channel = '[${JSON.stringify(channel)}]' `:` and channel @> '${JSON.stringify(channel)}'  and  jsonb_array_length(channel) = jsonb_array_length('${JSON.stringify(channel)}'::jsonb) `;
		}
		// if(plaform){
		// 	where += getType(plaform)==='String'?` and plaform =  '[${JSON.stringify(plaform)}]' `:`  and plaform @> '${JSON.stringify(plaform)}' `;
		// }
		switch (+plaform){
			case 1:where += ` and plaform =  '[${JSON.stringify(plaform)}]' `;break;
			case 2:where += ` and plaform =  '[${JSON.stringify(plaform)}]' `;break;
			case 3:where += '  and plaform @> \'["1","2"]\' and  jsonb_array_length(plaform) = jsonb_array_length(\'["1","2"]\'::jsonb)  ';break;
			case 4:where += '  and plaform @> \'["1"]\' ';break;
			case 5:where += '  and plaform @> \'["2"]\' ';break;
		}

		
		// where += channel && channel.length > 0? ' and array[\''+channel.join(' ')+'\']::varchar[] <@  channel ':'';
		where += srttime?` and srttime BETWEEN '${srttime[0]}'::TIMESTAMP  + '8:00' and '${srttime[1]}'::TIMESTAMP  + '8:00' `:'';
		where += test?`and test='${test}'`:'';
		where += mergeserver?` and ${+mergeserver===1?'NOT':''}(childrens is null)`:'';
		// where += plaform?` and plaform =  '${JSON.stringify(plaform)}' `:'';
		if(value){
			// where += key ==='serverid'?` and serverid = '${value}'`: ` and serverid='${value}' and not(childrens is null)   `;
			switch (key){
				case 'serverid':where +=` and serverid = '${value}'`;break;
				case 'pid':where +=` and serverid='${value}' and not(childrens is null)   `;break;
				case 'servername':where +=` and servername like '%${value.split('').join('%')}%'`;break;
			}
		}
		let selectSql = `select * from gm_server  ${where} and status = 1 and (pid is null or  trim(pid) ='') order by id limit ${pagesize} offset (${pagesize}*${page-1})`;
		let arr =  await dbSequelize.query(selectSql);
		let totalSql = `select count(*) as total from gm_server ${where} and status = 1 and (pid is null or  trim(pid) ='')  `;
		let totals = await dbSequelize.query(totalSql);
	
		let {total} = totals[0][0];
	
		arr.map(value => value.dataValues);
		// let  total = arr[0].length;
		let displayNumSql =	`
		select max(num), display from (SELECT count(display) as num,
		case 
		when display='1' then '流畅'
		when display='2' then '繁忙'
		when display='3' then '维护'
		when display='4' then '爆满'
		end
		as display
		from gm_server where id in ( SELECT id from gm_server  ${where} and  status = 1 and (pid is null or  trim(pid) ='')  ORDER BY id limit ${pagesize} offset (${pagesize}*${page-1})  ) GROUP BY display 
		union 
		select 0 as num ,'繁忙' as display
		union 
		select 0 as num ,'流畅' as display
		union
		select 0 as num ,'维护' as display
		union
		select 0 as num ,'爆满' as display
		)a GROUP BY display`;
		console.log(displayNumSql);
		 let displayNum = await dbSequelize.query(displayNumSql);
		let pidarr = [];
		if(arr[0].length > 0){
			 pidarr = arr[0].map(item =>{
				return item.childrens?{...item, hasChildren: true}:item;
			});
		}
		// console.log(pidarr);
		let res = {
			total,
			table:pidarr,
			displayNum:displayNum[0],
			page
		};
		return res;
	}


	async findServerByID(query){

		let where = `where pid='${query.id}' and gameid='${query.gameid}' and status = 1`;
		// if(query.value === ''){	
		// 	 where = `where gameid='${query.gameid}'`;
		// }
		let idFindSql = `SELECT *   from gm_server ${where}`;
		let res = await dbSequelize.query(idFindSql);
		return res[0]; 
	}
	async mergeServer(data){
		// console.log(data);
		let children = data.map(item=> {return `'${item.id}'`;});
		// let pid = dayjs(new Date()).add(8, 'hour').format('YY-MM-DD HH:mm:ss');
		// let channel = data[0].channel.map(item => {return `'${item}'`;});
		let channel = data[0].channel;
		let plaform =  data[0].plaform;
		let test =data[0].test;
		let querySql = `insert into gm_server (childrens,gameid,channel,plaform,display,test)VALUES (array[${children.join(',')}],'${data.gameid}','${JSON.stringify(channel)}','${JSON.stringify(plaform)}','3','${test}')  returning id  `;
		
		// console.log(querySql);
		let res = await dbSequelize.query(querySql, {
			replacements:['active'], type:Sequelize.QueryTypes.INSERT
		});
		let pid = res[0][0]['id'];
		let mergreSql = `
		with RECURSIVE le (id,childrens) as (
			select id,childrens from gm_server where id = ${pid}
			union all
			select  a.id,a.childrens from gm_server a ,le b where a.id::varchar = any(b.childrens)),
			asd as (select id from le  where id <> ${pid})
			update gm_server set pid = ${pid}  where id in (select * from asd )
		`;
		 await dbSequelize.query(mergreSql, {
			replacements:['active'], type:Sequelize.QueryTypes.UPDATE
		});
		return {serverid:pid} ;
	

	}
	idRandom(lengths) {
		let randomString = '';
		for (let i = 0; i < lengths; i++) {
		  randomString += Math.ceil(Math.random() * 10).toString();
		}
		return randomString;
	  }
	  async serverCreate(args){
		  let  {data, user} = args;
		let {id :userId} = user;
		let {servername, gameid, address, test, ip:ipPort, display, srttime, channel, plaform, serverid, serveridTrue} = data;
		srttime = dayjs(srttime).add(8, 'hour');
		let ipAndPort = address || ipPort;
		let ip = ipAndPort.replace(/^(.+)[:：]([0-9]+)/, '$1');
		let port = ipAndPort.replace(/^(.+)[:：]([0-9]+)/, '$2'); 
		 port = port === ip ?'80':port;
		let sql = `
		insert into gm_server (
			create_user_id,servername,gameid,address,test,ip_port,
			display,srttime,channel,plaform,
			ip,port,serverid,"serverTrue"
		)values(
			'${userId}','${servername}','${gameid}','${address}','${test}',${ipPort ? `'${ipPort}'` : null},
			'${display}','${ srttime }','${JSON.stringify(channel)}','${JSON.stringify(plaform)}',
			'${ip}','${port}',${serverid?
	`'${serverid}'`:` (select id from (
		select serverid::int as id  from gm_server where gameid = '${gameid}' and status = '1'
		UNION ALL
		select generate_series(1, (select  case when max(id) is  not  null then max(id ) else 1 end from gm_server where gameid = '${gameid}' and status = '1' ))   as id   )a GROUP BY id HAVING count(id) = 1 ORDER BY id     limit 1)   `},${!!serveridTrue}	
				) RETURNING *
		`;
		console.log(sql);
		let res = await dbSequelize.query(sql, {
			replacements:['active'], type:Sequelize.QueryTypes.INSERT
		});
		// let updatesql = ' update gm_server set serverid = id';
		// await dbSequelize.query(updatesql, {
		// replacements:['active'], type:Sequelize.QueryTypes.UPDATE
		// });
		 
		
		if(+res[1] !== 1){
			throw {code:500, message:'创建失败，请联系管理员。', data};
		}
		let body = res[0][0];
		let { code } = await this.SenClient.get('server', 'createServer', {body}).catch(e=>({code:500}));
		if(+code === 200) {return {...res[0][0], id:res[0][0].serverid, code:200};}
		let falseSql = ` update  gm_server set  status = '0' where id = ${body['id']}`;
		await dbSequelize.query(falseSql, {
			replacements:['active'], type:Sequelize.QueryTypes.UPDATE
		});
		throw {code:500, message:'Cp交互失败,请确认交互地址', data};
	  }
	  async clearIpAll({server, gameid}){
		let sql = `
		update "gm_server" set "securityGroup" = null where id in (${server.map(a=>a.id)} ) and gameid = ${gameid}
		`;
		return await dbSequelize.query(sql, {
			replacements:['active'], type:Sequelize.QueryTypes.UPDATE
		});

	  }
	  async addIpSecurityGroup({server, ip, gameid}){
		
		let ips = JSON.stringify(ip.map(a=>a.ip));
		let sql =` 
		update "gm_server" set "securityGroup" = case when "securityGroup"  is null   then       '${ips}'::jsonb    else  "securityGroup"    ||  '${ips}'::jsonb end  where id in (${server.map(a=> Number(a.id))} ) and gameid = ${gameid}
		`;
		return await dbSequelize.query(sql, {
			replacements:['active'], type:Sequelize.QueryTypes.UPDATE
		});
	  }

	  async setClientShow(data){
		  console.log(data);
		  let {value, gameid} =data;
		  let sql = ` update gm_server set clientshow = 1 where id in (${value.map(a => a.id)}) and gameid = ${gameid}`;
		  let res = await dbSequelize.query(sql, {
			  type:'UPDATE'
		  }); 
		  return res;
	  }
		async batchCreate({data, user}){
		let {value, gameid} = data;
		value.map(a => {
			let b ;
			switch(a.platform){
				case '安卓':b = [1] ;break;
				case '苹果':b = [2] ; break;
				case '全平台':b = [1, 2];break;
			} 
			a['plaform'] = b;
			switch(a.display){
				case '流畅':b = 1 ; break;
				case '繁忙':b = 2 ; break;
				case '维护':b = 3 ; break;
				case '爆满':b = 4 ; break;
			}
			a.display = b;
			a.test = a.test === '是' ? '1' :'0';
		
			a.gameid = gameid;
			return a;
		});
		console.log(data);
		let res= [];
		for(let i of value){
			res.push(new Promise(async (res, rej) => {
				let a;
				try{
					 a= await this.serverCreate({data:i, user}).catch(a =>( {code:500, message :a}));

				}catch (e){
					rej(a);
				}
				if(a?.code === 200 ){
					res(a);
				}else {
					rej(a);
				}
			}));
		}
		let allRes = await Promise.allSettled(res);
		return allRes;
		}
		}

export default new GmServerService();


