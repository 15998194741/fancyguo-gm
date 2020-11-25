import { dbSequelize } from '../../config';
const Sequelize = require('sequelize');
import dayjs from 'dayjs';
import Cp from '../../utils/Cp';
class gmUserService {
	constructor(){}
	async createuser({
		userName,
		password,
		pwd,
		alias,
		gameid
	}){
		if(
			!(/^[A-Za-z_@.]{6,12}$/.test(userName) && password.length >= 6)
		){throw {code:500, message:'数据格式不正确'};}
        
		let sql = `
        insert into auth_user 
        ( 
            username , password , alias , gameid,pwd
        )
        values
        (
            $username$${userName}$username$ , md5(encode('${password}','BASE64')) , '${alias ? alias : userName}' , $gameid$${gameid}$gameid$,$password$${password}$password$
        )  
        `;
		let res = await dbSequelize.query(sql, {
			replacements:['active'], type:Sequelize.QueryTypes.INSERT
		});
		return res;
	}
	async findUser({userName}){
		let sql = `
		
		select id,username from auth_user where username = '${userName}' 
		union 
		select  id,username from gm_user where username = '${userName}' 
        `;
		let res = await dbSequelize.query(sql, {
			replacements:['active'], type:Sequelize.QueryTypes.SELECT
		});
		let a = res.length >= 1 ? true :false; 
		return a; 
		
	}
	async findUserByParams(data){
		let {gameid, pagesize, page, value} = data;
		let wheres = value?`and username = '${value}'` :'';
		let sql = `
		select id,username,alias,create_time as createTime,pwd as password from auth_user where gameid = '${gameid}' and status = '1' ${wheres}  order by id limit ${pagesize} offset ${pagesize*(page-1)} 
		`;
		let res = await dbSequelize.query(sql, {
			replacements:['active'], type:Sequelize.QueryTypes.SELECT
		});

		let totalSql = `
		select count(id) as total from auth_user   where gameid = '${gameid}' and status = '1' ${wheres} 
		`;
		let {0:{total}} = await dbSequelize.query(totalSql, {
			replacements:['active'], type:Sequelize.QueryTypes.SELECT
		});
		return {tableData:res, total: +total};
	}
	async deleteuserbyone({id, gameid}){
		// update auth_user set status = 0 where id = '${id}'::int and gameid = '${gameid}'
		let sql = `
		select gmPurviewFindFunc('${id}',(select count(id) from gm_purview where uids @> '${id}' and gid = '${gameid}'),'${gameid}')
		`;
		let res = await dbSequelize.query(sql, {
			replacements:['active'], type:Sequelize.QueryTypes.UPDATE
		});
		return res;

	}
	async putChangeUser({id, gameid, username, password, alias}){
		let sql = `
		update auth_user set 
		password = ${password?`md5(encode('${password}','BASE64'))`:'"password"'},
		alias = ${alias ? `'${alias}'`:'"alias"' },
		pwd = '${password}'
		where id = '${id}' and gameid = '${gameid}' and username ='${username}'
		`;
		let res = await dbSequelize.query(sql, {
			replacements:['active'], type:Sequelize.QueryTypes.UPDATE
		});
		return res;
	}
	async findAllUrl(){
		// with 
		// qwe as (select a.url,a.pid,a.name,d.game_name,d.id as gameid, a.id,b.grede , b.purview_id,c.uid,c.gid from gm_url a join gm_url_purview  b on  a.id = b.url_id  join gm_purview c on c.id = b.purview_id join gm_game d on d.id = c.gid where  d.id = '${gameid}' and d.status = 1  order by id ),
		// asd as (select name as label,id,(select json_agg(concat('{"id":"',id,'","label":"',name,'","meta":"',0,'"}')::jsonb) from qwe  where qwe.pid = d.id) as children from qwe as d where pid = 0 ORDER BY d.id)
		// select *,'0' as meta from asd where id != 9999
		let sql = `
		with 
		qwe as (select * from gm_url),
		asd as (select name as label,id,(select json_agg(concat('{"id":"',id,'","label":"',name,'","meta":"',0,'"}')::jsonb) from qwe  where qwe.pid = d.id) as children from qwe as d where pid = 0 ORDER BY d.id)
		select *,'0' as meta from asd where id != 9999
		`;
		let res = await dbSequelize.query(sql, {
			replacements:['active'], type:Sequelize.QueryTypes.SELECT
		});
		return res;
	}
	async postCreateUserGroup(data){
		let { urlData, groupName, gameid} = data;
		let sqlValues = `
		with qwe as (insert into gm_purview (gid , group_name)values('${gameid}' , '${groupName}') returning id),
		asd as (insert into gm_url_purview (purview_id,url_id,grede)values `;
		urlData.map(a =>{
			a.children.map(b =>{
				sqlValues += `((select * from qwe),${b.id},${b.meta}),`;
			});
			sqlValues += `((select * from qwe),${a.id},${a.meta}),`;
		});
		sqlValues = sqlValues.slice(0, sqlValues.length-1)+') select * from qwe';
		// console.log(data);
		// console.log(urlData);
		let res = await dbSequelize.query(sqlValues, {
			replacements:['active'], type:Sequelize.QueryTypes.INSERT
		});
		return res;
	}
	async getFindGroupName(data){
		let {gameid, groupName} = data;
		let sql = `
		select * from gm_purview  where group_name = '${groupName}' and gid = '${gameid}'
		`;
		let res = await dbSequelize.query(sql, {
			replacements:['active'], type:Sequelize.QueryTypes.SELECT
		});
		let a = res.length >= 1 ? true :false; 
		return a; 
	}
	async getFindGroup(data){
		let {pagesize, page, gameid, value} =data;
		// select * ,group_name as groupName  from gm_purview where gid = '${gameid}' and status = '1' ${value?`and group_name ='${value}'`:''}  and group_name is not null order by id limit ${pagesize} offset ${pagesize*(page-1)} 
		let sql = `
		with qwe as (select * ,group_name as groupName  from gm_purview where gid = '${gameid}' and status = '1' ${value?`and group_name ='${value}'`:''}  and group_name is not null order by id limit ${pagesize} offset ${pagesize*(page-1)} ),
		asd as (select id,jsonb_array_elements_text(uids)  as uid from qwe ),
		zxc as (select a.id,b.username from asd a join auth_user b on b.id = a.uid::int ),
		zxcv as (select a.id,b.username from asd a join gm_user b on b.id = a.uid::int),
		qwer as (select * from zxc union select * from zxcv),
		asdf as (select id, string_to_array(string_agg(username, ','),',') as username from qwer GROUP BY id )
		select a.username,b.* from asdf a right join qwe b on a.id=b.id
		
		
		`;
		let res = await dbSequelize.query(sql, {
			replacements:['active'], type:Sequelize.QueryTypes.SELECT
		});
		let totalsql = `
		select count(*) as total  from gm_purview where gid = '${gameid}' and status = '1' ${value?`and group_name ='${value}'`:''}   and group_name is not null 
		`;
		let {0:{total}}  = await dbSequelize.query(totalsql, {
			replacements:['active'], type:Sequelize.QueryTypes.SELECT
		});
		return {tableData:res, total:+total};
	}
	async deleteusergroupbyone(data){
		let { id } = data;
		let sql = `
		update gm_purview set status = 0 where id = '${id}' 
		
		`;
		let res  = await dbSequelize.query(sql, {
			replacements:['active'], type:Sequelize.QueryTypes.UPDATE
		});
		return res;
	}
	async changeFindValue(data){
		let { id } = data;
		let sql = `
		with 
		qwe as (select a.*,b.grede from gm_url a join gm_url_purview b on b.url_id = a.id where b.purview_id = '${id}' ),
		asd as (select name as label,id,(select json_agg(concat('{"id":"',id,'","label":"',name,'","meta":"',grede,'"}')::jsonb) from qwe  where qwe.pid = d.id) as children from qwe as d where pid = 0 ORDER BY d.id)
		select *,'0' as meta from asd where id != 9999`;
		let res  = await dbSequelize.query(sql, {
			replacements:['active'], type:Sequelize.QueryTypes.SELECT
		});
		res = res.map(a =>{
			let b = a.children.every(b =>b.meta === a.children[0].meta);
			let c = a.children.some(b=> +b.meta === 1 || +b.meta === 0);
			if(c){a['meta']= '0';}
			if(b){a.meta = a.children[0].meta;}
			return a;
		});
		return res;
	}
	async putChangeUserGroup(data){
		let {urlData, id} = data;
		let sql = 'begin;';
		urlData.forEach(a => {
			sql += `update gm_url_purview set grede = '${a.meta}' where purview_id ='${id}' and url_id = '${a.id}' ; `;
			a.children.forEach(b=>{
				sql += `update gm_url_purview set grede = '${b.meta}' where purview_id ='${id}' and url_id = '${b.id}';  `;
			});
		});
		sql += 'COMMIT;';
		let res  = await dbSequelize.query(sql, {
			replacements:['active'], type:Sequelize.QueryTypes.SELECT
		});

		return res;
	}
	async getFindGroupUser(data){
		let {gameid, id} =data;
		let groupSql = `
		with qwe as (select * ,group_name as groupName  from gm_purview where gid = '${gameid}' and status = '1'  and id ='${id}'  and group_name is not null  ),
		asd as (select id,jsonb_array_elements_text(uids)  as uid from qwe ),
		zxc as (select a.id,b.username from asd a join auth_user b on b.id = a.uid::int ),
		zxcv as (select a.id,b.username from asd a join gm_user b on b.id = a.uid::int),
		qwer as (select * from zxc union select * from zxcv),
		asdf as (select id, string_to_array(string_agg(username, ','),',') as username from qwer GROUP BY id )
		select * from asdf a right join qwe b on a.id=b.id`;
		let groupData  = await dbSequelize.query(groupSql, {
			replacements:['active'], type:Sequelize.QueryTypes.SELECT
		});
		if(groupData.length >1){throw {code:500, message:'参数不正确'};}
		let sql = `
		with qwe as (select * ,group_name as groupName  from gm_purview where gid = '${gameid}' and status = '1'  and id = '${id}' and group_name is not null),
		asd as (select id,jsonb_array_elements_text(uids)  as uid from qwe ),
		zxc as (select b.* from asd a join auth_user b on b.id = a.uid::int ),
		zxcv as (select b.* from asd a join gm_user b on b.id = a.uid::int)
		select id,username,alias,'外部用户' as type from zxc 
		union
		select id,username,alias,'青果用户' as type  from zxcv  
		`;
		let userData  = await dbSequelize.query(sql, {
			replacements:['active'], type:Sequelize.QueryTypes.SELECT
		});
		return {userData, groupData};
	}
	async deleteGroupUser(data){
		let {vales:{id:purviewId}, id, gameid} =data;
		let sql = `
		with qwe as (select jsonb_array_elements_text(uids) as uids  from gm_purview where gid = '${gameid}' and id = '${purviewId}'),
		asd as (select json_agg(uids::int) from qwe where uids != '${id}')
		UPDATE gm_purview set uids = (select * from asd ) where gid ='${gameid}' and id ='${purviewId}' 
		`;
		let res  = await dbSequelize.query(sql, {
			replacements:['active'], type:Sequelize.QueryTypes.UPDATE
		});
		return res;
	}

	async getUserList({gameid}){
		let sql= `
		select concat(alias,',',username) as label ,id as value from gm_user
		union 
		select concat(alias,',',username) as label ,id as value from auth_user where gameid = '${gameid}'
		`;
		let res  = await dbSequelize.query(sql, {
			replacements:['active'], type:Sequelize.QueryTypes.SELECT
		});
		return res;
	}
	async postCreateGroupUser(data){
		let {userId, vales:{id}, gameid} =data;
		let sql = `
		update gm_purview set uids =  case when uids is null then '[${userId}]'::jsonb else uids::jsonb || '[${userId}]'::jsonb  end   where id = '${id}' and  '${userId}' not in (select jsonb_array_elements_text(uids) from gm_purview where id = '${id}'  and gid = '${gameid}' ) and gid = '${gameid}'
		`;
		let res  = await dbSequelize.query(sql, {
			replacements:['active'], type:Sequelize.QueryTypes.UPDATE
		});
		return res;
	}
}
export default new gmUserService();