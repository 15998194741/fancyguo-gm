<template>
    <div class="client-container">
      <div class="role-container-header" >
      <ul style="margin: 5px 10px -5px 10px;">
        <li><el-button slot="reference" icon="el-icon-refresh" size='small' class="button-with-header"  >刷新</el-button></li>
        <li> <el-button v-if="grade"  slot="append" icon="el-icon-circle-plus-outline" size='small' class="button-with-header" @click="createFormAlert" >添加版本</el-button></li>
        <li> <el-button v-if="grade"  slot="append" icon="el-icon-edit" size='small' class="button-with-header"  @click="changeFormAlert" >修改</el-button></li>
      </ul>
    </div>
    <div class="role-container-search">
      <div class="server-container"><span>版本号：</span>
        <!-- <el-select v-model="filterForm.key"  disabled   placeholder="请选择" name='idselect' size='small' class="selectID">
          <el-option v-for="(item, index) in idoptions" :key="index" :label="item.label" :value="item.value">
          </el-option>
        </el-select> -->
        <el-input v-model="filterForm['value']" placeholder="请输入版本号" size='small' class="input-with-select" >
        </el-input>
        <el-button slot="append" icon="el-icon-search" size='small' class="button-with-select" name='truesearch' @click="filterFormChange('click')">
        </el-button>
     
      </div>
     
      <div class="comprehensive-container">
        <div v-for='(i,index) in selectForm' :key='index'  class="select-item"  > {{i.label}}:
          <el-select v-model="filterForm[i.key]" :multiple="i['multiple']" placeholder="请选择"  clearable :collapse-tags="i['collapse']" :filterable='i.filterable' size='small' style="border-radius: 10px;" @change="filterFormChange('change')" >
            <el-option v-for="(item,index) in i.options" :key="index"  :label='item.label' :value="item.value" >
            </el-option>
          </el-select>
        </div>
      </div>
    </div>
  
    <div id='body' class="role-container-body">
      <!-- :row-class-name="tableRowClassName"  -->
      <el-table
      ref="multipleTable"
      border
      :data="tableData" 
      @selection-change="handleSelectionChange"
      >
      <el-table-column  type="selection" width="40"></el-table-column>
      <el-table-column v-for='(column,index) in tablecolumn' :key='index'  :label="column.label">
      <template slot-scope="scope">  <div v-if="typeof scope.row[column.prop] === 'string' || typeof scope.row[column.prop] === 'number' ">
        {{ scope.row[column.prop] }}
        </div>
        <div v-else>
          <el-tag v-for='(i,index) in  scope.row[column.prop]' :key="index">{{ i }}</el-tag>
          </div>  
      </template>
      </el-table-column>
       <el-table-column  v-if="grade" label="停用">
       <template slot-scope="scope"> 
         <el-button type="danger" plain @click='clientStop(scope)'>停用</el-button>
       </template>
    </el-table-column>
    </el-table>
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
      @size-change="filterFormChange('pagechange')"
      @current-change="filterFormChange('pagechange')" ></el-pagination>
    </div>
  

<el-dialog
  title="新建版本"
  :visible.sync="centerDialogVisible"
  width="20%"
  :close-on-click-modal="false"
  >
    <el-form ref="ruleForm" label-position='left' :model="createForm" status-icon :rules="rules" label-width="60px" width="30%"   class="client-ruleForm">
    <el-form-item label="版本号" prop="versionId">
        <el-input v-model="createForm.versionId"  size="small" autocomplete="off"></el-input>
    </el-form-item>
     <el-form-item label="平台" prop="plaform">
         <el-select  v-model="createForm.plaform" placeholder="请选择"  multiple size='small' style="border-radius: 10px;">
    <el-option label='安卓' :value="'1'" ></el-option>
    <el-option label='苹果' :value="'2'" ></el-option>
    </el-select>
    </el-form-item>
     <el-form-item label="渠道" prop="channel">
        <el-select  v-model="createForm['channel']"   class="create-form-select"  multiple  placeholder="请选择" size='small' style="border-radius: 10px;">
            <el-option v-for="(item,index) in channelComponents"   :key="index"  :label='item.label' :value="item.value" ></el-option>
        </el-select>
    </el-form-item>
      <el-form-item label="显示"   prop="showType">
 <el-checkbox-group v-model="createForm['showType']">
    <el-checkbox label="测试"></el-checkbox>
    <el-checkbox label="正式"></el-checkbox>
  </el-checkbox-group>
    </el-form-item>
  </el-form>
   
  <span slot="footer" class="dialog-footer">
    <el-button @click="whiteCreateCancel">取 消</el-button>
    <el-button type="primary" @click="whiteCreateSubmit">确 定</el-button>
  </span>
