<template>
  <!-- <div class="distric-container"  :style=" `opacity: ${opacity};background-image: url('${this.$store.getters.permissionInfo.imgUrl}');` " @mouseover="opacity=1" @mouseout="opacity =0.3"> -->
  <div ref="rechaContainer" class="distric-container"  >
    <div class="option-container" style="margin-bottom: -2px;">
      <ul>
        <li>
          <el-button v-if="grade"  slot="reference" icon="el-icon-thumb" size='small'   class="button-with-header" :disabled='allselectchangeopen' @click="dialogFormchange = true">批量操作</el-button>
        </li>
        <li>
          <el-button   v-if="grade" slot="reference" icon="el-icon-refresh" size='small' class="button-with-header"   :disabled='allselectchangeopen'  @click='mergeServer'>合服</el-button>
        </li>
        <li>
          <el-button slot="reference" icon="el-icon-refresh-right" size='small' class="button-with-header"   @click="filterFormChange('flush')">刷新</el-button>
        </li>
        <li>
          <el-button  v-if="grade" slot="append" icon="el-icon-circle-plus-outline" size='small'  class="button-with-header" @click="newCreateServer">新建</el-button>
        </li>
      </ul>
    </div>
    <div class="search-container">
      <div class="server-container">ID：
        <el-select v-model="filterForm.key" value='serverid'  placeholder="请选择" name='idselect' size='small'>
          <el-option v-for="(item, index) in idoptions" :key="index" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        <el-input  v-model="filterForm.value" placeholder="请输入内容" size='small' class="input-with-select"   @keyup.enter.native="filterFormChange('click',$event)" >
        </el-input>
        <el-button slot="append" icon="el-icon-search" size='small' class="button-with-select" @click="filterFormChange('click')">
        </el-button>
        <span style="padding-left: 1%;">开服时间：</span>
          <el-date-picker   v-model="filterForm['srttime']"  size='small' type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"   @change='filterFormChange'>
          </el-date-picker>
          <el-checkbox v-model="filterForm['test']" true-label='1' false-label='0' @change='filterFormChange'>测试机</el-checkbox>
      </div>
     
      <div class="comprehensive-container">
        <div v-for='(i,index) in selectForm' :key='index'  class="select-item"  >
           <span class="comprehensive-container-label">{{i.label}}:</span>
          <el-select v-model="filterForm[i.key]" :multiple="i['multiple']" :collapse-tags="i['collapse']"  clearable  :filterable='i.filterable' placeholder="请选择" size='small' @change='filterFormChange'>
            <el-option v-for="(item,index) in i.options" :key="index"  :label='item.label' :value="item.value" >
            </el-option>
          </el-select>
        </div>
       
      </div>
    </div>
    <div class="table-container" >
      <!-- :tree-props="{children: 'children', hasChildren: 'hasChildren'}"  -->

      <div  class="table-body">
      <el-table
        ref="multipleTable"
        v-loading="loading"
        style="min-height: 66vh;" 
        element-loading-text="拼命加载中" 
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)" 
        border 
        lazy
        :load="loadpid"
        :tree-props="{ hasChildren: 'hasChildren'}"
        :data="tableData" 
        row-key="id"
        :default-sort="{prop: 'create_time',order:'descending'}" 
        :row-class-name="tableRowClassName" 
        @selection-change="handleSelectionChange"
        @size-change="handleSizeChange">
        <el-table-column  type="selection" width="55"></el-table-column>
        <el-table-column  label="合服ID" >
          <template slot-scope="scope">{{ scope.row.childrens?scope.row.id:'' }} </template>
        </el-table-column>
        <el-table-column label="区服ID" >
          <template slot-scope="scope">{{ scope.row.childrens?'':scope.row.id }} </template>
        </el-table-column>
        <el-table-column label="名称" >
          <template slot-scope="scope">{{ scope.row.servername }} </template>
        </el-table-column>
        <el-table-column   label="平台"   name='plaform'>
          <!-- <template slot-scope="scope">{{ scope.row.plaform|plaform }} </template> -->
          <template slot-scope="scope"> 
            <el-tag v-for='(i,index) in  scope.row["plaform"]' :key="index">{{ i |plaform}}</el-tag>
            </template>
        </el-table-column>
        <el-table-column label="渠道"  >
          <template slot-scope="scope" >
            <el-tooltip effect='light'  placement="top" class="aasdhjkahskdhjk">
              <div slot="content" :ref="'contentCssTableHover'+scope.$index" class="contentCssTableHover" > <el-tag v-for='(i,index) in  scope.row["channel"]' :key="index" >{{ i }}</el-tag></div>
            <div class="contentCssTableHidden" style="max-height:30px"><el-tag v-for='(i,index) in  scope.row["channel"]' :key="index">{{ i }}</el-tag></div> 
            </el-tooltip>
            <!-- <el-tag v-for='(i,index) in  scope.row["channel"]' :key="index">{{ i }}</el-tag> -->
          </template>
        </el-table-column>
        <el-table-column  label="显示状态"   >
          <template slot-scope="scope">
            <span v-if="scope.row.showstatusIsShow" :key="scope.row.id">
            <el-select v-model="scope.row.display"  :focus='true'  placeholder="请选择活动区域" @blur='showStatusChangeCancel(scope.$index,scope.row)'  @change="showStatusChangeSubmit(scope.$index,scope.row)" @visible-change='showStatusChangeBlur'>
              <el-option label="空闲" value="1"></el-option>
              <el-option label="繁忙" value="2"></el-option>
              <el-option label="爆满" value="4"></el-option>
              <el-option label="维护" value="3"></el-option>
            </el-select> 
            </span>
            <span v-else :key="scope.row.id" style="width:50px;" @dblclick="showStatusChange(scope.$index,scope.row)"> {{ scope.row.display|display }} </span>
             </template>
        </el-table-column>
        <el-table-column   label="负载状态">
          <template slot-scope="scope">{{ scope.row.load|display }} </template>
        </el-table-column>
        <el-table-column label="开服时间"  >
          <template slot-scope="scope">{{scope.row.srttime?scope.row.srttime:scope.row.create_time | timeFormate }} </template>
        </el-table-column>
        <el-table-column v-if="grade" prop='status' label="操作">
          <template slot-scope="scope">
            <div class="tableFlex">
            <el-button
              v-if="scope.row.display==='5' ? false : true" v-show="scope.row.childertrue?false:true" size="mini"
              icon="el-icon-edit-outline"
              class="button-with-header" @click="changeHandleEdit(scope.$index,scope.row)">修改</el-button>
            <el-button
              v-if="scope.row.display==='5' ?  false: true" v-show="scope.row.childertrue?false:true" size="mini" style="color: red;"
              icon="el-icon-video-pause" class="button-with-header" @click="handleStop(scope.$index,scope.row)">停用
            </el-button>
