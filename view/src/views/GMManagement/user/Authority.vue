<template>
    <div class="auth-group-container">
  
    <div class="role-container-search">
      <div class="server-container">
           <el-table
      ref="multipleTable"
      border
      :data="headerTableDatas" 
      >
      <!-- @selection-change="handleSelectionChange"
      <el-table-column  type="selection" width="40"></el-table-column> -->
      <el-table-column v-for='(column,index) in headertablecolumn' :key='index'  :label="column.label">
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
        <el-button  slot="append" :key='scope' style="border-radius:   30px;" icon="el-icon-circle-plus" size='small' class="button-with-header"  @click='createFormEldialog'>用户添加</el-button>
        </template>
      </el-table-column>
    </el-table>
       
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
           <!-- <span>{{ scope.row[column.prop] }}</span> -->
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
        icon="el-icon-delete"
        type='danger'
        class="button-with-header" 
        @click="deleteHandleEdit(scope.$index,scope.row)">删除</el-button>


        </template>
      </el-table-column>
    </el-table>
    </div>

<!-- 用户创建表单弹窗 -->
    <el-dialog title="用户添加" :visible.sync="dialogFormchange"  :close-on-click-modal="false">
      <el-form ref="createForm" :rules="createFormRules" :model="createForm" label-width="150px"  class='createFormAlert'> 
        <!-- <el-form-item label="区服ID:" class="createFormAlertBody" >
          <el-input v-model="createForm.serverid" disabled class="alertcontant"></el-input>
        </el-form-item> -->
       <el-form-item label="用户查找" prop="userId">
           <el-select v-model="createForm.userId" filterable  clearable placeholder="请选择">
            <el-option
              v-for="item in userList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      
        <el-form-item size="large" style="display: flex;justify-content: flex-end;">
          <el-button @click="createFormCancel">取 消</el-button>
          <el-button type="primary"   @click="createFormSubmitForm('createForm')">确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    </div>
</template>
  
<script>
// import elementResizeDetectorMaker from 'element-resize-detector';
  
import { postCreateGroupUser } from '@/api/gameUser';
import { getFindGroupUser, deleteGroupUser } from '@/api/gameUser';
import { getUserList } from '@/api/gameUser';
import dayjs from 'dayjs';
import eventUser from './eventUser';
export default {
  name: 'userauth',
  props: {
    id: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      dialogFormchange: false,
      headerTableDatas: [],
      createForm: {
        userId: ''
      },
      userList: [],
      createFormRules: {
        userId: [
          { required: true, validator: async(rule, value, callback) =>{
            if (!value) {
              return callback(new Error('请选择一个用户'));
            }
            return callback(); 
          }, trigger: ['blur'] }
        ]
      },
      tableData: [],
      tablecolumn: [
        { label: '用户ID', prop: 'id' },
        { label: '用户名', prop: 'username' },
        { label: '花名', prop: 'alias' },
        { label: '用户类型', prop: 'type' }
      ],
      headertablecolumn: [
        { label: '分组ID', prop: 'id' },
        { label: '分组名', prop: 'groupname' }
      ],
      tableTrue: []
    };
  },
  watch: {
    async id(n, o) {
      if (n === 0) {
        return;
      }
      await this.createdPage();
    }
  },
  computed: {
    tableDatas() {
      let a = this.tableData.map(a => {
        a.createtime = dayjs(a.createtime).format('YYYY-MM-DD HH:mm:ss');
        return a;
      }); 
      return a;
    }
  },
  methods: {
    async createdPage() {
      this.tableData = [];
      this.headerTableDatas = [];
      eventUser.$emit('userGroup', true);
      let { code, data } = await getFindGroupUser({ id: this.id });
      if (+code !== 200) {throw new Error('未获取信息');}
      let { groupData, userData } = data;
      this.tableData = userData;
      this.headerTableDatas = groupData;
    },
    async createFormEldialog() {
      let { data } = await getUserList();
      this.userList = data;
      this.dialogFormchange = true;
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
      let { 0: vales } = this.headerTableDatas;
      let { code } = await deleteGroupUser({ ...row, vales });
      if (+code === 200) {
        this.$message.success('删除成功');
        this.createdPage();
      }
      loading.close();
    },
    async createFormSubmitForm(value) {
      let errTrou = await this.$refs[value].validate().catch(err=>false);
      if (!errTrou) {return;}
      let sendtrue = await this.$confirm(`是否确认添加用户?`, '提示', {
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
      let { 0: vales } = this.headerTableDatas;
      let { code } = await postCreateGroupUser({ ...this.createForm, vales });
      if (+code === 200) {
        this.$message.success('用户添加成功。');
        this.createFormCancel();
        this.createdPage();

      }
      loading.close();
    },
    async createFormCancel() {
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
  .auth-group-container{
       .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
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
      min-height: 68vh;
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
  
