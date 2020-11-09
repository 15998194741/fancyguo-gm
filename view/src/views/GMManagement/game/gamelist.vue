<template>
  <div class="gamemanagement-list" >
    <div >
        <ul class="gamemanagement-list-ul" >
            <li v-for="(i, index) in valueList"       :key="index" class="gamemanagement-list-ul-li">
                <div class="gamemanagement-list-ul-li-div" >
                    <div :style="`background-image: url(${i['url']});`">
                    </div>
                    <div class="gamemanagement-list-ul-li-div-font">
                       <span> {{i['gamename']}}</span>
                    </div>
                    <div class="gamemanagement-list-ul-li-div-button">
                     <el-button type="warning" @click="changeFormDialogShow(i)">修改</el-button>
                     <el-button type="danger" @click="removeGame(i)">删除</el-button>
                    </div>
                </div>
                <!-- {{i}} -->
            </li>
        </ul>
      <!-- <el-row
        v-for="(i, index) in valueList"
        :key="index"
        :class="{ teststs: gradele9999 }"
      >
        <el-col :span="32" style="display: flex">
          <div class="gamephoto"  :style="`background-image: url(${i.url});`" @mouseover="GameClick(index)"  @mouseout="GameClick(index)">
            <circleButton
              v-if="gradele9999"
              :refName="`${index}`"
            ></circleButton>
            <el-col class="gamename"><span>{{ i.gamename }}</span>
            </el-col>
          </div>
        </el-col>
      </el-row> -->
    </div>

    <el-dialog
      title="游戏创建"
      :visible.sync="gameCreatedialogFormVisible"
      class="eldialog-gamemanement"
      :close-on-click-modal="false"
      @close="createCancel"
    >
      <el-form
        ref="createForm"
        prop="file"
        label-width="100px"
        :model="createForm"
        :rules="createFormRules"
        class="createFormAlert"
      >
        <el-form-item label="游戏封面上传" class="gameimgupload" prop="file">
          <el-upload
            class="avatar-uploader"
            action="#"
            :show-file-list="false"
            :http-request="fileUpload"
            :accept="'.jpg,.jpeg,.png'"
          >
            <img v-if="imageUrl" ref="img" :src="imageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="游戏名称" prop="gameName">
          <el-input
            v-model="createForm.gameName"
            placeholder="请输入游戏名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="设置管理员" prop="userId">
          <el-select
            v-model="createForm.userId"
            filterable
            clearable
            placeholder="请选择"
          >
            <el-option
              v-for="item in userList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div style="display: flex; justify-content: flex-end">
        <el-button type="danger" plain @click="createCancel">取消</el-button>
        <el-button
type="primary" plain @click="createFormSubmit"
          >确定</el-button
        >
      </div>
    </el-dialog>

    <el-dialog
      title="游戏配置"
      :visible.sync="gameChangedialogFormVisibleVip"
      class="eldialog-gamemanement"
      :close-on-click-modal="false"
      @close="GameConfigCancel"
    >
      <el-form
        ref="GameConfig"
        prop="file"
        label-width="100px"
        :model="gameConfig"
        :rules="gameConfigRules"
        class="createFormAlert"
      >
        <el-form-item label="user表名:" prop="userName">
          <el-input
            v-model="gameConfig.userName"
            placeholder="请输入user表名"
          ></el-input>
        </el-form-item>
        <el-form-item label="userToken:" prop="userToken">
          <el-input
            v-model="gameConfig.userToken"
            placeholder="请输入userToken"
          ></el-input>
        </el-form-item>
        <el-form-item label="event表名:" prop="eventName">
          <el-input
            v-model="gameConfig.eventName"
            placeholder="请输入event表名"
          ></el-input>
        </el-form-item>
        <el-form-item label="eventToken:" prop="eventToken">
          <el-input
            v-model="gameConfig.eventToken"
            placeholder="请输入eventToken"
          ></el-input>
        </el-form-item>
      </el-form>
      <div style="display: flex; justify-content: flex-end">
        <el-button
