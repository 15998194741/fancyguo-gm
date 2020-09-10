<template>
  <div class="whitemail-container">
    <div class="role-container-header" >
    <ul style="margin: 5px 10px -5px 0px;">
      <li><el-button slot="reference" icon="el-icon-refresh" size='small' class="button-with-header"  @click='filterFormChange'>刷新</el-button></li>
      <li> <el-button  slot="append" icon="el-icon-circle-plus-outline" size='small' class="button-with-header"  @click='dialogFormchangeShowTrue'>添加</el-button></li>
    </ul>
  </div>
  <div class="role-container-search">
    <div class="server-container">ID：
      <el-input v-model="filterForm['value']" placeholder="请输入内容" size='small' class="input-with-select" >
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
    <el-table-column  type="selection" width="40"></el-table-column>
    <el-table-column v-for='(column,index) in tablecolumn' :key='index' :label="column.label">
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

<el-dialog  ref="newMailelDialog" title="新建邮件" :visible.sync="dialogFormchange" class="announceddialog"  :close-on-click-modal="false"  >
    <div  class="container">
        <div>  
          <el-form ref="createFormRulesLeft" :model="createFormMail"  status-icon label-width="100px" class="demo-ruleForm">
            <el-form-item  label="邮件标题" >
              <el-input v-model='createFormMail.title'  autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="邮件正文" >
              <el-input v-model='createFormMail.text' type="textarea"  :rows='6' autocomplete="off"></el-input>
            </el-form-item>
          </el-form>
        </div>
              <div>
                <el-form ref="createFormRulesRight" :model="createFormMail" status-icon  label-width="100px" class="demo-ruleForm">
                 <el-form-item label="发送方式 :" prop="serverName">
                  <el-radio v-model="createFormMail['sendType']" :label="true">周期发送</el-radio>
                  <el-radio v-model="createFormMail['sendType']" :label="false">单次发送</el-radio>
                </el-form-item>
                <el-form-item label="道具" prop="pass">
                <el-form ref="createFormRulesRight" :model="createFormMail" status-icon   >
                  <el-form-item v-for='(item,index) in  annexList' :key='item["id"]' class="annexList"  prop="pass">
                    <el-row style="margin-top: 1px;">
                    <el-col :span='10' >
                      <el-cascader
                      v-model="annexList[index]['annexName']"
                      :show-all-levels="false"
                      :props="annexProps"
                      :options='annexOptions'
                    ></el-cascader>
                       </el-col>
                  <el-col  :span='5'><el-input  v-model="annexList[index]['annexNumber']"  placeholder="数量"  autocomplete="off"></el-input>  </el-col>
                       <el-col :span='2'>
                        <i class="el-icon-remove"  style="font-size: 200%; position: absolute; top: 15%; bottom: 15%;"  @click='annexListCut(index)'></i>
                      </el-col>
                      </el-row>
                      </el-form-item>
                </el-form>
                    <i class="el-icon-circle-plus" style="font-size: 200%;margin-top: 5px;"  @click='annexListAdd'></i>
                  </el-form-item>
              </el-form>
              </div>
   </div>
     <div slot="footer" class="dialog-footer">
       <el-button @click="createFormMailCancel">取 消</el-button>
       <el-button type="primary" class="allSelectButton" >确 定</el-button>
     </div>
   </el-dialog>

  </div>
</template>

<script>
// import elementResizeDetectorMaker from 'element-resize-detector';
import { getQueryAnnexOptionsLazy, getQueryAnnexOptions } from '@/api/mail.js';
var id = 0;
export default {
  name: 'rolequery',
  data() {
    return {
      serverCreatedialogFormVisible: false,
      annexProps: {
        lazy: true,
        async lazyLoad(node, resolve) {
          let { label } = node;
          let { data: nodes } = await getQueryAnnexOptionsLazy({ label });
          resolve(nodes);
        }
      },
      annexOptions: [],
      dialogFormchange: false,
      annexList: [
        { annexName: '', annexNumber: '', id: 0 }
      ],
      createFormMail: {
        title: '',
        text: '',
        sendType: true
      },
      file: '',
      filelist: [],
      multipleTable: '',
      total: 0,
      filterForm: {
        value: '',
        type: '',
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
        label: '福利类别',
        multiple: false,
        key: 'type',
        value: '',
        options: [
          {
            label: '不限制',
            value: ''
          }, {
            label: '周期',
            value: '1'

          }, {
            label: '单次',
            value: '2'
          }]
      }
      ],
    
      tableData: [],
      tablecolumn: [
        { label: '邮件ID', prop: 'roleid', width: 50 },
        { label: '邮件标题', prop: 'account_id', width: 50 },
        { label: '邮件内容', prop: 'role_name', width: 25 },
        { label: '附件', prop: 'plaform', width: -50 },
        { label: '福利类别', prop: 'plaform', width: -50 },
        { label: '发送时间', prop: 'plaform', width: -50 }
       

      ],

      screenWidth: 145,
      screenHeight: '',
      tableTrue: []
    };
    
  },
  methods: {
    async dialogFormchangeShowTrue() {
      let { code, data } = await getQueryAnnexOptions();
      if (code === 200) {
        this.annexOptions = data;
      }
      this.dialogFormchange = true;
    },
    async createFormMailCancel() {
      this.dialogFormchange = false;
      this.$refs['createFormRulesLeft'].resetFields();
      this.$refs['createFormRulesRight'].resetFields();
      
    },
    filterFormChange(val) {
      switch (val) {
        case 'click':this.filterFormChangeClick(); break;
        case 'change':this.filterFormChangeChange(); break;
        case 'pagechange':this.filterFormChangeChange(); break;
        default:this.filterFormChangeFlush();
      }
    },
    annexListCut(index) {
      if (this.annexList.length === 1) {
        this.$message.warning('必须有一条记录。');  
        return;
      }
      this.annexList.splice(index, 1);
    },
    annexListAdd() {
      let a = this.annexList[this.annexList.length - 1];
      a['annexName'] && a['annexNumber'] ? this.annexList.push({ annexName: '', annexNumber: '', id: ++id }) : this.$message.warning('请填写完整');  
      this.$refs['newMailelDialog'].$el.scrollTo({
        top: this.$refs['newMailelDialog'].$el.scrollHeight + 100, 
        behavior: 'smooth' 
      });  
    }
  },
  mounted() {
    
    // const _this = this;
    // const erd = elementResizeDetectorMaker();
    // erd.listenTo(document.getElementById('body'), element =>{
    //   this.screenWidth = element.offsetWidth * 0.2429;
    // });
  }


  
};
</script>

<style lang="scss" rel="stylesheet/scss">
.whitemail-container{

.container{
        display: grid;
        grid-template-columns: 2fr 2fr;
        margin-top: 2%;
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