</div>
          </template>

        </el-table-column>
      </el-table>
      </div>
      <div class="bottom-msg">
        <div class="botton-msg-left"> 
          当前查询共{{total}}个区服,
          <span>其中显示状态:
            <span v-for='(i,index) of displayNum' :key='index'>  {{i.display}}  {{i.max}}个 </span> 
          </span>
        </div>
        <div class="botton-msg-right">
          <!-- current-page='4' -->
          <el-pagination

              :page-size.sync="filterForm['pagesize']"
              :page-sizes="[20, 40,60,80]"
              background
              layout="total, sizes, prev, pager, next, jumper"
              :pager-count='9'  
              :hide-on-single-page="false"  
              :total="total"
              :current-page.sync='filterForm.page'
              @size-change="filterFormChange('page')"
              @current-change="filterFormChange('page')" ></el-pagination>
        </div>
      </div>
    </div>
    <el-dialog title="批量操作" :visible.sync="dialogFormchange"  :close-on-click-modal="false">

      <div class="alertname">
        <el-table ref="multipleTable" :data="allselectchange">
          <el-table-column prop='pid' label="合服ID" :width="widthtable">
          </el-table-column>
          <el-table-column prop="serverid" label="区服ID" :width="widthtable">
          </el-table-column>
          <el-table-column prop="servername" label="名称" :width="widthtable">
          </el-table-column>
          <el-table-column prop="plaform" label="平台" :width="widthtable">
          </el-table-column>
          <el-table-column prop="channel" label="渠道" :width="widthtable">
          </el-table-column>
          <el-table-column prop="display" label="显示状态" :width="widthtable">
          </el-table-column>
          <el-table-column prop="load" label="负载状态" :width="widthtable">
          </el-table-column>
          <el-table-column prop="srttime" label="开服时间" :width="widthtable">
          </el-table-column>
 <el-table-column v-if="grade" prop='status' label="操作">
          <template slot-scope="scope">
            <div class="tableFlex">
            <el-button
              size="mini" style="color: red;"
              icon="el-icon-video-pause" class="button-with-header" @click="piliangcaozuoCancel(scope.$index,scope.row)">取消
            </el-button>
            </div>
          </template>

        </el-table-column>

        </el-table>
      </div>
      <div slot="footer" class="dialog-footer">
        
        <el-select v-model="radio3" value='1' placeholder="请选择活动区域">
          <el-option label="空闲" value="1"></el-option>
          <el-option label="繁忙" value="2"></el-option>
          <el-option label="爆满" value="4"></el-option>
          <el-option label="维护" value="3"></el-option>
        </el-select>
        <el-button style="margin-left: 10px;" @click="dialogFormchange = false">取 消</el-button>
        <el-button type="primary" @click="updateserver">确 定</el-button>
      </div>
    </el-dialog>



    <!-- 区服创建表单弹窗 -->
    <el-dialog  title="新建区服" :visible.sync="serverCreatedialogFormVisible" :close-on-click-modal="false">
      <el-form ref="createForm"  key="createForm" :rules="createFormRules" :model="createForm" label-width="100px"  class='createFormAlert'> 
        <!-- <el-form-item label="区服ID:" class="createFormAlertBody" >
          <el-input v-model="createForm.serverid" disabled class="alertcontant"></el-input>
        </el-form-item> -->
        <el-form-item label="区服名称:" class="createFormAlertBody" prop='servername' hide-required-asterisk required>
          <el-input v-model="createForm.servername" class="alertcontant" placeholder="请输入区服名称"></el-input>
        </el-form-item>
        <el-form-item label="平台" class="createFormAlertBody"  prop='plaform' hide-required-asterisk required>
          <el-select v-model="createForm.plaform" class="alertcontant"  multiple placeholder="请选择平台">
            <el-option v-for="(item,index) in selectForm[0].options" :key="index"  :label='item.label' :value="item.value?item.value:0">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="渠道" class="createFormAlertBody"  prop='channel' hide-required-asterisk required>
          <el-select v-model="createForm.channel"  class="alertcontant" multiple placeholder="请选择渠道">
            <el-option v-for="(item,index) in selectForm[1].options" v-show="item.value===''?false:true" :key="index" :label='item.label' :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="IP/PORT" class="createFormAlertBody" prop='ip' hide-required-asterisk required>
          <el-input v-model="createForm.ip" class="alertcontant"  placeholder="请输入IP地址和端口用:分开"></el-input>
        </el-form-item>
        <el-form-item label="显示状态" class="createFormAlertBody" prop='display' hide-required-asterisk required>
          <el-select v-model="createForm.display"  class="alertcontant"  placeholder="请选择显示状态">
            <el-option  v-for="(item,index) in selectForm[2].options" v-show="item.value===''||item.value ==5 ?false:true"  :key="index" :label='item.label' :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开服时间" class="createFormAlertBody" prop='srttime' hide-required-asterisk required >
          <el-date-picker
            v-model="createForm.srttime" 
            :picker-options="{
                disabledDate: time => {
                  return time.getTime() < Date.now() - 3600 * 1000 * 24
                },
              }" 
            type="datetime"   class="alertcontant" placeholder="选择日期时间" >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="测试机">
          <el-switch v-model="createForm.test" active-color="#13ce66"   active-value='1' inactive-value='0' inactive-color="#ff4949"></el-switch>
          <el-button type="danger" icon="el-icon-refresh-right" style="margin: 0 0 0 155px;"    @click="createFormResetForm('createForm')">清空</el-button>
        </el-form-item>
        <el-form-item label="资源地址" class="createFormAlertButtom" hide-required-asterisk required prop='address' >
          <el-input v-model="createForm.address"  class="alterbuttominput" placeholder="请输入资源地址"></el-input>
        </el-form-item>
        <el-form-item size="large">
          <el-button @click="serverCreatedialogFormVisible = false">取 消</el-button>
          <el-button type="primary"   @click="createFormSubmitForm('createForm')">确 定</el-button>
        
        </el-form-item>
      </el-form>
    </el-dialog>


    <el-dialog title="区服修改" :visible.sync="dialogFormVisiblechange"  :close-on-click-modal="false">
      <div class="alertname">
        <div class="changeAlertBody"><span class="alertspan">区服id</span><el-input v-model="formchange.serverid" disabled class="alertcontant"></el-input></div>
        <div class="changeAlertBody"><span class="alertspan">区服名称</span><el-input v-model="formchange.servername" disabled class="alertcontant"></el-input></div>
        <div class="changeAlertBody"><span class="alertspan">平台</span><el-select v-model="formchange.plaform" disabled class="alertcontant" multiple placeholder="请选择活动区域"></el-select></div>
        <div class="changeAlertBody"><span class="alertspan">渠道</span><el-select v-model="formchange.channel" disabled class="alertcontant" multiple placeholder="请选择活动区域"></el-select></div>
        <div class="changeAlertBody"><span class="alertspan">IP/PORT</span><el-input v-model="formchange.ip_port" disabled class="alertcontant"></el-input>     </div>
        <div class="changeAlertBody">   
         <span class="alertspan">显示状态<b style="color: red;">*</b></span>
            <el-select v-model="formchange.display" class="alertcontant" :value='formchange.display' placeholder="请选择活动区域"   @change="changes">
              <el-option  v-for="(item,index) in selectForm[2].options" v-show="item.value==''||item.value =='5' ?false:true"  :key="index" :label='item.label' :value="item.value"></el-option>
            </el-select>
        </div>
        <div class="changeAlertBody">  <span class="alertspan">开服时间</span>  <el-date-picker  v-model="formchange.srttime" disabled type="datetime" placeholder="选择日期时间"   class="alertcontant">  </el-date-picker>      </div>
        <div class="changeAlertBody"> </div>
      </div>     

      <div class="alterbuttom"> <span>资源地址</span> <el-input v-model="formchange.address" disabled class="changebuttominput" ></el-input> </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisiblechange = false">取 消</el-button>
        <el-button type="primary" @click="updateServerToOne(false)">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import { deepCopy } from '@/utils/zoneSettings';