type="danger" plain @click="GameConfigCancel"
          >取消</el-button
        >
        <el-button
type="primary" plain @click="GameConfigSubmit"
          >确定</el-button
        >
      </div>
    </el-dialog>

    <el-dialog
      title="游戏修改"
      :visible.sync="gameChangedialogFormVisible"
      class="eldialog-gamemanement"
      :close-on-click-modal="false"
      @close="changeCancel"
    >
      <el-form
        ref="changeForm"
        prop="file"
        label-width="100px"
        :model="changeForm"
        :rules="changeFormRules"
        class="createFormAlert"
      >
        <el-form-item label="游戏封面上传" class="gameimgupload" prop="file">
          <el-upload
            class="avatar-uploader"
            action="#"
            :show-file-list="false"
            :http-request="changeFileUpload"
            :accept="'.jpg,.jpeg,.png'"
          >
            <img
              v-if="changeForm.imageUrl"
              ref="img"
              :src="changeForm.imageUrl"
              class="avatar"
            />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="游戏名称" prop="gameName">
          <el-input
            v-model="changeForm.gameName"
            placeholder="请输入游戏名称"
            @change="changeForm.gameNameChange = true"
          ></el-input>
        </el-form-item>
        <el-form-item label="设置管理员" prop="userId">
          <el-select
            v-model="changeForm.userId"
            filterable
            clearable
            placeholder="请选择"
            @change="changeForm.userIdChange = true"
          >
            <el-option
              v-for="item in userList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div style="display: flex; justify-content: flex-end">
        <el-button type="danger" plain @click="changeCancel">取消</el-button>
        <el-button
type="primary" plain @click="changeFormSubmit"
          >确定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getQueryGame,
  getQueryUserList,
  getPostCreateGame,
  deleteGame
} from '@/api/gameGm';
import { changeGame, changeGameConfig } from '@/api/gameGm';
// import circleButton from './circlebutton';

