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


export function findAllUrl(params) { 
  return request({
    url: `gm/user/findAllUrl`,
    method: 'get',
    params
  });
}

export function postCreateUserGroup(data) { 
  return request({
    url: `gm/user/postCreateUserGroup`,
    method: 'post',
    data
  });
}


export function getFindGroupName(params) { 
  return request({
    url: `gm/user/getFindGroupName`,
    method: 'get',
    params
  });
}




export function getFindGroup(params) { 
  return request({
    url: `gm/user/getFindGroup`,
    method: 'get',
    params
  });
}




export function deleteusergroupbyone(data) { 
  return request({
    url: `gm/user/deleteusergroupbyone`,
    method: 'put',
    data
  });
}


export function putChangeUserGroup(data) { 
  return request({
    url: `gm/user/putChangeUserGroup`,
    method: 'put',
    data
  });
}



export function changeFindValue(params) { 
  return request({
    url: `gm/user/changeFindValue`,
    method: 'get',
    params
  });
}




export function getFindGroupUser(params) { 
  return request({
    url: `gm/user/getFindGroupUser`,
    method: 'get',
    params
  });
}




export function deleteGroupUser(data) { 
  return request({
    url: `gm/user/deleteGroupUser`,
    method: 'put',
    data
  });
}



export function getUserList(params) { 
  return request({
    url: `gm/user/getUserList`,
    method: 'get',
    params
  });
}



export function postCreateGroupUser(data) { 
  return request({
    url: `gm/user/postCreateGroupUser`,
    method: 'post',
    data
  });
}
