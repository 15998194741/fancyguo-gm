<template>
<div class="channnel-group-container">
    <div class="role-container-search">
      <div class="server-container">渠道名：
        <el-input v-model="value" placeholder="请输入渠道名" size='small' class="input-with-select" >
        </el-input>
        <el-button slot="append" icon="el-icon-search" size='small' class="button-with-select" name='truesearch' @click="filterFormChange('click')">
        </el-button>
        <el-button  slot="append" style="float: right; border-radius:  30px;" icon="el-icon-circle-plus" size='small' class="button-with-header"  @click='createFormEldialog'>渠道添加</el-button>
      </div>
    </div>
    <div id='body' class="role-container-body">
      <el-table
      ref="multipleTable"
      border
      :data="tableDatas" 
      >
      <el-table-column v-for='(column,index) in tablecolumn' :key='index'  :label="column.label">
       <template slot-scope="scope" :title="scope.row[column.prop]">
           <div v-if="!scope.row[column.prop]">
        </div>
        <div v-else-if="typeof scope.row[column.prop] === 'string' || typeof scope.row[column.prop] === 'number' " :title="scope.row[column.prop]"  class="tableHiddenBody">
        <el-tooltip class="item"  effect='light'  placement="top"  >
          <div slot="content" ><span>{{ scope.row[column.prop] }}</span></div>
        </el-tooltip>
        <span class="tableHidden">{{ scope.row[column.prop] }}</span>
        </div>
        <div v-else>
          <el-tooltip effect='light'  placement="top" class="aasdhjkahskdhjk">
              <div slot="content" :ref="'contentCssTableHover'+scope.$index" class="contentCssTableHover"> <el-tag v-for='(i,index) in  scope.row[column.prop]' :key="index" >{{ i }}</el-tag></div>
            <div class="contentCssTableHidden"><el-tag v-for='(i,index) in  scope.row[column.prop]' :key="index">{{ i }}</el-tag></div> 
            </el-tooltip>
          </div>  
        </template>
      </el-table-column>
      <el-table-column  label="分组操作">
        <template slot-scope="scope">
        <el-button
              size="mini"
              type="warning"
              icon="el-icon-edit-outline"
              class="button-with-header" 
              @click="changeHandleEdit(scope.$index,scope.row)">修改</el-button>
        <el-button
        size="mini"
        icon="el-icon-delete"
        type='danger'
        class="button-with-header" 
        @click="deleteHandleEdit(scope.$index,scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    </div>
    <div class="role-container-bottom">
      <el-pagination
      style="text-align: right;"
      :page-size.sync="pagesize"
      :page-sizes="[10, 20, 30, 40]"
      background
      layout="total, sizes, prev, pager, next, jumper"
      :pager-count='9'  
      :hide-on-single-page="false"  
      :total="total"
      :current-page.sync='page'
      @size-change="filterFormChange('change')"
      @current-change="filterFormChange('change')" ></el-pagination>
    </div>
  
<!-- 用户创建表单弹窗 -->
    <el-dialog title="渠道创建" :visible.sync="dialogFormchange"  :close-on-click-modal="false">
      <el-form ref="createForm" :rules="createFormRules" :model="createForm" label-width="150px"  class='createFormAlert'> 
        <el-form-item label="渠道ID:" class="createFormAlertBody" prop='channelId' hide-required-asterisk required>
          <el-input v-model="createForm.channelId" class="alertcontant" placeholder="请输入用户名"></el-input>
        </el-form-item>
         <el-form-item label="渠道名称:" class="createFormAlertBody" prop='channelName' hide-required-asterisk required>
          <el-input v-model="createForm.channelName" class="alertcontant" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item size="large" style="display: flex;justify-content: flex-end;">
          <el-button @click="createFormCancel">取 消</el-button>
          <el-button type="primary"   @click="createFormSubmitForm('createForm')">确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 用户创建表单弹窗 -->
    <el-dialog title="用户分组修改" :visible.sync="dialogFormchangeUser"  :close-on-click-modal="false">
      <el-form ref="changeForm" :rules="changeFormRules" :model="changeForm" label-width="150px"  class='createFormAlert'> 
        <el-form-item label="分组名:" class="createFormAlertBody" prop='groupname' hide-required-asterisk required>
          <el-input v-model="changeForm.groupname" class="alertcontant" placeholder="请输入用户名" @change="changeForm.nameChange = true"></el-input>
        </el-form-item>
         <el-form-item label="权限:" class="createFormAlertBody" prop='alias' hide-required-asterisk >
          
        </el-form-item>
      
        <el-form-item size="large" style="display: flex;justify-content: flex-end;">
          <el-button @click="changeFormCancel">取 消</el-button>
          <el-button type="primary"   @click="changeFormSubmitForm('changeForm')">确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>





    </div>
