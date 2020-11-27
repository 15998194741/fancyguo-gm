import { dbSequelize } from '../../config';
const Sequelize = require('sequelize');
import dayjs from 'dayjs';
import Cp from '../../utils/Cp';

class MailService{
	constructor() {
		let { a } = require('../../xiaolu/senecaclient');
		this.SenClient = a;
	}
	async queryByParms(data){
		let {createTime, channel, servername, annex, Id:id } = data;
		let {gameid:game_id, plaform, pagesize, page} = data; 
		let condition  = {game_id,  id };
		let getType = data => Object.prototype.toString.call(data).split(' ')[1].slice(0, -1);
		let where = 'where '; 
		let whereObj =[];
		for(let i in condition){
			if(!condition[i]){continue;}
			whereObj.push( ` ${i}= '${condition[i]}'`);
		}
		
		where += whereObj.join('  and  '); 
		// channel = channel ?typeof channel === 'string'? [channel]:channel:false;
		servername = servername ?typeof servername === 'string'? [servername]:servername:false;
		annex = annex ?typeof annex === 'string'? [annex]:annex:false;
		where += !createTime?'':` and create_time between '${dayjs(new Date(createTime[0])).format('YYYY-MM-DD HH:mm:ss')}' and  '${dayjs(new Date(createTime[1])).format('YYYY-MM-DD HH:mm:ss')}'`;
		// where += !channel ? '': ` and channel @> '[${channel.map(item => `"${item}"`)}]'::jsonb  `;
		where += !annex ? '': ` and annex @> '[${annex.map(item => `{"ID":"${item}"}`).join(',')}]'::jsonb  `;
		// where += !servername ? '': ` and servername @> '[${servername.map(item => `${item}`).join(',')}]'::jsonb  `;
		if(channel){
			where += getType(channel)==='String'?` and  channel = '[${JSON.stringify(channel)}]' `:` and channel @> '${JSON.stringify(channel)}'  and  jsonb_array_length(channel) = jsonb_array_length('${JSON.stringify(channel)}'::jsonb) `;
		}
		if(plaform){
			where += getType(plaform)==='String'?` and plaform =  '[${JSON.stringify(plaform)}]' `:`  and plaform @> '${JSON.stringify(plaform)}' `;
		}
		if(servername){
			where += getType(servername)==='String'?` and servername =  '[${JSON.stringify(servername)}]' `:`  and servername @> '${JSON.stringify(servername)}'  and  jsonb_array_length(servername) = jsonb_array_length('${JSON.stringify(servername)}'::jsonb)`;

		}

		let sql = `
			with asd as (			
				select * from gm_smtp  ${where}  and status = 1 ORDER BY id desc limit ${pagesize} offset ${pagesize*(page-1)} 
			),
			dsa as (select * from gm_server),
			ssss as( select asd.servername, string_to_array(string_agg(dsa.servername, ','),',') as servernames from asd LEFT JOIN dsa on dsa.serverid::jsonb <@ (asd.servername) GROUP BY  asd.servername),
			qweqweqwe  as (select asd.* ,ssss.servernames from asd left join ssss on ssss.servername = asd.servername),
			asdasd as (select jsonb_array_elements(annex) ->> 'ID' as names, jsonb_array_elements(annex) ->> 'number' as numbers ,id  from  qweqweqwe ),
			qweqwe as (select asdasd.id,string_to_array(string_agg(concat(gm_article.name,'  ',asdasd.numbers,'个'),','),',') as annexnames from asdasd left JOIN gm_article on gm_article.article_id = asdasd.names GROUP BY asdasd.id ),
			qweasd as (select (case when plaform = '"1"' then '安卓' when plaform = '"2"' then '苹果'  end ) as plaform ,id from (select jsonb_array_elements(plaform) as plaform,id from asd )a )
			select asd.*,qweqwe.annexnames,a.plaforms from asd left join qweqwe on qweqwe.id = asd.id left
			join (select string_to_array(string_agg(plaform,','),',')as plaforms ,id from qweasd GROUP BY id )a on a.id = asd.id order by asd.id desc
		`;
		console.log(sql);
		let res = await dbSequelize.query(sql, {
			replacements:['active'], type:Sequelize.QueryTypes.SELECT
		});
		let totalsql = `
		select count(*) as total from gm_smtp ${where} and status = 1 
		`;
		// console.log(totalsql);
		let ress = await dbSequelize.query(totalsql, {
			replacements:['active'], type:Sequelize.QueryTypes.SELECT
		});
		return {data:res, total:ress[0].total?ress[0].total:0};
	}
	async getQueryAnnexOptions(data){
		let {gameid } = data;
		let res = await dbSequelize.query(`select classification as label , classification as value from gm_article where gameid =${gameid} GROUP BY classification  `);
		return res[0];
	}
	async getQueryAnnexOptionsLazy(data){
		let { gameid, label } = data;
		let res = await dbSequelize.query(`select name as label , article_id as value  , TRUE as leaf  from gm_article where gameid =${gameid} and classification = '${label}' `);
		return res[0];
	}
	async getQueryAnnexServernames(data){
		let { gameid } = data;
		// let res = await dbSequelize.query(`with tableone as (select servername from gm_server GROUP BY servername having count(servername)>1),
		// tabletwo as (select min(id) from gm_server GROUP BY servername HAVING count(servername)>1),
		// tablethere as (select min(id) from gm_server GROUP BY servername HAVING count(servername)=1),
		// tablemain as (select * from gm_server)
		// select servername as value ,servername as label from  tablemain where   tablemain.gameid = ${gameid} and  tablemain.id in (select * from tablethere ) or  tablemain.servername in  (select * from  tableone) and tablemain.id in (select * from  tabletwo)  `);
		let res = await dbSequelize.query(
			`	select a as value ,a as label from  (	 select DISTINCT servername  as a from gm_server  where gameid =${gameid} and status  = 1  ) a`
		);
		return res[0];
	}
	async getPlaformChannelToservername(data){
		let { gameid, channel, plaform } = data;
		if(typeof channel ==='string'){
			channel = [channel];
		}
		let res = await dbSequelize.query(`select servername as label ,serverid as value from gm_server  where gameid =${gameid} and plaform ='${plaform}' and channel = array[${channel.map(item => `'${item}'`)}]::varchar[]  `);
		return res[0];
	}
	async postMailToCreate(data){
		let {gameid, title, text, mailLink:link,  Annex, serverName, allServerTrue, roleId, smtpId, sendTime, sendDateTime} =data;
		if(Annex){
			for(let i in Annex){
				Annex[i] = JSON.stringify(Annex[i]);
			}
		}
		if(sendTime){
			sendDateTime = new Date();
		}
		sendDateTime = dayjs(sendDateTime).format('YYYY-MM-DD HH:mm:ss'); 
		// if(typeof serverName == 'string' || serverName.length === 0){
		// 	serverName = null;
		// }else if(serverName.length >1){
		// 	serverName = `'[${serverName}]'`;
		// }else{
		// 	serverName = `'${serverName}'`;
		// }
	
		// let querySql = `with 
		// 	asd as ( select plaform,channel,id from gm_server where id in (${roleId.map(item => item['serverid'])}) ),
		// 	qwe as (select jsonb_array_elements(roleid) ->> 'serverid' as serverids,id from gm_smtp where id=8 ),
		// 	zxc as (select qwe.id , asd.plaform,asd.channel from qwe left join asd on asd.id=qwe.serverids::int),
		// 	ert as (select unnest(channel) as test from zxc where plaform = plaform ),
		// 	dfg as (select test from ert GROUP BY test ),
		// 	cvb as (select string_to_array(string_agg(test, ',') ,',') as channel ,1 as id  from dfg),
		// 	rty as (select plaform from zxc where plaform = plaform union select plaform from zxc where plaform = plaform),
		// 	fgh as (select string_to_array(string_agg(plaform, ','),',') as plaform ,1 as id  from rty )
		// 	select plaform,channel  from fgh join cvb on fgh.id = cvb.id
		// 	`;
		// `
		// 	with 
		// 					asd as ( select plaform,channel,id,servername from gm_server where id in (${roleId.map(item => item['serverid'])}) ),
		// 					qwe as (select jsonb_array_elements(roleid) ->> 'serverid' as serverids,id from gm_smtp where id=8 ),
		// 					zxc as (select qwe.id , asd.plaform,asd.channel from qwe left join asd on asd.id=qwe.serverids::int),
		// 					ert as (select jsonb_array_elements(channel) as test from zxc where plaform = plaform ),
		// 					dfg as (	select json_agg(test)  as channel,1 as id  from (select test ,1 as id  from ert GROUP BY test ) a  GROUP BY id ),	
		// 					rty as (select plaform from zxc union select plaform from zxc ),												
		// 					fgh as (select plaform ,1 as id  from rty ),
		// 					ghj as (select array_to_json(string_to_array(string_agg(servername,','),','))  as servername  ,1 as id from (select servername , 1 as id from asd ) a group by id )
		// 					select plaform,channel,servername   from fgh join dfg on fgh.id = dfg.id  join ghj  on ghj.id = dfg .id  where plaform = plaform
		// 	`;
		var plaform, channel, roleIds;
		if (allServerTrue){
			let querySql = `
			with 
				asd as ( select plaform,channel,id,servername from gm_server where servername in (${serverName.map(item => `'${item}'`)})),
				ghj as (select array_to_json(string_to_array(string_agg(servername,','),','))  as servername  ,1 as id from (select servername , 1 as id from asd ) a group by id ),																					
				ert as (select jsonb_array_elements(channel) as test from asd where plaform = plaform ),
				dfg as (select json_agg(test)  as channel,1 as id  from (select test ,1 as id  from ert GROUP BY test ) a  GROUP BY id ),
				qwe as (select array_to_json(string_to_array(string_agg(plaform,',') ,',')) as plaform,id from (select plaform ,1 as id from (select jsonb_array_elements_text(plaform) as plaform ,1 as id from (select plaform,1 as id  from asd) a )a  group by plaform  ) a  GROUP BY id )
				select plaform,channel  from (qwe join dfg on dfg.id = qwe.id) join ghj on ghj.id = qwe.id
			`;
			let DBres = await dbSequelize.query(querySql, {
				replacements:['active'], type:Sequelize.QueryTypes.SELECT
			});
			plaform = DBres[0]['plaform'];
			channel = DBres[0]['channel'];
			roleIds = ['全服邮件'];
		}else{
			let querySql = `with 
				asd as ( select plaform,channel,id,servername from gm_server where serverid::int  in (${roleId.map(item => item['serverid'])}) ),
				ghj as (select array_to_json(string_to_array(string_agg(servername,','),','))  as servername  ,1 as id from (select servername , 1 as id from asd ) a group by id ),																					
				ert as (select jsonb_array_elements(channel) as test from asd where plaform = plaform ),
				dfg as (select json_agg(test)  as channel,1 as id  from (select test ,1 as id  from ert GROUP BY test ) a  GROUP BY id ),
				qwe as (select array_to_json(string_to_array(string_agg(plaform,',') ,',')) as plaform,id from (select plaform ,1 as id from (select jsonb_array_elements_text(plaform) as plaform ,1 as id from (select plaform,1 as id  from asd) a )a  group by plaform  ) a  GROUP BY id )
				select plaform,channel ,servername from (qwe join dfg on dfg.id = qwe.id) join ghj on ghj.id = qwe.id
			`;
			let DBres = await dbSequelize.query(querySql, {
				replacements:['active'], type:Sequelize.QueryTypes.SELECT
			});
			plaform = DBres[0]['plaform'];
			channel = DBres[0]['channel'];
			serverName = DBres[0]['servername'];
		 roleIds = roleId.map(item=> item['id']);
		}
		let sql = ` 
		insert into  gm_smtp  
		(game_id,title,text,link,channel,plaform,annex,serverName,roleid,roleids,smtp_id,sendtime,is_use)
		values
		(${gameid},$title$${title}$title$,$text$${text}$text$,$link$${link}$link$,
		${channel ?`'${JSON.stringify(channel)}'`:null},
		${plaform ?`'${JSON.stringify(plaform)}'`:null},
		${Annex?Annex.length >1?`'[${Annex}]'` :`'[${Annex}]'`:null},
		${serverName ?`'${JSON.stringify(serverName)}'`:null},
		${roleIds?`'${JSON.stringify(roleIds)}'`:null},
		${JSON.stringify(roleId) === '""'?null:`'${JSON.stringify(roleId)}'`}
		,'${smtpId}','${sendDateTime}',true) RETURNING id
		`;
		let res = await dbSequelize.query(sql, {
			replacements:['active'], type:Sequelize.QueryTypes.INSERT
		});
		if(sendTime){
			 await this.mailSendTimely({gameid, id:res[0][0]['id']});
			
		}else{
			 await this.mailSendTiming({gameid, id:res[0][0]['id']});
		}
		return res[0][0];
	}
    
