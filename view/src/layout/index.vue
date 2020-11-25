<template>
  <div class="layout-box" >
    <el-container class="app-container">
      <el-aside v-if="gradele9999" class="shrinkTransition" :width="isCollapse ? '200px' : '60px'" style="background-color: rgb(9, 27, 47);">        <appSidebar style="height: 100%;" @shrink="shrink"> </appSidebar>      </el-aside>
      <el-container class="app-body-container">
        <el-header  class="app-header-container"  style="height: 100px;"><Navbar></Navbar>         </el-header>
        <el-main  > <AppProject></AppProject></el-main>
      </el-container>
    </el-container>
  
  </div>
</template>




<script>
// 使用 mock 模拟数据
// import '@/utils/mock';

import AppProject from './project/app-project';
import Navbar from './project/navbar';
import appSidebar from './project/app-sidebar';

export default {
  name: 'Layout',
  components: {
    appSidebar,
    AppProject,
    Navbar
  },
  data() {
    // let rec;
    return {
      isCollapse: true
    };
  },
  computed: {
    grade() {
      return this.$route.meta.grade;       
    },
    gradele9999() {
      return +this.grade !== 9999; 
    },
    scrollheight() {
      return document.body.scrollHeight;
    },
    sidebar() {
      return this.$store.state.app.sidebar;
    },
    device() {
      return this.$store.state.app.device;
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      };
    }
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false });
    },
    shrink() {
      this.isCollapse = !this.isCollapse;
    }
    // async volume() {
    //   this.rec.start();
    // }
  },
  mounted() {
    this.$store.dispatch('user/setusers');
    let a = +this.$store.state.user.permissionInfo.gameid === 5;
    if (a) {
      this.$router.push({ path: '/GMManagement/gameManagement' });
    }
    // var SpeechRecognition = SpeechRecognition || window.webkitSpeechRecognition;
    // var SpeechGrammarList = SpeechGrammarList || window.webkitSpeechGrammarList;
    // // var SpeechRecognitionEvent = SpeechRecognitionEvent || window.webkitSpeechRecognitionEvent;
    // var rec = new SpeechRecognition();
    // var recList = new SpeechGrammarList();
    // var langeage = ['你好', '再见', '牛啊', '兄弟', '小鹿'];
    // var grammar = '#JSGF V1.0; grammar loageage; public <langeage> = ' + langeage.join(' | ') + ' ;';
    // recList.addFromString(grammar, 1);
    // rec.grammars = recList;
    // rec.continuous = false;
    // rec.lang = 'zh-CN';
    // rec.interimResults = false;
    // rec.maxAlternatives = 1;
    // rec.onresult = (e)=>{
    //   console.log(e);
    //   rec.stop();
    // }; //结束后执行
    // rec.onspeechend = (e) => {
    //   console.log(e);
    //   console.log(233);
    //   rec.stop();
    // }; //太久没监听到
    // rec.onnomatch = (event) => {
    //   console.log(event);
    //   console.log(111);
    //   rec.stop();
    // };	//监听到的信息没有返回
    // rec.onerror = (event) => {
    //   console.log(event);
    //   console.log(2222);
    //   rec.stop();
    // }; //错误
    // this.rec = rec;
  }
};
</script>

<style lang="scss" scoped>
  $backLinear_1:#73a5b0;
  $backLinear_2:#343355;
  $url: '../';
  .business-index{
 
 /* min-height: 869px; */
}
#business-index{
 /* min-height: 869px; */
}
  .layout-box {
    height: 100%;
    width: 100%;
    padding: 0;
    min-width: 1000px;
    background: url($url + "assets/system_images/system-bg-01.jpg");
    background-attachment: fixed;
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }
  .app-container {
    /* padding-left: 5px; */
    height: 100%;
    padding: 0;
  }
  .app-body-container {
    height: 100%;
    min-height: auto;
    background-color: black;
    padding: 0;
  }
.app-header-container{
  height: 200px;
  width: 100%;
  padding: 0;
}
.el-main {
  padding: 0;
  
}

.el-main div{
  min-height: 700px;
}

.el-aside{
  overflow: hidden;
}
.shrinkTransition {
  transition: width 0.5s cubic-bezier(0.075, 1.1, 0.165, 1);
}

</style>
