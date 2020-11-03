<template>
  <div  ref="rechaContainer" class="mail-container">
    <div class="role-container-header" >
    <ul style="margin-top: 5px;margin-bottom: -5px;margin-right: 10px;">
      <li><el-button slot="reference" icon="el-icon-refresh-right" size='small' class="button-with-header button-with-select"  @click='filterFormChange'>刷新</el-button></li>
      <li> <el-button  v-if='grade' slot="append" icon="el-icon-circle-plus-outline" size='small' class="button-with-header button-with-select"  @click='dialogFormchangeShowTrue'>新建邮件</el-button></li>
    </ul>
  </div>
  <div class="role-container-search">
    <div class="server-container"> <span>邮件ID：</span> 
      <el-input v-model="filterForm['Id']" placeholder="请输入邮件ID" size='small' class="input-with-select" > </el-input>
      <el-button slot="append" icon="el-icon-search" size='small' class="button-with-select" name='truesearch' @click="filterFormChange('click')"> </el-button>
    </div>
    <div class="comprehensive-container">
      <div v-for='(i,index) in selectForm' :key='index'  class="select-item"  > {{i.label}}:
        <el-select v-model="filterForm[i.key]" :multiple="i['multiple']" placeholder="请选择"  clearable :collapse-tags="i['collapse']" :filterable='i.filterable' size='small' style="border-radius: 10px;" @change="filterFormChange('change')" >
          <el-option v-for="(item,index) in i.options" :key="index"  :label='item.label' :value="item.value" >
          </el-option>
        </el-select>
      </div>
      <span style="width: 5vw;">发送时间：</span>
      <el-date-picker   v-model="filterForm['createTime']"  size='small' type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"   @change="filterFormChange('change')">
      </el-date-picker>
    </div>
  </div>

  <div id='body' class="role-container-body">
    <el-table
    ref="multipleTable"
    border
    highlight-current-row
    fit
    :data="tableData" 
    :default-sort = "{prop: 'id', order: 'descending'}"
    class="tableCssHeightSet"
    >
    <el-table-column v-for='(column,index) in tablecolumn' :key='index'    :label="column.label">
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
     <el-table-column  v-if="grade"  label="操作">
           <template slot-scope="scope" >
            <!-- <el-button  v-if='grade' slot="append" icon="el-icon-circle-plus-outline" size='small' class="button-with-header button-with-select"  @click='dialogFormchangeShowTrue'>新建邮件</el-button> -->
            <el-button  v-if="grade"  v-show="stopMailIsShow(scope)" slot="append" icon="el-icon-delete-solid" round size='small' class="button-with-header button-with-select"  @click='mailStopSend(scope)'>停用</el-button>
           </template>
     </el-table-column>
  </el-table>
  </div>
  <div class="role-container-bottom">
    <el-pagination
    style="text-align: right;"
    :page-size.sync="filterForm['pagesize']"
    :page-sizes="[50, 100, 150, 200]"
    background
    layout="total, sizes, prev, pager, next, jumper"
    :pager-count='9'  
    :hide-on-single-page="false"  
    :total="total"
    :current-page.sync='filterForm.page'
    @size-change="filterFormChange('pagechange')"
    @current-change="filterFormChange('pagechange')" ></el-pagination>
  </div>
  <el-dialog  ref="newMailelDialog" title="新建邮件" :visible.sync="dialogFormchange" class="announceddialog"  :close-on-click-modal="false"  @close='createFormMailCancel'>
    <div  class="container">
        <div>  
          <el-form ref="createFormRulesLeft" :model="createFormMail"  status-icon :rules="createFormRulesLeft" label-width="100px" class="demo-ruleForm">
            <el-form-item  label="邮件标题" prop="title">
              <el-input v-model='createFormMail.title'  autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="邮件正文" prop="text">
              <el-input v-model='createFormMail.text' type="textarea"  :rows='6' autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item  label="全服邮件" >
              <el-switch
              v-model='createFormMail.allServerTrue'
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change='createFormMailallServerTrueChange'>
            </el-switch>
              </el-form-item>
            <!-- <el-form-item v-show='!createFormMail.allServerTrue' label="玩家ID" prop="roleId">
              <el-input  v-model='createFormMail["roleId"]' ></el-input>
            </el-form-item> -->
          </el-form>
        </div>
              <div>
                <el-form ref="createFormRulesRight" :model="createFormMail" status-icon :rules="createFormRulesRight" label-width="100px" class="demo-ruleForm">
                <el-form-item  label="邮件链接" >
                  <el-input v-model='createFormMail.mailLink'  autocomplete="off"></el-input>
                </el-form-item>
                <!-- <el-form-item v-show='!createFormMail.allServerTrue' label="平台:">
                  <el-select  v-model='createFormMail.plaform'  placeholder="请选择" size='small' style="border-radius: 10px;" @change='plaformChannelToservername' >
                    <el-option   label='不限制' value="" ></el-option>
                    <el-option   label='安卓' value="1" ></el-option>
                      <el-option   label='苹果' value="2" ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item v-show='!createFormMail.allServerTrue' label="渠道:">
                  <el-select v-model='createFormMail.channel' multiple  placeholder="请选择" size='small' style="border-radius: 10px;" @change='plaformChannelToservername' >
                    <el-option v-for="(item,index) in selectForm[1].options"   :key="index"  :label='item.label' :value="item.value" >
                    </el-option>
                  </el-select>
                </el-form-item>-->
                <el-form-item v-if='createFormMail.allServerTrue' label="服务器:" prop="serverName">
                  <el-select v-model='createFormMail.serverName' :value='""'  filterable    multiple placeholder="请选择" size='small' style="border-radius: 10px;"  >
                    <el-option v-for="(item,index) in servernamesselect"   :key="index"  :label='item.label' :value="item.value" >
                    </el-option></el-select>
                     <el-button v-show='createFormMail.allServerTrue'  type="primary" class="allSelectButton" @click='allSelectAllServer'>全 选</el-button>
                </el-form-item> 
                 <el-form-item   v-else label="人员名单:" prop="serverName">
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
                    :http-request="fileUpload" >
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                    <div slot="tip" class="el-upload__tip">只能上传xlsx/xls文件</div>
                  </el-upload>
                  </el-form-item>
                 <el-form-item label="发送方式 :" prop="serverName">
                  <el-radio v-model="createFormMail['sendTime']" :label="true">即时发送</el-radio>
                  <el-radio v-model="createFormMail['sendTime']" :label="false">定时发送</el-radio>
                   <el-date-picker
                   v-show="!createFormMail['sendTime']"
                    v-model="createFormMail['sendDateTime']"
                    type="datetime"
                    :picker-options="{
                                   disabledDate: time => {
                                      return time.getTime() < Date.now() - 3600 * 1000 * 24
                                    },
                                  
                                  }"
                    placeholder="选择日期时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="携带附件" prop="pass">
                  <el-switch
                  v-model='createFormMail.carryAnnex'
                  active-color="#13ce66"
                  inactive-color="#ff4949">
                </el-switch>
                  </el-form-item>
                  <el-form-item v-show='createFormMail.carryAnnex'  prop="pass">
                <el-form ref="createFormRulesRight" :model="createFormMail" status-icon :rules="createFormRulesRight"  >
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
       <el-button type="primary" class="allSelectButton" @click='createFormMailSubmit'>确 定</el-button>
     </div>
   </el-dialog>



