<template>
  <div
id='business-index' class="business-index"    >
    <div class="welcome">
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
 background-image: url(../../styles/images/backimage.png);
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
