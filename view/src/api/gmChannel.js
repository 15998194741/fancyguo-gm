import request from '@/utils/request';


export function createchannel(data) { 
  return request({
    url: `gm/channel/createchannel`,
    method: 'post',
    data
  });
}





export function findChannel(params) { 
  return request({
    url: `gm/channel/findChannel`,
    method: 'get',
    params
  });
}
export function findChannelById(params) { 
  return request({
    url: `gm/channel/findChannelById`,
    method: 'get',
    params
  });
}
  




export function deleteChannel(data) { 
  return request({
    url: `gm/channel/deleteChannel`,
    method: 'put',
    data
  });
}



export function putChangeChannel(data) { 
  return request({
    url: `gm/channel/putChangeChannel`,
    method: 'put',
    data
  });
}



export function forceDelete(data) { 
  return request({
    url: `gm/channel/forceDelete`,
    method: 'put',
    data
  });
}
