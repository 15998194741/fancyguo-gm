<template>
  <div ref="whiteContainer" class="white-container">
    <div class="role-container-header" >
    <ul style="margin: 5px 10px -5px 0px;">
 <li><el-button slot="reference" icon="el-icon-refresh-right" size='small' class="button-with-header"  @click='filterFormChange'>刷新</el-button></li>
 <li> <el-button  v-if='grade' slot="append" icon="el-icon-delete-solid" size='small'  class="button-with-header"  @click='createFormAlert'>添加白名单用户</el-button></li>
    </ul>
  </div>
  <div class="role-container-search">
    <div class="server-container"><span>角色ID：</span>
   
 <el-input v-model="filterForm.value" placeholder="请输入角色ID" size='small' class="input-with-select" >
 </el-input>
 <el-button slot="append" icon="el-icon-search" size='small' class="button-with-select" name='truesearch' @click="filterFormChange('click')">
 </el-button>
    </div>
    <div class="comprehensive-container">
 <div v-for='(i,index) in selectForm' :key='index'  class="select-item"  > {{i.label}}:
   <el-select v-model="filterForm[i.key]" :multiple="i['multiple']" clearable :collapse-tags="i['collapse']" :filterable='i.filterable'  placeholder="请选择" size='small' style="border-radius: 10px;" @change="filterFormChange('change')" >
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
      <el-table-column  v-if='grade' label="查看">
       <template slot-scope="scope" > 
         <el-button type="primary" plain @click='whiteIndexToMail(scope)'>查看</el-button>
       </template>
    </el-table-column>
     <el-table-column  v-if='grade' label="停用">
       <template slot-scope="scope" > 
         <el-button  v-show="scope['row']['type'] === '周期'"  type="danger" plain @click='whiteMailStop(scope)'>停用</el-button>
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

 <el-dialog title="添加白名单用户" :visible.sync="dialogFormchange" class="announceddialog"  :close-on-click-modal="false"> 
    <!-- <el-drawer
  ref="drawer"
  title="添加白名单用户"
  :before-close="false" 
  :visible.sync="dialogFormchange"
  direction="ltr"
  > -->
    <div  >

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
  <el-form-item label-width="80px"  label="渠道:">
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
     <el-form ref="createFormRules" :model="createFormWhite" status-icon :rules="createFormRules">
    <el-form-item    label="人员名单:" prop="roleId">
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
  <el-form-item label-width="80px" label="福利类别:" prop="type">
  <el-select  v-model="createFormWhite['type']" placeholder="请选择"  size='small' style="border-radius: 10px;" @change="typeChange" >
    <el-option label='周期' :value="true" ></el-option>
    <el-option label='单次' :value="false" ></el-option>
    </el-select>
</el-form-item>
 <el-form-item label-width="80px" label="邮件标题:" prop="name">
  <el-select  v-model="createFormWhite['name']"  placeholder="请选择" size='small' style="border-radius: 10px;" >
    <el-option v-for="(item,index) in name" :key="index" :label='item.label' :value="item.value" ></el-option>
    </el-select>
</el-form-item>
 <el-form-item label-width="80px" label="备注:" prop="notebook">
  <el-input v-model="createFormWhite['notebook']"  size='small' style="width: 10.5vw;" ></el-input>
</el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="createFormACancel">取 消</el-button>
      <el-button type="primary" @click='createFormSumbit'>确 定</el-button>
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
// import elementResizeDetectorMaker from 'element-resize-detector';
import '@/assets/icon/iconfont.css';
import xlsx from 'xlsx';
import { whiteFindName, mailRelatedUser } from '@/api/white.js';
// import { findComponents } from '@/api/components.js';
import { channelComponents, servernameComponents } from '@/api/white.js';
import { find, stopWhiteMail } from '@/api/white.js';