<!-- <el-dialog title="邮件修改" :visible.sync="dialogFormUpdate" class="announceddialog"   :close-on-click-modal="false">
    <div class="container">
        <div >  
          <el-form ref="createFormRulesLeft" :model="updateFormMail"  status-icon :rules="createFormRulesLeft" label-width="100px" class="demo-ruleForm">
            <el-form-item  label="邮件标题" prop="title">
              <el-input v-model='updateFormMail.title'  autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="邮件正文" prop="text">
              <el-input v-model='updateFormMail.text' type="textarea"  :rows='6' autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item  label="全服邮件" >
              <el-switch
              v-model='updateFormMail.allServerTrue'
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change='createFormMailallServerTrueChange'>
            </el-switch>
              </el-form-item>
            <el-form-item v-show='!updateFormMail.allServerTrue' label="玩家ID" prop="roleId">
              <el-input  v-model='updateFormMail["roleId"]' ></el-input>
            </el-form-item>
          </el-form>
        </div>
              <div>
                <el-form ref="createFormRulesRight" :model="updateFormMail" status-icon :rules="createFormRulesRight" label-width="100px" class="demo-ruleForm">
                <el-form-item  label="邮件链接" prop="mailLink">
                  <el-input v-model='updateFormMail.mailLink'  autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item v-show='!updateFormMail.allServerTrue' label="平台:">
                  <el-select  v-model='updateFormMail.plaform'  placeholder="请选择" size='small' style="border-radius: 10px;" @change='plaformChannelToservername' >
                    <el-option   label='不限制' value="" ></el-option>
                    <el-option   label='安卓' value="1" ></el-option>
                      <el-option   label='苹果' value="2" ></el-option>
                  </el-select>
                 
                </el-form-item>
                <el-form-item v-show='!updateFormMail.allServerTrue' label="渠道:">
                  <el-select v-model='updateFormMail.channel' multiple  placeholder="请选择" size='small' style="border-radius: 10px;" @change='plaformChannelToservername' >
                    <el-option v-for="(item,index) in selectForm[1].options"   :key="index"  :label='item.label' :value="item.value" >
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="服务器:" prop="serverName">
                  <el-select v-model='updateFormMail.servername' :value='""'   multiple placeholder="请选择" size='small' style="border-radius: 10px;"  >
                    <el-option v-for="(item,index) in servernamesselect"   :key="index"  :label='item.label' :value="item.value" >
                    </el-option></el-select>
                </el-form-item>
                <el-form-item label="携带附件" prop="pass">
                  <el-switch
                  v-model='updateFormMail.carryAnnex'
                  active-color="#13ce66"
                  inactive-color="#ff4949">
                </el-switch>
                  </el-form-item>
                  <el-form-item v-show='updateFormMail.carryAnnex'  prop="pass">
                <el-form ref="createFormRulesRight" :model="updateFormMail" status-icon :rules="createFormRulesRight"  >
                  <el-form-item v-for='(item,index) in  annexList' :key='index' class="annexList"  prop="pass">
                    <el-row style="margin-top: 1px;">
                    <el-col :span='10' >
                      <el-cascader
                      v-model="annexList[index]['annexName']"
                      :show-all-levels="false"
                      :props="annexProps"
                      :options='annexOptions'
                    ></el-cascader>
                       </el-col>
                  <el-col  :span='5'><el-input  v-model="annexList[index]['annexNumber']"  autocomplete="off"></el-input>  </el-col>
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
       <el-button @click="dialogFormUpdateCancel">取 消</el-button>
       <el-button type="primary" @click='createFormMailSubmit'>确 定</el-button>
     </div>
   </el-dialog>

