import request from '@/utils/request';

export function getQueryGame(params) { 
  return request({
    url: `gm/game/list`,
    method: 'get',
    params
  });
}
  
export function getQueryUserList(params) { 
  return request({
    url: `gm/game/userList`,
    method: 'get',
    params
  });
}
export function getPostCreateGame(data) { 
  return request({
    url: `gm/game/creategame`,
    method: 'post',
    data,
    form: data
  });
}



export function deleteGame(data) { 
  return request({
    url: `gm/game/deleteGame`,
    method: 'put',
    data,
    form: data
  });
}


export function changeGame(data) { 
  return request({
    url: `gm/game/changeGame`,
    method: 'put',
    data,
    form: data
  });
}




export function changeGameConfig(data) { 
  return request({
    url: `gm/game/changeGameConfig`,
    method: 'put',
    data,
    form: data
  });
}