export default {
  name: 'whiteindex',
  data() {
    let roleidrule = (rule, value, callback)=>{
      value = this.$data.createFormWhite['roleId'];
      // console.log(this.$data.createFormWhite);
      if (!value) {
        return callback(new Error('不可以空着哦'));
      }
      callback();
    };
    let typerule = (rule, value, callback)=>{
      callback();
    };
    let nameidrule = (rule, value, callback)=>{
      if (!value) {
        return callback(new Error('不可以空着哦'));
      }
      callback();
    };
    
    return {
      serverCreatedialogFormVisible: false,
      createFormWhite: {
        roleId: '',
        name: '',
        type: true,
        notebook: ''
      },
      names: [],
      name: [],
      dialogFormchange: false,
      total: 0,
      filelist: [],
      filterForm: {
        value: '',
        plaform: '',
        channel: '',
        servername: '',
        type: '',
        page: 1,
        pagesize: 10
      },
      filterForms: {},
      createFormRules: {
        roleId: [
          { validator: roleidrule, trigger: ['blur', 'change'] }
        ],
        type: [
          { validator: typerule, trigger: ['blur', 'change'] }
        ],
        name: [
          { validator: nameidrule, trigger: ['blur', 'change'] }
        ]
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
        multiple: true,
        filterable: true,
        collapse: true,
        value: '',
        options: []
      },
      {
        label: '服务器名',
        key: 'servername',
        multiple: true,
        filterable: true,
        collapse: true,
        value: '',
        options: []
      }, {
        label: '福利类别',
        key: 'type',
        multiple: false,
        value: '',
        options: [{
          label: '周期',
          value: '周期'

        }, {
          label: '单次',
          value: '单次'
        }]
      } 
        // {
        //   label: '分组',
        //   key: 'banned_area',
        //   multiple: false,
        //   value: '',
        //   options: [{
        //     label: '不限制',
        //     value: ''
        //   }, {
        //     label: '角色',
        //     value: '1'

      //   }, {
      //     label: '账户',
      //     value: '2'
      //   }, {
      //     label: 'IP',
      //     value: '3'
      //   }]
      // }
      ],
      idoptions: [{
        label: '角色ID',
        value: 'roleid'
      }
      ],
      tableData: [],
      tablecolumn: [
        { label: '角色ID', prop: 'roleids', width: 50 },
        { label: '平台', prop: 'plaforms', width: 50 },
        { label: '渠道', prop: 'channel', width: 25 },
        { label: '服务器名称', prop: 'servername', width: -50 },
        { label: '福利类别', prop: 'type', width: -50 },
        { label: '福利ID', prop: 'smtp_id', width: -50 },
        // { label: '福利发放次数', prop: 'plaform', width: -50 },
        // { label: '角色分组', prop: 'plaform', width: -50 },
        { label: '备注', prop: 'notebook', width: -50 }
      ]
    }; 
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
    async whiteIndexToMail(scope) {
      let data = scope;
      this.$router.push({
        path: '/whiteListManagement/whiteListMail',
        query: { ...data['row'] }
      });
    },
    async whiteMailStop(scope) {
      let sendtrue = await this.$confirm(`是否确认停用白名单邮件?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning' })
        .catch(err => false);
      if (!sendtrue) {return;}
      let data = scope['row'];
      let { id } = data;
      let res = await stopWhiteMail({ id });
      let { code } = res;
      if (+code !== 200) {this.$message.warning('停用失败'); return;}
      this.$message.success('停用成功');
      this.filterFormChangeSumbit();
      // console.log(id);
    },
    async createFormSumbit() {
      let trues = await this.$refs['createFormRules'].validate().catch(err=>false);
      if (!trues) {return;}
      let sendtrue = await this.$confirm(`是否确认添加白名单用户?`, '提示', {
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
      let res = await mailRelatedUser(this.createFormWhite);
      let { code } = res;
      if (+code !== 200) { loading.close(); return;} 
      loading.close();
      this.$message.warning('创建成功');
      this.createFormACancel();
      this.dialogFormchange = false;
      this.filterFormChange();
    },
    async typeChange() {
      // console.log(this.createFormWhite['type']);
      let { type } = this.createFormWhite;
      console.log(this.names);
      this.createFormWhite['name'] = '';
      if (type) {
        this.name = this.names['1'];
      } else {
        this.name = this.names['2'];
      }
    },
    filterFormChange(val) {
      this.$refs['whiteContainer'].parentElement.scrollTo({
        top: 0, 
        behavior: 'smooth' 
      });
      switch (val) {
        case 'click':this.filterFormChangeClick(); break;
        case 'change':this.filterFormChangeChange(); break;
        case 'pagechange':this.filterFormPageChange(); break;
        default:this.filterFormChangeFlush();
      }
    },
    async filterFormChangeClick() {
      this.filterForm['page'] = 1;
      for (let i in this.filterForm) {
        if (i === 'value' || i === 'page' || i === 'pagesize') {this.filterForms[i] = this.filterForm[i]; continue;}
        this.filterForm[i] = null;
        this.filterForms[i] = this.filterForm[i];
      }
      this.filterFormChangeSumbit();

    },
    async filterFormChangeChange() {
      this.filterForm['value'] = null;
      this.filterForm['page'] = 1;
      for (let i in this.filterForm) {
        this.filterForms[i] = this.filterForm[i];
      }
      this.filterFormChangeSumbit();
    },
    async filterFormPageChange() {
      this.filterForms['page'] = this.filterForm['page'];
      this.filterForms['pagesize'] = this.filterForm['pagesize'];
      this.filterFormChangeSumbit();
    },
    async filterFormChangeFlush() {
      for (let i in this.filterForm) {
        if (i === 'pagesize') {continue;}
        this.filterForm[i] = null;
      }
      this.filterForm['page'] = 1;
      this.filterForms = this.filterForm;
      this.filterFormChangeSumbit();

    },
    async filterFormChangeSumbit() {
      let { code, data } = await find(this.filterForms);
     
      if (+code === 200) {
        try {
          let total = data[0]['total'];
          this.tableData = data;
          this.total = total ? Number(total) : 0;
        } catch {
          this.total = 0;
          this.tableData = [];
        }
      }
     
    },
    async createFormAlert() {
      this.dialogFormchange = true;
      this.names = await (async()=>{
        let { data } = await whiteFindName();
        return data;
      })();
      this.typeChange();
      console.log(this.names);
    },
    async createFormACancel() {
      this.filelist = [];
      this.dialogFormchange = false;
      for (let i in this.createFormWhite) {
        this.createFormWhite[i] = null;
      }
      await this.$refs['createFormRules'].resetFields();
    },
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
  async mounted() {
    
    this.name = this.names['1'];
    let { data: channelData } = await channelComponents();
    this.selectForm[1].options = this.selectForm[1].options.concat(channelData);
    let { data: serverData } = await servernameComponents();
    this.selectForm[2].options = this.selectForm[2].options.concat(serverData);
    this.filterFormChangeClick();
    // const erd = elementResizeDetectorMaker();
    // erd.listenTo(document.getElementById('body'), element =>{
    //   this.screenWidth = element.offsetWidth * 0.2429;
    // //   switch (element.offsetWidth) {
    // //     case 1840: break;
    // //     case 1700: this.screenWidth = '30%'; break;
    // //   }
    // });





  }


  
};
</script>

<style lang="scss" rel="stylesheet/scss">
.white-container{
  .el-dialog__body{
    min-width: 500px;
    .el-input--small .el-input__inner{
          width: 10.5vw;
          min-width: 200px;
    }
  }
  .upload-demo{
    &>ul>li{
      width: 15vw;
    }
  }
  .cell{
  max-height: 40px;
  overflow: hidden;
  white-space: nowrap;	/*规定文本不进行换行*/
    text-overflow: ellipsis;
  
}
.el-dialog{
width: 18vw;
min-width: 400px;
}
//   .announceddialog{
//   max-width: 35vw;
// }
.el-upload-dragger{
  width: 10.5vw !important;
  min-width: 200px;
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

