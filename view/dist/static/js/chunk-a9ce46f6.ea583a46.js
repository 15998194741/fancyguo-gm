(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-a9ce46f6"],{"2d79":function(e,t,r){"use strict";r.d(t,"a",(function(){return n}));var a=["0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","q","w","e","r","t","y","u","i","o","p","a","s","d","f","g","h","j","k","l","z","x","c","v","b","n","m"];function n(){for(var e="",t=0;t<10;t++){var r=Math.ceil(61*Math.random());e+=a[r]}return e}},"4010d":function(e,t,r){"use strict";r.d(t,"d",(function(){return n})),r.d(t,"a",(function(){return i})),r.d(t,"f",(function(){return o})),r.d(t,"h",(function(){return s})),r.d(t,"g",(function(){return l})),r.d(t,"e",(function(){return c})),r.d(t,"b",(function(){return u})),r.d(t,"c",(function(){return f}));var a=r("b775");function n(e){return Object(a["a"])({url:"cdk/createcdk",method:"post",data:e})}function i(e){return Object(a["a"])({url:"cdk/find",method:"get",params:e})}function o(e){return Object(a["a"])({url:"cdk/cdkDownload",method:"get",params:e})}function s(e){return Object(a["a"])({url:"cdk/detailsFind",method:"get",params:e})}function l(e){return Object(a["a"])({url:"cdk/cdkkeyfind",method:"get",params:e})}function c(e){return Object(a["a"])({url:"cdk/cdkCreateSchedule",method:"get",params:e})}function u(e){return Object(a["a"])({url:"cdk/CDKFindByTypeOne",method:"get",params:e})}function f(e){return Object(a["a"])({url:"cdk/CDKFindIdAndStop",method:"put",data:e})}},"4d00":function(e,t,r){"use strict";r.r(t);var a=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{directives:[{name:"loading",rawName:"v-loading",value:e.cdkLoading,expression:"cdkLoading"}],ref:"CDKContainer",staticClass:"CDK-container",attrs:{"element-loading-text":"拼命加载中","element-loading-spinner":"el-icon-loading","element-loading-background":"rgba(0, 0, 0, 0.8)"}},[r("div",{staticClass:"role-container-header"},[r("ul",{staticStyle:{"margin-top":"5px","margin-bottom":"-5px","margin-right":"10px"}},[r("li",[r("el-button",{staticClass:"button-with-header",attrs:{slot:"reference",icon:"el-icon-refresh",size:"small"},on:{click:e.flushTabelData},slot:"reference"},[e._v("刷新")])],1),e._v(" "),r("li",[r("el-button",{staticClass:"button-with-header",attrs:{slot:"reference",icon:"el-icon-refresh",size:"small"},on:{click:function(t){e.tableDataShwo=!e.tableDataShwo}},slot:"reference"},[e._v("查看CDK信息")])],1)])]),e._v(" "),r("div",{staticClass:"role-container-search"},[r("div",{staticClass:"server-container"},[e._v("ID：\n      "),r("el-select",{staticClass:"selectID",attrs:{placeholder:"请选择",name:"idselect",size:"small"},model:{value:e.filterForm.key,callback:function(t){e.$set(e.filterForm,"key",t)},expression:"filterForm.key"}},e._l(e.idoptions,(function(e,t){return r("el-option",{key:t,attrs:{label:e.label,value:e.value}})})),1),e._v(" "),r("el-input",{staticClass:"input-with-select",attrs:{placeholder:"请输入内容",size:"small"},model:{value:e.filterForm.value,callback:function(t){e.$set(e.filterForm,"value",t)},expression:"filterForm.value"}}),e._v(" "),r("el-button",{staticClass:"button-with-select",attrs:{slot:"append",icon:"el-icon-search",size:"small",name:"truesearch"},on:{click:function(t){return e.filterFormChange("click")}},slot:"append"})],1),e._v(" "),r("div",{staticClass:"comprehensive-container"},[e._l(e.selectForm,(function(t,a){return r("div",{key:a,staticClass:"select-item"},[e._v(" "+e._s(t.label)+":\n        "),r("el-select",{staticStyle:{"border-radius":"10px"},attrs:{multiple:t["multiple"],clearable:"","collapse-tags":t["collapse"],filterable:t.filterable,placeholder:"请选择",size:"small"},on:{change:function(t){return e.filterFormChange("change")}},model:{value:e.filterForm[t.key],callback:function(r){e.$set(e.filterForm,t.key,r)},expression:"filterForm[i.key]"}},e._l(t.options,(function(e,t){return r("el-option",{key:t,attrs:{label:e.label,value:e.value}})})),1)],1)})),e._v(" "),r("div",{staticClass:"timefilter"},[e._v(" 领取时间:  "),r("el-date-picker",{attrs:{size:"small",type:"datetimerange","range-separator":"至","start-placeholder":"开始日期","end-placeholder":"结束日期"},on:{change:function(t){return e.filterFormChange("change")}},model:{value:e.filterForm["takeEffectTime"],callback:function(t){e.$set(e.filterForm,"takeEffectTime",t)},expression:"filterForm['takeEffectTime']"}})],1)],2)]),e._v(" "),r("div",{directives:[{name:"show",rawName:"v-show",value:e.tableDataShwo,expression:"tableDataShwo"}],staticClass:"role-container-body-one",attrs:{id:"v-show-test-body"}},[r("el-table",{ref:"multipleTable",attrs:{border:"",data:e.tableData}},e._l(e.tablecolumn,(function(t,a){return r("el-table-column",{key:a,attrs:{label:t.label},scopedSlots:e._u([{key:"default",fn:function(a){return["string"===typeof a.row[t.prop]||"number"===typeof a.row[t.prop]?r("div",[e._v("\n        "+e._s(a.row[t.prop])+"\n        ")]):r("div",e._l(a.row[t.prop],(function(t,a){return r("el-tag",{key:a},[e._v(e._s(t))])})),1)]}}],null,!0)})})),1)],1),e._v(" "),r("div",{class:e.tableDataShwo?"role-container-body-two":"role-container-body-there",attrs:{id:"body"}},[r("el-table",{ref:"multipleTable",attrs:{border:"",data:e.tableDataTwo}},e._l(e.tablecolumnTwo,(function(t,a){return r("el-table-column",{key:a,attrs:{label:t.label},scopedSlots:e._u([{key:"default",fn:function(a){return["string"===typeof a.row[t.prop]||"number"===typeof a.row[t.prop]?r("div",[e._v("\n        "+e._s(a.row[t.prop])+"\n        ")]):r("div",e._l(a.row[t.prop],(function(t,a){return r("el-tag",{key:a},[e._v(e._s(t))])})),1)]}}],null,!0)})})),1)],1),e._v(" "),r("div",{staticClass:"role-container-bottom"},[r("span",[e._v("当前cdk已兑换"+e._s(e.useTotal)+"条")]),e._v(" "),r("el-pagination",{staticStyle:{"text-align":"right"},attrs:{"page-size":e.filterForm["pagesize"],"page-sizes":[100,150,200,250],background:"",layout:"total, sizes, prev, pager, next, jumper","pager-count":9,"hide-on-single-page":!1,total:e.total,"current-page":e.filterForm.page},on:{"update:pageSize":function(t){return e.$set(e.filterForm,"pagesize",t)},"update:page-size":function(t){return e.$set(e.filterForm,"pagesize",t)},"update:currentPage":function(t){return e.$set(e.filterForm,"page",t)},"update:current-page":function(t){return e.$set(e.filterForm,"page",t)},"size-change":function(t){return e.filterFormChange("pagechange")},"current-change":function(t){return e.filterFormChange("pagechange")}}})],1),e._v(" "),r("el-dialog",{staticClass:"announceddialog",attrs:{title:"新建CDK",visible:e.dialogFormchange,"close-on-click-modal":!1},on:{"update:visible":function(t){e.dialogFormchange=t},close:e.createFormMailCancel}},[r("div",{directives:[{name:"loading",rawName:"v-loading",value:e.creatinng,expression:"creatinng"}],attrs:{"element-loading-text":"拼命加载中","element-loading-spinner":"el-icon-loading","element-loading-background":"rgba(0, 0, 0, 0.8)"}},[r("div",{staticClass:"container"},[r("div",[r("el-form",{ref:"createFormRulesLeft",staticClass:"demo-ruleForm",attrs:{model:e.createForm,"status-icon":"",rules:e.createFormRulesLeft,"label-width":"100px"}},[r("el-form-item",{attrs:{label:"名称",prop:"name"}},[r("el-input",{staticClass:"create-form-input",attrs:{placeholder:"请输入名称",autocomplete:"off"},model:{value:e.createForm["name"],callback:function(t){e.$set(e.createForm,"name",t)},expression:"createForm['name']"}})],1),e._v(" "),r("el-form-item",{attrs:{label:"CDK类型:",prop:"type"}},[r("el-select",{staticClass:"create-form-select",staticStyle:{"border-radius":"10px"},attrs:{placeholder:"请选择",size:"small"},model:{value:e.createForm["type"],callback:function(t){e.$set(e.createForm,"type",t)},expression:"createForm['type']"}},[r("el-option",{attrs:{label:"唯一CDK",value:"1"}}),e._v(" "),r("el-option",{attrs:{label:"互斥CDK",value:"2"}}),e._v(" "),r("el-option",{attrs:{label:"通用CDK",value:"3"}})],1)],1),e._v(" "),r("el-form-item",{directives:[{name:"show",rawName:"v-show",value:"1"===e.createForm["type"],expression:"createForm['type'] === '1'"}],attrs:{label:"CDKKEY:",prop:"cdkkey"}},[r("el-col",{attrs:{span:16}},[r("el-input",{staticClass:"create-form-input-CDKKEY",attrs:{placeholder:"请输入CDKKEY",autocomplete:"off"},model:{value:e.createForm["cdkkey"],callback:function(t){e.$set(e.createForm,"cdkkey",e._n(t))},expression:"createForm['cdkkey']"}})],1),e._v(" "),r("el-col",{attrs:{span:5}},[r("el-button",{attrs:{type:"primary"},on:{click:e.cdkKeyGenerate}},[e._v("一键生成")])],1)],1),e._v(" "),r("el-form-item",{attrs:{label:"CDK数量:",prop:"quantity"}},[r("el-input",{staticClass:"create-form-input",attrs:{disabled:e.onlyOneCdkSelect,placeholder:"请输入数量",autocomplete:"off"},model:{value:e.createForm["quantity"],callback:function(t){e.$set(e.createForm,"quantity",e._n(t))},expression:"createForm['quantity']"}})],1),e._v(" "),r("el-form-item",{attrs:{label:"平台:",prop:"plaform"}},[r("el-select",{staticClass:"create-form-select",staticStyle:{"border-radius":"10px"},attrs:{placeholder:"请选择",size:"small",multiple:""},model:{value:e.createForm["plaform"],callback:function(t){e.$set(e.createForm,"plaform",t)},expression:"createForm['plaform']"}},[r("el-option",{attrs:{label:"安卓",value:"1"}}),e._v(" "),r("el-option",{attrs:{label:"苹果",value:"2"}})],1)],1),e._v(" "),r("el-form-item",{attrs:{label:"渠道:",prop:"channel"}},[r("el-select",{staticClass:"create-form-select",staticStyle:{"border-radius":"10px"},attrs:{multiple:"",placeholder:"请选择",size:"small"},model:{value:e.createForm["channel"],callback:function(t){e.$set(e.createForm,"channel",t)},expression:"createForm['channel']"}},e._l(e.selectForm[1].options,(function(e,t){return r("el-option",{key:t,attrs:{label:e.label,value:e.value}})})),1)],1),e._v(" "),r("el-form-item",{attrs:{label:"生效时间:",prop:"takeEffectTime"}},[r("el-date-picker",{staticClass:"el-date-picker-Cdk-takeEffectTime",attrs:{type:"datetime","picker-options":{disabledDate:function(e){return e.getTime()<Date.now()-864e5}},placeholder:"选择日期时间"},model:{value:e.createForm["takeEffectTime"],callback:function(t){e.$set(e.createForm,"takeEffectTime",t)},expression:"createForm['takeEffectTime']"}})],1),e._v(" "),r("el-form-item",{attrs:{label:"失效时间:",prop:"failureTime"}},[r("el-date-picker",{staticClass:"el-date-picker-Cdk-takeEffectTime",attrs:{type:"datetime","picker-options":{disabledDate:function(e){return e.getTime()<Date.now()-864e5}},placeholder:"选择日期时间"},model:{value:e.createForm["failureTime"],callback:function(t){e.$set(e.createForm,"failureTime",t)},expression:"createForm['failureTime']"}})],1)],1)],1),e._v(" "),r("div",[r("el-form",{ref:"createFormRulesRight",staticClass:"demo-ruleForm",attrs:{model:e.createForm,"status-icon":"",rules:e.createFormRulesRight,"label-width":"100px"}},[r("el-form-item",{attrs:{label:"邮件标题",prop:"title"}},[r("el-input",{staticClass:"create-form-input",attrs:{placeholder:"请输入名称",autocomplete:"off"},model:{value:e.createForm["title"],callback:function(t){e.$set(e.createForm,"title",t)},expression:"createForm['title']"}})],1),e._v(" "),r("el-form-item",{attrs:{label:"邮件正文",prop:"text"}},[r("el-input",{attrs:{type:"textarea",rows:6,autocomplete:"off"},model:{value:e.createForm["text"],callback:function(t){e.$set(e.createForm,"text",t)},expression:'createForm["text"]'}})],1),e._v(" "),r("el-form-item",{attrs:{label:"邮件内容",prop:"annexList"}},[e._l(e.createForm["annexList"],(function(t,a){return r("el-form-item",{key:t.id,staticClass:"annexList",attrs:{prop:"pass"}},[r("el-row",{staticStyle:{"margin-top":"1px"}},[r("el-col",{staticStyle:{width:"37.66667%"},attrs:{span:10}},[r("el-cascader",{staticClass:"annexcssSetting",attrs:{"show-all-levels":!1,props:e.annexProps,options:e.annexOptions},model:{value:e.createForm["annexList"][a]["annexName"],callback:function(t){e.$set(e.createForm["annexList"][a],"annexName",t)},expression:"createForm['annexList'][index]['annexName']"}})],1),e._v(" "),r("el-col",{attrs:{span:5}},[r("el-input",{staticClass:"annexcssSetting",attrs:{placeholder:"数量",autocomplete:"off"},model:{value:e.createForm["annexList"][a]["annexNumber"],callback:function(t){e.$set(e.createForm["annexList"][a],"annexNumber",e._n(t))},expression:"createForm['annexList'][index]['annexNumber']"}})],1),e._v(" "),r("el-col",{attrs:{span:3}},[r("el-button",{attrs:{type:"danger",icon:"el-icon-remove"},on:{click:function(t){return e.annexListCut(a)}}})],1)],1)],1)})),e._v(" "),r("i",{staticClass:"el-icon-circle-plus",staticStyle:{"font-size":"200%","margin-top":"5px"},on:{click:e.annexListAdd}})],2)],1)],1)]),e._v(" "),r("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[r("el-button",{on:{click:e.createFormMailCancel}},[e._v("取 消")]),e._v(" "),r("el-button",{attrs:{type:"primary"},on:{click:e.createFormSubmit}},[e._v("确 定")])],1)])])],1)},n=[],i=(r("8e6e"),r("456d"),r("ac4d"),r("8a81"),r("5df3"),r("1c4c"),r("6b54"),r("ac6a"),r("ade3")),o=(r("28a5"),r("7f7f"),r("96cf"),r("1da1")),s=r("74eb"),l=r("7e82"),c=r("2d79"),u=r("4010d"),f=r("5a0c"),m=r.n(f);function d(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,a)}return r}function p(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?d(Object(r),!0).forEach((function(t){Object(i["a"])(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):d(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function h(e,t){var r;if("undefined"===typeof Symbol||null==e[Symbol.iterator]){if(Array.isArray(e)||(r=b(e))||t&&e&&"number"===typeof e.length){r&&(e=r);var a=0,n=function(){};return{s:n,n:function(){return a>=e.length?{done:!0}:{done:!1,value:e[a++]}},e:function(e){throw e},f:n}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var i,o=!0,s=!1;return{s:function(){r=e[Symbol.iterator]()},n:function(){var e=r.next();return o=e.done,e},e:function(e){s=!0,i=e},f:function(){try{o||null==r.return||r.return()}finally{if(s)throw i}}}}function b(e,t){if(e){if("string"===typeof e)return g(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);return"Object"===r&&e.constructor&&(r=e.constructor.name),"Map"===r||"Set"===r?Array.from(e):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?g(e,t):void 0}}function g(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,a=new Array(t);r<t;r++)a[r]=e[r];return a}var v=0,y={name:"cdkDetail",data:function(){var e,t,r=this;e=function(e,t,r){return/^[0-9]*$/.test(t)?r():r(new Error("请输入正整数"))},t=function(e,t,r){var a,n=h(t);try{for(n.s();!(a=n.n()).done;){var i=a.value;if(!i.annexName)return r(new Error("请选择附件"));if(!/^[0-9]*$/.test(i["annexNumber"])&&i["annexNumber"].length>=1||!i["annexNumber"])return r(new Error("内容数量为正整数"))}}catch(o){n.e(o)}finally{n.f()}return r()};var a=function(e,t,a){if(!r.$data.createForm["takeEffectTime"]){var n=r.$data.createForm["takeEffectTime"];return r.$data.createForm["takeEffectTime"]=1,r.$data.createForm["takeEffectTime"]=n,a(new Error("请选择生效时间"))}return t<=r.$data.createForm["takeEffectTime"]?(r.$data.createForm["takeEffectTime"]=r.$data.createForm["takeEffectTime"],a(new Error("失效时间无效"))):a()},n=function(e,t,a){return r.$data.createForm["failureTime"]?t>=r.$data.createForm["failureTime"]?(r.$data.createForm["failureTime"]=r.$data.createForm["failureTime"],a(new Error("生效时间无效"))):a():(r.$data.createForm["failureTime"]=r.$data.createForm["failureTime"],a(new Error("请选择失效时间")))},i=function(e,t,a){return"1"!==r.$data.createForm["type"]||t?a():a(new Error("请输入CDKKEY,不想手输可以使用自动生成功能"))};return{total:0,creatinng:!1,cdkLoading:!1,annexProps:{expandTrigger:"hover",lazy:!0,lazyLoad:function(){var e=Object(o["a"])(regeneratorRuntime.mark((function e(t,r){var a,n,i;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return a=t.label,e.next=3,Object(l["d"])({label:a});case 3:n=e.sent,i=n.data,r(i);case 6:case"end":return e.stop()}}),e)})));function t(t,r){return e.apply(this,arguments)}return t}()},tableDataShwo:!1,annexOptions:[],dialogFormchange:!1,tableDataTwo:[],useTotal:"",filterForm:{key:"CDKID",value:"",plaform:"",channel:"",takeEffectTime:"",failureTime:"",page:1,pagesize:100},createForm:{name:"",type:"",cdkkey:"",quantity:"",plaform:"",channel:"",takeEffectTime:"",failureTime:"",title:"",text:"",annexList:[{annexName:"",annexNumber:"",id:v}]},filterFormShow:{},selectForm:[{label:"游戏平台",multiple:!1,filterable:!0,collapse:!1,key:"plaform",value:"",options:[{label:"安卓",value:"1"},{label:"苹果",value:"2"}]},{label:"游戏渠道",key:"channel",multiple:!0,filterable:!0,collapse:!0,value:"",options:[]}],idoptions:[{label:"CDKID",value:"CDKID"},{label:"CDKKEY",value:"CDKKEY"}],tableData:[],tablecolumn:[{label:"CDKID",prop:"id"},{label:"名称",prop:"name"},{label:"平台",prop:"plaforms"},{label:"渠道",prop:"channel"},{label:"CDKEY类型",prop:"types"},{label:"CDKEY数量",prop:"num"},{label:"生效日期",prop:"start_time"},{label:"失效日期",prop:"end_time"},{label:"CDKEY内容",prop:"annexs"}],tablecolumnTwo:[{label:"CDKKEYID",prop:"_id"},{label:"用户ID",prop:"roleid"},{label:"平台",prop:"plaform"},{label:"渠道",prop:"channel"},{label:"CDKKEY",prop:"key"},{label:"是否领取",prop:"isUse"},{label:"领取时间",prop:"receive"}],createFormRulesLeft:{name:{required:!0,message:"请输入CDK名称",trigger:["blur","change"]},type:{required:!0,message:"请输入选择一种cdk类型",trigger:["blur","change"]},quantity:[{required:!0,message:"请输入cdk数量",type:"integer",trigger:["blur","change"]},{validator:e,trigger:["blur","change"]}],cdkkey:{validator:i,trigger:["blur","change"]},plaform:{required:!0,message:"请选择平台，如果不限制请两个同时选中。",trigger:["blur","change"]},channel:{required:!0,message:"请选择至少一个渠道",trigger:["blur","change"]},takeEffectTime:[{required:!0,message:"请选择生效时间"},{validator:n}],failureTime:[{required:!0,message:"请选择失效时间"},{validator:a}]},createFormRulesRight:{title:{required:!0,message:"请输入标题",trigger:["blur","change"]},text:{required:!0,message:"请输入正文",trigger:["blur","change"]},annexList:{validator:t,trigger:["blur","change"]}}}},computed:{onlyOneCdkSelect:function(){return"1"===this.createForm["type"]&&(this.createForm["quantity"]=1,!0)}},methods:{downloadCDK:function(){var e=Object(o["a"])(regeneratorRuntime.mark((function e(t){var a,n,i;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return a=t["row"]["cdkid"],n=t["row"]["name"],e.next=4,Object(u["f"])({tablename:a});case 4:i=e.sent,Promise.all([r.e("chunk-7ba732c9"),r.e("chunk-5dde7229")]).then(function(){var e,t=r("3016"),a=t.export_json_to_excel,o=i.split("\n"),s=[o[0]],l=[],c=h(o.slice(1,o.length));try{for(c.s();!(e=c.n()).done;){var u=e.value,f=[u];l.push(f)}}catch(m){c.e(m)}finally{c.f()}a(s,l,n)}.bind(null,r)).catch(r.oe);case 6:case"end":return e.stop()}}),e)})));function t(t){return e.apply(this,arguments)}return t}(),viewDetails:function(){var e=Object(o["a"])(regeneratorRuntime.mark((function e(t){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:this.$router.push({path:"/CDKManagement/cdkDetail",query:p({},t["row"])});case 1:case"end":return e.stop()}}),e,this)})));function t(t){return e.apply(this,arguments)}return t}(),handleSelectionChange:function(){},cdkKeyGenerate:function(){this.createForm["cdkkey"]=Object(c["a"])()},createFormSubmit:function(){var e=Object(o["a"])(regeneratorRuntime.mark((function e(){var t,r,a,n,i;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return this.creatinng=!0,e.next=3,this.$refs["createFormRulesRight"].validate().catch((function(e){return!1}));case 3:return t=e.sent,e.next=6,this.$refs["createFormRulesLeft"].validate().catch((function(e){return!1}));case 6:if(r=e.sent,t&&r){e.next=10;break}return this.creatinng=!1,e.abrupt("return");case 10:return e.next=12,Object(u["d"])(this.createForm);case 12:if(a=e.sent,n=a.code,i=a.data,200===+n){e.next=19;break}return this.$message.info("创建失败"),this.creatinng=!0,e.abrupt("return");case 19:this.creatinng=!1,this.$message.success("创建成功,您创建的CDKID为   ".concat(i));case 21:case"end":return e.stop()}}),e,this)})));function t(){return e.apply(this,arguments)}return t}(),createFormMailCancel:function(){this.$refs["createFormRulesLeft"].resetFields(),this.$refs["createFormRulesRight"].resetFields(),this.dialogFormchange=!1,this.createForm["annexList"]=[{annexName:"",annexNumber:"",id:v}]},filterFormChange:function(e){switch(e){case"click":this.filterFormChangeClick();break;case"change":this.filterFormChangeChange();break;case"pagechange":this.filterFormChangeSubmit();break;default:this.filterFormChangeFlush()}},filterFormChangeClick:function(){var e=Object(o["a"])(regeneratorRuntime.mark((function e(){var t;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:e.t0=regeneratorRuntime.keys(this.filterForm);case 1:if((e.t1=e.t0()).done){e.next=8;break}if(t=e.t1.value,"value"!==t&&"key"!==t&&"pagesize"!==t){e.next=5;break}return e.abrupt("continue",1);case 5:this.filterForm[t]="",e.next=1;break;case 8:this.filterForm["page"]=1,this.filterFormShow["click"]=!!this.filterForm["value"]&&Object(i["a"])({},this.filterForm["key"],this.filterForm["value"]),this.filterFormChangeSubmit();case 11:case"end":return e.stop()}}),e,this)})));function t(){return e.apply(this,arguments)}return t}(),filterFormChangeChange:function(){var e=Object(o["a"])(regeneratorRuntime.mark((function e(){var t;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:if(t=this.filterFormShow.click,t){e.next=3;break}return e.abrupt("return");case 3:this.filterFormChangeSubmit();case 4:case"end":return e.stop()}}),e,this)})));function t(){return e.apply(this,arguments)}return t}(),filterFormChangeSubmit:function(){var e=Object(o["a"])(regeneratorRuntime.mark((function e(){var t,r,a,n,i,o,s,l,c,f,m,d,p,h,b,g;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return this.tableDataShwo=!0,t=this.$loading({lock:!0,text:"拼命加载中",spinner:"el-icon-loading",background:"rgba(0, 0, 0, 0.8)"}),e.next=4,Object(u["a"])(this.filterForm);case 4:if(r=e.sent,a=r.code,n=r.data,200===+a){e.next=11;break}return this.tableData=[],t.close(),e.abrupt("return");case 11:if(i=this.filterForm,o=i.pagesize,s=i.page,l=i.value,c=i.key,f=i.plaform,m=i.channel,d=i.takeEffectTime,n){e.next=19;break}return this.$message.warning("查找".concat(c,",").concat(l,"不存在")),this.tableDataTwo=[],this.tableData=[],t.close(),t.close(),e.abrupt("return");case 19:if(p=n.res,this.tableData=p,0!==p.length){e.next=29;break}return this.$message.warning("查找".concat(c,",").concat(l,"不存在")),this.tableDataTwo=[],this.tableData=[],t.close(),e.abrupt("return");case 29:if(1===p.length){e.next=33;break}return this.tableDataTwo=[],t.close(),e.abrupt("return");case 33:h=p[0].cdkid,b={page:s,tablename:h,pagesize:o,plaform:f,channel:m,takeEffectTime:d},g={page:s,tablename:h,pagesize:o,value:l,plaform:f,channel:m,takeEffectTime:d},e.t0=!!l,e.next=e.t0===("CDKKEY"===c)?39:e.t0===("CDKID"===c)?42:45;break;case 39:return e.next=41,this.ByCdkKey(g);case 41:return e.abrupt("break",45);case 42:return e.next=44,this.ByCdkID(b);case 44:return e.abrupt("break",45);case 45:this.$refs["CDKContainer"].parentElement.scrollTo({top:0,behavior:"smooth"}),t.close();case 47:case"end":return e.stop()}}),e,this)})));function t(){return e.apply(this,arguments)}return t}(),ByCdkKey:function(){var e=Object(o["a"])(regeneratorRuntime.mark((function e(t){var r,a,n,i,o;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,Object(u["g"])(t);case 2:if(r=e.sent,r){e.next=5;break}return e.abrupt("return");case 5:if(a=r.data,n=a.res,i=a.total,o=a.only,n){e.next=10;break}return this.tableDataTwo=[],e.abrupt("return");case 10:this.total=i,this.tableDataTwo=n.map((function(e){return e["isUse"]=e["isUse"]||o?"是":"否",e["receive"]=m()(e["receive"]).format("YYYY-MM-DD HH:mm:ss"),e}));case 12:case"end":return e.stop()}}),e,this)})));function t(t){return e.apply(this,arguments)}return t}(),ByCdkID:function(){var e=Object(o["a"])(regeneratorRuntime.mark((function e(t){var r,a,n,i,o;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,Object(u["h"])(t);case 2:if(r=e.sent,a=r.data,n=a.res,i=a.total,o=a.useTotal,n){e.next=8;break}return this.tableDataTwo=[],e.abrupt("return");case 8:this.total=i,this.useTotal=o,this.tableDataTwo=n.map((function(e){return e["isUse"]=e["isUse"]?"是":"否",e["receive"]=e["receive"]?m()(e["receive"]).subtract(8,"hour").format("YYYY-MM-DD HH:mm:ss"):"",e}));case 11:case"end":return e.stop()}}),e,this)})));function t(t){return e.apply(this,arguments)}return t}(),flushTabelData:function(){var e=Object(o["a"])(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:this.tableData=[],this.tableDataTwo=[],this.total=0,this.filterForm={key:"CDKID",value:"",plaform:"",channel:"",takeEffectTime:"",failureTime:"",page:1,pagesize:100};case 4:case"end":return e.stop()}}),e,this)})));function t(){return e.apply(this,arguments)}return t}(),createCdkForm:function(){var e=Object(o["a"])(regeneratorRuntime.mark((function e(){var t,r,a;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return this.dialogFormchange=!0,e.next=3,Object(l["c"])();case 3:t=e.sent,r=t.code,a=t.data,200===r&&(this.annexOptions=a);case 7:case"end":return e.stop()}}),e,this)})));function t(){return e.apply(this,arguments)}return t}(),annexListAdd:function(){var e=this.createForm["annexList"][this.createForm["annexList"].length-1];e["annexName"]&&e["annexNumber"]?this.createForm["annexList"].push({annexName:"",annexNumber:"",id:++v}):this.$message.warning("请填写完整")},annexListCut:function(e){1!==this.createForm["annexList"].length?this.createForm["annexList"].splice(e,1):this.$message.warning("必须有一条记录。")}},mounted:function(){var e=Object(o["a"])(regeneratorRuntime.mark((function e(){var t,r,a,n,i,o,l,c,u,f;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,Object(s["b"])({code:"areaclothing",gameid:this.gameid});case 2:if(t=e.sent,r=t.data.values.map((function(e){return{label:e,value:e}})),this.selectForm[1].options=this.selectForm[1].options.concat(r),a=p({},this.$route.query),n=a.value,i=a.game_id,o=a.key,l=1,c=100,this.filterForm={pagesize:c,page:l,value:n,gameid:i,key:o},!n){e.next=12;break}return this.filterFormChangeClick(),e.abrupt("return");case 12:u=p({},this.$route.query),f=u.id,this.filterForm={pagesize:c,page:l,value:f,gameid:i,key:"CDKID"},f&&this.filterFormChangeClick();case 15:case"end":return e.stop()}}),e,this)})));function t(){return e.apply(this,arguments)}return t}()},k=y,F=(r("81d0"),r("2877")),w=Object(F["a"])(k,a,n,!1,null,null,null);t["default"]=w.exports},"5a0c":function(e,t,r){!function(t,r){e.exports=r()}(0,(function(){"use strict";var e="millisecond",t="second",r="minute",a="hour",n="day",i="week",o="month",s="quarter",l="year",c=/^(\d{4})-?(\d{1,2})-?(\d{0,2})[^0-9]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?.?(\d{1,3})?$/,u=/\[([^\]]+)]|Y{2,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g,f=function(e,t,r){var a=String(e);return!a||a.length>=t?e:""+Array(t+1-a.length).join(r)+e},m={s:f,z:function(e){var t=-e.utcOffset(),r=Math.abs(t),a=Math.floor(r/60),n=r%60;return(t<=0?"+":"-")+f(a,2,"0")+":"+f(n,2,"0")},m:function(e,t){var r=12*(t.year()-e.year())+(t.month()-e.month()),a=e.clone().add(r,o),n=t-a<0,i=e.clone().add(r+(n?-1:1),o);return Number(-(r+(t-a)/(n?a-i:i-a))||0)},a:function(e){return e<0?Math.ceil(e)||0:Math.floor(e)},p:function(c){return{M:o,y:l,w:i,d:n,D:"date",h:a,m:r,s:t,ms:e,Q:s}[c]||String(c||"").toLowerCase().replace(/s$/,"")},u:function(e){return void 0===e}},d={name:"en",weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_")},p="en",h={};h[p]=d;var b=function(e){return e instanceof k},g=function(e,t,r){var a;if(!e)return p;if("string"==typeof e)h[e]&&(a=e),t&&(h[e]=t,a=e);else{var n=e.name;h[n]=e,a=n}return!r&&a&&(p=a),a||!r&&p},v=function(e,t){if(b(e))return e.clone();var r="object"==typeof t?t:{};return r.date=e,r.args=arguments,new k(r)},y=m;y.l=g,y.i=b,y.w=function(e,t){return v(e,{locale:t.$L,utc:t.$u,$offset:t.$offset})};var k=function(){function f(e){this.$L=this.$L||g(e.locale,null,!0),this.parse(e)}var m=f.prototype;return m.parse=function(e){this.$d=function(e){var t=e.date,r=e.utc;if(null===t)return new Date(NaN);if(y.u(t))return new Date;if(t instanceof Date)return new Date(t);if("string"==typeof t&&!/Z$/i.test(t)){var a=t.match(c);if(a)return r?new Date(Date.UTC(a[1],a[2]-1,a[3]||1,a[4]||0,a[5]||0,a[6]||0,a[7]||0)):new Date(a[1],a[2]-1,a[3]||1,a[4]||0,a[5]||0,a[6]||0,a[7]||0)}return new Date(t)}(e),this.init()},m.init=function(){var e=this.$d;this.$y=e.getFullYear(),this.$M=e.getMonth(),this.$D=e.getDate(),this.$W=e.getDay(),this.$H=e.getHours(),this.$m=e.getMinutes(),this.$s=e.getSeconds(),this.$ms=e.getMilliseconds()},m.$utils=function(){return y},m.isValid=function(){return!("Invalid Date"===this.$d.toString())},m.isSame=function(e,t){var r=v(e);return this.startOf(t)<=r&&r<=this.endOf(t)},m.isAfter=function(e,t){return v(e)<this.startOf(t)},m.isBefore=function(e,t){return this.endOf(t)<v(e)},m.$g=function(e,t,r){return y.u(e)?this[t]:this.set(r,e)},m.year=function(e){return this.$g(e,"$y",l)},m.month=function(e){return this.$g(e,"$M",o)},m.day=function(e){return this.$g(e,"$W",n)},m.date=function(e){return this.$g(e,"$D","date")},m.hour=function(e){return this.$g(e,"$H",a)},m.minute=function(e){return this.$g(e,"$m",r)},m.second=function(e){return this.$g(e,"$s",t)},m.millisecond=function(t){return this.$g(t,"$ms",e)},m.unix=function(){return Math.floor(this.valueOf()/1e3)},m.valueOf=function(){return this.$d.getTime()},m.startOf=function(e,s){var c=this,u=!!y.u(s)||s,f=y.p(e),m=function(e,t){var r=y.w(c.$u?Date.UTC(c.$y,t,e):new Date(c.$y,t,e),c);return u?r:r.endOf(n)},d=function(e,t){return y.w(c.toDate()[e].apply(c.toDate("s"),(u?[0,0,0,0]:[23,59,59,999]).slice(t)),c)},p=this.$W,h=this.$M,b=this.$D,g="set"+(this.$u?"UTC":"");switch(f){case l:return u?m(1,0):m(31,11);case o:return u?m(1,h):m(0,h+1);case i:var v=this.$locale().weekStart||0,k=(p<v?p+7:p)-v;return m(u?b-k:b+(6-k),h);case n:case"date":return d(g+"Hours",0);case a:return d(g+"Minutes",1);case r:return d(g+"Seconds",2);case t:return d(g+"Milliseconds",3);default:return this.clone()}},m.endOf=function(e){return this.startOf(e,!1)},m.$set=function(i,s){var c,u=y.p(i),f="set"+(this.$u?"UTC":""),m=(c={},c[n]=f+"Date",c.date=f+"Date",c[o]=f+"Month",c[l]=f+"FullYear",c[a]=f+"Hours",c[r]=f+"Minutes",c[t]=f+"Seconds",c[e]=f+"Milliseconds",c)[u],d=u===n?this.$D+(s-this.$W):s;if(u===o||u===l){var p=this.clone().set("date",1);p.$d[m](d),p.init(),this.$d=p.set("date",Math.min(this.$D,p.daysInMonth())).toDate()}else m&&this.$d[m](d);return this.init(),this},m.set=function(e,t){return this.clone().$set(e,t)},m.get=function(e){return this[y.p(e)]()},m.add=function(e,s){var c,u=this;e=Number(e);var f=y.p(s),m=function(t){var r=v(u);return y.w(r.date(r.date()+Math.round(t*e)),u)};if(f===o)return this.set(o,this.$M+e);if(f===l)return this.set(l,this.$y+e);if(f===n)return m(1);if(f===i)return m(7);var d=(c={},c[r]=6e4,c[a]=36e5,c[t]=1e3,c)[f]||1,p=this.$d.getTime()+e*d;return y.w(p,this)},m.subtract=function(e,t){return this.add(-1*e,t)},m.format=function(e){var t=this;if(!this.isValid())return"Invalid Date";var r=e||"YYYY-MM-DDTHH:mm:ssZ",a=y.z(this),n=this.$locale(),i=this.$H,o=this.$m,s=this.$M,l=n.weekdays,c=n.months,f=function(e,a,n,i){return e&&(e[a]||e(t,r))||n[a].substr(0,i)},m=function(e){return y.s(i%12||12,e,"0")},d=n.meridiem||function(e,t,r){var a=e<12?"AM":"PM";return r?a.toLowerCase():a},p={YY:String(this.$y).slice(-2),YYYY:this.$y,M:s+1,MM:y.s(s+1,2,"0"),MMM:f(n.monthsShort,s,c,3),MMMM:f(c,s),D:this.$D,DD:y.s(this.$D,2,"0"),d:String(this.$W),dd:f(n.weekdaysMin,this.$W,l,2),ddd:f(n.weekdaysShort,this.$W,l,3),dddd:l[this.$W],H:String(i),HH:y.s(i,2,"0"),h:m(1),hh:m(2),a:d(i,o,!0),A:d(i,o,!1),m:String(o),mm:y.s(o,2,"0"),s:String(this.$s),ss:y.s(this.$s,2,"0"),SSS:y.s(this.$ms,3,"0"),Z:a};return r.replace(u,(function(e,t){return t||p[e]||a.replace(":","")}))},m.utcOffset=function(){return 15*-Math.round(this.$d.getTimezoneOffset()/15)},m.diff=function(e,c,u){var f,m=y.p(c),d=v(e),p=6e4*(d.utcOffset()-this.utcOffset()),h=this-d,b=y.m(this,d);return b=(f={},f[l]=b/12,f[o]=b,f[s]=b/3,f[i]=(h-p)/6048e5,f[n]=(h-p)/864e5,f[a]=h/36e5,f[r]=h/6e4,f[t]=h/1e3,f)[m]||h,u?b:y.a(b)},m.daysInMonth=function(){return this.endOf(o).$D},m.$locale=function(){return h[this.$L]},m.locale=function(e,t){if(!e)return this.$L;var r=this.clone(),a=g(e,t,!0);return a&&(r.$L=a),r},m.clone=function(){return y.w(this.$d,this)},m.toDate=function(){return new Date(this.valueOf())},m.toJSON=function(){return this.isValid()?this.toISOString():null},m.toISOString=function(){return this.$d.toISOString()},m.toString=function(){return this.$d.toUTCString()},f}();return v.prototype=k.prototype,v.extend=function(e,t){return e(t,k,v),v},v.locale=g,v.isDayjs=b,v.unix=function(e){return v(1e3*e)},v.en=h[p],v.Ls=h,v}))},"6bd3":function(e,t,r){},"7e82":function(e,t,r){"use strict";r.d(t,"c",(function(){return n})),r.d(t,"d",(function(){return i})),r.d(t,"e",(function(){return o})),r.d(t,"b",(function(){return s})),r.d(t,"i",(function(){return l})),r.d(t,"f",(function(){return c})),r.d(t,"a",(function(){return u})),r.d(t,"h",(function(){return f})),r.d(t,"g",(function(){return m})),r.d(t,"j",(function(){return d}));var a=r("b775");function n(e){return Object(a["a"])({url:"mail/getQueryAnnexOptions",method:"get"})}function i(e){return Object(a["a"])({url:"mail/getQueryAnnexOptionsLazy",method:"get",params:e})}function o(e){return Object(a["a"])({url:"mail/getQueryAnnexServernames",method:"get",params:e})}function s(e){return Object(a["a"])({url:"mail/getPlaformChannelToservername",method:"get",params:e})}function l(e){return Object(a["a"])({url:"mail/postMailToCreate",method:"post",data:e})}function c(e){return Object(a["a"])({url:"mail/query",method:"get",params:e})}function u(e){return Object(a["a"])({url:"mail/annexAllQuery",method:"get",params:e})}function f(e){return Object(a["a"])({url:"mail/mailSend",method:"post",data:e})}function m(e){return Object(a["a"])({url:"mail/maxID",method:"get",params:e})}function d(e){return Object(a["a"])({url:"mail/stopMailSend",method:"get",params:e})}},"81d0":function(e,t,r){"use strict";var a=r("6bd3"),n=r.n(a);n.a}}]);