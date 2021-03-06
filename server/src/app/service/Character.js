import { dbSequelize } from '../../config';
import Ta from '../../utils/requests';
import Cp from '../../utils/Cp';
import fs from 'fs';
import dayjs from 'dayjs';
class CharacterService{
	constructor() {
		let { a } = require('../../xiaolu/senecaclient');
		this.SenClient = a;
	}

	static byData(data){
		let  whereObj = {};
		for (const key of Object.keys(data)) {
			data[key] && data[key]!='0'?whereObj[key] = data[key]:'';
		}
		
		if(Object.keys(whereObj).length === 0){return '' ;}
		data = null;
		let keyss= ['update_time', 'ip', 'distinct_id', 'account_id'];
		let where = [];
		if (whereObj){
			for( let [key, value] of Object.entries(whereObj)){
				keyss.includes(key)?where.push(` "#${key}"='${value}'`):where.push(` ${key}='${value}'`); 
			}
			where = where.join(' and ');
			whereObj = null;
		}

		return where;
	}
	static byBetween(data){
		let  whereObj = {}; 
		for(const key of Object.keys(data)){
			data[key] && data[key].length !=0?whereObj[key] = data[key]:'';
		}
		data = null;
		let wheres=[];
		let keyss= ['update_time', 'ip', 'distinct_id', 'account_id'];
		if(whereObj){
			for(let [key, value] of Object.entries(whereObj)){
				wheres.push(` and  "${keyss.includes(key)?'#':''}${key}" BETWEEN  CAST(  '${dayjs(value[0]).format('YYYY-MM-DD HH:mm:ss') }' as TIMESTAMP) and CAST( '${dayjs(value[1]).format('YYYY-MM-DD HH:mm:ss')}'as TIMESTAMP) `);
			}
		}
		wheres = wheres.join('  ');
		return wheres;
	}
	static byInArray(data){
		let  whereObj = {}; 
		for(const key of Object.keys(data)){
			data[key] && data[key].length !=0?whereObj[key] = data[key]:'';
		}
		data = null;
		let wheres=[];
		let keyss= ['update_time', 'ip', 'distinct_id', 'account_id'];
		if(whereObj){
			for(let [key, value] of Object.entries(whereObj)){
				
				if(typeof(value)==='string'){keyss.includes(key)?wheres.push(` and  "#${key}" = '${value}' `):wheres.push(` and  "${key}" = '${value}' `);continue;}
				keyss.includes(key)?wheres.push(` and  "#${key}" in (${value.map(item =>`'${item}'`).join(',')})`):wheres.push(` and  "${key}" in (${value.map(item =>`'${item}'`).join(',')}) `);
			}
		}
		return wheres.join(' ');
		
	}

	static  byArrayIn(data){
		let  whereObj = {}; 
		for(const key of Object.keys(data)){
			data[key] && data[key].length !=0?whereObj[key] = data[key]:'';
		}
		data = null;
		let wheres=[];
		let keyss= ['update_time', 'ip', 'distinct_id', 'account_id'];
		if(whereObj){
			for(let [key, value] of Object.entries(whereObj)){
				wheres.push(` and    array[${value.map(item =>`'${item}'`).join(',')}]::varchar[] <@ "${keyss.includes(key)?'#':''}${key}" `);
			}
		}
		
		return wheres.join(' ');
		
	}
	static async byOne(sql){
		let res = await dbSequelize.query(sql);
		return res[0][0]?res[0][0]:'';
	
	
	}
	static async byMany(sql){
		let res = await dbSequelize.query(sql);
		return res[0]?res[0]:'';
	}

	static tosql(dict){
		let { between, inArray, arrayIn, data, many } = dict;
		let condition = 'where  ';
		condition += data?CharacterService.byData(data):'';
		condition += between?CharacterService.byBetween(between):'';
		condition += inArray?CharacterService.byInArray(inArray):'';
		condition += arrayIn?CharacterService.byArrayIn(arrayIn):'';
		let cre = /^where(\s*)and(.*)/;
		condition = condition === 'where'?'':condition.replace(cre, 'where $1 $2');
		let cer = /^where(\s*)$/;

		return cer.test(condition)?'':condition ;
		// let res =  many?CharacterService.byMany(condition):CharacterService.byOne(condition);
		// return res;

		
		


	}

