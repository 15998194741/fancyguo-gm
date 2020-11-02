<template>
  <div ref="rechaContainer" class="anno-container">
    <div class="role-container-header" >
    <ul style="margin-top: 5px;margin-bottom: -5px;margin-right: 10px;">
      <li><el-button slot="reference" icon="el-icon-refresh" size='small' class="button-with-header" @click='filterFormChangeFlush' >刷新</el-button></li>
      <li><el-button v-if="grade" slot="reference" icon="el-icon-circle-plus-outline" size='small' class="button-with-header"  @click='dialogFormVisiblechangealter' >新建公告</el-button></li>
      <li><el-button  v-if="grade" slot="reference" icon="el-icon-mouse" :disabled='send' size='small' class="button-with-header"  @click='dialogFormVisiblesend = true' >发布</el-button></li>
    </ul>
  </div>
  <div class="role-container-search">
    <div class="server-container">公告ID：
      <el-input v-model="filterForm['bulletinid']" placeholder="请输入公告ID" size='small' class="input-with-select" >
      </el-input>
      <el-button slot="append" icon="el-icon-search" size='small' class="button-with-select" name='truesearch' @click="filterFormChange('click')">
      </el-button>
    <span>  发布时间：</span>
      <el-date-picker   v-model="filterForm['setime']"  size='small' type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"   @change="filterFormChange('change')">
      </el-date-picker>
    </div>
   
    <div class="comprehensive-container">
      <div v-for='(i,index) in selectForm' :key='index'  class="select-item"  > {{i.label}}:
        <el-select v-model="filterForm[i.key]" :multiple="i['multiple']"  clearable :collapse-tags="i['collapse']"  placeholder="请选择" size='small' style="border-radius: 10px;" @change="filterFormChange('change')" >
          <el-option v-for="(item,index) in i.options" :key="index"  :label='item.label' :value="item.value" >
          </el-option>
        </el-select>
      </div>
    </div>
  </div>

  <div id='body' class="role-container-body">
    <annotable :tableData='tableData' ></annotable>
  </div>
  <div class="role-container-bottom">
    <el-pagination
    style="text-align: right;"
    :page-size.sync="filterForm['pagesize']"
    :page-sizes="[10, 20, 30, 40]"
    background
    layout="total, sizes, prev, pager, next, jumper"
    :pager-count='9'  
    :hide-on-single-page="false"  
    :total="total"
    :current-page.sync='filterForm.page'
    @size-change="filterFormChange('change')"
    @current-change="filterFormChange('change')" ></el-pagination>
  </div>



     <createForm v-bind="{selectForm}"></createForm>
  




  <el-dialog title="公告发布" :visible.sync="dialogFormVisiblesend" class="announceddialog"  :close-on-click-modal="false">
  <div class='tablesendheader' style="min-height: 5vh;">
    <el-form :inline="true"  class="demo-form-inline">
  <el-form-item label="">
     <el-switch
    v-model="sendtime"
    active-text="实时发送"
    inactive-text="定时发送"
    :active-value="false"
    :inactive-value="true"> </el-switch>
  </el-form-item>
   <el-form-item label="结束时间" >
   <el-date-picker
      v-model="endtime"
      type="datetime"
      placeholder="选择日期时间">
    </el-date-picker>
  </el-form-item>
    <el-form-item   v-show='sendtime' label="发送时间" style="margin-left:3vw;">
   <el-date-picker
      v-model="sendtimes"
      type="datetime"
      placeholder="选择日期时间">
    </el-date-picker>
  </el-form-item>
