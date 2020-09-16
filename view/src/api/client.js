import request from '@/utils/request';


export function clientCreate(data) { 
  return request({
    url: `client/create`,
    method: 'post',
    data
  });
}

export function clientFind(params) { 
  return request({
    url: `client/find`,
    method: 'get',
    params
  });
}

export function channelfind(params) { 
  return request({
    url: `client/channelfind`,
    method: 'get',
    params
  });
}
  

export function versionidall(params) { 
  return request({
    url: `client/versionidall`,
    method: 'get',
    params
  });
}


export function stopClient(params) { 
  return request({
    url: `client/stopClient`,
    method: 'delete',
    params,
    data: params
  });
}


export function changeClient(data) { 
  return request({
    url: `client/changeClient`,
    method: 'put',
    data
  });
}
