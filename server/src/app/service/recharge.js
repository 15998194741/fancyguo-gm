import Cp from '../../utils/Cp';
import { dbSequelize } from '../../config';
import dayjs from 'dayjs';
var mysql  = require('mysql');  
 
var connection = mysql.createConnection({     
	host     : '117.50.10.34',       
	user     : 'gmfancyguo',              
	password : 'gmfancyguo!',       
	port: '3306',                   
	database: 'sdk' 
}); 
connection.connect();

class rechargeService{
	constructor() {
		// const { SenecaClient } = require('../../xiaolu/senecaclient');
		// this.SenClient = new SenecaClient('127.0.0.1', 10002, 'tcp');
		let { a } = require('../../xiaolu/senecaclient');
		this.SenClient = a;

		var mysql  = require('mysql');  
		var connection = mysql.createConnection({     
			host     : '117.50.10.34',       
			user     : 'gmfancyguo',              
			password : 'gmfancyguo!',       
			port: '3306',                   
			database: 'sdk' 
		}); 
		connection.connect();
	}

	async query(data){
		var mysql  = require('mysql');  
		var connection = mysql.createConnection({     
			host     : '117.50.10.34',       
			user     : 'gmfancyguo',              
			password : 'gmfancyguo!',       
			port: '3306',                   
			database: 'sdk' 
		}); 
		connection.connect();
		let {roleid, stime, plaform, servername, page, pagesize, gameid} = data;
		let srttime = data['srttime[]'];
		let channel = data['channel[]'];
		let serverid ;
		if(servername){
			 serverid = await dbSequelize.query(`select serverid from gm_server where  servername ='${servername}' `);
			serverid = serverid[0][0].serverid;		
		}
		let where = `where  appid ='${gameid}'`;
		where += !channel?'':typeof channel === 'string'?` and channel =  '${channel}'`:` and channel in (${channel.map(item=>`'${item}'`).join(',')})`;
		where += !roleid?'':` and roleid='${roleid}'`;
		where += !srttime?'':` and a.createdAt between '${dayjs(srttime[0]).format('YYYY-MM-DD HH:mm:ss')}' and '${dayjs(srttime[1]).format('YYYY-MM-DD HH:mm:ss')}'`;
		where += !plaform ?  '' :plaform === '2'?' and type = \'apple\' ':plaform==='1'?' and type in (\'union\',\'alipay\',\'wechat\') ' :'';
		where += !serverid?'':` and serverId = '${serverid}'`;
		var sql = `SELECT 
        roleId,roleName,platform,a.uid,pid,channel,deviceid,isOK,isSend,serverId,price,tid,a.createdAt,a.updatedAt ,type
        FROM  pay AS a 
        RIGHT JOIN  
        users AS b 
        ON a.uid=b.uid 
       ${where}
       limit ${pagesize}
       offset ${pagesize*(page-1)} 
        `;
		let totalsql = `SELECT 
        count(*) as total
        FROM  pay AS a 
        RIGHT JOIN  
        users AS b 
        ON a.uid=b.uid 
       ${where}`;
		let res = await new Promise((resolve, reject)=>{
			connection.query(sql, async(err, result)=>{
				if(err){
					console.log(err);
					return;
				}
				return resolve(result);
            
			});
		});
		let total = await new Promise((resolve, reject)=>{
			connection.query(totalsql, async(err, result)=>{
				if(err){
					// console.log(err);
					return reject(err);
				}
				return resolve(result);
            
			});
		});
		res = JSON.parse(JSON.stringify(res));
		total = total[0].total;
		
		connection.end();
		return {res, total};
	}
	async replenishment(data){
		let { code } = await this.SenClient.get('Order', 'Replenishment', {body:{...data}});
		if(code !== 200){
			throw {code:500, message:'交互失败'};
		}
		return true; 
		// return await Cp.post(gameid, '', data);
	}



}

export default new rechargeService();