<template>
  <div
id='business-index' class="business-index"  :style="bgimage"  >
    <div class="welcome" :data-text="`欢迎${user.alias}登录`">
    欢迎{{user.alias}}登录
  </div>
    
  </div>
</template>

<script>
// import { ParticlesBg } from 'particles-bg-vue';
import { mapGetters } from 'vuex';

export default {
  
  name: 'business-index', 
  // components: {
  //   ParticlesBg
  // },
  data() {

    return {
      bgimage: `background-image: url("${this.$store.getters.permissionInfo.imgUrl || 'http://106.75.7.83/images/game/1601380673143c1c45b2ff75acca5664a7984c503e63.jpg'}");`,
      bgshow: 'z-index:3',
      aliasss: this.$store.getters.user.alias
    };
  },
  computed: {
    ...mapGetters([
      'avatar',
      'nickName',
      'username',
      'alias',
      'user'
    ])
  },
  mounted() {
    sessionStorage.setItem('username', this.username);
  },
  methods: {
    
  }
  // created() {
  //   interval = setInterval(() =>{
  //     this.bgshow = 'z-index:-3';
  //   }, 3000);
  // }, 
  // beforeDestroy() {
  //   clearInterval(interval);
  // }
};
</script>

<style lang="scss"  rel="stylesheet/scss" >
.business-index{
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
    font-family: cursive;
  background-size: cover;
  /* margin: 0 0 5px 0; */
    //  height: 89.3vh;
      height: 100%;
  .welcome{
    font-size: 100px;
  }
}
#business-index{
    //  height: 89.3vh;
   height: 100%;
}
</style>


<style lang="scss" scoped>
@import './index.css';
</style>