</el-form>
    
  </div>
    <div class="">
      <el-table
      ref="multipleTable"
      border
      class="tablesendclass"
      :data="tableTrue" 
      >
      <el-table-column v-for='(column,index) in tablecolumn' :key='index'  :label="column.label">
        <template slot-scope="scope">{{ scope.row[column.prop] }}</template>
      </el-table-column>
    </el-table>
   </div>
     <div slot="footer" class="dialog-footer">
       <el-button @click="dialogFormVisiblesend = false">取 消</el-button>
       <el-button type="primary" @click='postsendannounced'>确 定</el-button>
     </div>
   </el-dialog>



   <el-dialog title="公告修改" :visible.sync="dialogBulletinFormchange" class="announceddialog"  :close-on-click-modal="false">
    <div class="container">
       <div >  
         <el-form ref="form"  label-width="80px">
           <el-form-item label="公告ID:">
             <el-input v-model="changebulletindata['id']" disabled style="width: 80%;" placeholder="请输入内容"></el-input>
           </el-form-item>
           <el-form-item label="公告正文:">
             <el-input
             v-model="changebulletindata['text']"
             type="textarea"
             style="width: 80%;"
             :rows="8"
             placeholder="请输入内容">
 </el-input>
           </el-form-item>
           </el-form>
       </div>
       <div>
         <el-form v-if="changebulletindata['type'] === '公告板'"  ref="form" label-width="80px" >
           <el-form-item label="公告标题:" hide-required-asterisk>
             <el-input v-model="changebulletindata['title']" placeholder="请输入内容"></el-input>
           </el-form-item>
         <!-- <el-form-item label="公告图片:" hide-required-asterisk>
           <a href="javascript:;" class="a-upload">
           <input  id='uploadimage'    type='file'  @change='fileupload'> 点击上传文件
         </a>{{fileName}}
         </el-form-item> -->
         <el-form-item label="公告链接:">
           <el-input v-model="changebulletindata['link']" placeholder="请输入内容"></el-input>
         </el-form-item>
         </el-form>
         <el-form v-if="changebulletindata['type'] === '跑马灯'" ref="form" label-width="80px" >
           <el-form-item label="开始时间:" hide-required-asterisk>
            <el-date-picker
            v-model="changebulletindata['start_time']"
            :picker-options="{
                disabledDate: time => {
                  return time.getTime() <  Date.now() - 3600 * 1000 * 24
                }
              }" 
            type="datetime" class="alertcontant" placeholder="选择日期时间" @change='changeQueryMarqueeweights'>
          </el-date-picker>
           </el-form-item>
         <el-form-item label="结束时间:" hide-required-asterisk>
           <el-date-picker
           v-model="changebulletindata['end_time']"
           type="datetime"
           placeholder="选择日期时间"
           @change='changeQueryMarqueeweights'>
         </el-date-picker>
         </el-form-item>
         <el-form-item label="平台:">
           <el-select v-model="changebulletindata['plaform']" disabled placeholder="请选择" size='small' style="border-radius: 10px;" >
           </el-select>
         </el-form-item>
         <el-form-item label="渠道:">
           <el-select v-model="changebulletindata['client']" multiple disabled placeholder="请选择" size='small' style="border-radius: 10px;" ></el-select>
         </el-form-item>
         <el-form-item label="服务器:">
           <el-select v-model="changebulletindata['servername']" disabled multiple placeholder="请选择" size='small' style="border-radius: 10px;" ></el-select>
         </el-form-item>
         <el-form-item label="时间间隔:">
           <el-input  v-model.number="changebulletindata['time_interval']" placeholder="请输入内容"></el-input>
         </el-form-item>
         <el-form-item label="权重:"  prop='weights'>
          <el-select   v-model="changebulletindata['weights']"  placeholder="请选择" size='small' style="border-radius: 10px;" >
            <el-option v-for="(item,index) in Marqueeweights"   :key="index"  :label='item.label' :value="item.value" >
            </el-option></el-select>
        </el-form-item>
         </el-form>
       </div>
   </div>
     <div slot="footer" class="dialog-footer">
       <el-button @click="dialogBulletinFormchange = false">取 消</el-button>
       <el-button type="primary" @click='putchangeoneannounced'>确 定</el-button>
     </div>
   </el-dialog>
  </div>
</template>

<script>
import { deepCopy } from '@/utils/zoneSettings';
import { findComponents } from '@/api/components.js';
import { putchangeoneannouncedreq, getqueryMarqueeweights } from '@/api/announcedManagement';
import { postsendAnnouncement, getqueryAnnouncement } from '@/api/announcedManagement';
import { findServername } from '@/api/character.js';
import dayjs from 'dayjs';
import ANNO from './componts/anno';
import annotable from './componts/table';
import createForm from './componts/create';
import { loading, close, secondConfirmation } from '@/views/loading';

