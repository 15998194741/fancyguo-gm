<template>
    <div class="anno-table-container">
    <el-table
    ref="multipleTable"
    border
    :data="tableData" 
    :row-class-name="tableRowClassName" 
    @selection-change="handleSelectionChange"
    >
    <el-table-column  type="selection" width="40"></el-table-column>
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
    <el-table-column  v-if="grade" prop='status' label="操作">
      <template slot-scope="scope" >
        <div style="display: flex;justify-content: center;">
          <el-button  v-show='scope.row["changeshow"]' v-if="scope.row.type !== '跑马灯'"  @click="placardmodify(scope.$index,scope.row)">修改</el-button>
        <el-popconfirm
          v-show='scope.row["stopshow"]'
          confirmButtonText='好的'
          cancelButtonText='不用了'
          icon="el-icon-info"
          iconColor="red"
          title="确定停用此公告吗？"
          @onConfirm="placarddeactivate(scope.$index,scope.row)">
          <el-button slot="reference"  >停用</el-button>
        </el-popconfirm>
        </div>
      </template>
    </el-table-column>
  </el-table>
    </div>
</template>
  
<script>
import { putupdateAnnouncement } from '@/api/announcedManagement';
import ANNO from './anno';
export default {
  name: 'userauth',
  props: {
    tableData: {
      type: Array,
      default: ()=>[]
    }
   
  },
  data() {
    return {
      tablecolumn: [
        { label: '公告ID', prop: 'id' },
        { label: '公告类型', prop: 'type' },
        { label: '平台', prop: 'plaforms' },
        { label: '渠道', prop: 'client' },
        { label: '区服名称', prop: 'servername' },
        { label: '公告标题', prop: 'title' },
        { label: '公告状态', prop: 'anno_status' },
        { label: '开始时间', prop: 'stime' },
        { label: '结束时间', prop: 'etime' }
      ],
      tableTrue: []
    };
  },
  watch: {
   
  },
  computed: {
    grade() {
      if (+this.$route.meta.grade === 0) {
        return false;
      }
      return true;
    }
  },
  methods: {
    tableRowClassName({ row, rowIndex }) {
      if (row.anno_status !== '待用' || row.type !== '公告板') {
        return 'success-row';
      }  
    },
    handleSelectionChange(val) {
      this.tableTrue = val.filter(item => item.anno_status === '待用' && item.type === '公告板');
      ANNO.$emit('tableTrue', this.tableTrue);
    },
    async placarddeactivate(index, row) {
      let res = await putupdateAnnouncement(row);
      if (+res.code !== 200) {return; }
      this.$message.success('停用成功');
      this.tableData[index]['anno_status'] = '停用';
      this.tableData[index].stopshow = false;
      this.tableData[index].changeshow = false;
    },
    async placardmodify(index, row) {
      ANNO.$emit('tableChange', { index, row });
    }
  },
  async  mounted() {

  
  }
};
</script>
  
<style lang="scss" rel="stylesheet/scss">
.anno-table-container{
  .aasdhjkahskdhjk{
    max-height: 5vh;
  }

.success-row td:first-child div{
  visibility: hidden;
}
}
</style>
  
