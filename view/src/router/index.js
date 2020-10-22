import Vue from 'vue';
import Router from 'vue-router';
import store from '@/store';
import { addRoutes } from '@/router/rules';
import { getPermission } from '@/api/user';
Vue.use(Router);

/* Layout */
// import Layout from '@/layout';

/**
 * 路由
 * @type {*[]}
 */
export const constantRoutes = [
  
  {
    path: '/login',
    component(r) {
      require(['@/views/login/index'], r);
    },
    meta: { title: '登录' },
    hidden: true
  },
  {
    path: '/',
    component(resolve) {
      require(['@/layout'], resolve);
    },
    redirect: '/index',
    children: [
      {
        path: 'index',
        name: 'business-index',
        meta: { title: '首页' },
        component(r) {
          require(['@/views/business'], r);
        }
      }
    ]
  },
  {
    path: '/404',
    component(resolve) {
      require(['@/views/404'], resolve);
    },
    meta: { title: '404' },
    hidden: true
  },
  {
    path: '/2048',
    component(resolve) {
      require(['@/views/2048'], resolve);
    },
    meta: { title: '2048' },
    hidden: true
  },
  {
    path: '/waterfall',
    component(resolve) {
      require(['@/views/waterfall'], resolve);
    },
    meta: { title: 'waterfall' },
    hidden: true
  },
  {
    path: '/saolei',
    component(resolve) {
      require(['@/views/saolei/saolei'], resolve);
    },
    meta: { title: 'saolei' },
    hidden: true
  },
  {
    path: '/pintu',
    component(resolve) {
      require(['@/views/saolei'], resolve);
    },
    meta: { title: 'pintu' },
    hidden: true
  },

  // 404 page must be placed at the end !!!
  { path: '*',
    redirect: '/index',
    component(r) {
      require(['@/views/2048'], r);
    },
    hidden: true }
];

const createRouter = () => new Router({
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
});

const router = createRouter();
router.beforeEach(async(to, from, next) => {
  
  if (to.path === '/login') {
    return next();
  }
  if (!sessionStorage.getItem('fancy-guo-login-token')) {
    return next('/login');
  }
 
  if (from.name === null || from.path === '/login' || to.path === '/' || to.path === '/index') { //页面刷新
    if (!store.state.user.permissionInfo.routes.length) {
      // 判断游戏名称记录是否存在
      let currentGameName = sessionStorage.getItem('currentGameName');
      // 发送异步消息
      let { routes } = await getPermissionInfo({ game: currentGameName, username: sessionStorage.getItem('username') });
      //动态添加路由
      let routers = await addRoutes(routes, router);
      let pathName = sessionStorage.getItem('pathName');
      sessionStorage.removeItem('pathName'); // 暂存上一个路由
      // console.log();
      let gameName = sessionStorage.getItem('gameName');
      if (store.state.user.permissionInfo.gamename !== gameName) {
        return next('/index');
      }
      for (let i of routers) {
        if (i['path'] === pathName) {
          return next(pathName);
        }
      }
      return next('/index');
      // console.log(router);
      // console.log(routes);
      // console.log(pathName);
      // return next(pathName);

    }
   
    let pathName = sessionStorage.getItem('pathName'); // 暂存上一个路由
    sessionStorage.removeItem('pathName'); 
    if (to.redirectedFrom !== '/' && to.redirectedFrom === pathName && to.redirectedFrom !== '/index') {
      return next(pathName);
    }
    return next();
  } else {
    return next();
  }
  
});

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}

// 请求用户权限信息
async function getPermissionInfo(params) {
  let { code, data } = await getPermission(params);
  // 请求成功时设置权限信息
  if (+code === 200) {
    store.commit('user/SET_PERMISSION_INFO', data);
  }
  return data;
}

export default router;
