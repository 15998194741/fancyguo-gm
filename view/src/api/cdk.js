import request from '@/utils/request';


export function CDKcreate(data) { 
  return request({
    url: `cdk/createcdk`,
    method: 'post',
    data
  });
}




export function CDKFind(params) { 
  return request({
    url: `cdk/find`,
    method: 'get',
    params
  });
}

export function cdkDownload(params) { 
  return request({
    url: `cdk/cdkDownload`,
    method: 'get',
    params
  });
}



export function detailsFind(params) { 
  return request({
    url: `cdk/detailsFind`,
    method: 'get',
    params
  });
}



export function cdkkeyfind(params) { 
  return request({
    url: `cdk/cdkkeyfind`,
    method: 'get',
    params
  });
}




export function cdkCreateSchedule(params) { 
  return request({
    url: `cdk/cdkCreateSchedule`,
    method: 'get',
    params
  });
}



export function CDKFindByTypeOne(params) { 
  return request({
    url: `cdk/CDKFindByTypeOne`,
    method: 'get',
    params
  });
}


export function CDKFindIdAndStop(data) { 
  return request({
    url: `cdk/CDKFindIdAndStop`,
    method: 'put',
    data
  });
}