import { findServername } from '@/api/character.js';
import { loading, close, secondConfirmation } from '@/views/loading';
import dayjs from 'dayjs';
import { findComponents, findServer, stopserver, ServerMerge, serverselect } from '@/api/components.js';
import { servercreate, serverUpdateToOne, serverallupdate, findServerByID, getpage } from '@/api/components.js';
export default {
  name: 'zoneset',
  data() {
    var ipcheck = (rule, value, callback) =>{
      if (!value) {
        return callback(new Error('IP不可为空'));
      }
      if (!(value.split(':').length === 2 || value.split('：').length === 2)) {return callback(new Error('请输入端口号，与IP用:分隔'));}
      let port = value.split(':').length === 2 ? value.split(':')[1] : value.split('：')[1];
      let ip = value.split(':').length === 2 ? value.split(':')[0] : value.split('：')[0];
      if (!(/^\+?[1-9][0-9]*$/.test(port) && Number(port) > 0 && Number(port) <= 65535)) {return callback(new Error('请输入正确端口号范围在1-65535'));}
      if (!(/^(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)$/.test(ip))) {
        return callback(new Error('请输入正确的IP地址'));
      }
      callback();
    };
    var servernameRepeat = async(rule, value, callback) =>{
      if (!value) {
        return callback(new Error('区服名称不可为空'));
      }
      let { data } = await findServername();
      this.$data.servernames = data.map(item=> item['value']);
      if (this.$data.servernames.find(item => item === value)) {
        return callback(new Error('区服名称不可重复'));
      }
      
      callback();
    };
    return {
      opacity: 0.5,
      servernames: '',
      showstatusIsShow: false,
      showstatusIsvalue: '',
      clientOptions: [], //客户端组件
      serverCreatedialogFormVisible: false, //区服创建弹窗变量
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
        filterable: true,
        collapse: true,
        multiple: true,
        value: '',
        options: []
      },
      {
        label: '显示状态',
        key: 'display',
        filterable: false,
        multiple: false,
        value: '',
        options: [{
          label: '不限制',
          value: ''
        }, {
          label: '空闲',
          value: '1'

        }, {
          label: '繁忙',
          value: '2'
        }, {
          label: '维护',
          value: '3'
        }, {
          label: '爆满',
          value: '4'
        }]
      }, {
        label: '负载状态',
        key: 'load',
        filterable: false,
        collapse: true,
        multiple: false,
        value: '',
        options: [{
          label: '不限制',
          value: ''
        }, {
          label: '空闲',
          value: '1'

        }, {
          label: '繁忙',
          value: '2'
        }, {
          label: '爆满',
          value: '4'
        }, {
          label: '维护',
          value: '3'
        }]
      }, {
        label: '是否合服',
        key: 'mergeserver',
        collapse: true,
        multiple: false,
        filterable: false,

        value: '',
        options: [{
          label: '不限制',
          value: ''
        }, {
          label: '已合服',
          value: '1'

        }, {
          label: '未合服',
          value: '2'
        }]
      }
      ],
      createForm: { //区服创建表单值
        serverid: '',
        servername: '',
        plaform: [],
        channel: [],
        ip: '',
        display: '1',
        srttime: '',
        address: '',
        test: '0',
        page: 1,
        pagesize: 20
      },
    
      createFormRules: {
        servername: [
          { required: true, message: '请输入区服名称', trigger: ['blur', 'change'] },
          { validator: servernameRepeat, trigger: 'blur' }
        ],
        plaform: [
          { required: true, message: '请选择一个平台', trigger: 'blur' }
        ],
        channel: [
          { required: true, message: '请选择一个渠道', trigger: ['blur', 'change'] }
        ],
        ip: [
          { validator: ipcheck, trigger: ['blur', 'change'] }
        ],
        display: [
          { required: true, message: '请选择显示状态', trigger: ['blur', 'change'] }
        ],
        srttime: [
          { type: 'date', required: true, message: '请选择开服时间', trigger: ['blur', 'change'] }
        ],
        address: [
          { required: true, message: '请输入资源地址', trigger: ['blur', 'change'] }
        ]
      },
      //筛选栏过滤
      // filterForm: ['0', '', '', '', undefined, 1, '0', 10],
      filterForm: {
        plaform: '',
        display: '',
        load: '',
        channel: '',
        srttime: '',
        key: 'serverid',
        value: '',
        test: '0',
        mergeserver: '',
        page: 1,
        pagesize: 20
      },
      //id查找区服
      filterServerIdForm: {
        key: 'serverid',
        value: ''
      },
      //区服搜索栏
      idoptions: [{
        value: 'serverid',
        label: '区服ID'
      }, {
        value: 'pid',
        label: '合服ID'
      }],
      //表格赛选菜单
      tableFilter: {
        display: [{ text: '空闲', value: '1' }, { text: '维护', value: '3' }, { text: '繁忙', value: '2' }, { text: '爆满', value: '4' }, { text: '停用', value: '5' }],
        plaform: [{ text: '安卓', value: '1' }, { text: '苹果', value: '2' }, { text: '互通', value: '0' }],
        channel: '',
        load: [{ text: '空闲', value: '1' }, { text: '维护', value: '2' }, { text: '繁忙', value: '3' }, { text: '爆满', value: '4' }]

      },
      //表格
      tableData: [],
      //左下角显示数量
      displayNum: '',
      //查找得条目总数
      total: 0,
      loading: false,
      // page: { page: 1, pagesize: 10 },
      dialogFormchange: false,
      changemodel: '',
      dialogFormVisiblechange: false,
      formLabelWidth: '10%',
     
      formchange: {
        serverid: '',
        servername: '',
        plaform: '不限制',
        channel: '不限制',
        ip: '',
        display: '',
        srttime: '',
        address: ''

      },
      widthtable: 170,

      multipleTable: '',
    
      platformoptions: [
        '不限制',
        'Android',
        'IOS'
      ],
      platformoptionsinput: '不限制',
      clientinput: '不限制',
      statusinput: '不限制',
      loadinput: '不限制',
      datevalue: ['', ''],
      allselectchange: '',
      radio2: false,
      radio3: '1',
      flush: { gamename: this.$store.state.user.permissionInfo.gamename, ok: '1' }
    };
  },
  filters: {
    timeFormate(val) {      
      return dayjs(val).format('YYYY-MM-DD HH:mm:ss');    
    },
    plaform(val) {
      return +val === 0 ? '安卓 苹果' : +val === 1 ? '安卓' : '苹果';
    },
    display(val) {
      switch (+val) {
        case 1: return '空闲';
        case 2: return '繁忙';
        case 3: return '维护';
        case 4: return '爆满';
        case 5: return '停用';
      } 
    }
  },
  watch: {
    displayNum(n, o) {
      console.log(n, o);
    }
  },
  computed: {
    gameid() {
      return this.$store.getters.permissionInfo.gameid;
    },
    gamename() {
      return this.$store.getters.permissionInfo.gamename;
    },
    //筛选客户端
    channelOptionsFilter() {
      let a = this.clientOptions;
      let b = [];
      for (let i of a) {
        b.push({ 'text': i.label, 'value': i.value });
      }
      return b;
    },
    grade() {
      if (+this.$route.meta.grade === 0) {
        return false;
      }
      console.log(+this.$route.meta.grade);
      return true;
    },
    changeheaders() {
      if (this.showchangeleft) {
        return 260;
      } else {
        return 100;
      }
    },
    allselectchangeopen() {
      if (this.allselectchange.length > 1) {return false;}
      return true;
      // if (this.allselectchange.length === 0) {
      //   return true;
      // } else if () {
      //   return false;
      // }
      // ;
    },
    createbutton() {
      if (this.form.address.length > 0 && this.form.open_time && this.form.ip_port.length > 0 && this.form.name.length > 0) {
        return false;
      } else {
        return true;
      }
    }

  },
 

  methods: { 
    async piliangcaozuoCancel(a, b) {
      let mergetrue = await this.$confirm('是否确认取消此记录?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning' })
        .catch(err => false);
      if (!mergetrue) {return;}
      this.allselectchange.splice(a, 1);
    },
    async showStatusChange(a, b) {
      if (!this.grade) {
        return;
      }

      this.tableData[a]['showstatusIsShow'] = true;
    },
    async showStatusChangeBlur(a) {
      // console.log(a);
    },
    async showStatusChangeCancel(a, b) {
      console.log(a, b);
      // this.tableData[a]['showstatusIsvalue'] = false;
      // b['showstatusIsShow'] = false;
    },
    async showStatusChangeSubmit(a, b) {
      // console.log(a, b);
      // this.tableData[a].display = this.showstatusIsvalue;
      this.showstatusIsShow = false;
      b['index'] = a;
      this.updateServerToOne(b);
    },
    changes() {
      // console.log(this.formchange.display, this.formchange.index);
    },
    async loadpid(tree, treeNode, resolve) {
   
      let res = await findServerByID(tree);
      resolve(res.data.map(item=>{
        delete item.pid;
        item['childertrue'] = true;
        return item;
      }));
    },
    //合服
    async mergeServer() {
      let [obj, ...arr] = this.allselectchange;
      let { channel: _channel, plaform: _plaform } = obj;
      let dispalys = this.allselectchange.find(item => +item['display'] !== 3);
      if (dispalys) {
        await this.$message.warning('请修改区服状态为维护状态，才可以合服哦~');
        return;
      }
      
    
      let mergeTrue = arr.every(({ plaform, channel }) => plaform.sort().toString() === _plaform.sort().toString() && channel.sort().toString() === _channel.sort().toString());
      if (!mergeTrue) {
        this.$message.warning('不同平台，不同渠道，不可以合服!');
        return;
      }
      let mergetrue = await this.$confirm('是否确认合并区服?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning' })
        .catch(err => false);
      if (!mergetrue) {return;}
      // let mergeIP = await this.$confirm('是否统一IP?', '提示', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   type: 'warning' })
      //   .catch(err => false);
      // let newip = '';
      // if (mergeIP) {
      //   newip = await this.$prompt('请输入新Ip地址', '提示', {
      //     confirmButtonText: '确定',
      //     cancelButtonText: '取消'
      //   }).catch(err => false);
      //   if (!newip) {return;} 
      // }
      // let { value } = newip;
      if (mergetrue) {
      // this.allselectchange['ip'] = value ? value : '';
        let res = await ServerMerge(this.allselectchange);
        if (+res['code'] === +200) {
          this.$message.success('合服成功!'); 
          this.filterFormChange('flush');
          return;
        }
        this.$message.warning('合服失败!'); 
      
      }
   
    },


    //重置创建表单
    createFormResetForm(formName) {
      this.$refs[formName].resetFields();
    },
    handleSizeChange(val) {
      // console.log(val);
    },
    //提交创建表单
    createFormSubmitForm(formName) {
      this.$refs[formName].validate(async(valid) => {
        if (valid) {
        //二次确定
          let doubleTrue = await this.$confirm('是否确认创建区服?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning' })
            .catch(err => false);
          if (!doubleTrue) {
            return;
          }
          const loading = this.$loading({
            lock: true,
            text: '拼命加载中',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.8)'
          });
          this.filterFormChange('flush');
          let { code, data } = await servercreate({ ...this.createForm });
          loading.close();
         
          if (code === 200) {
            this.$message({
              type: 'success',
              message: `区服创建成功,您创建的区服ID是  ${data['id']} `
            });
            this.newCreateServer();
            this.$refs[formName].resetFields();
            this.filterFormChange('flush');
          }
          if (+code !== 200) {
            loading.close();
            return;
          }
          
          let continueCreate = await this.$confirm('是否继续创建区服?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning' })
            .catch(err => false);
          if (!continueCreate) {this.serverCreatedialogFormVisible = false;}
        }
      });

    },
    async filterFormChange(val, key) {
      this.$refs['rechaContainer'].parentElement.scrollTo({
        top: 0, 
        behavior: 'smooth' 
      });
      switch (val) {
        case 'click':this.filterFormChangeClick(); break;
        case 'flush':this.filterFormChangeFlush(); break;
        case 'page':this.filterFormChangePage(); break;

        default:this.filterForm.value = ''; findServer(this.filterForm).then(res=>{this.inserttable(res);});
      }
    
     
    },
    async finservers(findForm) {
      let res = await findServer(findForm);
      this.inserttable(res); 
    },
   
    async filterFormChangePage() {
   
      this.finservers(this.filterForm);
    },
    async filterFormChangeClick() {
      for (let key in this.filterForm) {
        if (key === 'key' || key === 'test' || key === 'value' || key === 'page' || key === 'pagesize') {
          continue;
        }
        this.filterForm[key] = '';
      }
      this.finservers(this.filterForm);
    },

    async filterFormChangeFlush() {
      this.filterForm = {
        plaform: '',
        display: '',
        load: '',
        channel: '',
        srttime: '',
        key: 'serverid',
        value: '',
        test: '0',
        mergeserver: '',
        page: 1,
        pagesize: 20
      };
      this.tableData = [];
      findServer(this.filterForm).then(res=>{this.inserttable(res);});
    
    },
    async filterFormClick() {
      this.filterForm = this.filterForm.map(item=>{
        return '';
      });
      let req = this.filterServerIdForm;
      // console.log(req.value);
      if (req.value === '') {
        // console.log(req.value);
        this.$message({
          message: '警告哦，不可以搜索空哦',
          type: 'warning'
        });
        return;
      }
      let res = await findServerByID(req);
      this.tableData = res.data;
      this.displayNum = '';
      this.total = res.data.length;
      return;
    },

    tableRowClassName({ row, rowIndex }) {
  
      if (row.display === '5') {
        return 'success-row';
      } 
      if (row.childertrue) {
        return 'childer-row';
      }
      if (!row.pid) {
        return 'pid-row';
      } 
   
    },
    //按钮新建区服
    newCreateServer() {
      this.serverCreatedialogFormVisible = true;
    },
    idRandom(lengths) {
      let randomString = '';
      for (let i = 0; i < lengths; i++) {
        randomString += Math.ceil(Math.random() * 10).toString();
      }
      return randomString;
    },
    plaformFilterTag(value, row) {
      return row['plaform'] === value;
    },
    channelFilterTag(value, row) {
      let a = row.channel;
      return a.includes(value);
    },
    displatFilterTag(value, row) {
      return row.display === value;
    },
    loadFilterTag(value, row) {
      return row.load === value;
    },
    //修改传参
    changeHandleEdit(index, row) {
      this.formchange = {
        ...row,
        // display: +row.display,
        index
      };
      this.dialogFormVisiblechange = true;
    //row为数据 
    },
    //停用传参
    async handleStop(index, row) {
    // console.log(index,);
      let mergetrue = await this.$confirm('是否确认停用区服?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning' })
        .catch(err => false);
      if (!mergetrue) {return;}
      const loading = this.$loading({
        lock: true,
        text: '拼命加载中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.8)'
      });
      let res = await stopserver({ ...row, gameid: this.gameid });
      if (res.code === 200) {
        loading.close();
        this.filterFormChange('flush');
        this.$message.success('停用成功。');
        findServer(this.filterForm).then(res=>{this.inserttable(res);});
      }
      loading.close();
    },

    //区服创建
    createserver() {

      let a = this.$confirm('是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {

        let a = servercreate({ ...this.form, 'gamename': this.gamename, 'gameid': this.gameid }).then(res => {
          if (res.code === 200) {
            this.$message({
              type: 'success',
              message: '创建成功!'
            });
            return Promise.resolve(true);
          } else {
            this.$message({
              type: 'info',
              message: '创建失败!'
            });
            return Promise.resolve(false);
          }
        }).catch((error) => {
        // console.log(error);
        });
        return Promise.resolve(a);
      });
      a.then(res => {
        if (res) {
          getpage({ gameid: this.gameid }).then(res => {
            this.tableData = res.data;
          });
          this.serverCreatedialogFormVisible = false;
          for (let key in this.form) {
            this.form[key] = '';
          }
        }
      });
    },
    handleSelectionChange(val,) {
      let a = [];
      for (let i of val) {
        if (i.display === '5' || i.childertrue) {
          continue;
        } else {
          a.push(i);
        }
      }

      this.allselectchange = a;
    },
    async updateserver() {
    //批量操作
      let data = { 'server': this.allselectchange, 'merge': this.radio2, 'showstatus': this.radio3, 'gameid': this.gameid };
      let sendtrue = await secondConfirmation(this, `是否确认继续操作?`);
      if (!sendtrue) {return;}
    
     

      loading(this);
      let { code } = await serverallupdate(data);
      if (code !== 200) {return;}
      this.allselectchange.forEach(a=>{
        let q;
        switch (+a.display) {
          case 1:q = '空闲';            
            break;
          case 2:q = '繁忙';
            break;
          case 3:q = '维护';
            break;
          case 4:q = '爆满';
            break;
        }
        this.displayNum.map(a=>{
          a.max = a.display === q ? +a.max - 1 : a.max;
          return a;
        });
      });
      let radio3;
      switch (+this.radio3) {
        case 1:radio3 = '空闲';            
          break;
        case 2:radio3 = '繁忙';
          break;
        case 3:radio3 = '维护';
          break;
        case 4:radio3 = '爆满';
          break;
      }
      this.displayNum.map(a=>{
        a.max = a.display === radio3 ? +a.max + this.allselectchange.length : a.max;
        return a;
      });
      this.dialogFormchange = false;
      this.tableData.map(item=>{
        if (this.allselectchange.find(_item=> _item.id === item.id)) {
          item.display = this.radio3;
          return item;
        } 
        return item;
      });
      this.$message.success('修改成功!');
     
      close(this);
      // this.$confirm('是否继续?', '提示', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   type: 'warning'
      // }).then(() => {
      //   serverallupdate(data).then(res => {
      //     if (res.code === 200) {
      //       this.tableData.map(item=>{
      //         if (this.allselectchange.find(_item=> _item.id === item.id)) {
      //           item.display = this.radio3;
      //           return item;
      //         } 
      //         return item;
      //       });
  
      //       this.dialogFormchange = false;
      //       this.$message({
      //         type: 'success',
      //         message: '成功!'
      //       });
      //       return true;
      //     }
      //   });
      // }).catch(() => {
      //   this.$message({
      //     type: 'info',
      //     message: '已取消'
      //   });
      // });

    },
    //区服修改
    async updateServerToOne(displaychanges) {
      let sendtrue = await secondConfirmation(this, `您正在修改数据，请谨慎处理！是否继续?`);
      if (!sendtrue) {return;}
      if (displaychanges) {
        this.formchange = displaychanges;
      }
      this.loading = true;
      let { code } = await serverUpdateToOne({ ...this.formchange });
      if (code !== 200) {return;}
      this.$message.success('修改成功。');
      // 获取最新任务列表
      let index = this.formchange.index;
      this.tableData[index].display = this.formchange.display;
      this.tableData = [];
      this.filterFormChange('flush');
      this.loading = false;
      this.dialogFormVisiblechange = false;
      
    },
    inserttable(res) {
      let data = res.data;
      try {
        data.table.forEach(a => (a['showstatusIsShow'] = false));
      } catch (e) {
        console.log('没有数据啊 兄弟');
      }
      
      this.tableData = data.table;
      this.formchange.page = Number(data.page);
      this.displayNum = data.displayNum;
      this.total = Number(data.total);
    },
    selectservers() {
      serverselect(this.flush).then(res => {
        this.tableData = res;
      });
    }
  },  
  async mounted() {

    findComponents({ code: 'areaclothing', gameid: this.gameid }).then(res => {
      let components = res.data.values.map(item=>({
        label: item,
        value: item
      }));
      this.selectForm[1].options = this.selectForm[1].options.concat(components);
      this.clientOptions = components;
    });
 
    findServer(this.filterForm).then(res=>{this.inserttable(res);});
  
  },

  created() {
   
  }
};
</script>

