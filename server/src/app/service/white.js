import { dbSequelize } from '../../config';
const Sequelize = require('sequelize');
import dayjs from 'dayjs';
import Cp from '../../utils/Cp';
import send from 'koa-send';
class whiteServer {
	constructor(){}


	async mailCreate(data){
		let { title, text, sendType, cycle, annex, gameid} = data;
		let {user} = data;
		let annexs = [];
		for(let i of annex ){
			annexs.push({
				name:i['annexName'][1],
				number:Number(i['annexNumber'])
			});	
		
		}
		
		let sql=`
		insert into gm_white_smtp 
		( create_user_id , game_id ,  title,text,sendtype ,cycle,annex)
		values 
		('${user['id']}'  , '${gameid}','${title}','${text}',${!!sendType},'${cycle}','${JSON.stringify(annexs)}')
		returning id
		`;
		let res = await dbSequelize.query(sql, {
			replacements:['active'], type:Sequelize.QueryTypes.INSERT
		});
		return res[0][0];
		// console.log(sql);
	}
	async whiteFindAll(data){
		let {gameid, page, pagesize, type, value} = data;
		let where = value?` and w.id = '${value}'::int `:''; 
		where += type?` and w.sendtype = ${!!(type === 'true')}`:'';
		let sql = `
		select w.*,(case when w."sendtype" then '周期' else '单次' end ) as type,(case when w."sendtype" = false then '单次' when w."cycle" = 'month' then '每月' when w."cycle" = 'week' then '每周'  end) as cycles ,a.annexnames from (select 
			string_to_array(string_agg(concat(name,'  ',number,'个'),','),',') as annexnames,id
			from (select w.*,a.name from 
			(select jsonb_array_elements(annex) ->> 'name' as nameid  ,
			 jsonb_array_elements(annex) ->> 'number' as number
			,id from gm_white_smtp) w join gm_article a on a.article_id=w.nameid ) a   group by id ) a join gm_white_smtp  w on a.id = w.id where w.game_id = '${gameid}'  and w.status = '1' ${ where} ORDER BY w.id desc  limit ${pagesize} offset ${pagesize*(page-1)}
		`;
		let res = await dbSequelize.query(sql, {
			replacements:['active'], type:Sequelize.QueryTypes.SELECT
		});
		let totalSql = `select count(id) as total from  gm_white_smtp  w where w.game_id ='${gameid}' and status = '1' ${ where} `;
		let total = await dbSequelize.query(totalSql, {
			replacements:['active'], type:Sequelize.QueryTypes.SELECT
		});
		 total = total[0]['total'];
		return {res, total};
	}
	async whiteFindName(data){
		let {gameid} = data;
		let sql = `
		select string_to_array(string_agg(a,','),',') as "1", string_to_array(string_agg(b,','),',') as "2" from (select case when sendtype then string_agg(title ,',')  end  as a  ,1 as id , case when not  sendtype then string_agg(title ,',')  end  as b from gm_white_smtp where game_id = '${gameid}'  and status = '1'  GROUP BY sendtype) a GROUP BY id
		`;
		let res = await dbSequelize.query(sql, {
			replacements:['active'], type:Sequelize.QueryTypes.SELECT
		});
		if(res.length === 0){
			return;
		}
		let value = res[0];
		value['1'] = value['1'].map(item=>({value:item, label:item})); 
		value['2'] = value['2'].map(item=>({value:item, label:item})); 
		return value;
	}
	async whiteStopMail(data){
		let {gameid, id } =data;
		let querysql = `
		select count(id) from gm_white_user where smtp_id = '${id}' and status = '1' 
		`;
		let count = await dbSequelize.query(querysql, {
			replacements:['active'], type:Sequelize.QueryTypes.SELECT
		});
		
		if(+count[0]['count'] !== 0 ){
			throw new Error('此邮件有白名单用户存在！！！');
		}
		let sql = `
		update  gm_white_smtp set  status = '0' where game_id = '${gameid}' and id ='${id}'
		`;
		let res = await dbSequelize.query(sql, {
			replacements:['active'], type:Sequelize.QueryTypes.UPDATE
		});
		return res;
	}
	async findTitle(data){
		let {gameid} =data ;
		let sql = `
		select title from gm_white_smtp where game_id ='${gameid}' and status = '1'
		`;
		let res = await dbSequelize.query(sql, {
			replacements:['active'], type:Sequelize.QueryTypes.SELECT
		});
		return res;
	}

