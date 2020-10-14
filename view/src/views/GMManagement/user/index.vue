<template>
    <div class="user-index-container">
      <!-- <div class="role-container-header" >
      <ul class="teststststs">
        <li><el-button slot="reference" icon="el-icon-refresh" size='small' class="button-with-header"  @click='filterFormChange'>刷新</el-button></li>
        <li> <el-button  slot="append" icon="el-icon-delete-solid" size='small' class="button-with-header" :disabled='fenghaocaozuo' @click='dialogFormchange = true'>道具回收</el-button></li>
      </ul>
    </div> -->
    <div class="role-container-search">
      <div class="server-container">用户名：
        <el-input v-model="value" placeholder="请输入用户名" size='small' class="input-with-select" >
        </el-input>
        <el-button slot="append" icon="el-icon-search" size='small' class="button-with-select" name='truesearch' @click="filterFormChange('click')">
        </el-button>
        <el-button  slot="append" style="float: right; border-radius:  30px;" icon="el-icon-circle-plus" size='small' class="button-with-header"  @click='dialogFormchange = true'>用户添加</el-button>
      </div>
      <!-- <div class="comprehensive-container">
        <div v-for='(i,index) in selectForm' :key='index'  class="select-item"  > {{i.label}}:
          <el-select v-model="filterForm[i.key]" :multiple="i['multiple']" placeholder="请选择" size='small' style="border-radius: 10px;" @change="filterFormChange('change')" >
            <el-option v-for="(item,index) in i.options" :key="index"  :label='item.label' :value="item.value" >
            </el-option>
          </el-select>
        </div>
      </div> -->
    </div>
  
    <div id='body' class="role-container-body">
      <el-table
      ref="multipleTable"
      border
      :data="tableDatas" 
      >
      <!-- @selection-change="handleSelectionChange"
      <el-table-column  type="selection" width="40"></el-table-column> -->
      <el-table-column v-for='(column,index) in tablecolumn' :key='index'  :label="column.label">
        <template slot-scope="scope">{{ scope.row[column.prop] }}</template>
      </el-table-column>
       <el-table-column  label="用户操作">
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
    <el-dialog title="用户创建" :visible.sync="dialogFormchange"  :close-on-click-modal="false">
      <el-form ref="createForm" :rules="createFormRules" :model="createForm" label-width="150px"  class='createFormAlert'> 
        <!-- <el-form-item label="区服ID:" class="createFormAlertBody" >
          <el-input v-model="createForm.serverid" disabled class="alertcontant"></el-input>
        </el-form-item> -->
        <el-form-item label="用户名:" class="createFormAlertBody" prop='userName' hide-required-asterisk required>
          <el-input v-model="createForm.userName" class="alertcontant" placeholder="请输入用户名"></el-input>
        </el-form-item>

         <el-form-item label="花名:" class="createFormAlertBody" prop='alias' hide-required-asterisk >
          <el-input v-model="createForm.alias" class="alertcontant" placeholder="请输入花名"></el-input>
        </el-form-item>
        <el-form-item label="密码:" class="createFormAlertBody" prop='password' hide-required-asterisk required  >
          <el-input v-model="createForm.password" maxlength="128" class="alertcontant" placeholder="请输入密码" show-password></el-input>
        </el-form-item>
       <el-form-item label="再次输入密码:" class="createFormAlertBody" prop='pwd' hide-required-asterisk required>
          <el-input v-model="createForm.pwd" class="alertcontant" placeholder="请再次输入密码" show-password></el-input>
        </el-form-item>
        <el-form-item size="large" style="display: flex;justify-content: flex-end;">
          <el-button @click="createFormCancel">取 消</el-button>
          <el-button type="primary"   @click="createFormSubmitForm('createForm')">确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 用户修改表单弹窗 -->
    <el-dialog :key="111" title="用户修改"   :visible.sync="dialogFormchangeUser" :close-on-click-modal="false">
      <el-form ref="changeForm"  :key="222" :rules="changeFormRules" :model="changeForm" label-width="150px"  class='createFormAlert'> 
        <!-- <el-form-item label="区服ID:" class="createFormAlertBody" >
          <el-input v-model="createForm.serverid" disabled class="alertcontant"></el-input>
        </el-form-item> -->
        <el-form-item label="用户名:" class="createFormAlertBody" prop='userName' hide-required-asterisk >
          <el-input v-model="changeForm.username"  disabled class="alertcontant" placeholder="请输入用户名"></el-input>
        </el-form-item>

         <el-form-item label="花名:" class="createFormAlertBody" prop='alias' hide-required-asterisk >
          <el-input v-model="changeForm.alias" class="alertcontant" placeholder="请输入花名" @input="changeForm.changeTrue = false"></el-input>
        </el-form-item>
        <el-form-item label="密码:" class="createFormAlertBody" prop='password' hide-required-asterisk :required='!!changeForm.password'  >
          <el-input v-model="changeForm.password" maxlength="128" class="alertcontant" placeholder="请输入密码" show-password></el-input>
        </el-form-item>
       <el-form-item v-show="changeForm.password" label="再次输入密码:" class="createFormAlertBody" prop='pwd' hide-required-asterisk :required='!!changeForm.password'>
          <el-input v-model="changeForm.pwd" class="alertcontant" placeholder="请再次输入密码" show-password></el-input>
        </el-form-item>
        <el-form-item size="large" style="display: flex;justify-content: flex-end;">
          <el-button @click="changeFormCancel">取 消</el-button>
          <el-button type="primary"   :disabled='changeFormSubmitTrue' @click="changeFormSubmitForm('changeForm')">确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>





    </div>
