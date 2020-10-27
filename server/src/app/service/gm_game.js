import { dbSequelize } from '../../config';
const Sequelize = require('sequelize');
import dayjs from 'dayjs';
import Cp from '../../utils/Cp';
class gmGameService {
	constructor(){}


	async gameList(data){
		let { gameid } = data;
		let sql = `
        SELECT id,super_user_id as userId,game_name as gamename ,image_url as url ,false as movehover FROM "gm_game"  where case when 5 = '${gameid}'::int then id != '5' else id = '${gameid}' end and status = '1'`;
		let res = await dbSequelize.query(sql, {
			replacements:['active'], type:Sequelize.QueryTypes.SELECT
		});
		return res;
	}
	async gmUser(data){
		let sql = 'select concat(alias,\',\',nick_name) as label ,id as value from gm_user';
		let res = await dbSequelize.query(sql, {
			replacements:['active'], type:Sequelize.QueryTypes.SELECT
		});
		return res;
	}
	async creategame({request:{ files:{file} }, data}){
		const path = require('path');
		const fs = require('fs');
		// 上传单个文件
		file; // 获取上传文件
		let fileType = /(.*)[.jpg,.jpeg,.png]$/;
		if(!fileType.test(file.name)){return '文件格式不正确';}
		let filePath= await new Promise((resolve, reject)=>{
			// 创建可读流
			const reader = fs.createReadStream(file.path);
			let imgName = `${new Date().getTime()}${file.name}`;
			let filePath = path.join(__dirname, '../../images/game/') + imgName;
			// 创建可写流
			const upStream = fs.createWriteStream(filePath);
			// 可读流通过管道写入可写流
			reader.pipe(upStream);
			reader.on('end', async(err)=>{
				if(err){
					reject(false);
				}
				resolve(imgName);
			});
		});
		let {gameName, userId} = data;
		let sql = `
		with qwe as (insert into gm_game ( game_name,image_url,super_user_id) values('${gameName}','http://106.75.7.83/images/game/${filePath}','${userId}') RETURNING id ),
		asd as (insert into gm_purview (uids,gid)values('[${userId}]',(select * from qwe )) returning id),
		ert as (select * from 
								(select id as purview_id, 1 as  joinnum  from asd ) a join 
								(select id as url_id,1 as  joinnum from gm_url ) b on a.joinnum = b.joinnum join 
								(select 1 as grede ,1 as joinnum) c on c.joinnum = b.joinnum
		),
		zxc as (insert into gm_url_purview (purview_id ,grede,url_id) select    purview_id,grede,url_id  from ert),		
		xcv as (insert into gm_game_token (type,gameid
			)values('event',(select * from qwe)
			),(
			'user',(select * from qwe)))
		select * from qwe `;
		// let tests = `
		// insert into gm_game_token (gameid,type)
		// values
		// (,'user') 
		// `;
		console.log(sql);
		let res = await dbSequelize.query(sql, {
			replacements:['active'], type:Sequelize.QueryTypes.INSERT
		});
		return res;
	}
	async deleteGame(data){
		let { id } = data;
		let sql = `
		update gm_game set status = '0' where id = '${id}'::int `;
		let res = await dbSequelize.query(sql, {
			replacements:['active'], type:Sequelize.QueryTypes.UPDATE
		});
		return res;

	}
	async changeGame({request:{ files:{file} }, data}){
		let {iamgeChange, gameNameChange, userIdChange, id, gameName, userId}=data;
		if(!(iamgeChange ||  gameNameChange ||  userIdChange)){throw {code:500, message:'没有值改 你干啥玩意'};}
		
		// let res =await dbSequelize.query(sql);
		// console.log(res);
		let a = async ( file, id) =>{
			let filePath = 'http://106.75.7.83/images/game/' + await this.fileUpload(file);
			let sql = `update gm_game set  image_url = '${filePath}'  where id ='${id}'::int;`;
			return sql;
		};
		let b = ( id, game) => {
			let sql = `update gm_game set  game_name = '${game}'  where id ='${id}'::int; `;
			return sql;
		};
		let c = ( id, userId) =>{
			let sql = `
with asd as (select super_user_id ,id from gm_game  where id = '${id}'::int) ,
qwe as (update "gm_game" set super_user_id = '${userId}'::int where id = '${id}'::int RETURNING super_user_id),
zxc as (update gm_purview set uids = '[${userId}]' where gid = (select id from asd) and uids = (select concat('[',super_user_id,']')::jsonb from asd)  RETURNING id  )
select * from zxc;
			
			`;
			// 			with asd as (select super_user_id ,id from gm_game  where id = '${id}'::int) ,
			// qwe as (update "gm_game" set super_user_id = '${userId}'::int where id = '${id}'::int RETURNING super_user_id),
			// zxc as (update gm_purview set uid = (select * from qwe) where gid = (select id from asd) and uid = (select super_user_id from asd)  RETURNING id  )
			// select * from zxc;
			return sql;
		};

		let sql =` 
		begin;
		${iamgeChange?await a( file, id):''}
		${gameNameChange?b( id, gameName):''}
		${userIdChange?c( id, userId):''}
		COMMIT;
		`;
		let res = await dbSequelize.query(sql, {
			replacements:['active'], type:Sequelize.QueryTypes.UPDATE

		});
		return res;
	
		// switch ('true') {
		// 	case iamgeChange:
		// 		filePath = 'http://106.75.7.83/images/game/' + this.fileUpload(file);
		// 		sql += `update gm_game set  image_url = ${filePath}  where id ='${id}'::int `;
		// 		break;
		// 	case gameNameChange:
				
		// 		break;
		// 	case userIdChange:
				
		// 		break;
		
		// 	default:
		// 		break;
		// }
		// return data;
	}
	async fileUpload(file){
		const path = require('path');
		const fs = require('fs');
		// 上传单个文件
		file; // 获取上传文件
		let fileType = /(.*)[.jpg,.jpeg,.png]$/;
		if(!fileType.test(file.name)){return '文件格式不正确';}
		let filePath= await new Promise((resolve, reject)=>{
			// 创建可读流
			const reader = fs.createReadStream(file.path);
			let imgName = `${new Date().getTime()}${file.name}`;
			let filePath = path.join(__dirname, '../../images/game/') + imgName;
			// 创建可写流
			const upStream = fs.createWriteStream(filePath);
			// 可读流通过管道写入可写流
			reader.pipe(upStream);
			reader.on('end', async(err)=>{
				if(err){
					reject(false);
				}
				resolve(imgName);
			});
		});
		return filePath;
	}
	async changeGameConfig({data:{userName,	userToken,	eventName,	eventToken,	gameid } }){
		let  sql = `
		update gm_game_token set token = '${userToken}' ,tablename = '${userName}' where gameid = '${gameid}' and "type" = 'event';
		update gm_game_token set token = '${eventToken}' ,tablename = '${eventName}' where gameid = '${gameid}' and "type" = 'user';
		`;
		let res = await dbSequelize.query(sql, {
			replacements:['active'], type:Sequelize.QueryTypes.UPDATE

		});
		return res;
		
	}
}
export default new gmGameService();