<style lang="scss" rel="stylesheet/scss">
.aasdhjkahskdhjk{
 max-height: 5vh;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

}
 .el-select-dropdown__item.selected{
                 color: #2BBFBD !important;
      }
  .change-header {
    display: flex;
    .rightchange ul {
      width: 160px;

      .li2 {
        margin-left: 40px;
      }
    }

    .rightchange ul li {
      margin-top: 1px;
      margin-left: 20px;
    }

    .leftchange {
      width: 100px;
      margin-top: 1px;

      ul {
        width: 150px;

        li {
          margin-left: 25px;
        }
      }

    }
  }

  .distric-container {
    height: calc(100vh - 200px);
    .tableFlex {
        display: flex;
    }
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
      // .el-input__inner{
      //     color: #2BBFBD !important;
      //   border-color: #2BBFBD !important;
      // }
      .el-pagination.is-background .el-pager li:not(.disabled).active{
        background-color: #2BBFBD !important;
      }
      .el-select-dropdown__item.selected{
                 color: #2BBFBD !important;
      }
      
      
    /* 区服创建表单样式 */
    .createFormAlert{
      display: flex;
      flex-wrap: wrap;
      .createFormAlertBody{
        width: 50%;
      }
      .alertcontant {
      width: 80%;
    }
      .alterbuttominput {
        width: 91.5%;
      }
      .createFormAlertButtom{
        width: 100%;
      }
    }
    .el-table .warning-row {
      background: #dbaec2;

    }

    .el-table .success-row {
      background: darkgray;
      /* pointer-events: none; */
    }
    .childer-row td:first-child  div{
      visibility: hidden;
    }
    .childer-row{
      background-color: whitesmoke;
    }
    .el-table .success-row td:first-child div {
      visibility: hidden;
    }
  
    // .el-table .pid-row  td:nth-child(2) div {
    //   /* visibility: hidden; */
    // }

    .bottom-msg {
      display: flex;

      .botton-msg-left {
        flex: 1;
        margin-left: 0.5vw;
        // margin:10px;
      }
      .botton-msg-right{
        margin-right: 0.5vw;
      }
    }

    .server-container {
      padding: 10px;
     
    }

    .alertname {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
    }

    .alertcontant {
      width: 80%;
    }

    .changeAlertBody {
      width: 50%;
      margin-top: 10px;
      display: inline-flex;
      align-items: baseline;

      .alertspan {
        width: 20%;
        margin: 1px;
        text-align: left;
      }
      .alertcontant{
        width: 60%;
      }

      /* .alertspan{
      margin-left: 10%;
    } */
    }
    .changebuttominput{
//  margin-left: 1%;
    width: 80%;
    }
    .alterbuttom {
      margin-top: 10px;
      width: 100%;
      display: flex;
      flex-wrap: nowrap;
      justify-content: left;
      align-items: baseline;

      span {
        width: 10%;
        margin: 1px;
      }

      
    }

    .option-container {
      margin: 5px 10px;
      height: 30px;

      ul {
        li {
          float: right;
        }
      }
    }

    .search-container {
      margin: 10px;
      background-color: white;
      border-radius: 5px;
      padding: 5px;
      box-shadow: 1px 1px 4px 0px #828282;

      .server-container {
        border-bottom: 1px #bdbdbd dashed;
        
      }

      .comprehensive-container {
        display: flex;
        padding: 10px;
        align-items: baseline;
      }
    }

    .table-container {
      .table-body{
     margin: 10px;
    background-color: white;
    border-radius: 5px;
    padding: 5px 5px 0px 5px !important;
    min-height: 66vh;
    box-shadow: 1px 1px 4px 0px #828282;
      }
 
    }

    input[name='idselect'] {
      border-radius: 30px 0 0 30px;
      width: 100px;
      /* height: 30px; */
    }

    .input-with-select {
      width: 250px;
      margin-left: -4px;
      border-radius: 0;

      input {
        border-radius: 0;
      }
    }

    .button-with-select {
      width: auto;
      border-radius: 0 30px 30px 0;
      margin-left: -5px;
      margin-right: 10px;
      height: 32px;
        &:focus,&:active{
          color: #2BBFBD !important;
        }

    }
    .el-checkbox:last-of-type{
      margin-left: 10px;
    }

    .button-with-header {
      border-radius: 30px 30px 30px 30px;
      &:focus, &:active {
       color: #2BBFBD !important
      }
    }
    .comprehensive-container {
      width: 100%;
     
      .select-item {
        
      width: 20%;
      &>.comprehensive-container-label{
          width: 30%;
        }
      &>div{
        width: 70%;
      }
    }

      input {
        border-radius: 10px;
      }

    }
  }
</style>