	async annexAllQuery(data){
		let {gameid } = data;
		let res = await dbSequelize.query(`select 
        name as label ,
        article_id as value  from gm_article where gameid=${gameid}
        
        `);
		return res[0];
        
	}
	async findServerName(data){
		let { gameid } = data;
		let sql = ' select * from ';
		let res = await dbSequelize.query(sql, {
			replacements:['active'], type:Sequelize.QueryTypes.SELECT
		});
	}
	async mailSendTimely(data){
		// let res = await Cp.post(gameid, 'mail/immediate', data);
		let res = await this.SenClient.get('mail', 'immediate', {body:data});
		let {code, data:CpData} = res;
		if(code === 200){
			return CpData;	
		}
		// console.log(res);
		throw new Error('邮件及时发送 失败');
		
	}
	async mailSendTiming(data){
		let {gameid, id} = data;
		let res = await  this.SenClient.get('mail', 'timedMail', {body:data});
		
		let {code, data:CpData} = res;
		if(+code !== +200 ){	
			// let sql = ` update gm_smtp   set status = 0 where id = '${id}' and game_id='${gameid}'`;
			// let ress = await dbSequelize.query(sql);
			throw {message:'邮件定时发送 失败'};
		}
	
		return res;	
	
	}
	async mailSendCancel(data){
		let { gameid, id } = data;
		let res = await  this.SenClient.get('mail', 'timedMailCancel', {body:data});
		let {code, data:CpData} = res;
		if(+code !== +200 ){	throw {message:'取消邮件定时发送失败'};}
		let sql = ` update gm_smtp   set status = 0 where id = '${id}' and game_id='${gameid}'`;
		let ress = await dbSequelize.query(sql);
		return ress;	
	
	}
	async maxID(data){
		let { gameid } = data;
		let sql = ` select MAX(id) from gm_smtp where game_id= ${gameid}`;
		let res = await dbSequelize.query(sql, {
			replacements:['active'], type:Sequelize.QueryTypes.SELECT
		});
		return res[0];
	}

}
export default new MailService();
