<template>
  <!-- <div id="app" @contextmenu.prevent="onContextmenu"> -->
  <div id="app" >
    <router-view />
  </div>
</template>

<script>
// 引入 js-cookie 库
import Cookies from 'js-cookie';
import game from './views/telephone/index';
// import layx from 'vue-layx';
export default {
  name: 'App',
  data() {
    return {
      menuVisible: false
    };
  },
  methods: {
    // onContextmenu(event) {
    //   this.$contextmenu({
    //     items: [
    //       {
    //         label: '返回(B)',
    //         onClick: () => {
    //           this.message = '返回(B)';
    //           location.history;
    //         }
    //       },
    //       { label: '前进(F)', disabled: true },
    //       { label: '重新加载(R)', onClick: () => {
    //         location.reload();
    //       }, divided: true, icon: 'el-icon-refresh' },
    //       { label: '另存为(A)...' },
    //       { label: '打印(P)...', icon: 'el-icon-printer' },
    //       { label: '投射(C)...', divided: true },
        
    //       {
    //         label: '截取网页(R)',
    //         minWidth: 0,
    //         children: [
    //           {
    //             label: '截取可视化区域',
    //             onClick: () => {
    //               this.message = '截取可视化区域';
    //               console.log('截取可视化区域');
    //             }
    //           },
    //           { label: '截取全屏' }
    //         ]
    //       },
    //       { label: '查看网页源代码(V)', icon: 'el-icon-view' },
    //       { label: '检查(N)' }
    //     ],
    //     event,
    //     customClass: 'class-a',
    //     zIndex: 3,
    //     minWidth: 230
    //   });
    //   return false;
    // }
  },
  mounted() {
 
    if (+this.grade === 9999) {this.$router.push({ path: '/GMManagement/gameManagement' });}
  },
  created() {
    //在页面刷新时将vuex里的信息保存到sessionStorage里
    window.addEventListener('beforeunload', () => {
      sessionStorage.setItem('pathName', window.location.pathname); //重点：暂存页面刷新的地址
      sessionStorage.setItem('gameName', this.$store.state.user.permissionInfo.gamename);
    }, false);
    // 获取参数集合
    const params = new URLSearchParams(location.search);
    // 判断参数集合中是否存在 token 字段，存在则直接存到 cookie 里
    if (params.has('token')) { Cookies.set('fancy-guo-login-token', params.get('token')); }
    function browserRedirect() {
      var sUserAgent = navigator.userAgent.toLowerCase();
      var bIsIpad = sUserAgent.match(/ipad/i) === 'ipad';
      var bIsIphoneOs = sUserAgent.match(/iphone os/i) === 'iphone os';
      var bIsMidp = sUserAgent.match(/midp/i) === 'midp';
      var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) === 'rv:1.2.3.4';
      var bIsUc = sUserAgent.match(/ucweb/i) === 'ucweb';
      var bIsAndroid = sUserAgent.match(/android/i) === 'android';
      var bIsCE = sUserAgent.match(/windows ce/i) === 'windows ce';
      var bIsWM = sUserAgent.match(/windows mobile/i) === 'windows mobile';
      if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
        this.$message.warning('本系统暂不支持手机登录，页面将自动关闭或跳转。');
        window.opener = null;
        window.open('', '_self');
        window.close();
        location.href = 'https://www.fancyguo.com/';
      } 
    }
    browserRedirect();
    let icon = '<svg t="1606553020615" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5100" width="20" height="20"><path d="M892.773889 977.742273a381.747979 381.747979 0 0 0-232.749406-349.124108 389.538754 389.538754 0 0 0-48.692344-16.555398 314.065621 314.065621 0 0 0 122.704707-520.034236 314.065621 314.065621 0 1 0-323.317166 520.034236 374.444127 374.444127 0 0 0-48.692344 16.555398A379.800285 379.800285 0 0 0 131.225624 977.742273a40.901569 40.901569 0 0 0 12.173086 29.215407 45.28388 45.28388 0 0 0 33.597718 15.58155H847.003085a45.28388 45.28388 0 0 0 33.597718-15.58155 40.901569 40.901569 0 0 0 12.173086-29.215407z" fill="#5E5C5C" p-id="5101"></path></svg>';
    let layerConfig = {
      content: {
        content: game, //传递的组件对象
        parent: this, //当前的vue对象
        data: {}//props
      },
      type: 2,
      icon,
      title: '调试者工具',
      maxmin: true,
      resize: false,
      shadeClose: false,
      shade: false,
      btn: '确定',
      area: ['807px', '485px'],
      cancel: ()=>{//关闭事件
        alert('关闭iframe');
      }
    };
    let a = this.$layer.iframe(layerConfig);
    // this.$layer.close(a);
    console.log('layer', a);
    console.log(this);
    // layx.open(layxConfig);
    // document.addEventListener('contextmenu', event=>{
    //   this.menuVisible = false; // 先把模态框关死，目的是 第二次或者第n次右键鼠标的时候 它默认的是true
    //   this.menuVisible = true; // 显示模态窗口，跳出自定义菜单栏
    //   // var menu = document.querySelector('#menu');
    //   // var menu = this.$refs.createmenus;
    //   var menu = this.$refs.meishenmewenti;
    //   // 给整个document添加监听鼠标事件，点击任何位置执行foo方法
    //   menu.style.position = 'fixed';
    //   menu.style.left = event.clientX + 'px';
    //   menu.style.top = event.clientY + 'px';
    // });
  }
};
</script>

<style lang="scss">
  #app {
    /*
   background-size: 100% 100%;
   background-repeat: no-repeat;
   background-attachment: fixed;
   background: url("assets/system_images/system-bg-01.jpg");
   */
  }
  .el-scrollbar__wrap {
    overflow-x: hidden;
  }

  .el-scrollbar__view {
    height: 100%;
  }
  .el-select-dropdown__list {
    padding: 6px 0 10px;
  }
  .el-scrollbar__bar{
    &.is-vertical{
      width: 8px;//滚动条宽度
    }
  }
  .el-scrollbar__thumb {
    background-color: rgba(42, 58, 68, 0.51);
  }
  .el-scrollbar__thumb:hover {
    background-color: rgba(43, 76, 142, 0.68);
  }
  .mce-branding .mce-widget .mce-label .mce-flow-layout-item .mce-last {
    display: none;
  }
</style>
