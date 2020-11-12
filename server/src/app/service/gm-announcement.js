import gmAnnouncementDao from '../dao/gm-announcement';
import BaseService from '../../lib/base-service';
import Cp from '../../utils/Cp';
import fs from 'fs';
import { dbSequelize } from '../../config';
import dayjs from 'dayjs';
class GmAnnouncementService extends BaseService{
	constructor() {
		super(gmAnnouncementDao);
		let { a } = require('../../xiaolu/senecaclient');
		this.SenClient = a;
	}
	async queryBulletin(data){
		let {bulletinid:id, plaform, servername, type, page, pagesize, gameid} =data;
		let setime = data['setime[]']; 
		let channel = data['channel[]'];
		let where = `where  game_id=${gameid}  and status = 1 `;
		 data = {id, type};
		for(let [key, value] of  Object.entries(data)){
			where += value?`and ${key} = $${key}$${value}$${key}$`:'';
		}
		switch(typeof plaform){
			case 'string':where +=  plaform?` and plaform @> '"${plaform}"' and  jsonb_array_length('["1"]'::jsonb) = jsonb_array_length(plaform) `:'';break;
			case 'object':where += ` and plaform @> '${JSON.stringify(plaform)}' and  jsonb_array_length('${JSON.stringify(plaform)}'::jsonb) = jsonb_array_length(plaform) `;break;
		}
		where += servername? `and '${servername}' = any(servername)`:'';
		where += setime?` and ( start_time  between '${dayjs(setime[0]).format('YYYY-MM-DD HH:mm:ss')}' and '${dayjs(setime[1]).format('YYYY-MM-DD HH:mm:ss')}'  or sendtime   between '${dayjs(setime[0]).format('YYYY-MM-DD HH:mm:ss')}' and '${dayjs(setime[1]).format('YYYY-MM-DD HH:mm:ss')}'  )   `:'';
		switch(typeof channel){
			case 'string':where += ` and '${channel}' = any(client)`;break;
			case 'object':where += ` and array[${channel.map(item => `'${item}'`)}]::varchar[] <@ client`;break;
		}
		let sql = `
		with qwe as (	select id ,(case when plaforms = '1'::text then '安卓' when plaforms = '2'::text then '苹果' end ) as plaforms  from gm_announcement,jsonb_array_elements_text(plaform)  with  ordinality  arr(plaforms, index)),
            asd as (select id,status,end_time,start_time,anno_status,title,game_id,text,time_interval,img_url,weights,link,job_id,sendtime,
					(case when type::int = 1 then start_time else sendtime end) as stime ,
					(case when type::int = 1 then end_time else endtime end) as etime ,
					(case when type::int = 1 then '跑马灯' when type::int = 2 then '公告板' end ) as type,
					( case when cardinality(	array_remove(client,'')) = 0 then null else client end ) as client ,
					( case when cardinality(	array_remove(servername,'')) = 0 then null else servername end ) as servername 
					from gm_announcement  ${where} and (anno_status::int  not in (1,3)  or anno_status    is null )  
					order by id  offset ${pagesize*(page-1)} limit ${pagesize}),
			zxc as (select id,string_to_array(string_agg(plaforms, ','), ',')as plaforms from qwe  GROUP BY id )
			select asd.*,zxc.plaforms from  asd left join zxc  on asd.id=zxc.id
		`;
		let res = await dbSequelize.query(sql);
		let total = await dbSequelize.query(`select count(*) as total  from gm_announcement  ${where} and (anno_status::int  not in (1,3)  or anno_status    is null ) `);
		res = res[0];
		total = total[0][0].total;
		return {res, total};
	}
	async createBulletin(data, files, id){
		let filePath = null;
		if(JSON.stringify(files) !== '{}'){ 
			const path = require('path');
			const file = files.images;
			 filePath = await new Promise((resolve, reject)=>{
		  const reader = fs.createReadStream(file.path);
		  let a = `${new Date().getTime()}+${file.name}`;
		  let filePath = path.join(__dirname, '../../images/anno/') + a;
		  let fileWebUrl = 'http://106.75.7.83/images/anno/' + a;
		  const upStream = fs.createWriteStream(filePath);
		  reader.pipe(upStream);
		  reader.on('end', async(err)=>{
			  if(err){
				  reject(false);
			  }
			  resolve(fileWebUrl);
		  });
	  });
		}
		let { channel, servername, range, plaform} =data;
		if(channel.indexOf(',') != -1){
			channel = channel.split(',');
		}
		switch (typeof channel){
			case 'string':channel = `array['${channel}']`;break;
			case 'object':channel = `array[${channel.map(item => `'${item}'`)}]`;break;
			default :channel = null;
		}
		if(servername.indexOf(',') != -1){
			servername = servername.split(',');
		}
		switch (typeof servername){
			case 'string':servername = `array['${servername}']`;break;
			case 'object':servername = `array[${servername.map(item => `'${item}'`)}]`;break;
			default :servername = null;
		}
		if(plaform.indexOf(',') != -1){
			plaform = plaform.split(',');
		}
		switch (typeof plaform){
			case 'string':plaform = `["${plaform}"]`;break;
			case 'object':plaform = `[${plaform.map(item => `"${item}"`)}]`;break;
			default :plaform = false;
		}
		let sql = `insert into gm_announcement 
		  (title,text,game_id,img_url,plaform,client,link,bulletinid,create_user_id,type,servername,range) 
		  VALUES
		  ('${data.title}','${data.text}','${data.gameid}',${filePath?`'${filePath}'`:null},${plaform?`'${plaform}'::jsonb` :null},${channel},'${data.a}','${data.bulletinid}','${id}',2,${servername},'${range}') returning id `;
		  let res = await dbSequelize.query(sql);
		  try{
			let {code} = await this.SenClient.get('anno', 'marquee', {body:res[0][0]}).catch(a=>({data:500}));
			if(+code !== 200 )throw {message:'交互失败'};
		}catch({message}) {
			let sql = `
			update  gm_announcement set  status =0 where id = '${res[0][0]['id']}'`; 
			await dbSequelize.query(sql);
			throw {message};
		}
		return res[0][0];
	}
	async createMarquee(data, id){
		// let cpdata = data;
		// let Res = await Cp.insertMarquee(cpdata);
		// let {code :CpRes, msg:CpMsg} = JSON.parse(Res);
		// if(+CpRes !== +200){return {CpMsg};}
		let { channel, servername, plaform, text} =data;
		for(let [key, value] of Object.entries(data)){
			if(key === 'stime' || key === 'etime'){
				data[key] =	`'${dayjs(data[key]).format('YYYY-MM-DD HH:mm:ss')}'`;continue;
			}
			data[key]= data[key]?`'${value}'`:null;

		}
		if(plaform.indexOf(',') != -1){
			plaform = plaform.split(',');
		}
		switch (typeof plaform){
			case 'string':plaform = `["${plaform}"]`;break;
			case 'object':plaform = `[${plaform.map(item => `"${item}"`)}]`;break;
			default :plaform = false;
		}
		if(channel.indexOf(',') != -1){
			channel = channel.split(',');
		}
		switch (typeof channel){
			case 'string':channel = `array['${channel}']`;break;
			case 'object':channel = `array[${channel.map(item => `'${item}'`)}]`;break;
			default :channel = null;
		}
		if(servername.indexOf(',') != -1){
			servername = servername.split(',');
		}
		switch (typeof servername){
			case 'string':servername = `array['${servername}']`;break;
			case 'object':servername = `array[${servername.map(item => `'${item}'`)}]`;break;
			default :servername = null;
		}
		console.log(text);
		let sql = ` insert into gm_announcement 
		  (start_time,end_time,game_id, plaform,client,bulletinid,create_user_id,type,weights,time_interval,servername,anno_status,text) 
		  VALUES
		  (${data.stime},${data.etime},${data.gameid},${plaform?`'${plaform}'::jsonb` :null},${channel},${data.bulletinid},${id},1,${data.weights} ,${data.interval},${servername} ,2 ,$text$${text}$text$) returning id `;
		let res = await dbSequelize.query(sql);
		try{
			let {code} = await this.SenClient.get('anno', 'marquee', {body:res[0][0]}).catch(a=>({data:500}));
			if(+code !== 200 )throw {message:'交互失败'};
		}catch({message}) {
			let sql = `
			update  gm_announcement set  status =0 where id = '${res[0][0]['id']}'`; 
			await dbSequelize.query(sql);
			throw {message};
		}
		return res[0][0];
	}
	async updateBulletin(data){
		let {anno_status:annoStatus} =data;
		let res = await dbSequelize.query(`update gm_announcement set anno_status=1,status = 0 where id = '${data.id}' returning id`);
		if( annoStatus !== '待用'){
			await this.SenClient.get('anno', 'stop', {body:res[0][0]});
		}
		return res[0][0];
	}
	async sendBulletin(datas){
		let { data, sendtime, endtime } = datas;
		let res = await dbSequelize.query(`update gm_announcement set sendtime='${sendtime}' ,endtime ='${endtime}', anno_status =2 where id in (${data.map(item => item.id)}) `);
		let a = await this.SenClient.get('anno', 'send', {body:datas}).catch(a => {

			throw {message:'交互失败'};
		});
		
		return res;
	}
	async queryweights(parmas){
		let whereObj = {};
		for(let [key, value] of Object.entries(parmas)){
			if(!value || key.slice(-2) === '[]' ){continue;}
			whereObj[key] = value;
		}
		let getType = data => Object.prototype.toString.call(data).split(' ')[1].slice(0, -1);
		let { stime, etime, gameid, channel, plaform, servername } = whereObj;
		if(typeof servername === 'string'){servername = [servername];}
		servername = servername?` and servername = array[${servername.map(a=>`'${a}'`)}]::varchar[]` :'';
		if(typeof channel ==='string'){channel = [channel];}
		channel = channel?` and client = array[${channel.map(a=>`'${a}'`)}]::varchar[]` :'';
	
		if(plaform){
			plaform = getType(plaform)==='String'?` and plaform =  '[${JSON.stringify(plaform)}]' `:`  and plaform @> '${JSON.stringify(plaform)}' `;
		}
		if (!(stime && etime)){return [];}
		let res = await dbSequelize.query(`
		select weights as label , weights as value 
		from gm_announcement  
		where game_id = '${gameid}' and type = '1' ${channel} ${plaform?plaform:''} ${servername}
		and  ('${stime}' BETWEEN start_time and  end_time  
		or '${etime}' BETWEEN start_time and  end_time 
		or start_time BETWEEN '${dayjs(stime).format('YYYY-MM-DD HH:mm:ss')}' and  '${dayjs(etime).format('YYYY-MM-DD HH:mm:ss')}'  
		or end_time BETWEEN '${dayjs(stime).format('YYYY-MM-DD HH:mm:ss')}' and  '${dayjs(etime).format('YYYY-MM-DD HH:mm:ss')}')  `);
		return res[0];
	}
	async queryservernames(data){
		let {gameid, plaform, channel} = data;
		 if(plaform && channel){
			if(typeof channel === 'string'){channel = [channel];}
			if(typeof plaform === 'string'){plaform = [plaform];}
			let sql = `
			select servername as label,servername as value  from gm_server
			where gameid=${gameid} 
			and plaform  @> '${JSON.stringify(plaform)}'::jsonb
			and jsonb_array_length(plaform) = jsonb_array_length('${JSON.stringify(plaform)}'::jsonb )
			and   channel @> '${JSON.stringify(channel)}'::jsonb 
			and jsonb_array_length(channel) = jsonb_array_length('${JSON.stringify(channel)}'::jsonb  )
			and servername = servername and status = 1
			`;
			console.log(sql);
			// select servername as label,servername as value  from gm_server 
			// where gameid=${gameid} and plaform ='${plaform}'  
			// and channel = '${JSON.stringify(channel)}'::jsonb
			// and servername = servername
			let servernames  = await dbSequelize.query(sql);
			return servernames[0];
		}
	}
	async putchangeoneannounced(data){
		let  Marquee = async (data)=>{
			let {id, text, start_time, end_time, weights} = data;
			let res = await dbSequelize.query(`update gm_announcement 
			set text = '${text}',
			start_time = '${start_time}',
			end_time = '${end_time}' ,
			weights = '${weights}'
			where id = ${id}`);
			return res[0];
		};
		let  bulletin = async (data)=>{
		
			let {id, text, title, link} = data;
			let res = await dbSequelize.query(`update gm_announcement 
			set text = '${text}',
				title = '${title}',
				link = '${link}'
			where id = ${id}`);
			return res[0];
		};
		let res;
		switch(data.type){
			case '跑马灯':res = await Marquee(data);break;
			case '公告板':res = await bulletin(data);break;
		}
		return res;
		
	}
}
export default new GmAnnouncementService();