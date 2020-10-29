<template>
<div class="oper-group-container">
    <div class="role-container-search">
      <div class="server-container">
         <el-select v-model="value" placeholder="请选择">
          <el-option
            v-for="item in selectData"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
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
       <el-table-column   label="参数">
       <template slot-scope="scope" >
         <div class="testsss"> 
          <el-tooltip class="item"  effect='light'  placement="top"  >
          <div slot="content" ><span >{{scope.row.kwargs}}</span></div>
          <span >{{ scope.row['kwargs'] }}</span>
        </el-tooltip>
         </div>
        
        </template>
      </el-table-column>
    </el-table>
    </div>
    <div class="role-container-bottom">
      <el-pagination
      style="text-align: right;"
      :page-size.sync="pagesize"
      :page-sizes="[100, 200, 300, 400]"
      background
      layout="total, sizes, prev, pager, next, jumper"
      :pager-count='9'  
      :hide-on-single-page="false"  
      :total="total"
      :current-page.sync='page'
      @size-change="filterFormChange('change')"
      @current-change="filterFormChange('change')" ></el-pagination>
    </div>
    </div>
</template>
  
<script>
import { classification, querydata } from '@/api/logs';
import dayjs from 'dayjs';
export default {
  name: 'operationrecord',
  data() {
    return {
      selectData: [],
      total: 0,
      value: '',
      page: 1,
      pagesize: 100,
      tableData: [],
      tablecolumn: [
        { label: '操作名称', prop: 'instructions' },
        { label: '操作时间', prop: 'operating_time' },
        { label: 'IP', prop: 'ip' },
        { label: '操作人', prop: 'usernames' },
        { label: '操作说明', prop: 'text' }
      ]
    };
  },
  watch: {
    async value(n, o) {
      this.filterFormChange('click');
    }
  },
  computed: {
    tableDatas() {
      let a;
      try {
        a = this.tableData.map(a => {
          a['operating_time'] = dayjs(a.operating_time).format('YYYY-MM-DD HH:mm:ss');
          return a;
        }); 
      } catch (e) {
        return [];
      }
      return a;
    }
  },
  methods: {
    async filterFormChange(val) {
      if (val === 'click') {this.page = 1;}
      this.findUserByParams();
    },
    async findUserByParams() {
      let { value, page, pagesize } = this;
      let { data: { res, total }} = await querydata({ value, page, pagesize });
      this.tableData = res;
      this.total = +total;
    }
  },
  async mounted() {
    let { data: selectData } = await classification();
    this.selectData = selectData;
    this.value = this.selectData[0]?.label;
  }
};
</script>
  
<style lang="scss" rel="stylesheet/scss">
.oper-group-container{.testsss{max-height: 5vh;overflow: hidden;}.custom-tree-node{flex:1;display:flex;align-items:center;justify-content:space-between;font-size:14px;padding-right:8px;}.teststststs{float:right;SELECTOR{position:absolute;top:0;bottom:auto;margin-top:±VALUE;margin-bottom:auto;}}.selectID{span:first-child{display:none;}}.success-feng{background-color:rgba(255,0,0,0.4);}.success-jiny{background-color:rgba(255,155,0,0.3);}.el-tabletd,.el-tableth.is-leaf{text-align:center;}.demo-table-expand{display:grid;grid-template-columns:repeat(3,1fr);width:100%;margin-left:3%;font-size:18px;label{width:140px;color:#99a9bf;}.el-form-item{margin-right:0;margin-bottom:0;width:100%;display:flex;label{float:left;}}}.role-container-body{margin:10px;background-color:white;border-radius:5px;padding:5px;min-height:76vh;box-shadow: 1px 1px 4px 0px #828282;.el-table.cell{word-break:keep-all;}}.role-container-headerulli{float:right;margin-left:2px;button{border-radius:30px;}button:focus{box-sizing:content-box;}}.role-container-headerul{display:flex;justify-content:flex-end;}.server-container{padding:10px;}.input-with-select{width:250px;margin-left:-4px;border-radius:0;input{border-radius: 30px 0 0 30px ;}}.comprehensive-container.select-item{margin-left:10px;width:20%;}.comprehensive-container{.select-item:first-child{margin-left:-5px;width:19%;}}.comprehensive-container{display:flex;padding:10px;align-items:baseline;}.role-container-search{margin:10px;background-color:white;border-radius:5px;padding:2px;box-shadow: 1px 1px 4px 0px #828282;button[name='truesearch']{border-radius: 0 30px 30px 0;margin-left:-5px;height:32px}input[name='idselect']{border-radius: 30px 0 0 30px;width: 100px;} .comprehensive-container {display: flex;padding: 10px;align-items: baseline;}}.createFormAlertBodys div{display: flex;}.createFormAlert{display: grid;grid-template-columns: 1fr ;align-items: center;.el-select{display: block;}}}
</style>