<el-dialog title="定时发送" :visible.sync="sendMailTimingdialog" class="sendMailTimingdialog"   :close-on-click-modal="false">
 <el-date-picker
      v-model="sendMailTimingdialogDateTime"
      type="datetime"
      placeholder="选择日期时间">
    </el-date-picker>
     <div slot="footer" class="dialog-footer">
       <el-button @click="sendMailTimingdialog = false">取 消</el-button>
       <el-button type="primary" @click='sendMailTimingSubmit'>确 定</el-button>
     </div>
 </el-dialog> -->












  </div>
</template>

<script>
import { findComponents } from '@/api/components.js';
import { getQueryAnnexOptions, getQueryMail, getQueryAnnexOptionsLazy, postMailToCreate, getPlaformChannelToservername } from '@/api/mail.js';
import { annexAllQuery, mailSend, getQueryAnnexServernames, mailIdQuery } from '@/api/mail.js';
import { stopMailSend } from '@/api/mail.js';
import dayjs from 'dayjs';
import xlsx from 'xlsx';
var id = 0;
export default {
  name: 'mailindex',
  data() {
    let title, text, mailLink, age, serverName;
    title = text = mailLink = age = serverName = (rule, value, callback) =>{
      if (!value) {
        return callback(new Error('请至少输入一个字符'));
      }
      callback();
    };
    return {
      sendMailTimingdialogDateTime: '',
      sendMailTimingdialogrow: '',
      updateFormMail: '',
      mailLink,
      title,
      exceldata: '',
      text,
      age,
      filelist: [],
      serverName,
      serverCreatedialogFormVisible: false,
      sendMailTimingdialog: false,
      dialogFormchange: false,
      dialogFormUpdate: false,
      createLock: false,
      annexProps: {
        lazy: true,
        async lazyLoad(node, resolve) {
          let { label } = node;
          let { data: nodes } = await getQueryAnnexOptionsLazy({ label });
          resolve(nodes);
        }
      },
      multipleTable: '',
      total: 0,
      createFormMail: {
        title: '',
        text: '',
        allServerTrue: false,
        roleId: '',
        sendTime: true,
        mailLink: '',
        plaform: '',
        channel: '',
        serverName: '',
        carryAnnex: false,
        sendDateTime: ''
      },
      filterForm: {
        Id: '',
        plaform: '',
        channel: '',
        annex: '',
        serverName: '',
        createTime: '',
        page: 1,
        pagesize: 50
      },
      selectForm: [{
        label: '平台',
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
        label: '渠道',
        filterable: true,
        collapse: true,
        multiple: true,
        key: 'channel',
        value: '',
        options: []
      },
      {
        label: '服务器',
        key: 'servername',
        filterable: true,
        collapse: true,
        multiple: true,
        value: '',
        options: []
      }, {
        label: '附件',
        key: 'annex',
        filterable: true,
        collapse: true,
        multiple: true,
        value: '',
        options: []
      }
      ],
      tableData: [],
      annexOptions: [],
      annexList: [
        { annexName: '', annexNumber: '' }
      ],
      servernamesselect: [],
      tablecolumn: [
        { label: '邮件ID', prop: 'id' },
        { label: '邮件标题', prop: 'title' },
        { label: '平台', prop: 'plaforms' },
        { label: '渠道', prop: 'channel' },
        { label: '区服名', prop: 'servername' },
        { label: '玩家ID', prop: 'roleid', list: 'roleidListToJson' },
        { label: '邮件内容', prop: 'text' },
        { label: '附件', prop: 'annexnames' },
        { label: '发送时间', prop: 'sendtime' }
      ]
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
    },
    
    createFormRulesRight() {
      return { mailLink: [{ validator: this.mailLink, trigger: ['blur'] }],
        text: [{ validator: this.text, trigger: ['blur'] }]
      };
    },
    createFormRulesLeft() {
      if (this.createFormMail.allServerTrue) {
        return { title: [{ validator: this.title, trigger: ['blur'] }],
          text: [{ validator: this.text, trigger: ['blur'] }]
        };
      }
      return { title: [{ validator: this.title, trigger: ['blur'] }],
        text: [{ validator: this.text, trigger: ['blur'] }],
        roleId: [{ validator: this.age, trigger: ['blur'] }] };
    }
  },
  methods: {
    stopMailIsShow(val) {
      let isShow = val['row'];
      let { is_use: isUse, sendtime } = isShow;
      if (!isUse || new Date(sendtime) < new Date()) {
        return false;
      }
      return true;
    },
    async mailStopSend(val) {
      let sendtrue = await this.$confirm(`是否确认通用此邮件?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning' })
        .catch(err => false);
      if (!sendtrue) {return;}
      let res = await stopMailSend({ id: val['row']['id'] });
      let { code } = res;
      if (+code === 200) {
        this.$message.success('停用成功');
        // this.tableData[this.val.$index]['is_use'] = false; 
        this.filterFormChange();
      } else {
        this.$message.success('停用失败');
      }
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
        _this.createFormMail['roleId'] = data;
      }
    },
    allSelectAllServer() {
      this.createFormMail['serverName'] = this.servernamesselect.map(item => item['value']);
    },
    async dialogFormUpdateCancel() {
      this.dialogFormUpdate = false;
    },
    async sendMailTimingSubmit() {
      let datetime = this.sendMailTimingdialogDateTime;
      if (!datetime) {this.$message.warning('请选择时间'); return;}
      datetime = dayjs(datetime).format('YYYY-MM-DD HH:mm:ss');
      let sendtrue = await this.$confirm(`是否在${datetime}发送?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning' })
        .catch(err => false);
      if (!sendtrue) {return;}
      let row = this.sendMailTimingdialogrow;
      row['theway'] = false;
      row['sendtime'] = datetime;
      let { code, message } = await mailSend(row);
      if (code === 200) {
        this.$message.success('发布成功');
        this.sendMailTimingdialog = false;
        this.sendMailTimingdialogrow = '';
      } else {
        this.$message.warning(message);
      }
    },
    async createFormMailCancel() {
      this.dialogFormchange = false;
      // this.createFormMail['carryAnnex'] = false;
      // this.createFormMail['sendTime'] = true;
      this.annexList = [
        { annexName: '', annexNumber: '', id: 0 }
      ]; 
      this.createFormMail = {
        title: '',
        text: '',
        allServerTrue: false,
        roleId: '',
        mailLink: '',
        plaform: '',
        channel: '',
        serverName: '',
        carryAnnex: false,
        'sendTime': true
      };
      this.$refs['createFormRulesLeft'].resetFields();
      this.$refs['createFormRulesRight'].resetFields();

    },
    async mailmessageChange(index, row) {
      this.dialogFormUpdate = true;
      this.updateFormMail = JSON.parse(JSON.stringify(row));
      this.updateFormMail['mailLink'] = row.link;
      this.updateFormMail['roleId'] = row['roleid'];
    
    },
    async mailmessageSend(index, row, sendTime) {
      if (sendTime) {
        let sendtrue = await this.$confirm('是否确认立即发送?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning' })
          .catch(err => false);
        if (!sendtrue) {return;}
      } else {
        this.sendMailTimingdialogrow = row;
        this.sendMailTimingdialogDateTime = '';
        this.sendMailTimingdialog = true;
        return;
      }
      row['theway'] = sendTime;
      let { code, message } = await mailSend(row);
      if (code === 200) {
        this.$message.success('发布成功');
      } else {
        this.$message.warning(message);
      }
    },
    async plaformChannelToservername() {
      let plaform = this.createFormMail['plaform'];
      let channel = this.createFormMail['channel'];
      this.createFormMail.serverName = '';
      if (plaform && channel.length) {
        let { data } = await getPlaformChannelToservername({ plaform, channel });
        this.servernamesselect = data;
        return;
      }
      this.servernamesselect = '';
    },
    async createFormMailallServerTrueChange() {
      this.servernamesselect = '';
      this.createFormMail.serverName = '';
      if (this.createFormMail.allServerTrue) {
        let { data } = await getQueryAnnexServernames();
        this.servernamesselect = data;
        return;
      }
    },
    async dialogFormchangeShowTrue() {
      this.dialogFormchange = true;
      let timeId = new Date();
      let { data: maxId } = await mailIdQuery();
      maxId['max'] = maxId['max'] ? maxId['max'] : 1;
      this.createFormMail['smtpId'] = timeId.getMinutes().toString() + timeId.getSeconds().toString() + maxId['max'];
      let { code, data } = await getQueryAnnexOptions();
      if (code === 200) {
        this.annexOptions = data;
      }
      this.$refs['createFormRulesLeft'].resetFields();
      this.$refs['createFormRulesRight'].resetFields();
    },
    annexListAdd() {
      let a = this.annexList[this.annexList.length - 1];
      a['annexName'] && a['annexNumber'] ? this.annexList.push({ annexName: '', annexNumber: '', id: ++id }) : this.$message.warning('请填写完整');  
      this.$refs['newMailelDialog'].$el.scrollTo({
        top: this.$refs['newMailelDialog'].$el.scrollHeight, 
        behavior: 'smooth' 
      });  
    },
    annexListCut(index) {
      if (this.annexList.length === 1) {
        this.$message.warning('必须有一条记录。');  
        return;
      }
      this.annexList.splice(index, 1);
    },
    async createFormMailSubmit() {
      const loading = this.$loading({
        lock: true,
        text: '拼命加载中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.8)'
      });
      let right = await this.$refs['createFormRulesRight'].validate().catch(err=>false);
      let left = await this.$refs['createFormRulesLeft'].validate().catch(err=>false);
      if (this.createFormMail.allServerTrue) {
        this.createFormMail.roleId = '';
        this.createFormMail.channel = '';
        this.createFormMail.plaform = '';
      }
      if (!(right && left)) { loading.close(); return;}
      if (this.createFormMail.allServerTrue && this.createFormMail.serverName.length === 0) {
        this.$message.warning('请选择区服');
        loading.close();
        return;
      }
      if (!this.createFormMail['sendTime'] && !this.createFormMail['sendDateTime']) {
        
        this.$message.warning('请选择发送时间');
        loading.close();
        return;
      }
      let a = [];
      if (this.createFormMail.carryAnnex) {
        for (let i of this.annexList) {
          if (!(i.annexName && i.annexNumber)) {
            this.$message.warning('附件不完整。');
            loading.close();
            return;
          }
          if (!(/^[0-9]*$/.test(i['annexNumber']))) {
            this.$message.warning('附件数据不合法,');
            loading.close();
            return;
          }
          
          a.push({ ID: i.annexName.slice(-1)[0], name: i.annexName[0], number: i.annexNumber });
        }
        this.createFormMail['Annex'] = this.createFormMail.carryAnnex ? a : '';
      }
      let sendtrue = await this.$confirm('是否确认立即发送?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning' })
        .catch(err => false);
      if (!sendtrue) { loading.close(); return;}
      let res = await postMailToCreate(this.createFormMail);
      let { code, message, data } = res;
      if (code === 200) {
        this.$message.success(message + `,您创建邮件的ID是   ${data.id}`);
        this.filelist = [];
        this.filterFormChange();
        for (let i in this.createFormMail) {
          this.createFormMail[i] = '';
        }
        this.dialogFormchange = false;
        loading.close();
        this.annexList = [
          { annexName: '', annexNumber: '' }
        ]; 
        this.createFormMail['mailLink'] = '';
        this.createFormMail['carryAnnex'] = false;
        this.createFormMail['allServerTrue'] = false;
        return;
      }
      loading.close();
      this.$message.info('创建失败!');
      
    },
    filterFormChange(val) {
      this.$refs['rechaContainer'].parentElement.scrollTo({
        top: 0, 
        behavior: 'smooth' 
      });
      switch (val) {
        case 'click':this.filterFormChangeClick(); break;
        case 'change':this.filterFormChangeChange(); break;
        case 'pagechange':this.filterFormChangeChange(); break;
        default:this.filterFormChangeFlush();
      }
    },
    filterFormChangeFlush() {
      for (let i in this.filterForm) {
        this.filterForm[i] = '';
      }
      this.filterForm['pagesize'] = 50;
      this.filterForm['page'] = 1;
      this.tableData = [];
      this.total = 0;
      this.filterFormChangeClick();
    },
    filterFormChangeClick() {
      for (let i in this.filterForm) {
        if (i === 'Id' || i === 'pagesize' || i === 'page') {continue;}
        this.filterForm[i] = '';
      }
      this.filterFormChangeSubmit();
    },
    filterFormChangeChange() {
      this.filterForm['Id'] = '';
      this.filterFormChangeSubmit();
    },
    async filterFormChangeSubmit() {
      let res = await getQueryMail(this.filterForm);
      let{ code, data } = res; 
      if (code !== 200) {
        this.$message.warning('查找失败');
        this.tableData = [];
      }
      let { data: datas, total } = data;
      datas.map(item =>{
        item.sendtime = item.sendtime ? dayjs(item.sendtime).format('YYYY-MM-DD HH:mm:ss') : '未发送';    
      });
      this.tableData = datas;
      this.total = Number(total);

    }
  },
  async mounted() {
    let res = await findComponents({ code: 'areaclothing', gameid: this.gameid });
    let components = res.data.values.map(item=>({
      label: item,
      value: item
    }));
    this.selectForm[1].options = this.selectForm[1].options.concat(components);
    this.clientOptions = components;
    let { data } = await getQueryAnnexServernames();
    this.selectForm[2].options = this.selectForm[2].options.concat(data);
    let { data: annexdata } = await annexAllQuery();
    this.selectForm[3].options = this.selectForm[3].options.concat(annexdata);
    this.filterFormChangeClick();



  }


  
};
</script>