</el-dialog>

<el-dialog
  title="版本批量修改"
  :visible.sync="ChangeDialogVisible"
  width="20%"
  :close-on-click-modal="false"
  >
   <!-- <div class="tag-group">
  <span class="tag-group__title">版本号</span>
  <el-tag
    v-for="item in tableTrue"
    :key="item.label"
    width='30px'
    effect="dark">
    {{ item['version_id']}}
  </el-tag>
</div> -->
   <el-form ref="ruleForms" label-position='left' :model="changeForm" status-icon :rules="changeFormrules" label-width="60px" width="30%"   class="client-ruleForm">
    <el-form-item label="版本号" >
        <el-tag  v-for="i in tableTrue"  :key="i['id']"> {{i['version_id']}}</el-tag>
    </el-form-item>
  <el-form-item label="显示"   prop="showType">
 <el-checkbox-group v-model="changeForm['showType']">
    <el-checkbox label="测试"></el-checkbox>
    <el-checkbox label="正式"></el-checkbox>
  </el-checkbox-group>
    </el-form-item>
  </el-form>





   
  <span slot="footer" class="dialog-footer">
    <el-button @click="whiteChangeCancel">取 消</el-button>
    <el-button type="primary" @click="whiteChangeSubmit" >确 定</el-button>
  </span>
</el-dialog>









    </div>
</template>
  
<script>
// import elementResizeDetectorMaker from 'element-resize-detector';
import { findComponents } from '@/api/components.js';
import { clientCreate, clientFind, channelfind, versionidall } from '@/api/client.js';
import { stopClient, changeClient } from '@/api/client.js';

