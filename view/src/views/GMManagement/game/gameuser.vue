<template>
  <div id="gamemanagement-user" class="gamemanagement-user" :style="userStyle" >
    
    <div  class="gamemanagement-user-click" @click="gameChangedialogFormVisibleVip = true">
<!-- <span>{{valueList[0]['gamename']}}</span> -->
 <div class="glows"></div> 
 <div v-if="!!dealGamename" :class="{'glitch':!!dealGamename}" :style="{'--deal-gamename': `'${dealGamename}'`}" :data-word="dealGamename">{{dealGamename}}</div>
 <div v-else class="text-magic" :data-word="dealGamename" :style="{'--deal-gamename': `'${dealGamename}'`}"></div>
 <div class="glows"></div> 
    </div>


    <el-dialog title="游戏配置" :visible.sync="gameChangedialogFormVisibleVip"  class="eldialog-gamemanement"  :close-on-click-modal="false" @close='GameConfigCancel'>
      <el-form ref="GameConfig"  prop='file'  label-width="100px"   :model='gameConfig' :rules="gameConfigRules"  class='createFormAlert'> 
      
        <el-form-item label="user表名:" prop="userName">
          <el-input v-model="gameConfig.userName" placeholder="请输入user表名" ></el-input>
        </el-form-item>
         <el-form-item label="userToken:" prop="userToken">
          <el-input v-model="gameConfig.userToken" placeholder="请输入userToken" ></el-input>
        </el-form-item>
         <el-form-item label="event表名:" prop="eventName">
          <el-input v-model="gameConfig.eventName" placeholder="请输入event表名" ></el-input>
        </el-form-item>
         <el-form-item label="eventToken:" prop="eventToken">
          <el-input v-model="gameConfig.eventToken" placeholder="请输入eventToken" ></el-input>
        </el-form-item>
     
      </el-form>
      <div style="display: flex;justify-content: flex-end;">
        <el-button type="danger" plain @click="GameConfigCancel">取消</el-button>
        <el-button type="primary" plain  @click="GameConfigSubmit">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { changeGameConfig } from '@/api/gameGm';

export default {
  name: 'GameUser',
  components: {
  },
  props: {
    valueList: {
      type: Array,
      default: ()=>([])
    }
  },
  data() {
    let gameChangedialogFormVisibleVip = false;
    let gameConfig = {
      userName: '',
      userToken: '',
      eventName: '',
      eventToken: ''
    };
    let gameConfigRules = {
      userName: { validator: (rule, value, callback) =>{
        if (value) {
          return callback();
        }
        return callback(new Error('请输入User表名'));
      }, trigger: ['blur', 'change'] },
      userToken: { validator: (rule, value, callback) =>{
        if (value) {
          return callback();
        }
        return callback(new Error('请输入UserToken'));
      }, trigger: ['blur', 'change'] },
      eventName: { validator: (rule, value, callback) =>{
        if (value) {
          return callback();
        }
        return callback(new Error('请输入Event表名'));
      }, trigger: ['blur', 'change'] },
      eventToken: { validator: (rule, value, callback) =>{
        if (value) {
          return callback();
        }
        return callback(new Error('请输入EventToken'));
      }, trigger: ['blur', 'change'] }
    };
    
    return {
      gameChangedialogFormVisibleVip,
      gameConfig,
      gameConfigRules,
      dealGamename: ''
    };
  },
  computed: {
    userStyle() {
      try {
        let { 0: { url }} = this.valueList;
        return `background-image: url(${url});`;
      } catch (e) {
        return '';
      }
    }
  },
  watch: {
    async valueList() {
      console.log(this.valueList);
      this.dealGamename = this.valueList?.[0]?.['gamename'];
    }
  },
  methods: {
    async GameConfigCancel() {
      this.gameChangedialogFormVisibleVip = false;
      this.gameConfig = this.$options.data().gameConfig;
      this.$refs['GameConfig'].resetFields();
    },
    async GameConfigSubmit() {
      let errTrou = await this.$refs['GameConfig'].validate().catch(err=>false);
      if (!errTrou) {return;}
      let sendtrue = await this.$confirm(`是否确认修改游戏配置?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning' })
        .catch(err => false);
      if (!sendtrue) {return;}
      const loading = this.$loading({
        lock: true,
        text: '拼命加载中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.8)'
      });
      let { code } = await changeGameConfig(this.gameConfig);
      if (+code === 200) {
        this.$message.success('修改成功');
        this.GameConfigCancel();
      }
      loading.close();
    }
    
  },
  async mounted() {
  
   
    // let a = require('./style.css');
    
    // let link = document.createElement('link');
    // link.setAttribute('rel', 'stylesheet');
    // link.setAttribute('href', './style.css');
    // document.getElementById('gamemanagement-user').appendChild(link);
    // console.log(this.valueList);
  },
  async created() {

  }
};
</script>

<style lang="scss" rel="stylesheet/scss">
.gamemanagement-user{
    /* backface-visibility: hidden; */
    background-repeat: round;
    width: 100%;
    height: 100%;
    /* background-repeat: no-repeat; */
    background-size: cover;
    .gamemanagement-user-click{
        width: 100%;
        height: 100%;
        display: grid;
      grid-template-columns: 20% 60% 20%;
    justify-content: center;
    justify-items: center;
    justify-self: center;
    align-self: center;
    align-items: center;
    flex-direction: row;
    }
   
}
</style>

<style  src='./tests.css' scoped></style>
<style  src='./style.css' scoped></style>
