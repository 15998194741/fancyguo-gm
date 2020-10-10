import request from '@/utils/request';

export function postCreateUser(data) { 
  return request({
    url: `gm/user/createuser`,
    method: 'post',
    data
  });
}



export function getFindUser(params) { 
  return request({
    url: `gm/user/findUser`,
    method: 'get',
    params
  });
}


export function findUserByParams(params) { 
  return request({
    url: `gm/user/findUserByParams`,
    method: 'get',
    params
  });
}





export function deleteuserbyone(data) { 
  return request({
    url: `gm/user/deleteuserbyone`,
    method: 'put',
    data
  });
}





export function putChangeUser(data) { 
  return request({
    url: `gm/user/putChangeUser`,
    method: 'put',
    data
  });
}
  
