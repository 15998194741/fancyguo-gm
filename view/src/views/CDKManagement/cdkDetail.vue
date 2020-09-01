<template>
  <div
ref="CDKContainer" v-loading='cdkLoading' 
  class="CDK-container"
   element-loading-text="拼命加载中" 
   element-loading-spinner="el-icon-loading"
   element-loading-background="rgba(0, 0, 0, 0.8)">
    <div class="role-container-header" >
    <ul style="margin-top: 5px;margin-bottom: -5px;margin-right: 10px;">
      <li><el-button slot="reference" icon="el-icon-refresh" size='small' class="button-with-header"  @click="tableDataShwo = !tableDataShwo" >刷新</el-button></li>
      <li><el-button slot="reference" icon="el-icon-refresh" size='small' class="button-with-header"  @click="tableDataShwo = !tableDataShwo" >查看CDK信息</el-button></li>
    </ul>
  </div>
  <div class="role-container-search">
    <div class="server-container">ID：
      <el-select v-model="filterForm.key"     placeholder="请选择" name='idselect' size='small' class="selectID">
        <el-option v-for="(item, index) in idoptions" :key="index" :label="item.label" :value="item.value"></el-option>
      </el-select>
      <el-input v-model="filterForm.value" placeholder="请输入内容" size='small' class="input-with-select" ></el-input>
      <el-button slot="append" icon="el-icon-search" size='small' class="button-with-select" name='truesearch' @click="filterFormChange('click')"></el-button>
    </div>
   
    <div class="comprehensive-container">
      <div v-for='(i,index) in selectForm' :key='index'  class="select-item"  > {{i.label}}:
        <el-select v-model="filterForm[i.key]" :multiple="i['multiple']" placeholder="请选择" size='small' style="border-radius: 10px;" @change="filterFormChange('change')" >
          <el-option v-for="(item,index) in i.options" :key="index"  :label='item.label' :value="item.value" >
          </el-option>
        </el-select>
      </div>
     <div class="timefilter"> 领取时间:  <el-date-picker   v-model="filterForm['takeEffectTime']"  size='small' type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"   @change="filterFormChange('change')"></el-date-picker></div> 
     <!-- <div class="timefilter"> 失效时间:  <el-date-picker   v-model="filterForm['srtfailureTimetime']"  size='small' type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"  @change="filterFormChange('change')"></el-date-picker></div>  -->
 </div>
  </div>

  <div v-show='tableDataShwo' id='v-show-test-body' class="role-container-body-one">
    <el-table
    ref="multipleTable"
    border
    :data="tableData" 
    >
    <el-table-column v-for='(column,index) in tablecolumn' :key='index' :label="column.label">
      <template slot-scope="scope">  <div v-if="typeof scope.row[column.prop] === 'string' || typeof scope.row[column.prop] === 'number' ">
        {{ scope.row[column.prop] }}
        </div>
        <div v-else>
          <el-tag v-for='(i,index) in  scope.row[column.prop]' :key="index">{{ i }}</el-tag>
          </div>  </template>
    </el-table-column>
  </el-table>
  </div>
    <div id='body' :class="tableDataShwo?'role-container-body-two':'role-container-body-there'">
    <el-table
    ref="multipleTable"
    border
    :data="tableDataTwo" 
    >
    <el-table-column v-for='(column,index) in tablecolumnTwo' :key='index' :label="column.label">
      <template slot-scope="scope">  <div v-if="typeof scope.row[column.prop] === 'string' || typeof scope.row[column.prop] === 'number' ">
        {{ scope.row[column.prop] }}
        </div>
        <div v-else>
          <el-tag v-for='(i,index) in  scope.row[column.prop]' :key="index">{{ i }}</el-tag>
          </div>  </template>
    </el-table-column>
  </el-table>
  </div>
  <div class="role-container-bottom">
    <el-pagination
    style="text-align: right;"
    :page-size.sync="filterForm['pagesize']"
    :page-sizes="[100, 150, 200,250 ]"
    background
    layout="total, sizes, prev, pager, next, jumper"
    :pager-count='9'  
    :hide-on-single-page="false"  
    :total="total"
    :current-page.sync='filterForm.page'
    @size-change="filterFormChange('pagechange')"
    @current-change="filterFormChange('pagechange')" ></el-pagination>
  </div>




  <el-dialog
  title="新建CDK" :visible.sync="dialogFormchange" class="announceddialog"
