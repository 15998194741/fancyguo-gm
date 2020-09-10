<template>
  <div class="white-container">
    <div class="role-container-header" >
    <ul style="margin: 5px 10px -5px 0px;">
 <li><el-button slot="reference" icon="el-icon-refresh" size='small' class="button-with-header"  @click='filterFormChange'>刷新</el-button></li>
 <li> <el-button  slot="append" icon="el-icon-delete-solid" size='small' class="button-with-header"  @click='dialogFormchange = true'>添加白名单用户</el-button></li>
    </ul>
  </div>
  <div class="role-container-search">
    <div class="server-container">ID：
   
 <el-input v-model="filterForm.value" placeholder="请输入角色ID" size='small' class="input-with-select" >
 </el-input>
 <el-button slot="append" icon="el-icon-search" size='small' class="button-with-select" name='truesearch' @click="filterFormChange('click')">
 </el-button>
    </div>
    <div class="comprehensive-container">
 <div v-for='(i,index) in selectForm' :key='index'  class="select-item"  > {{i.label}}:
   <el-select v-model="filterForm[i.key]" :multiple="i['multiple']" placeholder="请选择" size='small' style="border-radius: 10px;" @change="filterFormChange('change')" >
     <el-option v-for="(item,index) in i.options" :key="index"  :label='item.label' :value="item.value" >
     </el-option>
   </el-select>
 </div>
    </div>
  </div>

  <div id='body' class="role-container-body">
    <el-table
    ref="multipleTable"
    border
    :data="tableData" 
    >
       <!-- :row-class-name="tableRowClassName"  -->
    <el-table-column  type="selection" width="40"></el-table-column>
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

 <el-dialog title="添加白名单用户" :visible.sync="dialogFormchange" class="announceddialog"  :close-on-click-modal="false"> 
    <!-- <el-drawer
  ref="drawer"
  title="添加白名单用户"
  :before-close="false" 
  :visible.sync="dialogFormchange"
  direction="ltr"
  > -->
    <div  >
    <el-form>
  <!-- <el-form-item label-width="80px" label="角色ID:" prop="age">
    <el-input size='small' style="width: 10.5vw;"></el-input>
  </el-form-item> -->
  <!-- <el-form-item label-width="80px" label="平台:">
   <el-select placeholder="请选择" size='small' style="border-radius: 10px;" >
     <el-option label='不限制' value="" ></el-option>
     <el-option label='安卓' value="1" ></el-option>
  <el-option label='苹果' value="2" ></el-option>
   </el-select>
 </el-form-item>
  <el-form-item label-width="80px"  label="客户端:">
   <el-select   multiple placeholder="请选择" size='small' style="border-radius: 10px;" >
     <el-option v-for="(item,index) in selectForm[1].options"   :key="index"  :label='item.label' :value="item.value" >
     </el-option>
   </el-select>
 </el-form-item> -->
  <!-- <el-form-item label-width="80px" label="服务器:">
   <el-select  multiple placeholder="请选择" size='small' style="border-radius: 10px;" @change='queryMarqueeweights' >
     <el-option v-for="(item,index) in servernamesselect"   :key="index"  :label='item.label' :value="item.value" >
     </el-option></el-select>
 </el-form-item> -->
    <el-form-item    label="人员名单:" prop="serverName">
                <el-upload
                    ref='upload'
                    class="upload-demo"
                    drag
                    action="#"
                    accept='.xlsx,.xls'
                    :auto-upload="true"
                    :file-list='filelist'
                    :limit='1'
                    multiple
                    :http-request="fileUpload" 
                    >
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                    <div slot="tip" class="el-upload__tip">只能上传xlsx/xls文件</div>
                  </el-upload>
                  </el-form-item>
  <el-form-item label-width="80px" label="福利类别:">
  <el-select  v-model="createFormWhite['type']" multiple placeholder="请选择" size='small' style="border-radius: 10px;" >
    <el-option v-for="(item,index) in servernamesselect"   :key="index"  :label='item.label' :value="item.value" >
    </el-option></el-select>
</el-form-item>
 <el-form-item label-width="80px" label="备注" prop="age">
  <el-input v-model="createFormWhite['notebook']"  size='small' style="width: 10.5vw;" ></el-input>
</el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormchange = false">取 消</el-button>
      <el-button type="primary" @click='dialogFormchange = false'>确 定</el-button>
         </div>
   </div>
     
 </el-dialog> 

 <el-dialog title="excel数据" :visible.sync="serverCreatedialogFormVisible" class="whitedialog"  :close-on-click-modal="false"> 
     <el-table
    ref="multipleTable"
    border
    :data="createFormWhite['roleId']" 
    >
      <el-table-column prop='id' label="角色id">
    </el-table-column>
     <el-table-column prop='serverid' label="区服id">
    </el-table-column>
  </el-table>
  </el-dialog> 
  <!-- </el-drawer> --> 
   <!-- <el-dialog  ref="newMailelDialog" title="新建邮件" :visible.sync="dialogFormchange" class="announceddialog"  :close-on-click-modal="false"  @close='createFormMailCancel'>
       </el-dialog> -->
  </div>
