import request from '@/utils/request';

export function mailCreate(data) {
  return request({
    url: '/white/mailCreate',
    method: 'post',
    data
  });
}




export function whiteFindAll(params) {
  return request({
    url: '/white/whiteFindAll',
    method: 'get',
    params
  });
}


export function whiteFindName(params) {
  return request({
    url: '/white/whiteFindName',
    method: 'get',
    params
  });
}



export function whiteStopMail(data) {
  return request({
    url: '/white/whiteStopMail',
    method: 'put',
    data
  });
}



export function findTitle(params) {
  return request({
    url: '/white/findTitle',
    method: 'get',
    params
  });
}


export function WhiteMailChange(data) {
  return request({
    url: '/white/WhiteMailChange',
    method: 'put',
    data
  });
}



export function mailRelatedUser(data) {
  return request({
    url: '/white/mailRelatedUser',
    method: 'post',
    data
  });
}



export function servernameComponents(params) {
  return request({
    url: '/white/servernameComponents',
    method: 'get',
    params
  });
}

export function channelComponents(params) {
  return request({
    url: '/white/channelComponents',
    method: 'get',
    params
  });
}


export function find(params) {
  return request({
    url: '/white/find',
    method: 'get',
    params
  });
}





export function stopWhiteMail(params) {
  return request({
    url: '/white/stopWhiteMail',
    method: 'delete',
    data: params,
    params
  });
}



export function recordLookup(params) {
  return request({
    url: '/white/recordLookup',
    method: 'get',
    params
  });
}