export default {
  name: 'announcedmanage',
  components: {
    annotable,
    createForm
  },
  data() {
    return {
      changebulletindata: '',
      dialogBulletinFormchange: false,
      sendtime: false,
      sendtimes: '',
      endtime: '',
      dialogFormVisiblesend: false,
      file: [],
      total: 0,
      filterForm: {
        bulletinid: '',
        setime: '',
        plaform: '',
        channel: '',
        servername: '',
        type: '',
        page: 1,
        pagesize: 10
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
      selectForm: [{
        label: '游戏平台',
        multiple: true,
        collapse: false,
        key: 'plaform',
        value: '',
        options: [
          {
            label: '安卓',
            value: '1'

          }, {
            label: '苹果',
            value: '2'
          }]
      }, {
        label: '游戏渠道',
        key: 'channel',
        multiple: true,
        collapse: true,
        value: '',
        options: []
      },
      {
        label: '服务器名称',
        key: 'servername',
        multiple: true,
        collapse: true,
        value: '',
        options: []
      }, {
        label: '公告类型',
        key: 'type',
        multiple: false,
        collapse: true,
        value: '',
        options: [{
          label: '不限制',
          value: ''
        }, {
          label: '跑马灯',
          value: '1'

        }, {
          label: '公告板',
          value: '2'
        }]
      }],
      tableData: [],
      tablecolumn: [
        { label: '公告ID', prop: 'id' },
        { label: '公告类型', prop: 'type' },
        { label: '平台', prop: 'plaform' },
        { label: '渠道', prop: 'client' },
        { label: '区服名称', prop: 'servername' },
        { label: '公告标题', prop: 'title' },
        { label: '公告状态', prop: 'anno_status' },
        { label: '开始时间', prop: 'stime' },
        { label: '结束时间', prop: 'etime' }
      ],
      fileName: '',
      tableTrue: [],
      Marqueeweights: []
    };
  }, 
  computed: {
    send() {
      return this.tableTrue.length > 0 ? false : true;
    },
    grade() {
      if (+this.$route.meta.grade === 0) {
        return false;
      }
      return true;
    }
  },
  methods: {
    async changeQueryMarqueeweights(val) {
      if (val !== 'index') {
        this.changebulletindata['weights'] = '';
      }
      this.Marqueeweights = [];
      let { start_time: stime, end_time: etime, plaform, client, servername } = this.changebulletindata;
      switch (plaform) {
        case '不限制':plaform = ''; break;
        case '安卓':plaform = '1'; break;
        case '苹果':plaform = '2'; break;
      }
      let res = await getqueryMarqueeweights({ stime, etime, plaform, client, servername });
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
    },
    

    async putchangeoneannounced() {
      let { code } = await putchangeoneannouncedreq(this.changebulletindata);
      if (+code === +200) {this.dialogBulletinFormchange = false; this.filterFormChangeget(); this.$message.success('修改成功'); return;}
      this.$message.warning('修改失败');
    },
    async postsendannounced() {
      loading(this);
      
      let sendtime = this.sendtimes ? dayjs(this.sendtimes).format('YYYY-MM-DD HH:mm:ss') : '';
      if (!this.sendtime) {sendtime = dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss');}
      if (!sendtime) {this.$message.info('请选择开始时间'); close(this); return;}
      if (new Date().getTime() > new Date(sendtime).getTime() && this.sendtimes) {this.$message.info('开始时间错误'); close(this); return;}
      if (!this.endtime) {this.$message.info('请选择结束时间'); close(this); return;}
      if (new Date().getTime() > new Date(this.endtime).getTime() || new Date(this.endtime).getTime() <= new Date(sendtime).getTime()) {this.$message.info('结束时间错误'); close(this); return;}
      let sendtrue = await secondConfirmation(this, '是否确认发布。');
      if (!sendtrue) {close(this); return;}
      let res = await postsendAnnouncement({ data: this.tableTrue, sendtime, sendtimes: this.sendtimes, endtime: dayjs(this.endtime).format('YYYY-MM-DD HH:mm:ss') });
      if (res.code !== 200) {close(this); return;}
      this.$message.success('发布成功');
      this.dialogFormVisiblesend = false; 
      this.sendtimes = '';
      this.sendtime = false; 
      this.endtime = '';
      this.filterFormChangeget();
      close(this);
    },
   
    placardmodify(index, row) {
      this.dialogBulletinFormchange = true;
      this.changebulletindata = deepCopy(row);
      this.changeQueryMarqueeweights('index');
    },
    dialogFormVisiblechangealter() {
      ANNO.$emit('eialog', true);
    },
    fileupload(e) {
      this.createForm['images'] = e.target.files[0];
      this.fileName = this.createForm['images'].name;
    },
    filterFormChange(val) {
      this.$refs['rechaContainer'].parentElement.scrollTo({
        top: 0, 
        behavior: 'smooth' 
      });
      switch (val) {
        case 'click':this.filterFormChangeClick(); break;
        case 'change':this.filterFormChangeget(); break;
        case 'flush':this.filterFormChangeFlush(); break;
        case 'page':this.filterFormChangePage(); break;
      }
    },
    async filterFormChangeFlush() {
      this.filterForm = this.$options.data().filterForm;
      this.filterFormGET(this.filterForm);
    },
    filterFormChangeClick() {
      for (let key in this.filterForm) {
        if (key === 'bulletinid' || key === 'page' || key === 'pagesize') {
          continue;
        }
        this.filterForm[key] = '';
      }
      this.filterFormGET(this.filterForm);
    },
    filterFormChangeget() {
      this.filterForm['bulletinid'] = '';
      this.filterFormGET(this.filterForm);
    },
    async filterFormGET(value) {
      let res = await getqueryAnnouncement(this.filterForm);
      if (+res.code !== +200) {this.tableData = []; return;} 
      this.tableData = res.data.res;
      this.total = +res.data.total;
      this.tableData.map(item =>{
        try {
          item['stime'] = item.stime ? dayjs(item.stime).format('YYYY-MM-DD HH:mm:ss') : '';   
          item['etime'] = item.etime ? dayjs(item.etime).format('YYYY-MM-DD HH:mm:ss') : '';    
        } catch (err) {
          console.log(err);
        }
        switch (+item.anno_status) {
          case 1: item['anno_status'] = '停用'; item.changeshow = false; item.stopshow = false; break;
          case 2: item['anno_status'] = '发布中'; item.changeshow = false; item.stopshow = true; break;
          case 3: item['anno_status'] = '发布失败'; item.changeshow = false; item.stopshow = false; break;
          case 4: item['anno_status'] = '发布完成'; item.changeshow = false; item.stopshow = true; break;
          case 5: item['anno_status'] = '发布结束'; item.changeshow = false; item.stopshow = false; break;
          default:item['anno_status'] = '待用'; item.changeshow = true; item.stopshow = true;
        }
        return item;
      });
    }
  },
  async mounted() {
    ANNO.$on('tableChange', ({ index, row }) => {this.placardmodify(index, row);});
    ANNO.$on('tableTrue', data => {this.tableTrue = data;});
    ANNO.$on('flush', data => {this.filterFormChangeget();});
    let { data: { values }} = await findComponents({ code: 'areaclothing', gameid: this.gameid });
    let components = values.map(item=>({
      label: item,
      value: item
    }));
    this.selectForm[1].options = this.selectForm[1].options.concat(components);
    this.clientOptions = components;
 
    let { data } = await findServername();
    data.map(item =>{
      this.selectForm[2].options.find(ele => ele.label === item.label) || !item.label ? item : this.selectForm[2].options.push(item);
    });
    this.filterFormChange('click');
  }


  
};
</script>

<style lang="scss" rel="stylesheet/scss">
  .anno-container{
  .tablesendclass{
  }
  .tablesendheader{
    /* display: flex;
    align-items: baseline; */
  }
.announceddialog{
    input {
      // width: 15vw;
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

.success-row td:first-child div{
  visibility: hidden;
}

  .selectID {
  
    span:first-child{
      display: none;
      
    }
  }


  .success-feng{
    background-color: rgba(255,0,0,0.4);
  }
  .success-jiny{
    background-color: rgba(255,155,0,0.3);

  }
  .el-table td, .el-table th.is-leaf{
    text-align: center;
  }
    .demo-table-expand{
      display: grid;
      grid-template-columns: repeat(3,1fr);
      width: 100%;
      margin-left: 3%;
      font-size: 18px;
      label{
        width: 140px;
      color: #99a9bf;
      }
    .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 100%;
    display: flex;
    label{
      float: left;
    }
    /* text-align: center; */
  }
    }
  .role-container-body{
    margin: 10px;
    background-color: white;
    border-radius: 5px;
    padding: 5px;
    min-height: 66vh;
    /* -webkit-box-shadow: 1px 1px 4px 0px #828282; */
    box-shadow: 1px 1px 4px 0px #828282;
    .el-table .cell{
      word-break: keep-all;
    } 
  }
  .role-container-header ul li{
    float: right;
    margin-left: 2px;
    button{
      border-radius: 30px;
    }
    button:focus{
      box-sizing: content-box;
    }

  }
  .role-container-header ul{
    display: flex;
    justify-content: flex-end;
  }
  .server-container {
        border-bottom: 1px #bdbdbd dashed;
        padding: 10px;
      }
      .input-with-select {
      width: 250px;
      margin-left: -4px;
      border-radius: 30px 0 0 30px;

      input {
        border-radius: 30px 0 0 30px;
      }
    }
    .comprehensive-container {
      width: 100%;
     
      .select-item {
        
      width: 20%;
      &>.comprehensive-container-label{
          width: 30%;
        }
      &>div{
        width: 70%;
      }
    }

      input {
        border-radius: 10px;
      }

    }
      .comprehensive-container {
        display: flex;
        padding: 10px;
        align-items: baseline;

      }
      .role-container-search {
      margin: 10px;
      background-color: white;
      border-radius: 5px;
      padding: 5px;
      box-shadow: 1px 1px 4px 0px #828282;
      button[name='truesearch']{
            border-radius: 0 30px 30px 0;
            margin-left: -5px;
            height: 32px;
            margin-right: 20px;
      }
      input[name='idselect'] {
      border-radius: 30px 0 0 30px;
      width: 100px;
      /* height: 30px; */
    }
      .server-container {
        border-bottom: 1px #bdbdbd dashed;
      }

      .comprehensive-container {
        display: flex;
        padding: 10px;
        align-items: baseline;

      }
    }

    .createFormAlertBodys div{
      display: flex;
    }

    .createFormAlert{
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: center;
      .el-select{
        display: block;
      }
  }






}


</style>

