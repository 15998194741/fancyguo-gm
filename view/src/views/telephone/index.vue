<template>
    <div class="telephone-pros-container">
     <!-- <img id='telephone-images' src="./static/mobilePhone.png" alt=""> -->
        <div id='gonggaobanbeirong'   class='gonggaobanbeirong'>
            <div ref="gonggaobanbeirong" class="fuwenbenneitong">
                <span class="youxigonggap">游戏公告</span>

            </div>
        </div>
    </div>
</template>
  
<script>
  
export default {
  
  name: 'telephone',
  data() {
    return {
    };
      
  },
  mounted() {
      

    console.log(this);
  
  
  
  }
  
  
    
};
</script>
  
<style lang="scss" rel="stylesheet/scss">
 .telephone-pros-container{
 height:433px;
 width:805px;
 background-image: url('./static/mobilePhone.png');
  .gonggaobanbeirong{
      width: 590px;
      border: 1px solid;
      height: 341px;
      position: relative;
      left: 102px;
      top: 44px;
      background-color: white;
      .fuwenbenneitong{
          position:absolute;
          left: 10%;
          top:10%;
          width: 80%;
          min-height: 80%;
          background-color: black;
          .youxigonggap{
              color: red;
              position: relative;
              left: -20px;
              top: -10px;
              background-color: blue;
          }
      }
  }
    // #telephone-images{
    //     transform:rotate(90deg);
    // }
 }
  
</style>
  
