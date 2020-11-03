<template>
    <div class="record-container">
      <div class="role-container-header" >
      <ul style="margin: 5px 10px -5px 0;">
        <li><el-button slot="reference" icon="el-icon-refresh-right" size='small' class="button-with-header"  @click='filterFormChange'>刷新</el-button></li>
        <!-- <li> <el-button  slot="append" icon="el-icon-delete-solid" size='small' class="button-with-header" :disabled='fenghaocaozuo' @click='dialogFormchange = true'>道具回收</el-button></li> -->
      </ul>
    </div>
    <div class="role-container-search">
      <div class="server-container">ID：
          <el-select v-model="filterForm.key" value='serverid'  placeholder="请选择" name='idselect' size='small'>
          <el-option v-for="(item, index) in idoptions" :key="index" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        <el-input v-model="filterForm.value" placeholder="请输入内容" size='small' class="input-with-select" >
        </el-input>
        <el-button slot="append" icon="el-icon-search" size='small' class="button-with-select" name='truesearch' @click="filterFormChange('click')">
        </el-button>
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
      :data="tableData" 
      >
      <el-table-column v-for='(column,index) in tablecolumn' :key='index'  :label="column.label">
        <template slot-scope="scope">{{ scope.row[column.prop] }}</template>
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
      @size-change="filterFormChange('change')"
      @current-change="filterFormChange('change')" ></el-pagination>
    </div>
  </div>
</template>
  
<script>
import { recordLookup } from '@/api/white.js';
export default {
  name: 'whiterecprding',
  data() {
    return {
      total: 0,
      filterForm: {
        key: 'roleid',
        value: '',
        page: 1,
        pagesize: 10
      },
      selectForm: [],
      idoptions: [{
        label: '角色ID',
        value: 'roleid'
      }, {
        label: '邮件ID',
        value: 'mailid'
      }
      ],
      tableData: [],
      tablecolumn: [
        { label: '角色ID', prop: 'recoreroleid', width: 50 },
        { label: '邮件ID', prop: 'smtp_id', width: 50 },
        // { label: '物品类型', prop: 'role_name', width: 25 },
        { label: '发送时间', prop: 'sendtime', width: -50 }
      ]
    };
  },
  methods: {
    async filterFormChange(val) {
      this.tableData = [];
      let { data } = await recordLookup(this.filterForm);
      let { tableData, total } = data;
      this.tableData = tableData;
      this.total = +total;
    }
  },
  async mounted() {
    await this.filterFormChange();
  }
    
};
</script>
<style lang="scss" rel="stylesheet/scss">
.record-container{

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
    min-height: 73.5vh;
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
        // border-bottom: 1px #bdbdbd dashed;
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
      // padding: 5px;
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
      // .server-container {
      //   border-bottom: 1px #bdbdbd dashed;
      // }

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