:close-on-click-modal="false"  @close='createFormMailCancel' >
<div
v-loading='creatinng'
   element-loading-text="拼命加载中" 
   element-loading-spinner="el-icon-loading"
   element-loading-background="rgba(0, 0, 0, 0.8)">
    <div
        class="container"  
        >
        <div>  
          <el-form ref="createFormRulesLeft" :model="createForm" status-icon :rules="createFormRulesLeft" label-width="100px" class="demo-ruleForm">
             <el-form-item  label="名称" prop="name">
                  <el-input v-model="createForm['name']" class="create-form-input" placeholder="请输入名称"  autocomplete="off"> </el-input>
             </el-form-item>
             <el-form-item  label="CDK类型:" prop="type">
                   <el-select  v-model="createForm['type']"  class="create-form-select" placeholder="请选择" size='small' style="border-radius: 10px;"  >
                    <el-option   label='唯一CDK' value="1" ></el-option>
                    <el-option   label='互斥CDK' value="2" ></el-option>
                      <el-option   label='通用CDK' value="3" ></el-option>
                  </el-select>
             </el-form-item>
               <el-form-item  v-show="createForm['type'] === '1'" label="CDKKEY:" prop="cdkkey">
                  <el-col :span="16">
                  <el-input  v-model.number="createForm['cdkkey']" class="create-form-input-CDKKEY"   placeholder="请输入CDKKEY" autocomplete="off"> </el-input>
                  </el-col>
                  <el-col :span="5">
                    <el-button type="primary" @click="cdkKeyGenerate">一键生成</el-button>
                  </el-col>
             </el-form-item>
              <el-form-item  label="CDK数量:" prop="quantity">
                  <el-input  v-model.number="createForm['quantity']"  class="create-form-input" :disabled="onlyOneCdkSelect" placeholder="请输入数量" autocomplete="off"> </el-input>
             </el-form-item>
          <el-form-item label="平台:"  prop="plaform">
                  <el-select   v-model="createForm['plaform']"  class="create-form-select"   placeholder="请选择" size='small'   multiple style="border-radius: 10px;" >
                    <el-option   label='安卓' value="1" ></el-option>
                    <el-option   label='苹果' value="2" ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="客户端:" prop="channel">
                  <el-select  v-model="createForm['channel']"  class="create-form-select"  multiple  placeholder="请选择" size='small' style="border-radius: 10px;">
                    <el-option v-for="(item,index) in selectForm[1].options"   :key="index"  :label='item.label' :value="item.value" >
                    </el-option>
                  </el-select>
                </el-form-item>
                 <el-form-item label="生效时间:" prop="takeEffectTime">
                 <el-date-picker
                     v-model="createForm['takeEffectTime']"
                    type="datetime"
                    class="el-date-picker-Cdk-takeEffectTime"
                    :picker-options="{
                                   disabledDate: time => {
                                      return time.getTime() < Date.now() - 3600 * 1000 * 24
                                    },
                                  
                                  }"
                    placeholder="选择日期时间">
                    </el-date-picker>
                </el-form-item>
                 <el-form-item label="失效时间:" prop="failureTime">
                  <el-date-picker
                  v-model="createForm['failureTime']"
                  class="el-date-picker-Cdk-takeEffectTime"
                  type="datetime"
                    :picker-options="{
                                   disabledDate: time => {
                                      return time.getTime() < Date.now() - 3600 * 1000 * 24
                                    },
                                  
                                  }"
                    placeholder="选择日期时间">
                    </el-date-picker>
                </el-form-item>
           </el-form>
        </div>
              <div>
           <el-form ref="createFormRulesRight" :model="createForm" status-icon :rules="createFormRulesRight" label-width="100px" class="demo-ruleForm">
               <el-form-item  label="邮件标题" prop="title">
                  <el-input v-model="createForm['title']" class="create-form-input" placeholder="请输入名称"  autocomplete="off"> </el-input>
             </el-form-item>
            
             <el-form-item label="邮件正文" prop="text">
              <el-input v-model='createForm["text"]' type="textarea"  :rows='6' autocomplete="off"></el-input>
            </el-form-item>
             <el-form-item label="邮件内容" prop="annexList">
               <el-form-item v-for='(item,index) in  createForm["annexList"]' :key='item.id' class="annexList"  prop="pass">
                    <el-row style="margin-top: 1px;">
                    <el-col :span='10' style="width:37.66667%" >
                      <el-cascader
                      v-model="createForm['annexList'][index]['annexName']"
                      class="annexcssSetting"
                      :show-all-levels="false"
                      :props="annexProps"
                      :options='annexOptions'
                    ></el-cascader>
                       </el-col>
                  <el-col  :span='5'><el-input  v-model.number="createForm['annexList'][index]['annexNumber']"  class="annexcssSetting"  placeholder="数量"  autocomplete="off"></el-input>  </el-col>
                       <el-col :span='3'>
                          <el-button type="danger" icon="el-icon-remove"  @click='annexListCut(index)' ></el-button>
                      </el-col>
                      </el-row>
                      </el-form-item>
                      <i class="el-icon-circle-plus" style="font-size: 200%;margin-top: 5px;"  @click='annexListAdd'></i>
            </el-form-item>
           </el-form>
              </div>
   </div>
     <div slot="footer" class="dialog-footer">
       <el-button @click="createFormMailCancel">取 消</el-button>
       <el-button type="primary" @click='createFormSubmit'>确 定</el-button>
     </div>
    </div>
   </el-dialog>
     <!-- <el-backtop target=".page-component__scroll .el-scrollbar__wrap" :bottom="100">
    <div
      style="{
        height: 100%;
        width: 100%;
        background-color: #f2f5f6;
        box-shadow: 0 0 6px rgba(0,0,0, .12);
        text-align: center;
        line-height: 40px;
        color: #1989fa;
      }"
    >
      UP
    </div>
  </el-backtop> -->
  </div>
