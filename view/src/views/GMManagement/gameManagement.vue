<template>
  <div v-if="gradele9999" class="gamemanagement" :style="backgroundColor">
     <div v-if="gradele9999" class="game-header">
      <div class="game-header-create">
          <i class="el-icon-plus game-header-icon" @click="createFormAlertTrue"></i>
          <i class="el-icon-refresh-right game-header-icon" @click="createTableList"></i>
      </div>
       
      <div class="game-header-list">
          <div  @click="chechouk=true">
            <svg-icon v-if="chechouk" icon-class="game-grid-true"></svg-icon>
             <i v-else class="el-icon-s-grid"></i>
          </div>
        <!-- <div :class="{'game-header-list-chechouk':!chechouk}" @click="chechouk=false"> -->
        <div  @click="chechouk=false">
            <svg-icon v-if="chechouk" icon-class="list-game"></svg-icon>
            <svg-icon v-else icon-class="list-game-true"></svg-icon>
        </div>
      </div>
     <div class="game-header-back">
        <span></span>
        <el-color-picker
          v-model="color"
          size="mini"
          show-alpha
          :predefine="predefineColors"
        ></el-color-picker>
      </div>
    </div>
     <gameIndex v-if="chechouk" ></gameIndex>
    <gameList v-else :backgroundColor="backgroundColor"></gameList>
             
  <el-dialog title="游戏创建" :visible.sync="gameCreatedialogFormVisible"  class="eldialog-gamemanement"  :close-on-click-modal="false" @close='createCancel'>
      <el-form ref="createForm"  prop='file'  label-width="100px"   :model='createForm' :rules="createFormRules"  class='createFormAlert'> 
        <el-form-item label="游戏封面上传" class="gameimgupload" prop="file">
          <el-upload
          class="avatar-uploader"
          action="#"
          :show-file-list="false"
         :http-request="fileUpload" 
         :accept="'.jpg,.jpeg,.png'">
          <img v-if="imageUrl" ref="img" :src="imageUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      
        <!-- <el-upload
          class="upload-demo"
          drag
          action="#"
          multiple>
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div slot="tip" class="uploadTest">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload> -->
        </el-form-item>
        <el-form-item label="游戏名称" prop="gameName">
          <el-input v-model="createForm.gameName" placeholder="请输入游戏名称"></el-input>
        </el-form-item>
        <el-form-item label="设置管理员" prop="userId">
           <el-select v-model="createForm.userId" filterable  clearable placeholder="请选择">
            <el-option
              v-for="item in userList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div style="display: flex;justify-content: flex-end;">
        <el-button type="danger" plain @click="createCancel">取消</el-button>
        <el-button type="primary" plain @click="createFormSubmit">确定</el-button>
      </div>
    </el-dialog>

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


<el-dialog title="游戏修改" :visible.sync="gameChangedialogFormVisible"  class="eldialog-gamemanement"  :close-on-click-modal="false" @close='changeCancel'>
      <el-form ref="changeForm"  prop='file'  label-width="100px"   :model='changeForm' :rules="changeFormRules"  class='createFormAlert'> 
        <el-form-item label="游戏封面上传" class="gameimgupload" prop="file">
          <el-upload
          class="avatar-uploader"
          action="#"
          :show-file-list="false"
         :http-request="changeFileUpload" 
         :accept="'.jpg,.jpeg,.png'">
          <img v-if="changeForm.imageUrl" ref="img" :src="changeForm.imageUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        </el-form-item>
        <el-form-item label="游戏名称" prop="gameName">
          <el-input v-model="changeForm.gameName" placeholder="请输入游戏名称" @change="changeForm.gameNameChange = true"></el-input>
        </el-form-item>
        <el-form-item   label="设置管理员" prop="userId">
           <el-select v-model="changeForm.userId" filterable clearable  placeholder="请选择" @change="changeForm.userIdChange = true">
            <el-option
              v-for="item in userList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div style="display: flex;justify-content: flex-end;">
        <el-button type="danger" plain @click="changeCancel">取消</el-button>
        <el-button type="primary" plain @click="changeFormSubmit">确定</el-button>
      </div>
    </el-dialog>
  </div>
  <gameUser v-else :valueList='valueList'></gameUser>
</template>

<script>


