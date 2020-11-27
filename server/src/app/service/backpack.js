import { dbSequelize } from '../../config';
const Sequelize = require('sequelize');
import dayjs from 'dayjs';
import Ta from '../../utils/requests';





class BackpackService {
	constructor() {
	}
    async query(data) {
        /* let { serverid, gameid, roleid } = data;*/
        let { serverid, gameid, roleid  } = data;
        serverid = String(roleid).slice(String(roleid).length-5);
        let sql = `select * from gm_server where serverid = '${serverid}' and gameid ='${gameid}' and status = 1`;
        let { ip, port } = await dbSequelize.query(sql, {
            plain: true,
            type: 'SELECT'
        });
        let url = `http://${ip}:${port}/gmswap/BackPackQuery`;
        console.log(url);
        let reqData = { role_id: roleid };
        let req = {
            url,
            method:  'post',
            headers: {
                Connection: 'close'
            },
            body: { data: reqData },
            form: reqData,
            data: reqData
        };
        const axios = require('axios');
        let { data: res } = await axios(req).catch((a) => ({ data: { code: 500 } }));
        if (+res.code !== 200) {
            throw { code: 500, message: '没有此角色'};
        } else {
            return res?.data;
        }



    }
    async queryServer(data) {
        let { gameid, roleid } = data;
        let sql = `select token,tablename from gm_game_token where gameid = '${gameid}' and type='user'`;
        let { token, tablename } = await dbSequelize.query(sql, {
            plain: true,
            type: 'SELECT'
        });
        let Tasql = `select server_id as serverid from ${tablename} where "role_id" = '${roleid}' group by server_id   `;
        let res = await Ta.tasql(Tasql, token);
        console.log(res);
        if (res.length > 0) {
            let sql = `select * from gm_server where gameid = '${gameid}' and serverid::int in (${res.map(a => a?.serverid)}) and status =1`;
            let ress =  await dbSequelize.query(sql, {
                type: 'SELECT'
            });
            console.log(ress);
        }
        return; 
    }
    async BackPackRecycle(data) {
        console.log(data);
        let { gameid, roleid, value, serverid } = data;
        serverid = String(roleid).slice(String(roleid).length-5);
        let sql = `select * from gm_server where serverid = '${serverid}' and gameid ='${gameid}' and status = 1`;
        let { ip, port } = await dbSequelize.query(sql, {
            plain: true,
            type: 'SELECT'
        });
        let url = `http://${ip}:${port}/gmswap/BackPackRecycle`;
        let reqData = { role_id: roleid, data: value };
        console.log(reqData);
        let req = {
            url,
            method: 'post',
            headers: {
                Connection: 'close'
            },
            body: { data: reqData },
            form: reqData,
            data: reqData
        };
        const axios = require('axios');
        let { data: res } = await axios(req).catch((a) => ({ data: { code: 500 } }));
        console.log(res);
        if (+res.code !== 200) {
            throw { code: 500, message: '回收失败' };
        } else {
            return res?.data;
        }
    }

}

export default new BackpackService();
