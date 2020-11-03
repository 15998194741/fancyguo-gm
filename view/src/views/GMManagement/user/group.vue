<template>
    <div class="user-group-container">
      <!-- <div class="role-container-header" >
      <ul class="teststststs">
        <li><el-button slot="reference" icon="el-icon-refresh-right" size='small' class="button-with-header"  @click='filterFormChange'>刷新</el-button></li>
        <li> <el-button  slot="append" icon="el-icon-delete-solid" size='small' class="button-with-header" :disabled='fenghaocaozuo' @click='dialogFormchange = true'>道具回收</el-button></li>
      </ul>
    </div> -->
    <div class="role-container-search">
      <div class="server-container">分组名：
        <el-input v-model="value" placeholder="请输入分组名" size='small' class="input-with-select" >
        </el-input>
        <el-button slot="append" icon="el-icon-search" size='small' class="button-with-select" name='truesearch' @click="filterFormChange('click')">
        </el-button>
        <el-button  slot="append" style="float: right; border-radius:  30px;" icon="el-icon-circle-plus" size='small' class="button-with-header"  @click='createFormEldialog'>分组添加</el-button>
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
          <!-- <el-tag v-for='(i,index) in  scope.row[column.prop]' :key="index">{{ i }}</el-tag> -->
          <!-- <el-tag v-for='(i,index) in  scope.row[column.prop]' :key="index">{{ i }}</el-tag> -->
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
      <el-table-column  label="权限分配">
        <template slot-scope="scope">
        <el-button
              size="mini"
              type="warning"
              icon="el-icon-edit-outline"
              class="button-with-header" 
              @click="JumpAuth(scope.$index,scope.row)">跳转</el-button>
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
    <el-dialog title="用户分组创建" :visible.sync="dialogFormchange"  :close-on-click-modal="false">
      <el-form ref="createForm" :rules="createFormRules" :model="createForm" label-width="150px"  class='createFormAlert'> 
        <!-- <el-form-item label="区服ID:" class="createFormAlertBody" >
          <el-input v-model="createForm.serverid" disabled class="alertcontant"></el-input>
        </el-form-item> -->
        <el-form-item label="分组名:" class="createFormAlertBody" prop='groupName' hide-required-asterisk required>
          <el-input v-model="createForm.groupName" class="alertcontant" placeholder="请输入用户名"></el-input>
        </el-form-item>

         <el-form-item label="权限:" class="createFormAlertBody" prop='alias' hide-required-asterisk >
           <el-tree
            :data="urlData"
            node-key="id"
            :expand-on-click-node="false">
            <span slot-scope="{ node, data }" class="custom-tree-node">
                <span>{{ node.label }}</span>
        <span>
            <el-radio v-model="data.meta" label="0" @change="urlChooseOne(data,node)">可见</el-radio>
            <el-radio v-model="data.meta" label="827" @change="urlChooseOne(data,node)">不可见</el-radio>
            <el-radio v-model="data.meta" label="1" @change="urlChooseOne(data,node)">可操作</el-radio>
          <!-- <el-button
            type="text"
            size="mini"
            @click="() => append(data)">
            Append
          </el-button>
          <el-button
            type="text"
            size="mini"
            @click="() => remove(node, data)">
            Delete
          </el-button> -->
        </span>
      </span>
    </el-tree>
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
        <!-- <el-form-item label="区服ID:" class="createFormAlertBody" >
          <el-input v-model="createForm.serverid" disabled class="alertcontant"></el-input>
        </el-form-item> -->
        <el-form-item label="分组名:" class="createFormAlertBody" prop='groupname' hide-required-asterisk required>
          <el-input v-model="changeForm.groupname" class="alertcontant" placeholder="请输入用户名" @change="changeForm.nameChange = true"></el-input>
        </el-form-item>

         <el-form-item label="权限:" class="createFormAlertBody" prop='alias' hide-required-asterisk >
           <el-tree
            :data="changeForm.urlData"
            node-key="id"
            :expand-on-click-node="false">
            <span slot-scope="{ node, data }" class="custom-tree-node">
                <span>{{ node.label }}</span>
        <span>
            <el-radio v-model="data.meta" label="0" @change="urlChooseOne(data,node)">可见</el-radio>
            <el-radio v-model="data.meta" label="827" @change="urlChooseOne(data,node)">不可见</el-radio>
            <el-radio v-model="data.meta" label="1" @change="urlChooseOne(data,node)">可操作</el-radio>
          <!-- <el-button
            type="text"
            size="mini"
            @click="() => append(data)">
            Append
          </el-button>
          <el-button
            type="text"
            size="mini"
            @click="() => remove(node, data)">
            Delete
          </el-button> -->
        </span>
      </span>
    </el-tree>
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
// import elementResizeDetectorMaker from 'element-resize-detector';
  
