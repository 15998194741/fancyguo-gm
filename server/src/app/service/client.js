import { dbSequelize } from '../../config';
const Sequelize = require('sequelize');


class clientService{
	constructor() {}
	async create(data){
		let {versionId, plaform, channel, showType, gameid} =data;
		let {user} = data;
		let sql = `
        insert into gm_client 
        (version_id,plaform,channel,is_show_type,game_id,create_user_id)
        values
        ('${versionId}','${JSON.stringify(plaform)}','${JSON.stringify(channel)}','${JSON.stringify(showType)}','${gameid}','${user['id']}')
        `;
		// console.log(sql);
		let res = await dbSequelize.query(sql, {
			replacements:['active'], type:Sequelize.QueryTypes.INSERT
		});
		return res;
		// return;
	}
	async find(data){
		let {page, pagesize, gameid, value, plaform, channel, isShowType} =data;
		let getType = data => Object.prototype.toString.call(data).split(' ')[1].slice(0, -1);
		let condition = ` where game_id = '${gameid}' and status ='1' `;  
		if(value){
			condition += ` and version_id = '${value}' `;
		}
		if(plaform){
			condition += getType(plaform)==='String'?` and plaform =  '[${JSON.stringify(plaform)}]' `:`  and plaform @> '${JSON.stringify(plaform)}'  and  jsonb_array_length(plaform) = jsonb_array_length('${JSON.stringify(plaform)}'::jsonb)`;
		}
		if(isShowType){
			condition += getType(isShowType)==='String'?` and is_show_type =  '[${JSON.stringify(isShowType)}]' `:`  and is_show_type @> '${JSON.stringify(isShowType)}'  and  jsonb_array_length(is_show_type) = jsonb_array_length('${JSON.stringify(isShowType)}'::jsonb)`;
		}
		if(channel){
			condition += getType(channel)==='String'?` and channel =  '[${JSON.stringify(channel)}]' `:`  and channel @> '${JSON.stringify(channel)}'  and  jsonb_array_length(channel) = jsonb_array_length('${JSON.stringify(channel)}'::jsonb)`;
		}
		let sql = `
        select *,(case when plaform = '["1"]' then '["安卓"]'::jsonb when plaform = '["2"]' then '["苹果"]'::jsonb when   plaform @> '["1","2"]'::jsonb then '["安卓","平果"]'::jsonb end)
         as plaforms,(select count(*) from gm_client ${condition}) as total  from gm_client ${condition} ORDER BY id desc limit ${pagesize} offset ${pagesize*(page-1)}
        `;
		let res = await dbSequelize.query(sql, {
			replacements:['active'], type:Sequelize.QueryTypes.SELECT
		});
        
		return res;
	}
	async channelfind(data){
		let {gameid} = data;
		let sql = `
        select jsonb_array_elements_text(channel) as label,jsonb_array_elements_text(channel)  as value  from gm_client where game_id = '${gameid}' and status='1'
        union 
        select jsonb_array_elements_text(channel) as label,jsonb_array_elements_text(channel)  as value from gm_client where game_id = '${gameid}' and status='1'
        `;
		let res = await dbSequelize.query(sql, {
			replacements:['active'], type:Sequelize.QueryTypes.SELECT
		});
		return res;
	}
	async versionidall(data){
		let {gameid} = data;
		let sql = `
        select string_to_array(string_agg( version_id  , ','),',')  as  versionId from (select version_id,1 as id  from gm_client  where game_id = '${gameid}' and status ='1' GROUP BY version_id )a GROUP BY id
        `;
		let res = await dbSequelize.query(sql, {
			replacements:['active'], type:Sequelize.QueryTypes.SELECT
		});
		return res[0];
	}
	async stopClient(data){
		let {id, gameid } =data;
		let { user } =data;
		let sql = `
        update gm_client set status = '0' ,update_user_id = '${user['id']}' where id ='${id}' and game_id ='${gameid}' returning * 
        `;
		let res = await dbSequelize.query(sql, {
			replacements:['active'], type:Sequelize.QueryTypes.UPDATE
		});
		return res[0];
	}
	async changeClient(data){
		let {type, id, user, gameid} = data;
		let sql = `
        update gm_client set is_show_type = '${JSON.stringify(type)}' , update_user_id  =  '${user['id']}' where game_id = '${gameid}' and id in(${id.map(item => `'${item}'`)})    returning *
        `;
		let res = await dbSequelize.query(sql, {
			replacements:['active'], type:Sequelize.QueryTypes.UPDATE
		});
		return res[0];
	}
}


export default new clientService();