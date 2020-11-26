


import request from '@/utils/request';

export function setClientShow(data) { 
  return request({
    url: `server/setClientShow`,
    method: 'post',
    data
  });
}


export function download() { 
  return request({
    url: `server/download`,
    method: 'get'
  });
}



export function batchCreate(data) { 
  return request({
    url: `server/batchCreate`,
    method: 'post',
    data
  });
}

export function stopCancel(data) { 
  return request({
    url: `server/stopCancel`,
    method: 'post',
    data
  });
}
