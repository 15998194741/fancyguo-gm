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
  
<!-- 渠道创建表单弹窗 -->
    <el-dialog title="渠道创建" :visible.sync="dialogFormchange"  :close-on-click-modal="false">
      <el-form ref="createForm" :rules="createFormRules" :model="createForm" label-width="150px"  class='createFormAlert'> 
        <el-form-item label="渠道ID:" class="createFormAlertBody" prop='channelId' hide-required-asterisk required>
          <el-input v-model="createForm.channelId" class="alertcontant" placeholder="请输入用户名"></el-input>
        </el-form-item>
         <el-form-item label="渠道名称:" class="createFormAlertBody" prop='channelName' hide-required-asterisk required>
          <el-input v-model="createForm.channelName" class="alertcontant" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item size="large" style="display: flex;justify-content: flex-end;">
          <el-button @click="FormEildalogCanCel('dialogFormchange','createForm','createForm')">取 消</el-button>
          <el-button type="primary"   @click="createFormSubmitForm('createForm')">确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 渠道修改表单弹窗 -->
    <el-dialog title="用户分组修改" :visible.sync="dialogFormchangeUser"  :close-on-click-modal="false">
      <el-form ref="changeForm" :rules="changeFormRules" :model="changeForm" label-width="150px"  class='createFormAlert'> 
        <el-form-item label="渠道ID:" class="createFormAlertBody" prop='channelId' hide-required-asterisk required>
          <el-input v-model="changeForm.channelId" class="alertcontant" placeholder="请输入用户名"></el-input>
        </el-form-item>
         <el-form-item label="渠道名称:" class="createFormAlertBody" prop='channelName' hide-required-asterisk required>
          <el-input v-model="changeForm.channelName" class="alertcontant" placeholder="请输入用户名"></el-input>
        </el-form-item>
      
        <el-form-item size="large" style="display: flex;justify-content: flex-end;">
          <el-button @click="FormEildalogCanCel('dialogFormchangeUser','changeForm','changeForm')">取 消</el-button>
          <el-button type="primary"   @click="changeFormSubmitForm('changeForm')">确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>





    </div>
</template>
  
<script>
import { createchannel, findChannel, findChannelById } from '@/api/gmChannel';
import { deleteChannel, putChangeChannel, forceDelete } from '@/api/gmChannel';
import dayjs from 'dayjs';
import { loading, close, secondConfirmation } from '@/views/loading';
export default {
  name: 'channelmanagement',
  data() {
    return {
      loading: '',
      radio: '',
      dialogFormchange: false,
      dialogFormchangeUser: false,
      total: 0,
      value: '',
      page: 1,
      pagesize: 10,
      createForm: {
        id: '',
        channelId: '',
        channelName: ''
      },
      changeForm: {
        id: '',
        channelId: '',
        channelName: ''
      },
      changeFormData: {
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
            let { channelId } = this.$data.changeFormData;
            if (+value === +channelId) {return callback();}
            let { data: a } = await findChannel({ type: false, value });
            return callback(a ? new Error('不可以重复') : undefined); 
          }, trigger: ['blur'] }
        ],
        channelName: [
          { validator: async(rule, value, callback) =>{
            if (!value) {
              return callback(new Error('请输入渠道名称'));
            }
            let { channelName } = this.$data.changeFormData;
            if (value === channelName) {return callback();}
            let { data: a } = await findChannel({ type: true, value });
            return callback(a ? new Error('不可以重复') : undefined); 
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
            let { data: a } = await findChannel({ type: false, value });
            return callback(a ? new Error('不可以重复') : undefined); 
          }, trigger: ['blur'] }
        ],
        channelName: [
          { validator: async(rule, value, callback) =>{
            if (!value) {
              return callback(new Error('请输入渠道名称'));
            }
            let { data: a } = await findChannel({ type: true, value });
            return callback(a ? new Error('不可以重复') : undefined); 
          }, trigger: ['blur'] }
        ]
      },
      tableData: [],
      tablecolumn: [
        { label: '渠道ID', prop: 'channel_id' },
        { label: '渠道名称', prop: 'channel' },
        { label: '创建时间', prop: 'createtime' }
      ]
    };
  },
  watch: {},
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
      let { channel: channelName, channel_id: channelId, id } = row;
      this.changeForm = { channelName, channelId, id };
      this.changeFormData = {};
      for (let i in this.changeForm) {
        this.changeFormData[i] = this.changeForm[i];
      }
    },
    async deleteHandleEdit(index, row) {
      let { channel } = row;
      let sendtrue = await secondConfirmation(this, `是否确认删除 ${channel} 渠道?`);
      if (!sendtrue) {return;}
      loading(this);
      let { code, data } = await deleteChannel(row);
      if (+code === 200) {
        if (data) {
          let sendtrue = await secondConfirmation(this, `该数据存在级联关系，是否强制删除 ${channel} 渠道？注意： 相关数据都将删除。`);
          if (!sendtrue) {close(this); return;}
          await forceDelete(row);
        }
        this.$message.success('删除成功');
        this.findUserByParams();
      }
      close(this);
    },
    async forceDelete(row) {

      console.log('要求强制删除');
    },
    async filterFormChange(val) {
      if (val === 'click') {this.page = 1;}
      this.findUserByParams();
    },
    async findUserByParams() {
      let { value, page, pagesize } = this;
      let { data: { tableData, total }} = await findChannelById({ value, page, pagesize });
      this.tableData = tableData;
      this.total = +total;
    },
    async changeFormSubmitForm(val) {
      let errTrou = await this.$refs[val].validate().catch(err=>false);
      if (!errTrou) {return;}
    
      if (JSON.stringify(this.changeForm) === JSON.stringify(this.changeFormData)) {this.$message.warning('未作修改!'); return;}
      let sendtrue = await secondConfirmation(this, `是否确认修改渠道? 注意：修改渠道后所有有关数据级联修改`);
      if (!sendtrue) {return;}
      loading(this);
      let { code } = await putChangeChannel(this.changeForm);
      if (+code === 200) {
        this.$message.success('用户分组修改成功。');
        this.FormEildalogCanCel('dialogFormchangeUser', 'changeForm', 'changeForm');
        this.findUserByParams();
      }
      close(this);
    },
    async createFormSubmitForm(value) {
      let errTrou = await this.$refs[value].validate().catch(err=>false);
      if (!errTrou) {return;}
      let sendtrue = await secondConfirmation(this, `是否确认创建渠道?`); 
      if (!sendtrue) {return;}
      loading(this);
      let { code } = await createchannel({
        ...this.createForm
      });
      if (+code === 200) {
        this.$message.success('渠道创建成功。');
        this.FormEildalogCanCel('dialogFormchange', 'createForm', 'createForm');
        this.findUserByParams();
      }
      close(this);
    },
    async FormEildalogCanCel(f, s, t) {
      this[f] = false;
      this[s] = this.$options.data()[s];
      this.$refs[t].resetFields();
    }
  },
  mounted() {
    this.findUserByParams();
  }
};
</script>
  