</template>

<script>
// import json2csv from 'json2csv';
import { findComponents } from '@/api/components.js';
import { getQueryAnnexOptionsLazy, getQueryAnnexOptions } from '@/api/mail.js';
import { generateCodeFrame } from './cdkGenerate.js';
import { CDKcreate, CDKFind, cdkDownload, detailsFind } from '@/api/cdk'; 
import { cdkkeyfind } from '@/api/cdk'; 
import dayjs from 'dayjs';
let id = 0;
export default {
  name: 'CDKmanagement',
  data() {
    let quantity, annexList;
 
    quantity = (rule, value, callback) =>{
      if (/^[0-9]*$/.test(value)) {
        return callback();
      }
      return callback(new Error('请输入正整数'));
    };
    annexList = (rule, value, callback) =>{
      for (let i of value) {
        if (!(i.annexName)) {
          return callback(new Error('请选择附件'));
        }
        if (!(/^[0-9]*$/.test(i['annexNumber'])) && i['annexNumber'].length >= 1 || !i['annexNumber']) {
          return callback(new Error('内容数量为正整数'));
        }
      }
      return callback();
    };
    let failureTimeRules = (rule, value, callback) =>{
      if (!this.$data.createForm['takeEffectTime']) {
        let a = this.$data.createForm['takeEffectTime']; 
        this.$data.createForm['takeEffectTime'] = 1;
        this.$data.createForm['takeEffectTime'] = a;
        return callback(new Error('请选择生效时间'));

      }
      if (value <= this.$data.createForm['takeEffectTime']) {
        this.$data.createForm['takeEffectTime'] = this.$data.createForm['takeEffectTime'];
        return callback(new Error('失效时间无效'));
      }
      return callback();
    };
    let takeEffectTime = (rule, value, callback) =>{
      if (!this.$data.createForm['failureTime']) {
        this.$data.createForm['failureTime'] = this.$data.createForm['failureTime'];
        return callback(new Error('请选择失效时间'));
      }
      if (value >= this.$data.createForm['failureTime']) {
        this.$data.createForm['failureTime'] = this.$data.createForm['failureTime'];
        return callback(new Error('生效时间无效'));
      }
      return callback();
    };
    let cdkkey = (rule, value, callback) =>{
      if (this.$data.createForm['type'] === '1') {
        if (!value) {
          return callback(new Error('请输入CDKKEY,不想手输可以使用自动生成功能'));

        }
      }
      return callback();
    };
    return {
      total: 0,
      creatinng: false,
      cdkLoading: false,
      annexProps: {
        expandTrigger: 'hover',
        lazy: true,
        async lazyLoad(node, resolve) {
          let { label } = node;
          let { data: nodes } = await getQueryAnnexOptionsLazy({ label });
          resolve(nodes);
        }
      },
      tableDataShwo: false,
      annexOptions: [],
      dialogFormchange: false,
      tableDataTwo: [],
      filterForm: {
        key: 'CDKID',
        value: '',
        plaform: '',
        channel: '',
        takeEffectTime: '',
        failureTime: '',
        page: 1,
        pagesize: 100
      },
      createForm: {
        name: '',
        type: '',
        cdkkey: '',
        quantity: '',
        plaform: '',
        channel: '',
        takeEffectTime: '',
        failureTime: '',
        title: '',
        text: '',
        annexList: [
          { annexName: '', annexNumber: '', id }
        ]
      },
      selectForm: [{
        label: '平台',
        multiple: false,
        key: 'plaform',
        value: '',
        options: [
          {
            label: '不限制',
            value: ''
          }, {
            label: 'Android',
            value: '1'

          }, {
            label: 'IOS',
            value: '2'
          }]
      }, {
        label: '客户端',
        key: 'channel',
        multiple: true,
        value: '',
        options: []
      }
      ],
      idoptions: [{
        label: 'CDKID',
        value: 'CDKID'
      }, {
        label: 'CDKKEY',
        value: 'CDKKEY'
      }
      ],
      tableData: [],
      tablecolumn: [
        { label: 'CDKID', prop: 'id' },
        { label: '名称', prop: 'name' },
        { label: '平台', prop: 'plaforms' },
        { label: '客户端', prop: 'channel' },
        { label: 'CDKEY类型', prop: 'type' },
        { label: 'CDKEY数量', prop: 'num' },
        { label: '生效日期', prop: 'start_time' },
        { label: '失效日期', prop: 'end_time' },
        { label: 'CDKEY内容', prop: 'annexs' }
      ],
      tablecolumnTwo: [
        { label: 'CDKKEYID', prop: '_id' },
        { label: '用户ID', prop: 'roleid' },
        { label: '平台', prop: 'plaform' },
        { label: '客户端', prop: 'channel' },
        { label: 'CDKKEY', prop: 'key' },
        { label: '是否领取', prop: 'isUse' },
        { label: '领取时间', prop: 'receive' }
      ],
      createFormRulesLeft: {
        name: { required: true, message: '请输入CDK名称', trigger: ['blur', 'change'] },
        type: { required: true, message: '请输入选择一种cdk类型', trigger: ['blur', 'change'] },
        quantity: [{ required: true, message: '请输入cdk数量', type: 'integer', trigger: ['blur', 'change'] }, { validator: quantity, trigger: ['blur', 'change'] }],
        cdkkey: { validator: cdkkey, trigger: ['blur', 'change'] },
        plaform: { required: true, message: '请选择平台，如果不限制请两个同时选中。', trigger: ['blur', 'change'] },
        channel: { required: true, message: '请选择至少一个客户端', trigger: ['blur', 'change'] },
        takeEffectTime: [{ required: true, message: '请选择生效时间' },
          { validator: takeEffectTime }],
        failureTime: [{ required: true, message: '请选择失效时间' }, { validator: failureTimeRules }]
      },
      createFormRulesRight: {
        title: { required: true, message: '请输入标题', trigger: ['blur', 'change'] },
        text: { required: true, message: '请输入正文', trigger: ['blur', 'change'] },
        annexList: { validator: annexList, trigger: ['blur', 'change'] }
      }
    };
    
  },
  computed: {
    onlyOneCdkSelect() {
      if (this.createForm['type'] === '1') {
        this.createForm['quantity'] = 1;
        return true;
      }
      return false;
    }
  },  
  methods: {
    async downloadCDK(val) {
      let tablename = val['row']['cdkid'];
      let activityname = val['row']['name'];
      let res = await cdkDownload({ tablename });
      require.ensure([], () => {
        const { export_json_to_excel: exportJsonToExcel } = require('@/Excel/Export2Excel');//注意这个Export2Excel路径
        // let tHeader = ['cdkkey']; 
        let excelval = res.split(`\n`);
        let tHeader = [excelval[0]]; 
        var list = []; //把要导出的数据tableData存到list
        for (let i of excelval.slice(1, excelval.length)) {
          var a = [i];
          list.push(a);
        }
        exportJsonToExcel(tHeader, list, activityname);//最后一个是表名字
      });
    },
    async viewDetails(data) {
      // let tablename = data['row']['cdkid'];
      this.$router.push({
        path: '/CDKManagement/cdkDetail',
        query: {
          ...data['row']
        }
      });
    },
    handleSelectionChange() {
      
    },
    cdkKeyGenerate() {
      this.createForm['cdkkey'] = generateCodeFrame();  
    },
    async createFormSubmit() {
      this.creatinng = true;
      let right = await this.$refs['createFormRulesRight'].validate().catch(err=>false);
      let left = await this.$refs['createFormRulesLeft'].validate().catch(err=>false);
      if (!(right && left)) {this.creatinng = false; return;}
      let { code, data } = await CDKcreate(this.createForm);
      if (+code !== +200) {this.$message.info('创建失败'); this.creatinng = true; return; }
      this.creatinng = false;
      this.$message.success(`创建成功,您创建的CDKID为   ${data}`);
      
    },
    createFormMailCancel() {
      this.$refs['createFormRulesLeft'].resetFields();
      this.$refs['createFormRulesRight'].resetFields();
      this.dialogFormchange = false;
      this.createForm['annexList'] = [
        { annexName: '', annexNumber: '', id }
      ];
    },
    filterFormChange(val) {
      switch (val) {
        case 'click':this.filterFormChangeClick(); break;
        case 'change':this.filterFormChangeChange(); break;
        case 'pagechange':this.filterFormChangeSubmit(); break;
        default:this.filterFormChangeFlush();
      }
    },
    async filterFormChangeClick() {
      for (let i in this.filterForm) {
        if (i === 'value' || i === 'key' || i === 'pagesize') {continue;}
        this.filterForm[i] = '';
      }
      this.filterForm['page'] = 1;

      this.filterFormChangeSubmit();
    },
    async filterFormChangeChange() {
      if (this.tableDataTwo.length < 2) {return;}
      this.filterFormChangeSubmit();
    },
    async filterFormChangeSubmit() {
      this.tableDataShwo = true;
      const loading = this.$loading({
        lock: true,
        text: '拼命加载中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.8)'
      });
      let { code, data } = await CDKFind(this.filterForm);
      if (+code !== 200) {
        this.tableData = [];
        loading.close();
        return;
      }
      let { res } = data;
      this.tableData = res;
      let { pagesize, page, value, key } = this.filterForm;
      if (res.length === 0) {
        this.$message.warning(`查找${key},${value}不存在`);
        this.tableDataTwo = [];
        this.tableData = [];
        loading.close();
        return;
      } else if (res.length !== 1) {
        loading.close();
        return;
      }
      let { cdkid: tablename } = res[0];
      let querys = { page, tablename, pagesize };
      let queryByKey = { page, tablename, pagesize, value };
      // let responseData;
      switch (!!value) {
        case key === 'CDKKEY': await this.ByCdkKey(queryByKey); break;
        case key === 'CDKID':await this.ByCdkID(querys); break;
      }
   
      // let { data: detailsdata } = responseData;
      // let { res: detailsres, total } = detailsdata;
      // this.total = total;
      // this.tableDataTwo = key === 'CDKKEY' ? [detailsdata] : detailsres;
      // if (this.tableDataTwo) {
      //   this.tableDataTwo.map(item => {
      //     item['isUse'] = item['isUse'] ? '是' : '否';
      //     return item;
      //   });
      // }
      this.$refs['CDKContainer'].parentElement.scrollTo({
        top: 0, 
        behavior: 'smooth' 
      });
      loading.close();
      
    },
    async ByCdkKey(val) {
      let res = await cdkkeyfind(val);
      let { data } = res;
      let { res: responseData, total, only } = data;
      if (!responseData) {this.tableDataTwo = []; return;}
      this.total = total;
      this.tableDataTwo = responseData.map(item => {
        item['isUse'] = item['isUse'] || only ? '是' : '否';
        item['receive'] = dayjs(item['receive']).format('YYYY-MM-DD HH:mm:ss');
        return item;
      });
      
    },
    async ByCdkID(val) {
      let res = await detailsFind(val);
      let { data } = res;
      let { res: responseData, total } = data;
      if (!responseData) {this.tableDataTwo = []; return;}
      this.total = total;
      this.tableDataTwo = responseData.map(item => {
        item['isUse'] = item['isUse'] ? '是' : '否';
        item['receive'] = item['receive'] ? dayjs(item['receive']).format('YYYY-MM-DD HH:mm:ss') : '';
        return item;
      });
    },









    
    async createCdkForm() {
      this.dialogFormchange = true;
      let { code, data } = await getQueryAnnexOptions();
      if (code === 200) {
        this.annexOptions = data;
      }
     
    },
    
    annexListAdd() {
      let a = this.createForm['annexList'][this.createForm['annexList'].length - 1];
      a['annexName'] && a['annexNumber'] ? this.createForm['annexList'].push({ annexName: '', annexNumber: '', id: ++id }) : this.$message.warning('请填写完整');  
    },

    annexListCut(index) {
      // console.log(index);
      // console.log(...(this.annexList.map(item => ({ ...item }))));
      if (this.createForm['annexList'].length === 1) {
        this.$message.warning('必须有一条记录。');  
        return;
      }
      this.createForm['annexList'].splice(index, 1);
    }



  },
  async mounted() {
    let res = await findComponents({ code: 'areaclothing', gameid: this.gameid });
    let components = res.data.values.map(item=>({
      label: item,
      value: item
    }));
    this.selectForm[1].options = this.selectForm[1].options.concat(components);
    let { id: value, game_id: gameid } = { ...this.$route.query };
    let page = 1;
    let pagesize = 100;
    this.filterForm = {
      pagesize,
      page,
      value,
      gameid,
      key: 'CDKID'
    };
    if (value) {
      this.filterFormChangeClick();
    }
    
    // console.log(this);
  } 
   


  
};
</script>