</template>
  
<script>
  
import dayjs from 'dayjs';

export default {
  name: 'channelmanagement',
  data() {
    return {
      radio: '',
      dialogFormchange: false,
      dialogFormchangeUser: false,
      total: 0,
      value: '',
      page: 1,
      pagesize: 10,
      createForm: {
        channelId: '',
        channelName: ''
      },
      changeForm: {
        channelId: '',
        channelName: ''
      },
      changeFormRules: {
        channelId: [
          { validator: async(rule, value, callback) =>{
            if (!value) {
              return callback(new Error('请输入渠道ID'));
            }
            if (!/^[0-9]*$/.test(value)) {
              return callback(new Error('请输入数字'));
            }
            return callback(); 
          }, trigger: ['blur'] }
        ],
        channelName: [
          { validator: async(rule, value, callback) =>{
            if (!value) {
              return callback(new Error('请输入渠道名称'));
            }
            return callback(); 
          }, trigger: ['blur'] }
        ]
      },
      urlData: [],
      createFormRules: {
        channelId: [
          { validator: async(rule, value, callback) =>{
            if (!value) {
              return callback(new Error('请输入渠道ID'));
            }
            if (!/^[0-9]*$/.test(value)) {
              return callback(new Error('请输入数字'));
            }
            return callback(); 
          }, trigger: ['blur'] }
        ],
        channelName: [
          { validator: async(rule, value, callback) =>{
            if (!value) {
              return callback(new Error('请输入渠道名称'));
            }
            return callback(); 
          }, trigger: ['blur'] }
        ]
      },
      tableData: [],
      tablecolumn: [
        { label: '渠道ID', prop: 'id' },
        { label: '渠道名称', prop: 'groupname' },
        { label: '创建时间', prop: 'groupname' }
      ]
    };
  },
  watch: {

  },
  computed: {
    tableDatas() {
      let a = this.tableData.map(a => {
        a.createtime = dayjs(a.create_time).format('YYYY-MM-DD HH:mm:ss');
        return a;
      }); 
      return a;
    }
  },
  methods: {

    async createFormEldialog() {
      this.dialogFormchange = true;
    },
    async changeHandleEdit(index, row) {
      this.dialogFormchangeUser = true;
      this.changeForm['nameChange'] = false;
      try {this.$refs['changeForm'].resetFields();} catch ({ message }) {console.log(message);}
      for (let i in row) {
        this.changeForm[i] = row[i];
      }
  
    },
    async deleteHandleEdit(index, row) {
      let { groupname } = row;
      let sendtrue = await this.$confirm(`是否确认删除 ${groupname} 用户分组?`, '提示', {
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
      // let { code } = await deleteusergroupbyone(row);
      // if (+code === 200) {
      //   this.$message.success('删除成功');
      //   this.findUserByParams();
      // }
      loading.close();
    },
    async filterFormChange(val) {
      switch (val) {
        case 'click':
          this.clickFindUserByParams();
          break;
        default:
          this.findUserByParams();
          break;
      }
    },
    async changeFormSubmitForm(val) {
      let errTrou = await this.$refs[val].validate().catch(err=>false);
      if (!errTrou) {return;}
      let sendtrue = await this.$confirm(`是否确认修改用户分组?`, '提示', {
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
      // let { code } = await putChangeUserGroup(this.changeForm);
      // if (+code === 200) {
      //   this.$message.success('用户分组修改成功。');
      //   this.changeFormCancel();
      //   this.findUserByParams();
      // }
      loading.close();
    },
    async createFormSubmitForm(value) {
      let errTrou = await this.$refs[value].validate().catch(err=>false);
      if (!errTrou) {return;}
      let sendtrue = await this.$confirm(`是否确认创建用户分组?`, '提示', {
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

      // let { code } = await postCreateUserGroup({
      //   urlData: this.urlData,
      //   groupName: this.createForm.groupName
      // });
      // if (+code === 200) {
      //   this.$message.success('用户分组创建成功。');
      //   this.createFormCancel();
      //   this.findUserByParams();
      // }
      loading.close();
    },
    async createFormCancel() {
      this.dialogFormchange = false;
      this.createForm = this.$options.data().createForm;
      this.$refs['createForm'].resetFields();
    },
    async changeFormCancel() {
      this.dialogFormchange = false;
      this.createForm = this.$options.data().createForm;
      this.$refs['createForm'].resetFields();
    }
  },
  async  mounted() {
  
  }
};
</script>
  
<style lang="scss" rel="stylesheet/scss">
.channnel-group-container{.custom-tree-node{flex:1;display:flex;
align-items:center;
justify-content:space-between;
font-size:14px;
padding-right:8px;}.teststststs{
float:right;
SELECTOR{position:absolute;top:0;bottom:auto;margin-top:±VALUE;margin-bottom:auto;}}.selectID{
span:first-child{
display:none;}}.success-feng{
background-color:rgba(255,0,0,0.4);}.success-jiny{
background-color:rgba(255,155,0,0.3);}.el-tabletd,.el-tableth.is-leaf{
text-align:center;}.demo-table-expand{
display:grid;
grid-template-columns:repeat(3,1fr);
width:100%;
margin-left:3%;
font-size:18px;
label{
width:140px;
color:#99a9bf;}.el-form-item{
margin-right:0;
margin-bottom:0;
width:100%;
display:flex;
label{
float:left;}/*text-align:center;*/}}.role-container-body{
margin:10px;
background-color:white;
border-radius:5px;
padding:5px;
min-height:72vh;/*-webkit-box-shadow:1px1px4px0px#828282;*/
box-shadow: 1px 1px 4px 0px #828282;.el-table.cell{
word-break:keep-all;}}.role-container-headerulli{
float:right;
margin-left:2px;
button{
border-radius:30px;}
button:focus{
box-sizing:content-box;}}.role-container-headerul{
display:flex;
justify-content:flex-end;}.server-container{//border-bottom:1px#bdbdbddashed;
padding:10px;}.input-with-select{
width:250px;
margin-left:-4px;
border-radius:0;
input{
border-radius: 30px 0 0 30px ;}}.comprehensive-container.select-item{
margin-left:10px;
width:20%;}.comprehensive-container{.select-item:first-child{
margin-left:-5px;
width:19%;}}.comprehensive-container{
display:flex;
padding:10px;
align-items:baseline;}.role-container-search{
margin:10px;
background-color:white;
border-radius:5px;
padding:2px;
box-shadow: 1px 1px 4px 0px #828282;
button[name='truesearch']{
border-radius: 0 30px 30px 0;
margin-left:-5px;
height:32px
}
input[name='idselect']{
border-radius: 30px 0 0 30px;
width: 100px;/* height: 30px; */} .comprehensive-container {
display: flex;
padding: 10px;
align-items: baseline;}}.createFormAlertBodys div{display: flex;}.createFormAlert{
display: grid;
grid-template-columns: 1fr ;
align-items: center;.el-select{
display: block;}}}
</style>