</template>

<script>
import elementResizeDetectorMaker from 'element-resize-detector';
import '@/assets/icon/iconfont.css';
import xlsx from 'xlsx';

export default {

  name: 'rolequery',
  data() {
    return {
      serverCreatedialogFormVisible: false,
      createFormWhite: {},
      dialogFormchange: false,
      multipleTable: '',
      total: 0,
      filelist: [],
      filterForm: {
        key: 'roleid',
        value: '',
        regtime: '',
        stime: '',
        plaform: '',
        channel: '',
        servername: '',
        'banned_type': '',
        'banned_area': '',
        page: 1,
        pagesize: 10
      },
      createFormRules: {
        type: [
          { required: true, message: '请输入至少一个字符', trigger: ['blur', 'change'] }
    
        ],
        area: [
          { required: true, message: '请选择一个平台', trigger: ['blur', 'change'] }
        ],
        time: [
          { required: true, trigger: ['blur', 'change'] }
        ],
        beacuse: [
          { required: true, message: '请输入原因', trigger: ['blur', 'change'] }
        ],
        long: [
          { required: true, message: '请输入时长', trigger: ['blur', 'change'] }
        ]
   
      },
      insertForm: {
        type: '1',
        area: '1',
        time: '1',
        beacuse: '',
        long: ''
   
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
            label: '安卓',
            value: '1'

          }, {
            label: '苹果',
            value: '2'
          }]
      }, {
        label: '客户端',
        key: 'channel',
        multiple: true,
        value: '',
        options: []
      },
      {
        label: '服务器',
        key: 'servername',
        multiple: false,
        value: '',
        options: [{
          label: '不限制',
          value: ''
        }]
      }, {
        label: '类别',
        key: 'banned_type',
        multiple: false,
        value: '',
        options: [{
          label: '不限制',
          value: ''
        }, {
          label: '封号',
          value: '1'

        }, {
          label: '禁言',
          value: '2'
        }]
      }, {
        label: '分组',
        key: 'banned_area',
        multiple: false,
        value: '',
        options: [{
          label: '不限制',
          value: ''
        }, {
          label: '角色',
          value: '1'

        }, {
          label: '账户',
          value: '2'
        }, {
          label: 'IP',
          value: '3'
        }]
      }
      ],
      idoptions: [{
        label: '角色ID',
        value: 'roleid'
      }
      ],
      tableData: [],
      tablecolumn: [
        { label: '角色ID', prop: 'roleid', width: 50 },
        { label: '平台', prop: 'account_id', width: 50 },
        { label: '客户端', prop: 'role_name', width: 25 },
        { label: '服务器名称', prop: 'plaform', width: -50 },
        { label: '福利类别', prop: 'plaform', width: -50 },
        { label: '福利发放次数', prop: 'plaform', width: -50 },
        { label: '角色分组', prop: 'plaform', width: -50 },
        { label: '备注', prop: 'plaform', width: -50 }
      ],
      screenWidth: 145,
      screenHeight: '',
      tableTrue: []
    }; 
  },
  methods: {
    async fileUpload(files) {
      const file = files.file;
      const fileReader = new FileReader();
      fileReader.onload = (ev) =>{
        try {
          const data = ev.target.result;
          const workbook = xlsx.read(data, {
            type: 'binary'
          });
          let a;
          for (let sheet in workbook.Sheets) {
            a = xlsx.utils.sheet_to_json(workbook.Sheets[sheet]);
            break;
          }   
          // a = a.map(item =>[item['serverid'], item['id']]);
          readfiles(a, this);
          // a = a.map(item =>`${item['serverid']}` + `${item['id']}`);
        } catch (e) {
          console.log(e);
          this.$message.warning('文件不正确！');
        }
      };
      fileReader.readAsBinaryString(file);
      function readfiles(data, _this) {
        _this.createFormWhite['roleId'] = data;
        _this.$confirm(`数据读取完毕，是否展开预览?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning' })
          .then(()=>{_this.serverCreatedialogFormVisible = true;})
          .catch(err => false);
      
      
      }
    }
  },
  mounted() {
    
    const erd = elementResizeDetectorMaker();
    erd.listenTo(document.getElementById('body'), element =>{
      this.screenWidth = element.offsetWidth * 0.2429;
    //   switch (element.offsetWidth) {
    //     case 1840: break;
    //     case 1700: this.screenWidth = '30%'; break;
    //   }
    });





  }


  
};
</script>

<style lang="scss" rel="stylesheet/scss">
.white-container{
.el-dialog{
width: 18vw;
}
//   .announceddialog{
//   max-width: 35vw;
// }
.el-upload-dragger{
  width: 16vw !important;
}
// .el-form-item__content{
//   line-height: -100px !important;
// }
.el-upload__tip{
  margin-top: -20px  !important;
}
.el-upload-list__item:first-child {
    margin-top: -3px;
}
.whitedialog .el-dialog{
width: 38vw;
border-radius: 10px;
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