import { getFindGroupName, postCreateUserGroup, getFindGroup } from '@/api/gameUser';
import { findAllUrl, deleteusergroupbyone } from '@/api/gameUser';
import { changeFindValue, putChangeUserGroup } from '@/api/gameUser';
import dayjs from 'dayjs';
import eventUser from './eventUser';

export default {
  name: 'usergroup',
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
        groupName: '',
        password: '',
        pwd: '',
        alias: ''
      },
      changeForm: {
        groupname: '',
        urlData: []
      },
      changeFormRules: {
        groupname: [
          { validator: async(rule, value, callback) =>{
            if (!value) {
              return callback(new Error('请输入分组名'));
            }
            if (!this.$data.changeForm['nameChange']) {return callback();}
            let { data: a } = await getFindGroupName({ groupName: value });
            return a ? callback(new Error('分组名重复')) : callback(); 
          }, trigger: ['blur'] }
        ]
      },
      urlData: [],
      createFormRules: {
        groupName: [
          { required: true, validator: async(rule, value, callback) =>{
            if (!value) {
              return callback(new Error('请输入分组名'));
            }

            let { data: a } = await getFindGroupName({ groupName: value });
            return a ? callback(new Error('分组名重复')) : callback(); 
          }, trigger: ['blur'] }
        ]
      },
      tableData: [],
      tablecolumn: [
        { label: '分组ID', prop: 'id' },
        { label: '分组名', prop: 'groupname' },
        { label: '用户ID', prop: 'uids' },
        { label: '用户名', prop: 'username' },
        { label: '创建时间', prop: 'createtime' }
        // { label: '数量', prop: 'plaform', width: -50 }
         
  
      ],
      tableTrue: []
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
    async JumpAuth(a, b) {
      this.$emit('ToUserAuth', { index: a, row: b });
    },
    async createFormEldialog() {
      let { data } = await findAllUrl();
      this.urlData = data;
      this.dialogFormchange = true;
    },
    async changeHandleEdit(index, row) {
      this.dialogFormchangeUser = true;
      this.changeForm['nameChange'] = false;
      try {this.$refs['changeForm'].resetFields();} catch ({ message }) {console.log(message);}
      for (let i in row) {
        this.changeForm[i] = row[i];
      }
      let { id } = row;
      let { data } = await changeFindValue({ id });
      this.changeForm['urlData'] = data;
  
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
      let { code } = await deleteusergroupbyone(row);
      if (+code === 200) {
        this.$message.success('删除成功');
        this.findUserByParams();
      }
      loading.close();
    },
    async urlChooseOne(data, nodes) {
      let { children, meta } = data;
      if (children) {
        data.children.map(a => {
          a.meta = meta;
          return a;
        });
      }
      let { parent, level } = nodes;
      if (+level !== 1) {
        let { data: parentdata } = parent;
        let a = parentdata.children.every(a => 
          a.meta === parentdata.children[0].meta
        );
        let b = parentdata.children.some(a => 
          +a.meta === 1 || +a.meta === 0
        );
        if (b) {
          parentdata.meta = '0';
        }
        if (a) {
          parentdata.meta = parentdata.children[0].meta;
        }
       
      }
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
      let { data: { tableData, total }} = await getFindGroup({ page: this.page, pagesize: this.pagesize });
      this.tableData = tableData;
      this.total = total;
    },
    async clickFindUserByParams() {
      let { data: { tableData, total }} = await getFindGroup({ value: this.value, page: this.page, pagesize: this.pagesize });
      this.tableData = tableData;
      this.total = total;
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
      let { code } = await putChangeUserGroup(this.changeForm);
      if (+code === 200) {
        this.$message.success('用户分组修改成功。');
        this.changeFormCancel();
        this.findUserByParams();
      }
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

      let { code } = await postCreateUserGroup({
        urlData: this.urlData,
        groupName: this.createForm.groupName
      });
      if (+code === 200) {
        this.$message.success('用户分组创建成功。');
        this.createFormCancel();
        this.findUserByParams();
      }
      loading.close();
    },
    async changeFormCancel() {
      this.dialogFormchangeUser = false;
      this.changeForm = this.$options.data().changeForm;
      this.$refs['changeForm'].resetFields();
    },
    async createFormCancel() {
      this.dialogFormchange = false;
      this.createForm = this.$options.data().createForm;
      this.$refs['createForm'].resetFields();
    }
  },
  async  mounted() {
    eventUser.$on('userGroup', data => {
      this.filterFormChange();
    });
    this.filterFormChange();
    // let { data: { tableData, total }} = await findUserByParams({ page: 1, pagesize: 10 });
    // this.tableData = tableData;
    // this.total = total;
    // this.findUserByParams();
    // const _this = this;
    // const erd = elementResizeDetectorMaker();
    // erd.listenTo(document.getElementById('body'), element =>{
    //   this.screenWidth = element.offsetWidth * 0.2429;

    // });
  
  }
};
</script>
  
  <style lang="scss" rel="stylesheet/scss">
  .user-group-container{
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
  