<style lang="scss" rel="stylesheet/scss">
.channnel-group-container{.custom-tree-node{flex:1;display:flex;align-items:center;justify-content:space-between;font-size:14px;padding-right:8px;}.teststststs{float:right;SELECTOR{position:absolute;top:0;bottom:auto;margin-top:±VALUE;margin-bottom:auto;}}.selectID{span:first-child{display:none;}}.success-feng{background-color:rgba(255,0,0,0.4);}.success-jiny{background-color:rgba(255,155,0,0.3);}.el-tabletd,.el-tableth.is-leaf{text-align:center;}.demo-table-expand{display:grid;grid-template-columns:repeat(3,1fr);width:100%;margin-left:3%;font-size:18px;label{width:140px;color:#99a9bf;}.el-form-item{margin-right:0;margin-bottom:0;width:100%;display:flex;label{float:left;}}}.role-container-body{margin:10px;background-color:white;border-radius:5px;padding:5px;min-height:76vh;box-shadow: 1px 1px 4px 0px #828282;.el-table.cell{word-break:keep-all;}}.role-container-headerulli{float:right;margin-left:2px;button{border-radius:30px;}button:focus{box-sizing:content-box;}}.role-container-headerul{display:flex;justify-content:flex-end;}.server-container{padding:10px;}.input-with-select{width:250px;margin-left:-4px;border-radius:0;input{border-radius: 30px 0 0 30px ;}}.comprehensive-container.select-item{margin-left:10px;width:20%;}.comprehensive-container{.select-item:first-child{margin-left:-5px;width:19%;}}.comprehensive-container{display:flex;padding:10px;align-items:baseline;}.role-container-search{margin:10px;background-color:white;border-radius:5px;padding:2px;box-shadow: 1px 1px 4px 0px #828282;button[name='truesearch']{border-radius: 0 30px 30px 0;margin-left:-5px;height:32px}input[name='idselect']{border-radius: 30px 0 0 30px;width: 100px;} .comprehensive-container {display: flex;padding: 10px;align-items: baseline;}}.createFormAlertBodys div{display: flex;}.createFormAlert{display: grid;grid-template-columns: 1fr ;align-items: center;.el-select{display: block;}}}
</style>



