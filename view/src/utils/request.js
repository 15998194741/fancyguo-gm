import axios from 'axios';
import { MessageBox, Message } from 'element-ui';
import store from '@/store';
// import { getToken } from '@/utils/cookie-utils';
import Cookies from 'js-cookie';
import crypto from 'crypto';
import router from '../router/index';
// 加密方法
const encrypt = (data, key) => {
  // 注意，第二个参数是Buffer类型
  return crypto.publicEncrypt(key, Buffer.from(data));
};
// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 50000 // request timeout
});

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    // console.log(store);
    config.headers['fancy-guo-login-token'] = Cookies.get('fancy-guo-login-token') || store.getters.token || sessionStorage.getItem('fancy-guo-login-token');

    // config.headers['fancy-guo-login-token'] = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwic3RhdHVzIjoxLCJjcmVhdGVVc2VySWQiOm51bGwsInVwZGF0ZVVzZXJJZCI6bnVsbCwiY3JlYXRlVGltZSI6IjIwMTktMDYtMjBUMTY6MDA6MDAuMDAwWiIsInVwZGF0ZVRpbWUiOiIyMDE5LTA2LTIwVDE2OjAwOjAwLjAwMFoiLCJ1c2VybmFtZSI6ImFkbWluIiwicGFzc3dvcmQiOiIiLCJuaWNrTmFtZSI6IueuoeeQhuWRmCIsImF2YXRhciI6Imh0dHA6Ly93ZXdvcmsucXBpYy5jbi9iaXptYWlsL3RCelNYWjdub2ljYVdOSU8xNVhLcDFwVTltMGliWnZQRmJUSHJqYWhZNlNwNWlhRUpkZ3E2aDZ3dy8xMDAiLCJlbWFpbCI6ImFkbWluQGZhbmN5Z3VvLmNuIiwic291cmNlIjoxLCJhbGlhcyI6bnVsbCwicGhvbmUiOm51bGwsImlhdCI6MTU5MzQ5NTgxMiwiZXhwIjoyMTk4Mjk1ODEyfQ.BtDlkV5MPKnTCUamUgH__GASdJn3_GIoY57lWbrdujE';
   
    if (store.getters.permissionInfo && store.getters.team) {
      let perByOrg = store.getters.permissionInfo[store.getters.team.id];
      config.headers['permission-header'] = perByOrg ? perByOrg.permissionHeader : '';
    }
    let gameid;
    try {
      gameid = encrypt(String(store.getters.gameid), `-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDFWnl8fChyKI/Tgo1ILB+IlGr8
ZECKnnO8XRDwttBbf5EmG0qV8gs0aGkh649rb75I+tMu2JSNuVj61CncL/7Ct2kA
Z6CZZo1vYgtzhlFnxd4V7Ra+aIwLZaXT/h3eE+/cFsL4VAJI5wXh4Mq4Vtu7uEje
ogAOgXACaIqiFyrk3wIDAQAB
-----END PUBLIC KEY-----
`);
    } catch ({ message }) {
      console.log(message);
    }
    config.headers['1f13d01052ccfae35744098fa9a71439'] = gameid.toString('base64');
    
   
    return config;
  },
  error => {
    // do something with request error
    console.log(error); // for debug
    return Promise.reject(error);
  }
);

// response interceptor
service.interceptors.response.use(
  /**
   * 如果您想获得http信息，例如头信息或状态信息
   * 请返回 response => response
  */

  response => {
    const res = response.data;
    // 如果自定义代码不是200，则判断为错误。
    if (res.code !== 200 && res.code !== 404) {
      if (res.code === 402 || res.code === 403 || res.code === 590) {
        Message({
          message: res.message || 'Error',
          type: 'warning'
        });
        return res;
      } else if (res.code === 592 || res.code === 591) {
        // to re-login
        MessageBox.confirm('您已经注销，您可以取消以停留在此页面，或再次登录', '前往登录', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload();
          });
        });
      } else if (res.code === 500) {
        Message({
          message: res.message.split('\n')[0],
          type: 'error',
          duration: 5 * 1000
        });
      } else if (res.code === 2000) {
        Message({
          message: res.message || 'Error',
          type: 'warning'
        });
        console.log(router);
        router.push({
          path: '/login'
        });
      }
    }
    return res;
  },
  error => {
    
    console.log('err' + error); // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    });
    return Promise.reject(error);
  }
);

export default service;
