<template>
<div class="announceddialog-create">
   <el-dialog title="新建公告" :visible.sync="eialog" class="announceddialog"  :close-on-click-modal="false">
   <div class="headradio"> 
     <el-radio v-model="radio"  :label="true">跑马灯</el-radio>
     <el-radio v-model="radio" :label="false">公告板</el-radio>
  </div>
   <div class="container">
      <div >  
        <el-form ref="createForm"  :model="createForm" :rules="textrule" label-width="80px">
          <!-- <el-form-item label="公告ID:">
            <el-input v-model="createForm['bulletinid']" disabled style="width: 80%;" placeholder="请输入内容"></el-input>
          </el-form-item> -->
          <el-form-item label="公告正文:" prop='text' >
            <el-input
            v-model="createForm['text']"
            type="textarea"
            style="width: 80%;"
            :rows="8"
            placeholder="请输入内容"></el-input>
          </el-form-item>
          </el-form>
      </div>
      <div>
        <!-- //公告板 -->
        <el-form v-show='!radio' ref="createFormbulletin" :model="createForm" :rules="announcementrule" label-width="80px" >
          <el-form-item label="公告标题:"  prop='title'>
            <el-input v-model="createForm.title" placeholder="请输入内容"  ></el-input>
          </el-form-item>
          <el-form-item label="公告图片:" hide-required-asterisk >
            <div style="display: grid;">
            <a href="javascript:;" class="a-upload" style="width: 15vw;">
            <input  id='uploadimage'    type='file'  @change='fileupload'> 点击上传文件 </a>
            <span>{{fileName}}</span>
            </div>
          </el-form-item>
        <el-form-item label="公告链接:" prop='a' >
          <el-input v-model="createForm['a']" placeholder="请输入内容"></el-input>
        </el-form-item>
         <el-form-item label="公告类型:"  >
          <el-select v-model="createForm.range"   placeholder="请选择" size='small' style="border-radius: 10px;" >
            <el-option   label='游戏外公告（登录界面展示的公告）' value="1" ></el-option>
            <el-option   label='游戏内公告（进入游戏后展示的公告）' value="2" ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-show="+createForm.range !== 1" label="平台:" prop='plaform'>
          <el-select v-model="createForm.plaform" clearable multiple placeholder="请选择" size='small' style="border-radius: 10px;" >
            <el-option   label='安卓' value="1" ></el-option>
            <el-option   label='苹果' value="2" ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item  v-show="createChannelShow" label="渠道:" prop='channel'>
          <el-select v-model="createForm.channel" multiple clearable placeholder="请选择" size='small' style="border-radius: 10px;"   @change='queryMarqueeweights'>
            <el-option v-for="(item,index) in selectForm[1].options"   :key="index"  :label='item.label' :value="item.value" >
            </el-option>
          </el-select>
        </el-form-item>
          <el-form-item v-show="createServerShow" label="服务器:" >
          <el-select v-model="createForm.servername" multiple placeholder="请选择" size='small' style="border-radius: 10px;" >
            <el-option v-for="(item,index) in servernamesselect"   :key="index"  :label='item.label' :value="item.value" >
            </el-option>
          </el-select>
        </el-form-item>
        </el-form>


        <!-- //跑马灯 -->
        <el-form v-show='radio' ref="createFormMarqueeRule" :rules='createFormMarqueeRules' :model="createForm"  label-width="80px" >
          <el-form-item label="开始时间:" prop='stime'>
            <el-date-picker
            v-model="createForm['stime']"
            type="datetime"
             :picker-options="{
                disabledDate: time => {
                  return time.getTime() <  Date.now() - 3600 * 1000 * 24
                }
              }" 
            placeholder="选择日期时间"
            @change='queryMarqueeweights'>
          </el-date-picker>
          </el-form-item>
        <el-form-item label="结束时间:" prop='etime'>
          <el-date-picker
          v-model="createForm['etime']"
          type="datetime"
          :picker-options="{
                disabledDate: time => {
                  return time.getTime() <  Date.now() - 3600 * 1000 * 24 
                }
              }" 
          placeholder="选择日期时间"
          @change='queryMarqueeweights'>
        </el-date-picker>
        </el-form-item>
        <el-form-item label="平台:" prop='plaform'>
          <el-select v-model="createForm.plaform"  clearable multiple placeholder="请选择" size='small' style="border-radius: 10px;" @change='queryMarqueeweights' >
            <el-option   label='安卓' value="1" ></el-option>
             <el-option   label='苹果' value="2" ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-show="createChannelShow" label="渠道:">
          <el-select v-model="createForm.channel" multiple  clearable placeholder="请选择" size='small' style="border-radius: 10px;" @change='queryMarqueeweights' >
            <el-option v-for="(item,index) in selectForm[1].options"   :key="index"  :label='item.label' :value="item.value" >
            </el-option></el-select>
        </el-form-item>
        <el-form-item  v-show="createServerShow" label="服务器:">
          <el-select v-model="createForm['servername']" multiple  clearable placeholder="请选择" size='small' style="border-radius: 10px;" @change='queryMarqueeweights' >
            <el-option v-for="(item,index) in servernamesselect"   :key="index"  :label='item.label' :value="item.value" >
            </el-option></el-select>
        </el-form-item>
        <el-form-item label="时间间隔:" prop='interval'>
          <el-input v-model.number="createForm['interval']" placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item label="权重:"  prop='weights'>
          <el-select  v-model="createForm['weights']"  placeholder="请选择" size='small' style="border-radius: 10px;" >
            <el-option v-for="(item,index) in Marqueeweights"   :key="index"  :label='item.label' :value="item.value" >
            </el-option></el-select>
        </el-form-item>
        </el-form>
      </div>

  </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="createFormCancel">取 消</el-button>
      <el-button type="primary" @click='postannounced'>确 定</el-button>
    </div>
  </el-dialog>
  </div>
