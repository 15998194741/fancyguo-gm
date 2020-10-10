// 路由规则集合
const routeRules = {
  // 区服管理
  '/zoneManagement/zoneSettings': {
    path: '/zoneManagement/zoneSettings',
    meta: { title: '区服设置' },
    component(resolve) {
      require(['@/views/zoneManagement/zoneSettings'], resolve);
    }
  },
  // '/zoneManagement/zoneSettings': {
  //   path: '/zoneManagement/zoneSettings',
  //   meta: { title: '区服设置' },
  //   component: () => import('@/views/zoneManagement/zoneSettings')
  // },
  // 角色管理
  '/roleManagement/roleQuery': {
    path: '/roleManagement/roleQuery',
    meta: { title: '角色查询' },
    component(resolve) {
      require(['@/views/roleManagement/roleQuery'], resolve);
    }
  },
  '/roleManagement/chatQuery': {
    path: '/roleManagement/chatQuery',
    meta: { title: '聊天查询' },
    component(resolve) {
      require(['@/views/roleManagement/chatQuery'], resolve);
    }
  },
  // '/roleManagement/chatQuery': {
  //   path: '/roleManagement/chatQuery',
  //   meta: { title: '聊天查询' },
  //   component: () => import('@/views/roleManagement/chatQuery')
  // },
  '/roleManagement/rucksackQuery': {
    path: '/roleManagement/rucksackQuery',
    meta: { title: '背包查询' },
    component(resolve) {
      require(['@/views/roleManagement/rucksackQuery'], resolve);
    }
  },
  '/roleManagement/prosumingQuery': {
    path: '/roleManagement/prosumingQuery',
    meta: { title: '产消查询' },
    component(resolve) {
      require(['@/views/roleManagement/prosumingQuery'], resolve);
    }
  },
  // 充值管理
  '/rechargeManagement/rechargeDetails': {
    path: '/rechargeManagement/rechargeDetails',
    meta: { title: '充值明细' },
    component(resolve) {
      require(['@/views/rechargeManagement/rechargeDetails'], resolve);
    }
  },
  // 公告管理
  '/announcedManagement/index': {
    path: '/announcedManagement/index',
    meta: { title: '公告管理' },
    component(resolve) {
      require(['@/views/announcedManagement/index'], resolve);
    }
  },
  // 邮件管理
  '/mailManagement/index': {
    path: '/mailManagement/index',
    meta: { title: '邮件管理' },
    component(resolve) {
      require(['@/views/mailManagement/index'], resolve);
    }
  },
  // 活动管理
  '/activityManagement/index': {
    path: '/activityManagement/index',
    meta: { title: '活动管理' },
    component(resolve) {
      require(['@/views/activityManagement/index'], resolve);
    }
  },
  // CDK管理
  '/CDKManagement/index': {
    path: '/CDKManagement/index',
    meta: { title: 'CDK管理' },
    component(resolve) {
      require(['@/views/CDKManagement/index'], resolve);
    }
  },
  //cdk详情
  '/CDKManagement/cdkDetail': {
    path: '/CDKManagement/cdkDetail',
    meta: { title: 'CDK详情' },
    component(resolve) {
      require(['@/views/CDKManagement/cdkDetail'], resolve);
    }
  },
  // 白名单管理
  '/whiteListManagement/index': {
    path: '/whiteListManagement/index',
    meta: { title: '白名单管理' },
    component(resolve) {
      require(['@/views/whiteListManagement/index'], resolve);
    }
  },
  '/whiteListManagement/whiteListMail': {
    path: '/whiteListManagement/whiteListMail',
    meta: { title: '白名单邮件' },
    component(resolve) {
      require(['@/views/whiteListManagement/whiteListMail'], resolve);
    }
  },
  '/whiteListManagement/whiterecording': {
    path: '/whiteListManagement/whiterecording',
    meta: { title: '白名单记录' },
    component(resolve) {
      require(['@/views/whiteListManagement/whiterecording'], resolve);
    }
  },
  // GM管理
  '/GMManagement/index': {
    path: '/GMManagement/index',
    meta: { title: 'GM管理' },
    component(resolve) {
      require(['@/views/GMManagement'], resolve);
    }
  },
  '/GMManagement/gameManagement': {
    path: '/GMManagement/gameManagement',
    meta: { title: '游戏管理' },
    component(resolve) {
      require(['@/views/GMManagement/gameManagement'], resolve);
    }
  },
  '/GMManagement/userManagement': {
    path: '/GMManagement/userManagement',
    meta: { title: '用户管理' },
    component(resolve) {
      require(['@/views/GMManagement/userManagement'], resolve);
    }
  },
  '/GMManagement/channelManagement': {
    path: '/GMManagement/channelManagement',
    meta: { title: '渠道管理' },
    component(resolve) {
      require(['@/views/GMManagement/channelManagement'], resolve);
    }
  },
  '/GMManagement/operationRecord': {
    path: '/GMManagement/operationRecord',
    meta: { title: '操作日志' },
    component(resolve) {
      require(['@/views/GMManagement/operationRecord'], resolve);
    }
  },
  '/clientManagement': {
    path: '/clientManagement',
    component(resolve) {
      require(['@/views/clientManagement'], resolve);
    },
    meta: { title: '客户端管理' }
  }
};

export function addRoutes(routes, router) {
  // 声明变量存储集合
  let _routes = [];
  // 进行遍历
  for (let route of routes) {
    // 判断是否具有二级菜单
    if (route.children && route.children.length) {
      // 遍历二级菜单
      for (let { url, meta } of route.children) {
        // 获取 route
        let _route = routeRules[url];
        // 为空直接退出
        if (!_route) { continue; }
        // console.log(meta);
        // 添加至集合
        _routes.push({ ..._route, meta: { grade: meta }});
      }
    } else {
      // 获取 route
      let _route = routeRules[route.url];
      // 为空直接退出
      if (!_route) { continue; }
      // console.log(route.meta);
      // 添加至集合
      _routes.push({ ..._route, meta: { grade: route.meta }});
    }
  }
  // 动态添加路由
  router.addRoutes([
    {
      path: '/',
      component: () => import('@/layout'),
      redirect: '/index',
      children: _routes
    }
  ]);
  return _routes;
}