export default {
  name: 'client',
  data() {
    let versionId = async(rule, value, callback) =>{
      if (!value) {
        return callback(new Error('不可以为空'));
      }
      let { data: versiondata } = await versionidall();
      let { versionid } = versiondata;
      if (versionid.indexOf(value) >= 0) {
        return callback(new Error('版本号不可以重复'));
      }
      return callback();
    };
    let showType = (rule, value, callback) =>{
      if (!value || JSON.stringify(value) === '[]') {
        return callback(new Error('请选择一个显示方式'));
      }
      return callback();
    };
    let channel = (rule, value, callback) =>{
      if (!value || JSON.stringify(value) === '[]') {
        return callback(new Error('请选择一个客户端'));
      }
      return callback();
    };
    let plaform = (rule, value, callback) =>{
      if (!value) {
        return callback(new Error('请选择一个平台'));
      }
      return callback();
    };
    return {
      centerDialogVisible: false,
      ChangeDialogVisible: false,
      total: 0,
      versionid: '',
      changeForm: {
        showType: []
      },
      createForm: {
        versionId: '',
        plaform: '',
        channel: '',
        showType: []
      },
      rules: {
        versionId: { validator: versionId, trigger: ['blur', 'change'] },
        plaform: { validator: plaform, trigger: ['blur', 'change'] },
        channel: { validator: channel, trigger: ['blur', 'change'] },
        showType: { validator: showType, trigger: ['blur', 'change'] }
      },
      changeFormrules: {
        showType: { validator: showType, trigger: ['blur', 'change'] }
      },
      channelComponents: [],
      filterForm: {
        value: '',
        plaform: '',
        channel: '',
        isShowType: '',
        page: 1,
        pagesize: 10
      },
      selectForm: [{
        label: '游戏平台',
        multiple: true,
        filterable: true,
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
        filterable: true,
        collapse: true,
        multiple: true,
        value: '',
        options: []
      },
      {
        label: '展示区服',
        key: 'isShowType',
        filterable: false,
        collapse: false,
        multiple: true,
        value: '',
        options: [{
          label: '测试',
          value: '测试'
  
        }, {
          label: '正式',
          value: '正式'
        }]
      }  
      ],
      tableData: [],
      tablecolumn: [
        { label: '版本号', prop: 'version_id', width: 50 },
        { label: '游戏平台', prop: 'plaforms', width: 50 },
        { label: '游戏渠道', prop: 'channel', width: 25 },
        { label: '展示区服', prop: 'is_show_type', width: -50 }
      ],
      tableTrue: []
    };
      
  }, 
  computed: {
    grade() {
      if (+this.$route.meta.grade === 0) {
        return false;
      }
      console.log(+this.$route.meta.grade);
      return true;
    }
  },
  methods: {
    async handleSelectionChange(val) {
      this.tableTrue = val;
    },
    async changeFormAlert() {
      if (this.tableTrue.length === 0) {this.$message.info('兄弟，你先选择一个'); return;} 
      this.ChangeDialogVisible = true;
    },
    async whiteCreateSubmit() {
      let sendtrue = await this.$confirm(`是否确认创建此版本?`, '提示', {
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
      let test = await this.$refs['ruleForm'].validate().catch(err=>false);
      if (!test) {loading.close(); return;}
      
      let { code } = await clientCreate(this.createForm);
      if (+code !== 200) {loading.close(); return;}
      this.centerDialogVisible = false;
      this.$message.success('创建成功');
      let { data } = await channelfind();
      this.selectForm[1].options = data;
      loading.close();
      this.whiteCreateCancel();
    },
    async whiteChangeSubmit() {
      let sendtrue = await this.$confirm(`是否确认修改此版本?`, '提示', {
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
      let test = await this.$refs['ruleForms'].validate().catch(err=>false);
      if (!test) {loading.close(); return;}
      console.log(this.changeForm['showType']);
      console.log(this.tableTrue);
      let res = await changeClient({ type: this.changeForm['showType'], id: this.tableTrue.map(item=>item['id']) });
      let { code } = res;
      if (+code !== 200) {loading.close(); return;}
      this.$message.success('修改成功');
      //白名单修改后端api未开发
      this.filterFormChange();
      loading.close();
      this.whiteChangeCancel();
    },
    async createFormAlert() {
      this.centerDialogVisible = true;
    },
    async clientStop(scope) {
      let sendtrue = await this.$confirm(`是否确认停用此版本?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning' })
        .catch(err => false);
      if (!sendtrue) {return;}
      let row = scope['row'];
      let { id } = row;
      let { code } = await stopClient({ id });
      if (+code !== 200) {return;}
      this.$message.success('停用成功');
      this.filterFormChange();
    },
    async whiteCreateCancel() {
      this.centerDialogVisible = false;
      this.createForm = this.$options.data().createForm;
      this.$refs['ruleForm'].resetFields();
    
    },
    async whiteChangeCancel() {
      this.ChangeDialogVisible = false;
      this.$refs['ruleForms'].resetFields();
    },
    async filterFormChange(val) {
      switch (val) {
        case 'click':this.whiteFilterFormClick(); break;
        case 'change':this.whiteFilterFormChange(); break;
        case 'pagechange':this.whiteFilterFormpageChange(); break;
        default:this.whiteFilterFormflush();
      }
    },
    async whiteFilterFormflush() {
      for (let i in this.filterForm) {
        if (i === 'pagesize') {continue;}
        this.filterForm[i] = '';
      }
      this.whiteFilterFormClick();
    },
    async whiteFilterFormClick() {
      for (let i in this.filterForm) {
        if (i === 'value' || i === 'key' || i === 'pagesize') {continue;}
        this.filterForm[i] = '';
      }
      this.filterForm['page'] = 1;
      this.whiteFilterFormSumbit();
    },
    async whiteFilterFormChange() {
      this.filterForm['value'] = null;
      this.filterForm['page'] = 1;
      this.whiteFilterFormSumbit();
    },
    async whiteFilterFormpageChange() {
      this.whiteFilterFormSumbit();
    },
    async whiteFilterFormSumbit() {
      let { code, data } = await clientFind(this.filterForm);
      if (+code !== 200) {this.tableData = []; return;}
      this.tableData = data;
      this.total = data.length === 0 ? 0 : +data[0]['total'];
    }
  },
  async mounted() {
    let { data: res } = await findComponents({ code: 'areaclothing' });
    this.channelComponents = res['values'].map(item=>({ value: item, label: item }));
    let { data } = await channelfind();
    this.selectForm[1].options = data;
  
    // const _this = this;
    // const erd = elementResizeDetectorMaker();
    // erd.listenTo(document.getElementById('body'), element =>{
    //   this.screenWidth = element.offsetWidth * 0.2429;
    //   //   switch (element.offsetWidth) {
    //   //     case 1840: break;
    //   //     case 1700: this.screenWidth = '30%'; break;
    //   //   }
    // });
  
  
  
  
  
  }
  
  
    
};
</script>
  
  <style lang="scss" rel="stylesheet/scss">
  .client-container{
      .el-button:active, .el-button:focus, .el-button:hover{
          color: #2BBFBD;
      }
      .el-select .el-input.is-focus .el-input__inner{
          color: #2BBFBD;
            border-color: #2BBFBD;
      }
      .client-ruleForm{
          .el-select ,.create-form-select ,.el-select--small{
              width: 100%;
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
        border-radius: 0;
        input {
          border-radius: 30px 0 0 30px;
        }
      }
     .comprehensive-container { display: flex;padding: 10px; align-items: baseline;width: 100%;.select-item {width: 20%;&>.comprehensive-container-label{width: 30%;} &>div{ width: 70%; }}input {border-radius: 10px;}}
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
  
