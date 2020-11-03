<template>
  <div ref="whitemailContainer" class="whitemail-container">
    <div class="role-container-header" >
    <ul style="margin: 5px 10px -5px 0px;">
      <li><el-button slot="reference" icon="el-icon-refresh-right" size='small' class="button-with-header"  @click='filterFormChangeFlush'>刷新</el-button></li>
      <li> <el-button v-if="grade" slot="append" icon="el-icon-circle-plus-outline" size='small' class="button-with-header"  @click='dialogFormchangeShowTrue'>添加</el-button></li>
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
     <el-table-column v-for='column in tablecolumn' :key='column["id"]'    :label="column.label">
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
    <el-table-column v-if="grade" label="操作" class="tableTest-caozuo" >
      <template slot-scope="scope" class="tableTest-caozuo">
        <div class="tableTest-caozuo">
             <el-button  type="warning"  @click="changeWhiteMail(scope.$index,scope.row)">修改</el-button>
        <el-button  type="danger"  @click="deleteWhiteMail(scope.$index,scope.row)">删除</el-button>
        </div>
      
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
    :current-page.sync='filterForm["page"]'
    @size-change="filterFormChange('pagechange')"
    @current-change="filterFormChange('pagechange')" ></el-pagination>
  </div>

<el-dialog  ref="newMailelDialog" title="新建白名单邮件" :visible.sync="dialogFormcreate" class="announceddialog"  :close-on-click-modal="false"  >
    <div  class="container">
        <div>  
          <el-form ref="createFormRulesLeft" :model="createFormMail"  :rules="createFormRules"   status-icon label-width="100px" class="demo-ruleForm">
            <el-form-item  label="邮件标题" prop="title" >
              <el-input v-model='createFormMail.title'  autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="邮件正文"  prop="text">
              <el-input v-model='createFormMail.text' type="textarea"  :rows='6' autocomplete="off"></el-input>
            </el-form-item>
          </el-form>
        </div>
              <div>
                <el-form ref="createFormRulesRight" :model="createFormMail" status-icon  :rules="createFormRules"  label-width="100px" class="demo-ruleForm">
                 <el-form-item label="发送方式" >
                  <el-radio v-model="createFormMail['sendType']" :label="true">周期发送</el-radio>
                  <el-radio v-model="createFormMail['sendType']" :label="false">单次发送</el-radio>
                </el-form-item>
                <el-form-item v-show="createFormMail['sendType']" label="发送周期" >
                  <el-radio v-model="createFormMail['cycle']" :label="'month'">月度发送</el-radio>
                  <el-radio v-model="createFormMail['cycle']" :label="'week'">周度发送</el-radio>
                </el-form-item>
                  <el-form-item v-show="createFormMail['sendType']" label="周期说明" >
                    <span>{{Description}}</span>
                  <!-- <el-radio v-model="createFormMail['cycle']" :label="'month'">月度发送</el-radio> -->
                  <!-- <el-radio v-model="createFormMail['cycle']" :label="'week'">周度发送</el-radio> -->
                </el-form-item>
                <el-form-item label="道具" prop='annex'>
                <!-- <el-form ref="createFormRulesRights" :model="createFormMail" status-icon   > -->
                  <div v-for='(item,index) of  createFormMail["annex"]' :key='item["id"]' class="annexList"  >
                    <el-row style="margin-top: 1px;">
                    <el-col :span='10' >
                      <el-cascader
                      v-model="createFormMail['annex'][index]['annexName']"
                      :show-all-levels="false"
                      :props="annexProps"
                      :options='annexOptions'
                    ></el-cascader>
                       </el-col>
                  <el-col  :span='5'>
                    <el-input  v-model="createFormMail['annex'][index]['annexNumber']"  placeholder="数量"  autocomplete="off"></el-input> 
                     </el-col>
                       <el-col :span='2'>
                        <i class="el-icon-remove"  style="font-size: 200%; position: absolute; top: 15%; bottom: 15%;"  @click='annexListCut(index)'></i>
                      </el-col>
                      </el-row>
                  </div>
                <!-- </el-form> -->
                    <i class="el-icon-circle-plus" style="font-size: 200%;margin-top: 5px;"  @click='annexListAdd'></i>
                  </el-form-item>
              </el-form>
              </div>
   </div>
     <div slot="footer" class="dialog-footer">
       <el-button @click="createFormMailCancel">取 消</el-button>
       <el-button type="primary" class="createFormSubmit"  @click="createFormSubmit" >确 定</el-button>
     </div>
   </el-dialog>