	async queryByParms(data){
		let pgsql=0;
		let datare = /(.*)\[\]$/;
		let query ={};
		for(let [i, j] of Object.entries(data)){
			query[i.replace(datare, '$1')]=j;
		}
	
		let {
			key,
			value,
			'regtime[]':regtims,
			regtime,
			stime,
			platform,
			channel,
			server_name,
			banned_type,
			banned_area,
			gameid,
			page,
			pagesize
		  } = query;
		  let token = await CharacterService.byOne(`select token,tablename from gm_game_token where gameid = '${gameid}' and type='user'`);
		  let tablename = token.tablename;
		  token = token.token;
		let many = true;
		 let reg_time  =  regtime || regtims;
		let between ={
			reg_time,
			stime
		}; 
		if(stime || banned_type ||  banned_area){
			data = {
				[key]:value,
				platform,
				banned_area,
				banned_type,
				server_name,
				gameid
			};
			tablename = 'gm_character';
			pgsql=1;
		}else{
			data = {
				[key]:value,
				platform,
				banned_area,
				banned_type,
				server_name,
			};
		}

		let inArray={
			channel
		};
		let sqls = CharacterService.tosql({
			inArray,
			between,
			data,
			many
		});
		
		var total = 0;
		if(key === 'role_name' && value){sqls += `or role_name like '%${value.split('').join('%')}%'`;}
		let res;
		if(pgsql === 1){
			let sql = `select * from gm_character ${sqls} offset ${pagesize*(page-1)} limit ${pagesize}  `; 
			// console.log(`select * from gm_character ${sqls} offset ${pagesize*(page-1)} limit ${pagesize}`);
			var { total } = await CharacterService.byOne(`select count(*) as total from gm_character ${sqls} `);
		
			res = await CharacterService.byMany(sql);
		}else{
			let sql = `select * from (select  a.*  from (select role_id,max(timestamp) as timestamp from ${tablename} where "$part_date"  is not   null  GROUP BY role_id ) qwe join ${tablename}  a on a.timestamp = qwe.timestamp and a.role_id = qwe.role_id ) a   ${sqls} order by "#user_id" offset ${pagesize*(page-1)} limit ${pagesize}  `;	
			res =   await Ta.tasql(sql, token);
			console.log('走到这了', res);
			sql = `select count(*) from (select  a.*  from (select role_id,max(timestamp) as timestamp from ${tablename}  where "$part_date"  is not   null GROUP BY role_id ) qwe join ${tablename}    a on a.timestamp = qwe.timestamp and a.role_id = qwe.role_id ) a     ${sqls}`;	
			total = await Ta.sqltoTotal(sql, token);
			if(!res){
				res='';
			}else{
				let sql = `select * from gm_character  where gameid='${gameid}' and status = 1 and roleid in (${res.map(item => `'${item.role_id}'`)})  `;
				console.log(sql);
				if(res.map(item => `'${item.role_id}'`).length !== 0){
					let children =  await CharacterService.byMany(sql);
					if(children.length>0){
						res = res.map(item =>{
							let a = children.find(_item => _item.roleid === item.role_id);
							return {...item, ...a};
						});
					}
				}
				
			
			}
		}
		// if(value && pgsql !==1 && res.length > 0){
		// 	console.log(res);
		// 	let wheres = res.map(item => item.roleid);
		// 	let sql = `select * from gm_character where gameid='${gameid}' and roleid in (${wheres.map(item=>`'${item}'`)})`; 	
		// 	console.log(sql);
		// 	let resu = await CharacterService.byMany(sql);
		// 	console.log(resu);

		// }
		return {res, total};
	}

	async findServername(gameid){
		let res = await dbSequelize.query(`select servername from gm_server where gameid='${gameid}' and status = 1` );
		let arr = res[0];
		return arr.map(item=>{
			return {label:item.servername, value:item.servername};
		});
	}


