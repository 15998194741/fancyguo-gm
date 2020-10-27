import { dbSequelize } from '../../config';
const Sequelize = require('sequelize');
import dayjs from 'dayjs';
import Cp from '../../utils/Cp';
class gmLogsService {
	constructor(){}
	async classification(data){
		console.log(data);
		let { gameid } = data;
		let sql = `select classification as label , classification as value  from gm_logs   where  game_id = $gameid$${gameid}$gameid$ GROUP BY classification `;
		let res = await dbSequelize.query(sql, {
			replacements:['active'], type:Sequelize.QueryTypes.SELECT
		});
		return res;
	}
	async querydata(data){
		let {page, pagesize, value, gameid} = data;
		let sql = `
        select * , (nick_name || "alias" ) as  usernames from gm_logs  where game_id= $$${gameid}$$ and classification = $classification$${value}$classification$  ORDER BY  operating_time  desc  limit ${pagesize} OFFSET ${(page-1)*pagesize} `;
		let res = await dbSequelize.query(sql, {
			replacements:['active'], type:Sequelize.QueryTypes.SELECT
		});
		let totalSql = `
        select count(*) as total from gm_logs  where game_id= $$${gameid}$$ and classification = $classification$${value}$classification$ `;
		let totalData = await dbSequelize.query(totalSql, {
			replacements:['active'], type:Sequelize.QueryTypes.SELECT
		});
		let {0:{total}} = totalData;
		return {res, total};

	}
}
export default new gmLogsService();