</template>
  
<script>
import { postcreateAnnouncement, getqueryservernames } from '@/api/announcedManagement';
import { getqueryMarqueeweights } from '@/api/announcedManagement';
import { loading, close, secondConfirmation } from '@/views/loading';
import ANNO from './anno';
export default {
  name: 'userauth',
  props: {
   
    selectForm: {
      type: Array,
      default: ()=>[]
    }
  },
  data() {
    var dateruleone = (rule, value, callback) =>{
      if (!value) {
        return callback(new Error('请选择一个时间'));
      }
      if (new Date() > value) {
        return callback(new Error('不可以选择超过现在时间得时间'));
      }
      callback();
    };
    var dateruletwo = (rule, value, callback) =>{
      if (!value) {
        return callback(new Error('请选择一个时间'));
      }
      if (new Date(value) <= this.createForm['stime']) {
        return callback(new Error('结束时间不可等于或小于开始时间'));
      }
      callback();
    };
    var intervalFormRule = (rule, value, callback) =>{
      if (!value) {
        return callback(new Error('请输入时间间隔'));
      }
      if (!/^[0-9]*$/.test(value)) {
        return callback(new Error('请输入纯数字'));
      }
      callback();
    };
    var titleruleone = (rule, value, callback) =>{
      if (!value) {
        return callback(new Error('请至少输入一个字符'));
      }
      callback();
    };
    var linkruleone = (rule, value, callback) =>{
      if (!value) {
        return callback(new Error('请至少输入一个字符'));
      }
      callback();
    };
    var textruleone = (rule, value, callback) =>{
      if (!value) {
        return callback(new Error('请至少输入一个字符'));
      }
      callback();
    };
    return {
      eialog: false,
      radio: true,
      createFormMarqueeRules: { 
        stime: [{ validator: dateruleone, trigger: ['blur', 'change'] }],
        etime: [{ validator: dateruletwo, trigger: ['blur', 'change'] }],
        interval: [{ validator: intervalFormRule, trigger: ['blur', 'change'] }],
        weights: [{ validator: linkruleone, trigger: ['blur', 'change'] }]
      },
      announcementrule: { 
        title: [{ validator: titleruleone, trigger: ['blur', 'change'] }]
        //   a: [{ validator: linkruleone, trigger: ['blur', 'change'] }] 
      },
      textrule: {
        text: [
          { validator: textruleone, trigger: ['blur', 'change'] }
        ]      
      },
      createForm: {
        bulletinid: '',
        stime: '',
        etime: '',
        plaform: [],
        channel: [],
        servername: '',
        interval: '',
        weights: '',
        title: '',
        images: '',
        a: '',
        text: '',
        range: '1'
      },
      Marqueeweights: [],
      servernamesselect: [],
      fileName: ''
    };
  },
  watch: {
  
  },
  computed: {
    grade() {
      if (+this.$route.meta.grade === 0) {
        return false;
      }
      return true;
    },
    createServerShow() {
      let { createForm: { plaform, channel }} = this;
      if (!plaform || plaform.length === 0) {this.createForm.channel = []; return false;}
      if (!channel || channel.length === 0) {this.createForm.servername = []; return false;}
      this.createForm.servername = [];
      return true;
    },
    createChannelShow() {
      let { createForm: { plaform }} = this;
      if (!plaform || plaform.length === 0) {this.createForm.channel = []; return false;}
      return true;
    }
  },
  methods: {
    arrayUnique(arr, name) {
      let hash = {};
      if (!arr || JSON.stringify(arr) === '[]') {return;}
      return arr.reduce(function(item, next) {
        hash[next[name]] ? '' : hash[next[name]] = true && item.push(next);
        return item;
      }, []);
    },
    async fileupload(e) {
      this.createForm['images'] = e.target.files[0];
      this.fileName = this.createForm['images'].name;
    },
    async createFormCancel() {
      this.eialog = false;
      this.$refs['createFormbulletin'].resetFields();
      this.$refs['createForm'].resetFields();
      this.createForm = this.$options.data().createForm;
    },
    async postannounced() {
      loading(this);
      let maintext = await this.$refs['createForm'].validate().catch(err=>false);
      let allRules = this.radio ? await this.$refs['createFormMarqueeRule'].validate().catch(err=>false) : await this.$refs['createFormbulletin'].validate().catch(err=>false);
      if (!allRules || !maintext) {close(this); return;}
      let sendTrue = await secondConfirmation(this, '确认创建公告。');
      if (!sendTrue) {close(this); return;}
      let a = new FormData();
      for (let [key, value] of Object.entries(this.createForm)) {
        a.append(key, value);
      }
      if (this.radio) {a.append('type', 1);} else {a.append('type', 2);}
      let res = await postcreateAnnouncement(a);
      if (res.code !== 200) {close(this); return; }
      for (let key in this.createForm) {
        this.createForm[key] = '';
      }
      this.file = '';
      this.fileName = '';
      this.eialog = false;
      ANNO.$emit('flush', true);
      let { data: { id }} = res;
      this.$message.success(`创建成功id为${id}!`); 
      this.$refs['createForm'].resetFields();
      close(this);
    },
    async queryMarqueeweights() {
      this.createForm['weights'] = '';
      let { stime, etime, plaform, channel, servername } = this.createForm;
      if (plaform && channel) {
        let servername = await getqueryservernames({ channel, plaform });
        let { data } = servername;
        this.servernamesselect = this.arrayUnique(data, 'value');
      } else {
        this.createForm['servername'] = '';
        this.servernamesselect = [];
      }
      let res = await getqueryMarqueeweights({ stime, etime, plaform, channel, servername });
      let { data } = res;
      this.Marqueeweights = data.filter(a => a.value);
      let arr1 = [
        { label: 1, value: 1 },
        { label: 2, value: 2 },
        { label: 3, value: 3 },
        { label: 4, value: 4 },
        { label: 5, value: 5 },
        { label: 6, value: 6 },
        { label: 7, value: 7 },
        { label: 8, value: 8 },
        { label: 9, value: 9 },
        { label: 10, value: 10 }
      ];
      this.Marqueeweights = arr1.filter(item => {
        return !this.Marqueeweights.some(ele => +ele.label === +item.label);
      });
    }
   
  },
  async  mounted() {
    ANNO.$on('eialog', a => {this.eialog = true;});
  
  }
};
</script>
  