<style lang="scss" rel="stylesheet/scss">
.CDK-container{
  .create-form-input-CDKKEY input:first-child{
    width: 100%;
    border-radius:  10px 0   0   10px ;
  }
  #v-show-test-body:hover{
        display: block;
  }
    .timefilter{
      width: 27vw;
      div:first-child{
        margin-left: 0px;
      }
    }
.create-form-select{
   div:first-child    {
     .el-input__icon .el-input__validateIcon .el-icon-circle-close{
       position: absolute;
     }
  }
}
.el-date-picker-Cdk-takeEffectTime {
  width: 90%;
}
.create-form-input{
   width: 90%;
}
.dialog-footer{
  display: flex;
    justify-content: flex-end;
}

.container{
        display: grid;
        grid-template-columns: 2fr 2fr;
        margin-top: 2%;
        input {
          width: 17vw;
          height: 32px;
          border-radius: 10px;
        }
        textarea{
          width: 17vw;
          border-radius: 10px;
        }
        button{
           height: 32px;
           border-radius: 0 10px 10px 0;
          padding: 6px 16px;
        }
        .annexcssSetting input{
          width: 100%;
          border-radius: 0px;
        }
         .annexcssSetting :first-child input{
          width: 100%;
          border-radius: 10px 0 0 10px;
        }
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
     .role-container-body-one{
    margin: 10px;
    // display: none;
    background-color: white;
    border-radius: 5px;
    padding: 5px;
    min-height: 10vh;
    box-shadow: 1px 1px 4px 0px #828282;
   
    .el-table .cell{
      word-break: keep-all;
    } 
    }
    
    .role-container-body-two{
         margin: 10px;
    background-color: white;
    border-radius: 5px;
    padding: 5px;
    min-height: 52vh;
    box-shadow: 1px 1px 4px 0px #828282;
    .el-table .cell{
      word-break: keep-all;
    } 
    }
  .role-container-body-there{
            margin: 10px;
    background-color: white;
    border-radius: 5px;
    padding: 5px;
    min-height: 66vh;
    box-shadow: 1px 1px 4px 0px #828282;
    .el-table .cell{
      word-break: keep-all;
    }
  }
  .role-container-body{
    margin: 10px;
    background-color: white;
    border-radius: 5px;
    padding: 5px;
    min-height: 66vh;
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
      border-radius: 0;

      input {
        border-radius: 0;
      }
    }
    .comprehensive-container .select-item {
      margin-left: 10px;
      width: 20%;
    }

    .comprehensive-container {
      .select-item:first-child {
        margin-left: -5px;
        width: 19%;
      }}
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
            height: 32px
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

