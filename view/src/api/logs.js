import request from '@/utils/request';


export function classification(params) { 
  return request({
    url: `gm/logs/classification`,
    method: 'get',
    params
  });
}




export function querydata(params) { 
  return request({
    url: `gm/logs/querydata`,
    method: 'get',
    params
  });
}