<el-dialog  ref="newMailelDialog" title="白名单邮件修改" :visible.sync="dialogFormchange" class="announceddialog"  :close-on-click-modal="false"  >
    <div  class="container">
        <div>  
          <el-form ref="changeFormRulesLeft" :model="changeFormMail"  :rules="createFormRules"   status-icon label-width="100px" class="demo-ruleForm">
               <el-form-item  label="邮件ID"   >
              <el-input v-model='changeFormMail.id'  disabled autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item  label="邮件标题"  >
              <el-input v-model='changeFormMail.title'  disabled autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="邮件正文"   >
              <el-input v-model='changeFormMail.text'  disabled type="textarea"  :rows='6' autocomplete="off"></el-input>
            </el-form-item>
          </el-form>
        </div>
              <div>
                <el-form ref="changeFormRulesRight" :model="changeFormMail" status-icon  :rules="changeFormRules"  label-width="100px" class="demo-ruleForm">
                <el-form-item label="道具" prop='annex'>
                  <div v-for='(item,index) of  changeFormMail["annex"]' :key='item["id"]' class="annexList"  >
                    <el-row style="margin-top: 1px;">
                    <el-col :span='10' >
                      <el-cascader
                      v-model="changeFormMail['annex'][index]['annexName']"
                      :show-all-levels="false"
                      :props="annexProps"
                      :options='annexOptions'
                    ></el-cascader>
                       </el-col>
                  <el-col  :span='5'>
                    <el-input  v-model="changeFormMail['annex'][index]['annexNumber']"  placeholder="数量"  autocomplete="off"></el-input> 
                     </el-col>
                       <el-col :span='2'>
                        <i class="el-icon-remove"  style="font-size: 200%; position: absolute; top: 15%; bottom: 15%;"  @click='annexListCutChange(index)'></i>
                      </el-col>
                      </el-row>
                  </div>
                <!-- </el-form> -->
                    <i class="el-icon-circle-plus" style="font-size: 200%;margin-top: 5px;"  @click='annexListAddChange'></i>
                  </el-form-item>
              </el-form>
              </div>
   </div>
     <div slot="footer" class="dialog-footer">
       <el-button @click="changeFormMailCancel">取 消</el-button>
       <el-button type="primary" class="createFormSubmit"  @click="changeFormSubmit" >确 定</el-button>
     </div>
   </el-dialog>



  </div>
</template>