<style lang="scss" rel="stylesheet/scss">
.contentCssTableHover{
  max-width: 50vw;
    span{
      margin: 5px;
      min-width: 1vw;
      max-width: 18vw;
      text-align: center;
    }
  }
.mail-container{
.tableCssHeightSet{
   .table_1_column_6, .el-table_1_column_7{
    & .cell{
      max-height:100px  !important;
      overflow: hidden;
    }
  }
  .contentCssTableHidden{
    height: 30px;
    overflow: hidden;
  }
  .tableHidden{
    max-height: 30px;
    overflow: hidden;
  }
  .tableHiddenBody{
    max-height: 60px;
    overflow: hidden;
  }
    // .el-table_1_column_6 {
    //      & .cell{
    //   max-height:100px  !important;
    //   &:focus,&:hover{
    //     overflow: auto !important;
    //   }
    // }
    // }
}
//   .tableCssHeightSet{
//   .el-table_1_column_6 , .el-table_1_column_7  {
//  & .cell{
//       max-height: 100px !important;
//       overflow: hidden !important;
//       text-overflow: ellipsis !important;
//       word-break: keep-all !important;
//       &:focus ,&:hover {
//           word-break:normal;
//           display:block;
//           white-space:nowrap;
//           word-wrap : break-word;
//           overflow: auto !important; 
//       }
//     } 
//     }
   
//   }
 .is-checked , .is_focus{
        color: #2BBFBD !important;
        .el-checkbox__inner{
        color: #2BBFBD !important;
        background-color: #2BBFBD !important;
        border-color: #2BBFBD !important;
        &:hover{
          border-color: #2BBFBD !important;
        }
        }
      }
      .el-checkbox__inner:hover{
        border-color: #2BBFBD !important;
      }
      .el-checkbox__input.is-checked+.el-checkbox__label{
        color: #2BBFBD !important;
      }
      .el-select .el-input.is-focus .el-input__inner {
         color: #2BBFBD !important;
        border-color: #2BBFBD !important;
      }
  .allSelectButton{
    &:focus{
      color: white !important;
    }
  }
  .el-upload__tip{
    margin-top: -15px !important;
  }
  .intervalBUttonClass{
    width: 100%;
    height: 100%;
  }
  .sendMailTimingdialog{
    width: 28vw;
    position: fixed;
    top: 10%;
    left: 40%;
  }
  .demo-ruleForm{
    .annexList{
      margin-left: 0;
    }
    .annexList div:first-child{
      margin-left: 0;
    }
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
  .button-with-select{
    &:focus{
      color:#2BBFBD !important ;
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
    // .el-table .cell{
    //   word-break: keep-all;
    // } 
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
   .comprehensive-container { width: 100%;.select-item {width: 20%;&>.comprehensive-container-label{width: 30%;} &>div{ width: 70%; }}input {border-radius: 10px;}}

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
.mail-container{


  
}

</style>

