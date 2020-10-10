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
			!(/^[A-Za-z_@.]{6,12}$/.test(userName) && pwd==password && password.length >= 6)
		){throw {code:500, message:'数据格式不正确'};}
        
		let sql = `
        insert into auth_user 
        ( 
            username , password , alias , gameid
        )
        values
        (
            '${userName}' , md5(encode('${password}','BASE64')) , '${alias?alias:userName}' , '${gameid}'
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
		select id,username,alias,create_time as createTime from auth_user where gameid = '${gameid}' and status = '1' ${wheres}  order by id limit ${pagesize} offset ${pagesize*(page-1)} 
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
		let sql = `
		update auth_user set status = 0 where id = '${id}'::int and gameid = '${gameid}'
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
		alias = ${alias ? `'${alias}'`:'"alias"' }
		where id = '${id}' and gameid = '${gameid}' and username ='${username}'
		`;
		console.log(sql);
		let res = await dbSequelize.query(sql, {
			replacements:['active'], type:Sequelize.QueryTypes.UPDATE
		});
		return res;
	}
}
export default new gmUserService();