	async WhiteMailChange(data){
		let {gameid, id, annex} =data;
		let annexs = [];
		for(let i of annex ){
			annexs.push({
				name:i['annexName'][1],
				number:Number(i['annexNumber'])
			});	
		}
		let sql = `
		update gm_white_smtp set annex = '${JSON.stringify(annexs)}' where id ='${id}'::int and game_id = '${gameid}'
		`;
		let res = await dbSequelize.query(sql, {
			replacements:['active'], type:Sequelize.QueryTypes.UPDATE
		});
		if(+res[1] !== 1){
			throw new Error('服务器出错联系管理员。');
		}
		// return res;
	}
	async mailRelatedUser(data){
		let {roleId, name, type, notebook, gameid} = data;
		let {user} =data;

		let sql = `
		insert into gm_white_user (
			game_id,notebook,roleid,smtp_id,plaform,channel,roleids,type,servername,create_user_id
			)values(
			'${gameid}','${notebook}','${JSON.stringify(roleId)}',(select id from  gm_white_smtp where title = '${name}'),
			(select array_to_json(string_to_array(string_agg(plaform, ','), ',')) as plaform from (select * from (select jsonb_array_elements_text(plaform) as plaform  from (		select plaform ,1 as id  from gm_server where  '[${roleId.map(item => item['serverid'])}]'::jsonb @> serverid::varchar::jsonb 
			) a ) a GROUP BY plaform)a ),
			(select array_to_json(string_to_array(string_agg(channel, ','), ',')) as channel from (select * from (select jsonb_array_elements_text(channel) as channel  from (		select channel ,1 as id  from gm_server where  '[${roleId.map(item => item['serverid'])}]'::jsonb @> serverid::varchar::jsonb 
				) a ) a GROUP BY channel)a ),'${JSON.stringify(roleId.map(item => item['id']))}'
			,'${type?'周期':'单次'}',
			(
				select array_to_json(string_to_array(string_agg(servername, ','), ',')) as servername from (select * from (select servername  from (              select servername ,1 as id  from gm_server where  '[${roleId.map(item => item['serverid'])}]'::jsonb @> serverid::varchar::jsonb
                        ) a ) a GROUP BY servername)a 
			),'${user['id']}'
			) returning id 
		`;
		// console.log(sql);
		let res = await	dbSequelize.query(sql, {
			replacements:['active'], type:Sequelize.QueryTypes.INSERT
		});
		// let id = res[0][0]['id'];
		// await this.sendWhiteMail({id, gameid});
		return res;
	}
	async servernameComponents(data){
		let { gameid } = data;
		let sql = `
		select servername as label,servername as value  from (select jsonb_array_elements_text(servername) as servername   from gm_white_user  where game_id = '${gameid}')a  group BY servername
		`;
		let res = await	dbSequelize.query(sql, {
			replacements:['active'], type:Sequelize.QueryTypes.SELECT
		});
		return res;
	}
	async channelComponents(data){
		let { gameid } = data;
		let sql = `
		select servername as label,servername as value  from (select jsonb_array_elements_text(channel) as servername   from gm_white_user  where game_id = '${gameid}')a  group BY servername
		`;
		let res = await	dbSequelize.query(sql, {
			replacements:['active'], type:Sequelize.QueryTypes.SELECT
		});
		return res;
	}
	async find(data){
		let getType = data => Object.prototype.toString.call(data).split(' ')[1].slice(0, -1);
		let {value, gameid, pagesize, page} = data;
		let {plaform, channel, servername, type} =data; 
		let condition =  `where game_id = '${gameid}' and status = '1' `;
		if(value){
			condition +=` and roleids @> '[${value}]' `;
		}
		if(plaform){
			condition += getType(plaform)==='String'?` and plaform =  '[${JSON.stringify(plaform)}]' `:`  and plaform @> '${JSON.stringify(plaform)}'  and  jsonb_array_length(plaform) = jsonb_array_length('${JSON.stringify(plaform)}'::jsonb)`;
		}
		if(channel){
			condition += getType(channel)==='String'?` and channel =  '[${JSON.stringify(channel)}]' `:`  and channel @> '${JSON.stringify(channel)}'  and  jsonb_array_length(channel) = jsonb_array_length('${JSON.stringify(channel)}'::jsonb)`;
		}
		if(servername){
			condition += getType(servername)==='String'?` and servername =  '[${JSON.stringify(servername)}]' `:`  and servername @> '${JSON.stringify(servername)}'  and  jsonb_array_length(servername) = jsonb_array_length('${JSON.stringify(servername)}'::jsonb)`;
		}
		if(type){
			condition += ` and type = '${type}'`;
		}
		let sql = `select *,(select count(*) from  gm_white_user ${condition} ) as total , 
		(select array_to_json(string_to_array(string_agg(plaform,','),','))from(  select case when  value = '1' then '安卓' when  value = '2' then '苹果' end as plaform   ,1 as id from jsonb_array_elements_text(plaform) a   )a  group by id 
)  as plaforms
			from gm_white_user ${condition} ORDER BY create_time desc limit ${pagesize} offset ${pagesize*(page-1)}`;
		let res = await	dbSequelize.query(sql, {
			replacements:['active'], type:Sequelize.QueryTypes.SELECT
		});
		return res;
	}
	// async sendWhiteMail(data){
	// 	let { id, gameid }= data;
	// 	let  res = await Cp.post(gameid, 'white/create', {id});
	// 	return res;
	// 	// console.log(res);
	// }
	async stopWhiteMail(data){
		let {gameid, id} = data;
		let sql = `
		update gm_white_user set status = '0' where id = '${id}'::int and game_id = '${gameid}'
		`;
		let res = await	dbSequelize.query(sql, {
			replacements:['active'], type:Sequelize.QueryTypes.UPDATE
		});
		return res;
	}
	async recordLookup(data){
		// console.log(data);
		let {gameid, key, value, page, pagesize} =data;
		let roleidWhere = '';
		let mailWhere = '';
		if(value){
			roleidWhere = key === 'roleid'?` where roleid = '${value}'`:'';
			mailWhere = key === 'mailid'?`and smtp_id= '${value}'`:'';
		}
		let sql =`
		with qwe as (select roleid,serverid,white_user_id,sendtime from gm_white_recording  ${roleidWhere}),
		asd as (select * from gm_white_user where id::varchar in (select white_user_id from qwe) and game_id = '${gameid}'  ${mailWhere} )
		select qwe.roleid as recoreroleid,qwe.sendtime as sendtime,qwe.serverid,asd.* from asd join qwe on asd.id::varchar = qwe.white_user_id ORDER BY create_time desc limit ${pagesize} offset ${pagesize*(page-1)}
`;
		let tableData = await dbSequelize.query(sql, {
			replacements:['active'], type:Sequelize.QueryTypes.SELECT
		});
		let totalSql = `
		with qwe as (select roleid,serverid,white_user_id,sendtime from gm_white_recording  ${roleidWhere}),
		asd as (select * from gm_white_user where id::varchar in (select white_user_id from qwe) and game_id = '${gameid}'  ${mailWhere} )
		select count(*) from asd join qwe on asd.id::varchar = qwe.white_user_id `;
		let total = await dbSequelize.query(totalSql, {
			replacements:['active'], type:Sequelize.QueryTypes.SELECT
		});
		total = total[0]['count'];
		return {tableData, total};
	}
}
export default new whiteServer();