import Cp from '../../utils/Cp';
import { dbSequelize } from '../../config';
import dayjs from 'dayjs';
import Axios from 'axios';
var mysql  = require('mysql');  
 
// var connection = mysql.createConnection({     
// 	host     : '117.50.10.34',       
// 	user     : 'gmfancyguo',              
// 	password : 'gmfancyguo!',       
// 	port: '3306',                   
// 	database: 'sdk' 
// }); 
// connection.connect();

class rechargeService{
	constructor() {
		// const { SenecaClient } = require('../../xiaolu/senecaclient');
		// this.SenClient = new SenecaClient('127.0.0.1', 10002, 'tcp');
		let { a } = require('../../xiaolu/senecaclient');
		this.SenClient = a;

		// var mysql  = require('mysql');  
		// var connection = mysql.createConnection({     
		// 	host     : '117.50.10.34',       
		// 	user     : 'gmfancyguo',              
		// 	password : 'gmfancyguo!',       
		// 	port: '3306',                   
		// 	database: 'sdk' 
		// }); 
		// connection.connect();
	}

	async query(data){
	/*	var mysql  = require('mysql');  
		var connection = mysql.createConnection({     
			host     : '117.50.10.34',       
			user     : 'gmfancyguo',              
			password : 'gmfancyguo!',       
			port: '3306',                   
			database: 'sdk' 
		}); 
		connection.connect();*/
		// console.log(data);
		let { srttime, gameid, page, pagesize: pageSize, channel, plaform: platform, roleid, servername } = data;
		let serverid;
		if (servername) {
			let sql = `select serverid from gm_server where  gameid ='${gameid}' and status =1 and servername = '${servername}'`;
			 var test  = await dbSequelize.query(sql, {
				plain: true,
			 });
			serverid = test.serverid;
        }
		let datas = {
			gameid,
			page,
			pageSize,
			channel,
			platform: platform ? +platform === +'1' ? 'android' :'ios' : '',
			roleid,
			serverid,
			createdAtStart: srttime?.length > 1 ? dayjs(new Date(srttime[0])).format('YYYY-MM-DD HH:mm:ss')  : '',
			createdAtEnd: srttime?.length >= 2 ? dayjs(new Date(srttime[1])).format('YYYY-MM-DD HH:mm:ss')  : ''
		};
		let tests = {};
		for (let i in datas) {
			console.log(i);
			if (datas[i]) {
				tests[i] = datas[i];
			}
		}
		console.log(tests);
		tests['gameid'] = '22222222';
		const qs = require('qs');
		let urls = qs.stringify(tests);
		let { data: { data: resData } } = await Axios.get('https://qgsdk.fancyguo.com/api/getOrdersDetails?' + urls).catch(() => ({ code: 500 }));
		console.log('https://qgsdk.fancyguo.com/api/getOrdersDetails?' + urls);
		return resData;
/*
		let {roleid,  plaform, servername, page, pagesize, gameid} = data;
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
		console.log(sql);
		let totalsql = `SELECT 
        count(*) as total
        FROM  pay AS a 
        RIGHT JOIN  
        users AS b 
        ON a.uid=b.uid 
       ${where}`;
		let res = await new Promise((resolve, reject)=>{
			 connection.query(sql, (err, result)=>{
				if(err){
					console.log(err);
					return;
				}
				return resolve(result);
            
			});
		});
		let total = await new Promise((resolve, reject)=>{
			connection.query(totalsql, (err, result)=>{
				if(err){
					// console.log(err);
					return reject(err);
				}
				return resolve(result);
            
			});
		});
		res = JSON.parse(JSON.stringify(res));
		total = total[0].total;
		
		connection.end();*/
		/*return {res, total};*/
	}
	async replenishment(data) {
		// console.log(data);
		let res  = await this.SenClient.get('Order', 'Replenishment', { body: { ...data } });
		if (+res.code !== 200){
			throw {code:500, message:'交互失败'};
		}
		let successData = res.data['100'].concat(res.data['200']);
		// let { code } = await Axios.post('https://qgsdk.fancyguo.com/api/updateOrderStatus', { successData }).catch(() => ({ code: 500 }));
		// if (+code !== 200) {
		// 	throw { message: '补单完成，告知SDK失败', data: res.data };
		// }
		var mysql  = require('mysql');  
		var connection = mysql.createConnection({     
			host     : '117.50.10.34',       
			user     : 'root',              
			password : '20200527sdk',       
			port: '3306',                   
			database: 'sdk' 
		}); 
		connection.connect();
		if(successData.length > 0 ){
			let  sql = `update pay set isSend = 'reSend_success' where tid in (${successData.map(a => `'${a.tid}'`)}) `;
			console.log(sql);
				 connection.query(sql, (err, result)=>{
				   if(err){
					   console.log(err);
					   return;
				   }
			   });
		}
		connection.end();
		return res.data; 
		// return await Cp.post(gameid, '', data);
	}



}

export default new rechargeService();