	async uploadFile(data, gameid){
		const path = require('path');
		// 上传单个文件
		
		const file = data.file; // 获取上传文件
		let fileType = /(.*)[.xlsx,.xls]$/;
		if(!fileType.test(file.name)){return '文件格式不正确';}
		let filePath= await new Promise((resolve, reject)=>{
			// 创建可读流
			const reader = fs.createReadStream(file.path);
			let filePath = path.join(__dirname, '../../excel/') + `${new Date().getTime()}${file.name}`;
			// 创建可写流
			const upStream = fs.createWriteStream(filePath);
			// 可读流通过管道写入可写流
			reader.pipe(upStream);
			reader.on('end', async(err)=>{
				if(err){
					reject(false);
				}
				resolve(filePath);
			});
		});
		return await this.readfilesData(filePath, gameid);
		
		
		

		
		// worksheet.eachRow((row, rownumber)=>{
		// 	var rowSize = row.cellCount;
		// 	var numValues = row.actualCellCount;
		// 	//console.log("单元格数量/实际数量:"+rowSize+"/"+numValues);
		// 	// cell.type单元格类型：6-公式 ;2-数值；3-字符串
		// 	row.eachCell(function(cell, colNumber) {
		// 		if(cell.type==6){
		// 			var value = cell.result;
		// 		}else{
		// 			var value = cell.value;
		// 		}
		// 		console.log('Cell ' + colNumber + ' = ' +cell.type +' ' +value);
		// 	});
		// });
		
			 
		
		
	}
	async downloads(){
		
	}
	async readfilesData(filePath, gameid){
		const Excel = require('exceljs');
		var workbook = new Excel.Workbook();	
		await workbook.xlsx.readFile(filePath);
		var worksheet = workbook.getWorksheet(1);
		var firstcolumns = worksheet.getColumn(1);
		var value = firstcolumns.values;
		var tableKey = value[1];
		var tableValue = [];
		for(let i=2 ;i<value.length;i++){
			tableValue.push(value[i]);
		}
		let sql = `select * from gm_character where gameid='${gameid}' and "${tableKey}" in (${tableValue.map(item => `'${item}'`)})`;
		return await CharacterService.byMany(sql);
	}

	async prohibitedMute(data){
		let banned_type =data.type;
		let banned_area = data.area;
		let banned_reason = data.beacuse;
		let gameid = data.gameid;
		let banned_time = data.time * data.long;
		for(let i of data.value){
			var { account_id, distinct_id,  role_id:roleid, role_name, platform, channel, machine, server_id:serverid, level, vip_level, sum_recharge, ip, reg_time:regtime, timestamp:update_time, server_name:servername } = i;
			regtime =   dayjs(regtime).format('YYYY-MM-DD HH:mm:ss');
			update_time =  dayjs(update_time).format('YYYY-MM-DD HH:mm:ss');
			var columns = {banned_area, banned_type, gameid, account_id, distinct_id,  roleid, role_name, platform, channel, machine, serverid, level, vip_level, sum_recharge, ip, regtime, update_time, servername, banned_time, banned_reason};
			await dbSequelize.query(`insert into  gm_character 
			(${Object.keys(columns).map(item=>`"${item}"`)})values(${Object.values(columns).map(item=>`'${item}'`)})`);
		}

		let res = await this.SenClient.get('char', 'BannedAsk', {body:data});
		console.log(res);
		return res ;
	}
	async outputConsume(data){
		if(!data.roleid){return false;}
		let token = await CharacterService.byOne(`select token,tablename from gm_game_token where gameid = '${data.gameid}' and type='event' `);
		let tablename = token.tablename;
		token = token.token;
		let {
			roleid, 
			object_id, 
			object_method, 
			object_name, 
			object_type, 
			object_number,
			page,
			pagesize
		  } = data;
		let sql = `select roleid,object_id,object_method,object_name,object_type,object_number,timestamp from ${tablename} where roleid='${roleid}'  order by roleid   offset ${pagesize*(page-1)} limit ${pagesize}`;
		let res =   await Ta.tasql(sql, token);
		let sqls = `select count(object_id) from ${tablename} where roleid='${roleid}'    `;
		let total = await Ta.sqltoTotal(sqls, token);
		return {res, total};
	}

	async backPackQuery(data){
		let url = 'backPackQuery';
		try{
			let res = await Cp.get(url, data);
			res = JSON.parse(res);
			return +res.code === 200 ?res.data:'';
		}catch (err){
			return '';
		}
	}
	async backPackRecycle(data){
		try{
			let url = 'backPackRecycle';
			let res =  await Cp.put(url, data);
			res = JSON.parse(res);
			return res;
		
		}catch (err){
			return false;
		}
	}	
	async BannedAskCancel(data) {
		let res = await this.SenClient.get('char', 'BannedAskCancel', { body: data });
		let { code, message } = res;
		if (+code !== 200) throw { message };
		return res;

	}
	async findServerid(gameid){
		let sql = `select serverid from gm_server where gameid = '${gameid}' and status = 1`;
		let res = await dbSequelize.query(sql, {
			replacements:['active'], type:'SELECT'
		});
		return res;
	}

}


export default new CharacterService();