</template>
  
<script>
// import elementResizeDetectorMaker from 'element-resize-detector';
  
import { postCreateUser, getFindUser } from '@/api/gameUser';
import { findUserByParams, deleteuserbyone } from '@/api/gameUser';
import { putChangeUser } from '@/api/gameUser';
import eventUser from './eventUser';

import dayjs from 'dayjs';

export default {
  
  name: 'userindex',
  data() {
    return {
      dialogFormchange: false,
      dialogFormchangeUser: false,
      total: 0,
      value: '',
      page: 1,
      pagesize: 10,
      createForm: {
        userName: '',
        password: '',
        pwd: '',
        alias: ''
      },
      changeForm: {
        username: '',
        password: '',
        pwd: '',
        alias: '',
        changeTrue: true
      },
      createFormRules: {
        userName: [
          { required: true, validator: async(rule, value, callback) =>{
            if (!value) {
              return callback(new Error('请输入用户名'));
            }
            if (/^[A-Za-z_@.]{6,12}$/.test(value)) {
              let { data: a } = await getFindUser({ userName: value });
              return a ? callback(new Error('用户名重复')) : callback(); 
            }
            return callback(new Error('请输入6-12位只含有字母下划线@的用户名'));
          }, trigger: ['blur'] }
        ],
        password: [
          { required: true, validator: (rule, value, callback) =>{
            if (!value) {
              return callback(new Error('请输入密码'));
            }
            if (value.length >= 6) {
              return callback();
            }
            return callback(new Error('密码长度至少6位'));
          }, trigger: ['blur', 'change'] }
        ],
        pwd: [
          { required: true, validator: (rule, value, callback) =>{
            if (!value) {
              return callback(new Error('请再次输入密码'));
            }
            let data = this.$data;
            if (value !== data.createForm.password) {
              return callback(new Error('二次密码大不相同。'));
            }
            return callback();
              

          }, trigger: ['blur', 'change'] }
        ]
      },
      changeFormRules: {
        password: [
          { validator: (rule, value, callback) =>{
            let data = this.$data;
            if (data.changeForm.password === '') {
              return callback();
            }
            this.$data.changeForm.changeTrue = true;
            if (!value) {
              return callback(new Error('请输入密码'));
            }
            if (value.length >= 6) {
              this.$data.changeForm.changeTrue = false;
              return callback();
            }
            return callback(new Error('密码长度至少6位'));
          }, trigger: ['blur', 'change'] }
        ],
        pwd: [
          { validator: (rule, value, callback) =>{
            let data = this.$data;
            if (data.changeForm.password === '') {
              return callback();
            }
            if (!value) {
              return callback(new Error('请再次输入密码'));
            }
           
            if (value !== data.changeForm.password) {
              return callback(new Error('二次密码大不相同。'));
            }
            return callback();
              

          }, trigger: ['blur', 'change'] }
        ]
      },
      tableData: [],
      tablecolumn: [
        { label: '用户ID', prop: 'id' },
        { label: '用户名', prop: 'username' },
        { label: '花名', prop: 'alias' },
        { label: '创建时间', prop: 'createtime' }
        // { label: '数量', prop: 'plaform', width: -50 }
         
  
      ],
      tableTrue: []
    };
  },
  computed: {
    tableDatas() {
      let a = this.tableData.map(a => {
        a.createtime = dayjs(a.createtime).format('YYYY-MM-DD HH:mm:ss');
        return a;
      }); 
      return a;
    },
    changeFormSubmitTrue() {
      let { alias, password, changeTrue } = this.changeForm;
      return !(alias || password) || changeTrue;
    }
  },
  methods: {
    async changeHandleEdit(index, row) {
      this.dialogFormchangeUser = true;
      this.changeForm.changeTrue = true;
      try {this.$refs['changeForm'].resetFields();} catch ({ message }) {console.log(message);}
      for (let i in row) {
        this.changeForm[i] = row[i];
      }
      
    },
    async deleteHandleEdit(index, row) {
      let { username } = row;
      let sendtrue = await this.$confirm(`是否确认删除 ${username} 用户?`, '提示', {
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
      let { code } = await deleteuserbyone(row);
      if (+code === 200) {
        this.$message.success('删除成功');
        eventUser.$emit('userGroup', true);
        this.findUserByParams();
      }
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
    async findUserByParams() {
      let { data: { tableData, total }} = await findUserByParams({ page: this.page, pagesize: this.pagesize });
      this.tableData = tableData;
      this.total = total;
    },
    async clickFindUserByParams() {
      let { data: { tableData, total }} = await findUserByParams({ value: this.value, page: 1, pagesize: 10 });
      this.tableData = tableData;
      this.total = total;
    },
    async changeFormSubmitForm(val) {
      let errTrou = await this.$refs[val].validate().catch(err=>false);
      if (!errTrou) {return;}
     
      let sendtrue = await this.$confirm(`是否确认修改用户?`, '提示', {
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
      let { code } = await putChangeUser(this.changeForm);
      if (+code === 200) {
        this.$message.success('用户信息修改成功');
        this.changeFormCancel();
        this.findUserByParams();

      }
      loading.close();
    },
    async createFormSubmitForm(value) {
      let errTrou = await this.$refs[value].validate().catch(err=>false);
      if (!errTrou) {return;}
      let sendtrue = await this.$confirm(`是否确认创建用户?`, '提示', {
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

      let { code } = await postCreateUser(this.createForm);
      if (+code === 200) {
        this.$message.success('用户创建成功。');
        this.createFormCancel();
        this.findUserByParams();
      }
      loading.close();
    },
    async createFormCancel() {
      this.dialogFormchange = false;
      this.createForm = this.$options.data().createForm;
      this.$refs['createForm'].resetFields();
    },
    async changeFormCancel() {
      this.dialogFormchangeUser = false;
      this.changeForm = this.$options.data().changeForm;
      this.$refs['changeForm'].resetFields();
    }
  },
  async  mounted() {
    // let { data: { tableData, total }} = await findUserByParams({ page: 1, pagesize: 10 });
    // this.tableData = tableData;
    // this.total = total;
    this.findUserByParams();
    // const _this = this;
    // const erd = elementResizeDetectorMaker();
    // erd.listenTo(document.getElementById('body'), element =>{
    //   this.screenWidth = element.offsetWidth * 0.2429;

    // });
  
  }
};
</script>
  
  <style lang="scss" rel="stylesheet/scss">
  .user-index-container{
      .teststststs{
          float: right;
          SELECTOR { position:absolute; top:0;bottom:auto;margin-top:±VALUE;margin-bottom:auto; }
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
      min-height: 72vh;
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
        //   border-bottom: 1px #bdbdbd dashed;
          padding: 10px;
        }
        .input-with-select {
        width: 250px;
        margin-left: -4px;
        border-radius: 0;
  
        input {
          border-radius:  30px 0 0 30px ;
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
        padding: 2px;
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
      grid-template-columns: 1fr ;
      align-items: center;
        .el-select{
          display: block;
        }
    }
  
  
  
  
  
  
  }
  
  
  </style>
  