<script>
// import elementResizeDetectorMaker from 'element-resize-detector';
import { getQueryAnnexOptionsLazy, getQueryAnnexOptions } from '@/api/mail.js';
import { mailCreate, whiteFindAll, whiteStopMail, findTitle } from '@/api/white.js';
import { WhiteMailChange } from '@/api/white.js';
export default {
  name: 'whitelistMail',
  data() {
    let titleRules = async(rule, value, callback)=>{
      if (!value) {
        let a = [
          '请输入邮件标题哦~',
          '邮件标题是必须输入得呢，亲~',
          '你为什么不输入邮件得标题呢~'
        ];
        return callback(new Error(a[Math.floor(Math.random() * a.length)]));
      }
      let { code, data } = await findTitle();
      if (+code !== 200) { return callback(new Error('服务器出现错误'));}
      for (let i of data) {
        if (i['title'] === value) {
          return callback(new Error('邮件标题不可以重复哦'));
        }
      }
      callback();
    };
    let textRules = (rule, value, callback)=>{
      if (!value) {
        let a = [
          '请输入邮件正文哦~',
          '邮件正文是必须输入得呢，亲~',
          '你为什么不输入邮件得正文呢~'

        ];
        return callback(new Error(a[Math.floor(Math.random() * a.length)]));
      }
      callback();
    };
    let annexRules = (rule, value, callback)=>{
      for (let i of value) {
        if (!i['annexName'] || !(Number(i['annexNumber']) > 0)) {
          return callback(new Error('请选择正确得附件包括道具数量只能是正整数'));
        }
      }
      // if (!value) {
      //   let a = [
      //     '请输入邮件正文哦~',
      //     '邮件正文是必须输入得呢，亲~',
      //     '你为什么不输入邮件得正文呢~'

      //   ];
      //   return callback(new Error(a[Math.floor(Math.random() * a.length)]));
      // }
      callback();
    };
    return {
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
      dialogFormcreate: false,
      createFormMail: {
        title: '',
        text: '',
        sendType: true,
        cycle: 'month',
        annex: [
          { annexName: '', annexNumber: '', id: 0 }
        ]
      },
      changeFormMail: {
        id: '',
        title: '',
        text: '',
        annex: [
          { annexName: '', annexNumber: '', id: 0 }
        ]
      },
      total: 0,
      value: '',
      filterForm: {
        value: '',
        type: '',
        page: 1,
        pagesize: 10
      },
      filterForms: {
        value: '',
        type: '',
        page: 1,
        pagesize: 10
      },
      createFormRules: {
        title: [
          { validator: titleRules, trigger: 'blur' } 
        ],
        text: [
          { validator: textRules, trigger: ['blur', 'change'] }
        ],
        annex: [
          { validator: annexRules, trigger: ['blur', 'change'] }
        ]
      },
      changeFormRules: {
        annex: [
          { validator: annexRules, trigger: ['blur', 'change'] }
        ]
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
            value: true

          }, {
            label: '单次',
            value: false
          }]
      }
      ],
    
      tableData: [],
      tablecolumn: [
        { label: '邮件ID', prop: 'id' },
        { label: '邮件标题', prop: 'title' },
        { label: '邮件内容', prop: 'text' },
        { label: '附件', prop: 'annexnames' },
        { label: '福利类别', prop: 'type' },
        { label: '福利周期', prop: 'cycles' }
        // { label: '发送时间', prop: 'plaform' }
      ]
    };
    
  },
  computed: {
    Description() {
      return this.createFormMail['cycle'] === 'month' ? '月度邮件为每月1日00:00准时发送' : '周度邮件为每周一00:00准时发送';
    },
    grade() {
      if (+this.$route.meta.grade === 0) {
        return false;
      }
      console.log(+this.$route.meta.grade);
      return true;
    }
  },
  methods: {
    async changeFormSubmit() {
      let sendtrue = await this.$confirm(`是否确认修改白名单邮件?`, '提示', {
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
      let left = await this.$refs['changeFormRulesRight'].validate().catch(err=>false);
      if (!left) {
        loading.close(); return;
      }
      let res = await WhiteMailChange(this.changeFormMail);
      let { code } = res;
      if (+code !== 200) {
        this.$message.warning('修改失败');
        loading.close(); return;
      }
      this.$message.warning('修改成功，自动刷新中~');
      this.filterFormChangeClick();
      this.changeFormMailCancel();
      loading.close(); return;
    },
    async changeWhiteMail(index, row) {
      let { code, data } = await getQueryAnnexOptions();
      if (code === 200) {
        this.annexOptions = data;
      }
      this.changeFormMail['title'] = row['title'];
      this.changeFormMail['text'] = row['text'];
      this.changeFormMail['annex'] = [
        { annexName: '', annexNumber: '', id: 0 }
      ];
      this.changeFormMail['id'] = row['id'];
      this.dialogFormchange = true;
    },
    async deleteWhiteMail(index, row) {
      let { id } = row;
      let sendtrue = await this.$confirm(`是否确认删除邮件ID为--${id}--白名单邮件?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning' })
        .catch(err => false);
      if (!sendtrue) {return;}
      let res = await whiteStopMail({ id });
      let { code } = res;
      // if (+code !== 200) {this.$message.warning(message.split('\n')[0]); return;}
      if (+code === 200) {
        this.filterFormChangeClick();
        this.$message.success('删除成功');
      }
     
      // if(+code === 200 ){this.$message.success('删除成功')}
    },
    async createFormSubmit() {
      let sendtrue = await this.$confirm(`是否确认创建白名单邮件?`, '提示', {
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
      let right = await this.$refs['createFormRulesRight'].validate().catch(err=>false);
      let left = await this.$refs['createFormRulesLeft'].validate().catch(err=>false);
      if (!(right && left)) {
        loading.close(); return;
      }
      let res = await mailCreate(this.createFormMail);
      let { code, data } = res;
      if (+code !== 200) {
        loading.close(); 
        this.$message.warning('创建失败!');
        return;
      }
      let { id } = data;
      this.$message.success(`创建成功，您创建的id是 ${id}`);
      loading.close(); 
      this.createFormMailCancel();
      this.filterFormChangeFlush();
    },
    async dialogFormchangeShowTrue() {
      let { code, data } = await getQueryAnnexOptions();
      if (code === 200) {
        this.annexOptions = data;
      }
      this.dialogFormcreate = true;
    },
    async createFormMailCancel() {
      this.dialogFormcreate = false;
      this.$refs['createFormRulesLeft'].resetFields();
      this.$refs['createFormRulesRight'].resetFields();
      this.createFormMail['annex'] = [
        { annexName: '', annexNumber: '', id: 0 }
      ];
    },
    async changeFormMailCancel() {
      this.dialogFormchange = false;
      this.$refs['changeFormRulesRight'].resetFields();
      this.changeFormMail['annex'] = [
        { annexName: '', annexNumber: '', id: 0 }
      ];
    },
    filterFormChange(val) {
      this.$refs['whitemailContainer'].parentElement.scrollTo({
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
    async filterFormChangeFlush() {
      this.tableData = [];
      for (let i in this.filterForm) {
        if (i === 'pagesize') {continue;}
        this.filterForm[i] = null;
      }
      this.filterForm['page'] = 1;
      this.filterFormChangeClick();




    },
    async filterFormPageChange() {
      let res = await whiteFindAll(this.filterForm);
      let { code, data } = res;
      if (+code !== 200) {this.tableData = []; return;}
      let { res: values, total } = data;
      this.tableData = values;
      this.total = Number(total);
    },
    async filterFormChangeClick() {
      this.filterForm['page'] = 1;
      this.filterForm['type'] = '';
      let res = await whiteFindAll(this.filterForm);
      let { code, data } = res;
      if (+code !== 200) {this.tableData = []; return;}
      let { res: values, total } = data;
      this.tableData = values;
      this.total = Number(total);
    },
    async filterFormChangeChange() {
      this.filterForm['page'] = 1;
      this.filterForm['value'] = '';
      let res = await whiteFindAll(this.filterForm);
      let { code, data } = res;
      if (+code !== 200) {this.tableData = []; return;}
      let { res: values, total } = data;
      this.tableData = values;
      this.total = Number(total);
    },
    annexListCut(index) {
      if (this.createFormMail['annex'].length === 1) {
        this.$message.warning('必须有一条记录。');  
        return;
      }
      this.createFormMail['annex'].splice(index, 1);
    },
    annexListCutChange(index) {
      if (this.changeFormMail['annex'].length === 1) {
        this.$message.warning('必须有一条记录。');  
        return;
      }
      this.changeFormMail['annex'].splice(index, 1);
    },
    annexListAdd() {
      let a = this.createFormMail['annex'][this.createFormMail['annex'].length - 1];
      a['annexName'] && a['annexNumber'] ? this.createFormMail['annex'].push({ annexName: '', annexNumber: '', id: a['id'] + 1 }) : this.$message.warning('请填写完整');  
      this.$refs['newMailelDialog'].$el.scrollTo({
        top: this.$refs['newMailelDialog'].$el.scrollHeight + 100, 
        behavior: 'smooth' 
      });  
    },
    annexListAddChange() {
      let a = this.changeFormMail['annex'][this.changeFormMail['annex'].length - 1];
      a['annexName'] && a['annexNumber'] ? this.changeFormMail['annex'].push({ annexName: '', annexNumber: '', id: a['id'] + 1 }) : this.$message.warning('请填写完整');  
      this.$refs['newMailelDialog'].$el.scrollTo({
        top: this.$refs['newMailelDialog'].$el.scrollHeight + 100, 
        behavior: 'smooth' 
      });  
    }
  },
  mounted() {
    let data = { ...this.$route.query };
    let { smtp_id: id } = data;
    this.filterForm['value'] = id;
    this.filterFormChangeClick();

    // let page = 1;
    // let pagesize = 100;
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
.cell .el-button:active, .el-button:focus{
  color: #2BBFBD !important;
}
.tableTest-caozuo   {
   .el-button:active, .el-button:focus{
  color: white !important;
  }
}
.cell{
  max-height: 40px;
  overflow: hidden;
  white-space: nowrap;	/*规定文本不进行换行*/
    text-overflow: ellipsis;
  
}
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