import { getQueryGame, getQueryUserList, getPostCreateGame, deleteGame } from '@/api/gameGm';
import { changeGame, changeGameConfig } from '@/api/gameGm';
import gameIndex from './game/index';
import gameUser from './game/gameuser';
import gameList from './game/gamelist';
export default {
  name: 'GameTest',
  components: {
    gameIndex,
    gameUser,
    gameList
  },
  watch: {
    color(n) {
      if (!n) {this.color = this.$options.data().color;}
    }
  },
  data() {
    let userIdRule = (rule, value, callback) =>{
      if (value) {
        return callback();
      }
      return callback(new Error('请选择用户'));
    };
    let gameNameRule = (rule, value, callback) =>{
      if (value) {
        return callback();
      }
      return callback(new Error('请输入游戏名称'));
    };
    let fileRule = (rule, value, callback) =>{
      
      let { name } = value; 
      if (name) {
        name = name.split('.').pop();
        switch (name) {
          case 'jpeg':break;
          case 'jpg':break;
          case 'png':break;
          default:
            return callback(new Error('不支持的文件类型'));
        }
      }
      if (!value) {
        return callback(new Error('请选择文件'));
      }
      
      return callback();
    };
    let changefileRule = (rule, value, callback) =>{
      if (!this.$data.changeForm.iamgeChange) {
        return callback();
      }
      let { name } = value; 
      if (name) {
        name = name.split('.').pop();
        switch (name) {
          case 'jpeg':break;
          case 'jpg':break;
          case 'png':break;
          default:
            return callback(new Error('不支持的文件类型'));
        }
      }
      if (!value) {
        return callback(new Error('请选择文件'));
      }
      
      return callback();
    };
    let color = '';
    let predefineColors = [
      '#ededed',
      '#ff4500',
      '#ff8c00',
      '#ffd700',
      '#90ee90',
      '#00ced1',
      '#1e90ff',
      '#c71585',
      'rgba(255, 69, 0, 0.68)',
      'rgb(255, 120, 0)',
      'hsv(51, 100, 98)',
      'hsva(120, 40, 94, 0.5)',
      'hsl(181, 100%, 37%)',
      'hsla(209, 100%, 56%, 0.73)',
      '#c7158577'
    ];
    return {
      color,
      predefineColors,
      chechouk: true,
      tests: false,
      mousehover: false,
      gameCreatedialogFormVisible: false,
      gameChangedialogFormVisible: false,
      gameChangedialogFormVisibleVip: false,
      valueList: [],
      userList: [],
      createForm: {
        userId: '',
        gameName: '',
        file: ''
      },
      gameConfig: {
        userName: '',
        userToken: '',
        eventName: '',
        eventToken: ''
      },
      changeForm: {
        imageUrl: '',
        gameNameChange: '',
        userIdChange: '',
        userId: '',
        gameName: '',
        file: '',
        id: '',
        iamgeChange: ''
      },
      imageUrl: '',
      createFormRules: {
        userId: { validator: userIdRule, trigger: ['blur', 'change'] },
        gameName: { validator: gameNameRule, trigger: ['change'] },
        file: { validator: fileRule, trigger: ['blur', 'change'] }
      },
      changeFormRules: {
        userId: { validator: userIdRule, trigger: ['blur', 'change'] },
        gameName: { validator: gameNameRule, trigger: ['change'] },
        file: { validator: changefileRule, trigger: ['blur', 'change'] }
      },
      gameConfigRules: {
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
      }
    };
  },
  computed: {
    grade() {
      return this.$route.meta.grade;       
    },
    gradele9999() {
      return +this.grade === 9999; 
    },
    backgroundColor() {
      return `background-color: ${this.color};`;
    }
  },
  methods: {
    async createFormAlertTrue() {
      this.gameCreatedialogFormVisible = true;
      let { code, data } = await getQueryUserList();
      if (+code === 200) {
        this.userList = data;
      }
    },
    async changeFormDialogShow(datas) {
      if (this.gradele9999) {
        this.gameChangedialogFormVisible = true;
        let { gamename, id, url, userid } = datas;
        this.changeForm.gameName = gamename;
        this.changeForm.imageUrl = url;
        this.changeForm.id = id;
        this.changeForm.userId = +userid;
        let { code, data } = await getQueryUserList();
        if (+code === 200) {
          this.userList = data;
        }
      } else {
        this.gameChangedialogFormVisibleVip = true;

        return;
      }
      
    },
    async removeGame(data) {
      let { gamename } = data;
      let sendtrue = await this.$confirm(`是否确认删除游戏->>${gamename}?`, '提示', {
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
      let { code } = await deleteGame(data);
      if (+code === 200) {
        this.$message.success('游戏删除成功');
      }
      loading.close();
      window.location.reload();
    },
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
    },
    async changeFormSubmit() {
      let { gameNameChange, userIdChange, iamgeChange } = this.changeForm;
      let AlertMessage;
      if (gameNameChange || userIdChange || iamgeChange) {
        AlertMessage = `
        您修改了 ${gameNameChange ? '游戏名 ' : ''}${userIdChange ? '管理员 ' : ''}${iamgeChange ? '游戏封面' : ''}`;
      } else {return;}
      let errTrou = await this.$refs['changeForm'].validate().catch(err=>false);
      if (!errTrou) {return;}
      
      let sendtrue = await this.$confirm(`是否确认修改游戏? ${AlertMessage}`, '提示', {
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
      let postData = this.changeForm;
      let Form = new FormData();
      for (let i in postData) {
        Form.append(i, postData[i]);
      }
      let { code } = await changeGame(Form);
      if (+code === 200) {
        this.$message.success('修改成功。');
        await this.createTableList();
        window.location.reload();
        this.changeCancel();
      }
      loading.close();

    },
    async changeCancel() {
      this.gameChangedialogFormVisible = false;
      this.changeForm = this.$options.data().changeForm;
      this.$refs['changeForm'].resetFields();
    },
    async createFormSubmit() {
      let errTrou = await this.$refs['createForm'].validate().catch(err=>false);
      if (!errTrou) {return;}
      let sendtrue = await this.$confirm(`是否确认添加游戏?`, '提示', {
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
      let postData = this.createForm;
      let Form = new FormData();
      for (let i in postData) {
        Form.append(i, postData[i]);
      }
      let { code } = await getPostCreateGame(Form);
      loading.close();
      if (+code === 200) {
        this.$message.success('游戏添加成功');
        window.location.reload();
        this.createCancel();
      }
    },
    async createCancel() {
      this.gameCreatedialogFormVisible = false;
      this.imageUrl = '';
      this.createForm = this.$options.data().createForm;
      this.$refs['createForm'].resetFields();
    },
    async changeFileUpload({ file }) {
      this.changeForm.file = file;
      this.changeForm.imageUrl = URL.createObjectURL(file);
      this.changeForm.iamgeChange = true; 
    },
    async fileUpload({ file }) {
      this.createForm.file = file;
      this.imageUrl = URL.createObjectURL(file);
      // let img = new Image();
      // let canvas = document.createElement('canvas');
      // Object.assign(canvas, {
      //   width: 100,
      //   height: 100
      // });
      // var ctx = canvas.getContext('2d');
      // Object.assign(img, {
      //   src: URL.createObjectURL(file)
      // });
      // img.addEventListener('load', res => {
      //   URL.revokeObjectURL(file);
      //   let { width, height } = img;
      //   ctx.drawImage(img, 0, 0, width, height, 0, 0, 100, 100);
      //   let src = canvas.toDataURL();
      //   this.imageUrl = src;
      //   URL.revokeObjectURL(src);
      // });
     
    },
    async createTableList() {
      let { code, data } = await getQueryGame();
      if (+code === 200) {
        this.valueList = data;
      }
    }
  },
  async mounted() {

    // let { code, data } = await getQueryGame();
    // if (+code === 200) {
    //   this.valueList = data;
    // }
  },
  async created() {
    await this.createTableList();
  }
};
</script>

<style lang="scss" rel="stylesheet/scss">

.gamemanagement{
  height: 100%;
  width: 100%;
  .gameimgupload {
    .avatar-uploader .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
      border-color: #409eff;
    }
    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 20vw;
      height: 10vw;
      line-height: 10vw;
      text-align: center;
    }
    .avatar {
      width: 20vw;
      height: 10vw;
      min-width: 300px;
      min-height: 150px;
      display: block;
    }
  }
   .eldialog-gamemanement > div:first-child {
    min-width: 500px;
    .el-select {
      width: 100%;
    }
  }
   .uploadTest {
    margin-top: -2vh;
    margin-left: 3vw;
  }
  .game-header {
    height: 5%;
    width: 100%;
    // background-color: #888888;
        background-color: rgba(0,0,0,.7);
    color: white;
    display: flex;
    justify-content: space-between;
    .game-header-icon {
      font-size: 130%;
      text-align: center;
      padding: 0%;
      margin: 0%;
      margin-left: 10px;
      cursor: pointer;
    }
    .game-header-back {
      display: flex;
      float: right;
      align-self: center;
      align-items: center;
    }
    .game-header-list{
        display:flex;
        height: 100%;
        font-size: 130%;
        text-align: center;
        align-self: center;
        align-items: center;
        align-content: center;
        margin-inline-start: auto;
        margin-right: 1%;
        &>div:first-child{
          padding-right: 20%;
        }
        .game-header-list-chechouk{
            height: 100%;
            text-align: center;
            align-self: center;
            align-items: center;
            align-content: center;
            justify-content: center;
            justify-items: center;
            justify-self: center;
            display: flex;
            background-color: black;
            width: 100%;
        }
    }
    .game-header-create{
        height: 100%;
        width: 30%;
        display: flex;
        align-items: center;
    }
  }

}
</style>
