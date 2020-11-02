import { dbSequelize } from '../../config';
const Sequelize = require('sequelize');
import dayjs from 'dayjs';
import Cp from '../../utils/Cp';
class gmChannelService {
	constructor(){}
	async createchannel(data){
		let {channelName, gameid, channelId} = data;
		let sql =`
        insert into gm_game_channel (channel,channel_id,gameid)values('${channelName}','${channelId}','${gameid}')`;
		let res = await dbSequelize.query(sql, {
			replacements:['active'], type:Sequelize.QueryTypes.INSERT
		});
		return res;
	}
	async findChannel(data){
		let { gameid, value, type} =data;
		let sql = `
        select channel,channel_id  as id from gm_game_channel where gameid =  '${gameid}' and case when ${type==='true'} then  channel ='${value}'  else channel_id::varchar = '${value}' end  and status = 1
		`;
		console.log(sql);
		let res = await dbSequelize.query(sql, {
			replacements:['active'], type:Sequelize.QueryTypes.SELECT
		});
		return res.length >= 1 ? true: false;
	}
    
	async findChannelById(data){
		let { gameid, value, page, pagesize} =data;
		let sql = `
        select  * from   gm_game_channel    where  gameid =  '${gameid}' and status = '1'  ${value?` and channel  ='${value}'  `:''} order by id limit ${pagesize} offset ${pagesize*(page-1)}
        `;
		let tableData = await dbSequelize.query(sql, {
			replacements:['active'], type:Sequelize.QueryTypes.SELECT
		});
		let totalSql = `
        select  count(*) from   gm_game_channel    where  gameid =  '${gameid}' and status = '1'  ${value?` and channel  ='${value}'  `:''} 
        `;
		let totals = await dbSequelize.query(totalSql, {
			replacements:['active'], type:Sequelize.QueryTypes.SELECT
		});
		let total = totals[0]['count'];
		return {tableData, total };
	}
	async deleteChannel(data){
		let {id, gameid, channel} = data;
		let sql = `
		select (select count(id) from gm_client  where channel @> '"${channel}"' and status = 1 and game_id = '${gameid}') + 
		(select count(id) from gm_announcement where client @> '{${channel}}' and status = 1 and game_id = '${gameid}') +
		(select count(id) from gm_cdk  where channel @> '"${channel}"' and status = 1 and game_id ='${gameid}' )+
		(select count(id) from gm_server  where channel @> '"${channel}"' and status = 1 and gameid ='${gameid}' )+
		(select count(id) from gm_smtp  where channel @> '"${channel}"' and status = 1 and game_id ='${gameid}' )+
		(select count(id) from gm_white_user  where channel @> '"${channel}"' and status = 1 and game_id ='${gameid}' ) as total
		`;
		let res = await dbSequelize.query(sql, {
			replacements:['active'], type:Sequelize.QueryTypes.SELECT
		});
		if(+res[0].total === 0 ){
			let sql = `
			 update gm_game_channel set status = '0' where id = '${id}' and gameid='${gameid}'`;
			 await dbSequelize.query(sql, {
				replacements:['active'], type:Sequelize.QueryTypes.UPDATE
			});
			return false;
		}
		return true;
	}
	async forceDelete(data){
		let {id, gameid} =data;
		let sql =`
		with asd as (update gm_game_channel set status = '0' where id = '${id}' and gameid='${gameid}' returning channel  )
		select deleteChannel('${gameid}',channel ) from asd `;
		let res = await dbSequelize.query(sql, {
			replacements:['active'], type:Sequelize.QueryTypes.UPDATE
		});
		return res;
	}
	async putChangeChannel(data){
		let {channelName, channelId, gameid, id} = data;
		let sql = `
		with qwe as (select * from gm_game_channel where id = '${id}' and gameid = '${gameid}' limit 1 ),
			asd as (update gm_game_channel set channel = '${channelName}' , channel_id = '${channelId}' where id = '${id}' and gameid = '${gameid}' returning *)
			select channelChangePut('${channelName}',(select channel from qwe limit 1 ),'${gameid}'::int)
		`;
		let res = await dbSequelize.query(sql, {
			replacements:['active'], type:Sequelize.QueryTypes.UPDATE
		});
		return res;
	}
}
export default new gmChannelService();