import gameIndex from './gameindex';
export default {
  name: 'GameIndex',
  components: {
    
  },
  props: {
    backgroundColor: {
      type: String,
      default: ''
    }
  },
  data() {
    let userIdRule = (rule, value, callback) => {
      if (value) {
        return callback();
      }
      return callback(new Error('请选择用户'));
    };
    let gameNameRule = (rule, value, callback) => {
      if (value) {
        return callback();
      }
      return callback(new Error('请输入游戏名称'));
    };
    let fileRule = (rule, value, callback) => {
      let { name } = value;
      if (name) {
        name = name.split('.').pop();
        switch (name) {
          case 'jpeg':
            break;
          case 'jpg':
            break;
          case 'png':
            break;
          default:
            return callback(new Error('不支持的文件类型'));
        }
      }
      if (!value) {
        return callback(new Error('请选择文件'));
      }

      return callback();
    };
    let changefileRule = (rule, value, callback) => {
      if (!this.$data.changeForm.iamgeChange) {
        return callback();
      }
      let { name } = value;
      if (name) {
        name = name.split('.').pop();
        switch (name) {
          case 'jpeg':
            break;
          case 'jpg':
            break;
          case 'png':
            break;
          default:
            return callback(new Error('不支持的文件类型'));
        }
      }
      if (!value) {
        return callback(new Error('请选择文件'));
      }

      return callback();
    };
    return {
      mousehover: false,
      chechouk: true,
      color: '#ededed',
      predefineColors: [
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
      ],
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
        userName: {
          validator: (rule, value, callback) => {
            if (value) {
              return callback();
            }
            return callback(new Error('请输入User表名'));
          },
          trigger: ['blur', 'change']
        },
        userToken: {
          validator: (rule, value, callback) => {
            if (value) {
              return callback();
            }
            return callback(new Error('请输入UserToken'));
          },
          trigger: ['blur', 'change']
        },
        eventName: {
          validator: (rule, value, callback) => {
            if (value) {
              return callback();
            }
            return callback(new Error('请输入Event表名'));
          },
          trigger: ['blur', 'change']
        },
        eventToken: {
          validator: (rule, value, callback) => {
            if (value) {
              return callback();
            }
            return callback(new Error('请输入EventToken'));
          },
          trigger: ['blur', 'change']
        }
      }
    };
  },
  computed: {
    grade() {
      return this.$route.meta.grade;
    },
    gradele9999() {
      return +this.grade === 9999;
    }
    // backgroundColor() {
    //   return `background-color: ${this.color};`;
    // }
  },
  methods: {
 
    async GameClick(index) {
      this.gradele9999
        ? gameIndex.$emit('DivClick', index)
        : this.changeFormDialogShow(this.valueList[0]);

      //   this.valueList[index]['menuTrue'] = !this.valueList[index]['menuTrue'];
    },
    async tesst() {
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
      let sendtrue = await this.$confirm(
        `是否确认删除游戏->>${gamename}?`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch((err) => false);
      if (!sendtrue) {
        return;
      }
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
      let errTrou = await this.$refs['GameConfig']
        .validate()
        .catch(e => false);
      if (!errTrou) {
        return;
      }
      let sendtrue = await this.$confirm(`是否确认修改游戏配置?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(e => false);
      if (!sendtrue) {
        return;
      }
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
        AlertMessage = `您修改了 ${gameNameChange ? '游戏名 ' : ''}${userIdChange ? '管理员 ' : ''}${iamgeChange ? '游戏封面' : ''}`;
      } else {
        return;
      }
      let errTrou = await this.$refs['changeForm']
        .validate()
        .catch((err) => false);
      if (!errTrou) { return; }

      let sendtrue = await this.$confirm(`是否确认修改游戏? ${AlertMessage}`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
      ).catch(err => false);
      if (!sendtrue) { return; }
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
      let errTrou = await this.$refs['createForm']
        .validate()
        .catch((err) => false);
      if (!errTrou) {
        return;
      }
      let sendtrue = await this.$confirm(`是否确认添加游戏?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch((err) => false);
      if (!sendtrue) {
        return;
      }
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
    },
    async createTableList() {
      this.valueList = [];
      let { code, data } = await getQueryGame();
      if (+code !== 200) {return;}
      this.valueList = data;
    }
  },
  async mounted() {
    gameIndex.$on('ChangeClick', ({ index, change }) => {
      let value = this.valueList[+index];
      change ? this.changeFormDialogShow(value) : this.removeGame(value);
    });
  },
  async created() {
    await this.createTableList();
  }
};
</script>

<style lang="scss" rel="stylesheet/scss">
.gamemanagement-list {
  position: relative;
  left: 0;
  top: 0;
     padding-left: 1%;
    width: 100%;
    padding-right: 1%;
  min-height: 95%;
  .gamemanagement-list-ul{
      padding-top: 5vh;
      .gamemanagement-list-ul-li{
          height: 10vh;
          .gamemanagement-list-ul-li-div{
              &:hover{
                  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
                  border-radius: 4px;
                  border: 1px solid #ebeef5;
              }
              display: flex;
              width: 100%;
              height: 90%;
              align-items: center;
              justify-content: space-between;
                  background-color: rgba(0,0,0,0.5);
              &> div:first-child{
                  width: 16vh;
                  height: 9vh;
                  background-repeat: round;
                  background-size: cover;
                
              }
              .gamemanagement-list-ul-li-div-font{
                height: 100%;
                align-self: center;
                align-items: center;
                align-content: center;
                text-align: center;
                justify-content: flex-start;
                justify-items: center;
                justify-self: center;
                display: flex;
                color: white;
                flex-grow:10;
                &>span:first-child{
                    margin-left: 1vw;
                }
              }
              .gamemanagement-list-ul-li-div-button{
                  padding-right: 1vw;
                  height: 100%;
                  display: flex;
                    align-self: center;
                align-items: center;
                align-content: center;
                text-align: center;
                justify-content: center;
                justify-items: center;
                justify-self: center;
              }
              
          }
      }
  }
 

  .eldialog-gamemanement > div:first-child {
    min-width: 500px;
    .el-select {
      width: 100%;
    }
  }

  
}
</style>
