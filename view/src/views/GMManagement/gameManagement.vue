<template>
  <div class="gamemanagement">
    <div class="gamemanagement-body">
      <!-- <el-row>
        <el-col :span="32" style="display:flex;">
        <div class="gamephoto" :style="'width: 20vw;height: 25vh;background-image: url(https://dss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2584239639,3280680022&fm=26&gp=0.jpg);'"></div> 
        </el-col>
        <el-col class="gamename" >  <span >{{test}}</span> </el-col>
      </el-row> -->
      
      
      
      <el-row  v-for="(i,index) in valueList" :key="index">
        <el-col :span="32" style="display:flex;">
        <div class="gamephoto" :style="`background-image: url(${i.url});`"></div> 
        </el-col>
        <el-col class="gamename" >  <span >{{i.gamename}}</span> </el-col>
      </el-row>
<!-- 
      <el-row>
        <el-col :span="32" style="display:flex;">
        <div class="gamephoto" :style="'background-image: url(https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=3387564317,402104373&fm=26&gp=0.jpg);'"></div> 
        </el-col>
        <el-col class="gamename" >  <span >{{testTwo}}</span> </el-col>
      </el-row> -->

      <el-row v-if="+grade === 9999">
        <el-col :span="32" style="display:flex;"><div class="gamephoto" :style="'background-image: url(https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=2576271325,1961580115&fm=26&gp=0.jpg);'"></div> </el-col>
        <el-col class="gamename" >    <span >添加游戏</span> </el-col>
      </el-row>

    </div>
  
  </div>
</template>

<script>
export default {
  name: 'GameTest',
  data() {
    return {
      valueList: [
        { gamename: '空翼冒险团', url: 'https://dss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2584239639,3280680022&fm=26&gp=0.jpg' },
        { gamename: '疯猴子砍猪', url: 'https://dss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=2138141738,2676640392&fm=26&gp=0.jpg' },
        { gamename: '镰刀割猴子', url: 'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=3387564317,402104373&fm=26&gp=0.jpg' },
        { gamename: '镰刀割猴子', url: 'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=3387564317,402104373&fm=26&gp=0.jpg' },
        { gamename: '镰刀割猴子', url: 'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=3387564317,402104373&fm=26&gp=0.jpg' },
        { gamename: '镰刀割猴子', url: 'http://106.75.7.83:12345/bulletin/images/11596455908720%2Bbackimage.png' }
      ],
      test: '空翼冒险团',
      testOne: '疯猴子砍猪',
      testTwo: '镰刀割猴子'
    }
    ;
  },
  computed: {
    grade() {
      return this.$route.meta.grade;       
    }
  }
};
</script>

<style lang="scss" rel="stylesheet/scss">
.gamemanagement{
    position: relative;
    left: 0;
    top: 0;
  width: 100%;
    height: 100%;
  .gamemanagement-body{
        display: grid;
    grid-template-columns: repeat(3,33.3%);
    position: absolute;
    left: 5%;
    top: 10%;
   width: 89%;
        justify-items: center;
      .gamephoto{
              background-color: red;
              background-repeat: round;
              background-size: contain;
              width: 20vw;
              height: 26vh;
            }
            .gamephotos{
              background-color: red;
              width: 20vw;
              height: 25vh;
              background-repeat: round;
              background-size: contain;
            }
            .gamemessage{
              margin-left: 10vw ;
              background-color: red;
              width: 30vw;
              height: 25vh;
            }
            .gamename{
              font-size: 2vw;
              padding-top:1vh;
               position: relative;
               width: 20vw;
               text-align: center;
            }
           
  
  }    
}
</style>