<style lang="scss" rel="stylesheet/scss">
.announceddialog-create{
.announceddialog{
    input {
      width: 15vw;
    }
    textarea{
      width: 15vw;
    }
        .headradio{
          margin-left: 3%;
           margin-top: -2%;
        }
      .container{
        display: grid;
        grid-template-columns: 2fr 2fr;
        margin-top: 2%;
      }
      #file-upload-button{
        display: none;
      }
      .a-upload {
    position: relative;
    background: #D0EEFF;
    border: 1px solid #99D3F5;
    border-radius: 4px;
    padding: 4px 12px;
    overflow: hidden;
    color: #1E88C7;
    text-decoration: none;
    text-indent: 0;
    line-height: 20px;
    margin-right: 10px;
}
.a-upload input {
    position: absolute;
    /* font-size: 100px; */
    bottom: 0;
    top: 0;
    left: 0;
    opacity: 0;
}
.a-upload:hover {
    background: #AADFFD;
    border-color: #78C3F3;
    color: #004974;
    text-decoration: none;
}
      /* #uploadimage{
        border: 0;
    padding: 0;
    border-radius: 0;
    height: 100%;
    line-height: 200%;

    -webkit-appearance: none;
    background-color: #FFF;
    background-image: none;
    border: 1px solid #DCDFE6;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    color: #606266;
    display: inline-block;
    font-size: inherit;
    outline: 0;
    -webkit-transition: border-color .2s cubic-bezier(.645,.045,.355,1);
    transition: border-color .2s cubic-bezier(.645,.045,.355,1);
    width: 100%;
    
    display: inline-block;
    background: #D0EEFF;
    border: 1px solid #99D3F5;
    border-radius: 4px;
    padding: 4px 12px;
    overflow: hidden;
    color: #1E88C7;
    text-decoration: none;
    text-indent: 0;
    line-height: 20px;

        :hover{
          background: #AADFFD;
          border-color: #78C3F3;
          color: #004974;
          text-decoration: none;
        } */
        
      /* } */
}

}


</style>
  
