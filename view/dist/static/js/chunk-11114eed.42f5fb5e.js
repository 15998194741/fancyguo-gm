(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-11114eed"],{"43e3":function(e,t,r){"use strict";var n=r("b808"),a=r.n(n);a.a},"70c9":function(e,t,r){"use strict";r.r(t);var n=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{staticClass:"client-container"},[r("div",{staticClass:"role-container-header"},[r("ul",{staticStyle:{margin:"5px 10px -5px 10px"}},[r("li",[r("el-button",{staticClass:"button-with-header",attrs:{slot:"reference",icon:"el-icon-refresh",size:"small"},slot:"reference"},[e._v("刷新")])],1),e._v(" "),r("li",[e.grade?r("el-button",{staticClass:"button-with-header",attrs:{slot:"append",icon:"el-icon-circle-plus-outline",size:"small"},on:{click:e.createFormAlert},slot:"append"},[e._v("添加版本")]):e._e()],1),e._v(" "),r("li",[e.grade?r("el-button",{staticClass:"button-with-header",attrs:{slot:"append",icon:"el-icon-edit",size:"small"},on:{click:e.changeFormAlert},slot:"append"},[e._v("修改")]):e._e()],1)])]),e._v(" "),r("div",{staticClass:"role-container-search"},[r("div",{staticClass:"server-container"},[r("span",[e._v("版本号：")]),e._v(" "),r("el-input",{staticClass:"input-with-select",attrs:{placeholder:"请输入版本号",size:"small"},model:{value:e.filterForm["value"],callback:function(t){e.$set(e.filterForm,"value",t)},expression:"filterForm['value']"}}),e._v(" "),r("el-button",{staticClass:"button-with-select",attrs:{slot:"append",icon:"el-icon-search",size:"small",name:"truesearch"},on:{click:function(t){return e.filterFormChange("click")}},slot:"append"})],1),e._v(" "),r("div",{staticClass:"comprehensive-container"},e._l(e.selectForm,(function(t,n){return r("div",{key:n,staticClass:"select-item"},[e._v(" "+e._s(t.label)+":\n          "),r("el-select",{staticStyle:{"border-radius":"10px"},attrs:{multiple:t["multiple"],placeholder:"请选择",clearable:"","collapse-tags":t["collapse"],filterable:t.filterable,size:"small"},on:{change:function(t){return e.filterFormChange("change")}},model:{value:e.filterForm[t.key],callback:function(r){e.$set(e.filterForm,t.key,r)},expression:"filterForm[i.key]"}},e._l(t.options,(function(e,t){return r("el-option",{key:t,attrs:{label:e.label,value:e.value}})})),1)],1)})),0)]),e._v(" "),r("div",{staticClass:"role-container-body",attrs:{id:"body"}},[r("el-table",{ref:"multipleTable",attrs:{border:"",data:e.tableData},on:{"selection-change":e.handleSelectionChange}},[r("el-table-column",{attrs:{type:"selection",width:"40"}}),e._v(" "),e._l(e.tablecolumn,(function(t,n){return r("el-table-column",{key:n,attrs:{label:t.label},scopedSlots:e._u([{key:"default",fn:function(n){return["string"===typeof n.row[t.prop]||"number"===typeof n.row[t.prop]?r("div",[e._v("\n        "+e._s(n.row[t.prop])+"\n        ")]):r("div",e._l(n.row[t.prop],(function(t,n){return r("el-tag",{key:n},[e._v(e._s(t))])})),1)]}}],null,!0)})})),e._v(" "),e.grade?r("el-table-column",{attrs:{label:"停用"},scopedSlots:e._u([{key:"default",fn:function(t){return[r("el-button",{attrs:{type:"danger",plain:""},on:{click:function(r){return e.clientStop(t)}}},[e._v("停用")])]}}],null,!1,1032068138)}):e._e()],2)],1),e._v(" "),r("div",{staticClass:"role-container-bottom"},[r("el-pagination",{staticStyle:{"text-align":"right"},attrs:{"page-size":e.filterForm["pagesize"],"page-sizes":[10,20,30,40],background:"",layout:"total, sizes, prev, pager, next, jumper","pager-count":9,"hide-on-single-page":!1,total:e.total,"current-page":e.filterForm.page},on:{"update:pageSize":function(t){return e.$set(e.filterForm,"pagesize",t)},"update:page-size":function(t){return e.$set(e.filterForm,"pagesize",t)},"update:currentPage":function(t){return e.$set(e.filterForm,"page",t)},"update:current-page":function(t){return e.$set(e.filterForm,"page",t)},"size-change":function(t){return e.filterFormChange("pagechange")},"current-change":function(t){return e.filterFormChange("pagechange")}}})],1),e._v(" "),r("el-dialog",{attrs:{title:"新建版本",visible:e.centerDialogVisible,width:"20%","close-on-click-modal":!1},on:{"update:visible":function(t){e.centerDialogVisible=t}}},[r("el-form",{ref:"ruleForm",staticClass:"client-ruleForm",attrs:{"label-position":"left",model:e.createForm,"status-icon":"",rules:e.rules,"label-width":"60px",width:"30%"}},[r("el-form-item",{attrs:{label:"版本号",prop:"versionId"}},[r("el-input",{attrs:{size:"small",autocomplete:"off"},model:{value:e.createForm.versionId,callback:function(t){e.$set(e.createForm,"versionId",t)},expression:"createForm.versionId"}})],1),e._v(" "),r("el-form-item",{attrs:{label:"平台",prop:"plaform"}},[r("el-select",{staticStyle:{"border-radius":"10px"},attrs:{placeholder:"请选择",multiple:"",size:"small"},model:{value:e.createForm.plaform,callback:function(t){e.$set(e.createForm,"plaform",t)},expression:"createForm.plaform"}},[r("el-option",{attrs:{label:"安卓",value:"1"}}),e._v(" "),r("el-option",{attrs:{label:"苹果",value:"2"}})],1)],1),e._v(" "),r("el-form-item",{attrs:{label:"渠道",prop:"channel"}},[r("el-select",{staticClass:"create-form-select",staticStyle:{"border-radius":"10px"},attrs:{multiple:"",placeholder:"请选择",size:"small"},model:{value:e.createForm["channel"],callback:function(t){e.$set(e.createForm,"channel",t)},expression:"createForm['channel']"}},e._l(e.channelComponents,(function(e,t){return r("el-option",{key:t,attrs:{label:e.label,value:e.value}})})),1)],1),e._v(" "),r("el-form-item",{attrs:{label:"显示",prop:"showType"}},[r("el-checkbox-group",{model:{value:e.createForm["showType"],callback:function(t){e.$set(e.createForm,"showType",t)},expression:"createForm['showType']"}},[r("el-checkbox",{attrs:{label:"测试"}}),e._v(" "),r("el-checkbox",{attrs:{label:"正式"}})],1)],1)],1),e._v(" "),r("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[r("el-button",{on:{click:e.whiteCreateCancel}},[e._v("取 消")]),e._v(" "),r("el-button",{attrs:{type:"primary"},on:{click:e.whiteCreateSubmit}},[e._v("确 定")])],1)],1),e._v(" "),r("el-dialog",{attrs:{title:"版本批量修改",visible:e.ChangeDialogVisible,width:"20%","close-on-click-modal":!1},on:{"update:visible":function(t){e.ChangeDialogVisible=t}}},[r("el-form",{ref:"ruleForms",staticClass:"client-ruleForm",attrs:{"label-position":"left",model:e.changeForm,"status-icon":"",rules:e.changeFormrules,"label-width":"60px",width:"30%"}},[r("el-form-item",{attrs:{label:"版本号"}},e._l(e.tableTrue,(function(t){return r("el-tag",{key:t["id"]},[e._v(" "+e._s(t["version_id"]))])})),1),e._v(" "),r("el-form-item",{attrs:{label:"显示",prop:"showType"}},[r("el-checkbox-group",{model:{value:e.changeForm["showType"],callback:function(t){e.$set(e.changeForm,"showType",t)},expression:"changeForm['showType']"}},[r("el-checkbox",{attrs:{label:"测试"}}),e._v(" "),r("el-checkbox",{attrs:{label:"正式"}})],1)],1)],1),e._v(" "),r("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[r("el-button",{on:{click:e.whiteChangeCancel}},[e._v("取 消")]),e._v(" "),r("el-button",{attrs:{type:"primary"},on:{click:e.whiteChangeSubmit}},[e._v("确 定")])],1)],1)],1)},a=[],i=(r("ac6a"),r("96cf"),r("1da1")),l=r("74eb"),o=r("b775");function s(e){return Object(o["a"])({url:"client/create",method:"post",data:e})}function c(e){return Object(o["a"])({url:"client/find",method:"get",params:e})}function u(e){return Object(o["a"])({url:"client/channelfind",method:"get",params:e})}function p(e){return Object(o["a"])({url:"client/versionidall",method:"get",params:e})}function h(e){return Object(o["a"])({url:"client/stopClient",method:"delete",params:e,data:e})}function m(e){return Object(o["a"])({url:"client/changeClient",method:"put",data:e})}var f={name:"client",data:function(){var e=function(){var e=Object(i["a"])(regeneratorRuntime.mark((function e(t,r,n){var a,i,l;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:if(r){e.next=2;break}return e.abrupt("return",n(new Error("不可以为空")));case 2:return e.next=4,p();case 4:if(a=e.sent,i=a.data,l=i.versionid,!(l.indexOf(r)>=0)){e.next=9;break}return e.abrupt("return",n(new Error("版本号不可以重复")));case 9:return e.abrupt("return",n());case 10:case"end":return e.stop()}}),e)})));return function(t,r,n){return e.apply(this,arguments)}}(),t=function(e,t,r){return t&&"[]"!==JSON.stringify(t)?r():r(new Error("请选择一个显示方式"))},r=function(e,t,r){return t&&"[]"!==JSON.stringify(t)?r():r(new Error("请选择一个客户端"))},n=function(e,t,r){return t?r():r(new Error("请选择一个平台"))};return{centerDialogVisible:!1,ChangeDialogVisible:!1,total:0,versionid:"",changeForm:{showType:[]},createForm:{versionId:"",plaform:"",channel:"",showType:[]},rules:{versionId:{validator:e,trigger:["blur","change"]},plaform:{validator:n,trigger:["blur","change"]},channel:{validator:r,trigger:["blur","change"]},showType:{validator:t,trigger:["blur","change"]}},changeFormrules:{showType:{validator:t,trigger:["blur","change"]}},channelComponents:[],filterForm:{value:"",plaform:"",channel:"",isShowType:"",page:1,pagesize:10},selectForm:[{label:"游戏平台",multiple:!0,filterable:!0,collapse:!1,key:"plaform",value:"",options:[{label:"安卓",value:"1"},{label:"苹果",value:"2"}]},{label:"游戏渠道",key:"channel",filterable:!0,collapse:!0,multiple:!0,value:"",options:[]},{label:"展示区服",key:"isShowType",filterable:!1,collapse:!1,multiple:!0,value:"",options:[{label:"测试",value:"测试"},{label:"正式",value:"正式"}]}],tableData:[],tablecolumn:[{label:"版本号",prop:"version_id",width:50},{label:"游戏平台",prop:"plaforms",width:50},{label:"游戏渠道",prop:"channel",width:25},{label:"展示区服",prop:"is_show_type",width:-50}],tableTrue:[]}},computed:{grade:function(){return 0!==+this.$route.meta.grade&&(console.log(+this.$route.meta.grade),!0)}},methods:{handleSelectionChange:function(){var e=Object(i["a"])(regeneratorRuntime.mark((function e(t){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:this.tableTrue=t;case 1:case"end":return e.stop()}}),e,this)})));function t(t){return e.apply(this,arguments)}return t}(),changeFormAlert:function(){var e=Object(i["a"])(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:if(0!==this.tableTrue.length){e.next=3;break}return this.$message.info("兄弟，你先选择一个"),e.abrupt("return");case 3:this.ChangeDialogVisible=!0;case 4:case"end":return e.stop()}}),e,this)})));function t(){return e.apply(this,arguments)}return t}(),whiteCreateSubmit:function(){var e=Object(i["a"])(regeneratorRuntime.mark((function e(){var t,r,n,a,i,l,o;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,this.$confirm("是否确认创建此版本?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).catch((function(e){return!1}));case 2:if(t=e.sent,t){e.next=5;break}return e.abrupt("return");case 5:return r=this.$loading({lock:!0,text:"拼命加载中",spinner:"el-icon-loading",background:"rgba(0, 0, 0, 0.8)"}),e.next=8,this.$refs["ruleForm"].validate().catch((function(e){return!1}));case 8:if(n=e.sent,n){e.next=12;break}return r.close(),e.abrupt("return");case 12:return e.next=14,s(this.createForm);case 14:if(a=e.sent,i=a.code,200===+i){e.next=19;break}return r.close(),e.abrupt("return");case 19:return this.centerDialogVisible=!1,this.$message.success("创建成功"),e.next=23,u();case 23:l=e.sent,o=l.data,this.selectForm[1].options=o,r.close(),this.whiteCreateCancel();case 28:case"end":return e.stop()}}),e,this)})));function t(){return e.apply(this,arguments)}return t}(),whiteChangeSubmit:function(){var e=Object(i["a"])(regeneratorRuntime.mark((function e(){var t,r,n,a,i;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,this.$confirm("是否确认修改此版本?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).catch((function(e){return!1}));case 2:if(t=e.sent,t){e.next=5;break}return e.abrupt("return");case 5:return r=this.$loading({lock:!0,text:"拼命加载中",spinner:"el-icon-loading",background:"rgba(0, 0, 0, 0.8)"}),e.next=8,this.$refs["ruleForms"].validate().catch((function(e){return!1}));case 8:if(n=e.sent,n){e.next=12;break}return r.close(),e.abrupt("return");case 12:return console.log(this.changeForm["showType"]),console.log(this.tableTrue),e.next=16,m({type:this.changeForm["showType"],id:this.tableTrue.map((function(e){return e["id"]}))});case 16:if(a=e.sent,i=a.code,200===+i){e.next=21;break}return r.close(),e.abrupt("return");case 21:this.$message.success("修改成功"),this.filterFormChange(),r.close(),this.whiteChangeCancel();case 25:case"end":return e.stop()}}),e,this)})));function t(){return e.apply(this,arguments)}return t}(),createFormAlert:function(){var e=Object(i["a"])(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:this.centerDialogVisible=!0;case 1:case"end":return e.stop()}}),e,this)})));function t(){return e.apply(this,arguments)}return t}(),clientStop:function(){var e=Object(i["a"])(regeneratorRuntime.mark((function e(t){var r,n,a,i,l;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,this.$confirm("是否确认停用此版本?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).catch((function(e){return!1}));case 2:if(r=e.sent,r){e.next=5;break}return e.abrupt("return");case 5:return n=t["row"],a=n.id,e.next=9,h({id:a});case 9:if(i=e.sent,l=i.code,200===+l){e.next=13;break}return e.abrupt("return");case 13:this.$message.success("停用成功"),this.filterFormChange();case 15:case"end":return e.stop()}}),e,this)})));function t(t){return e.apply(this,arguments)}return t}(),whiteCreateCancel:function(){var e=Object(i["a"])(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:this.centerDialogVisible=!1,this.createForm=this.$options.data().createForm,this.$refs["ruleForm"].resetFields();case 3:case"end":return e.stop()}}),e,this)})));function t(){return e.apply(this,arguments)}return t}(),whiteChangeCancel:function(){var e=Object(i["a"])(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:this.ChangeDialogVisible=!1,this.$refs["ruleForms"].resetFields();case 2:case"end":return e.stop()}}),e,this)})));function t(){return e.apply(this,arguments)}return t}(),filterFormChange:function(){var e=Object(i["a"])(regeneratorRuntime.mark((function e(t){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:e.t0=t,e.next="click"===e.t0?3:"change"===e.t0?5:"pagechange"===e.t0?7:9;break;case 3:return this.whiteFilterFormClick(),e.abrupt("break",10);case 5:return this.whiteFilterFormChange(),e.abrupt("break",10);case 7:return this.whiteFilterFormpageChange(),e.abrupt("break",10);case 9:this.whiteFilterFormflush();case 10:case"end":return e.stop()}}),e,this)})));function t(t){return e.apply(this,arguments)}return t}(),whiteFilterFormflush:function(){var e=Object(i["a"])(regeneratorRuntime.mark((function e(){var t;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:e.t0=regeneratorRuntime.keys(this.filterForm);case 1:if((e.t1=e.t0()).done){e.next=8;break}if(t=e.t1.value,"pagesize"!==t){e.next=5;break}return e.abrupt("continue",1);case 5:this.filterForm[t]="",e.next=1;break;case 8:this.whiteFilterFormClick();case 9:case"end":return e.stop()}}),e,this)})));function t(){return e.apply(this,arguments)}return t}(),whiteFilterFormClick:function(){var e=Object(i["a"])(regeneratorRuntime.mark((function e(){var t;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:e.t0=regeneratorRuntime.keys(this.filterForm);case 1:if((e.t1=e.t0()).done){e.next=8;break}if(t=e.t1.value,"value"!==t&&"key"!==t&&"pagesize"!==t){e.next=5;break}return e.abrupt("continue",1);case 5:this.filterForm[t]="",e.next=1;break;case 8:this.filterForm["page"]=1,this.whiteFilterFormSumbit();case 10:case"end":return e.stop()}}),e,this)})));function t(){return e.apply(this,arguments)}return t}(),whiteFilterFormChange:function(){var e=Object(i["a"])(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:this.filterForm["value"]=null,this.filterForm["page"]=1,this.whiteFilterFormSumbit();case 3:case"end":return e.stop()}}),e,this)})));function t(){return e.apply(this,arguments)}return t}(),whiteFilterFormpageChange:function(){var e=Object(i["a"])(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:this.whiteFilterFormSumbit();case 1:case"end":return e.stop()}}),e,this)})));function t(){return e.apply(this,arguments)}return t}(),whiteFilterFormSumbit:function(){var e=Object(i["a"])(regeneratorRuntime.mark((function e(){var t,r,n;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,c(this.filterForm);case 2:if(t=e.sent,r=t.code,n=t.data,200===+r){e.next=8;break}return this.tableData=[],e.abrupt("return");case 8:this.tableData=n,this.total=0===n.length?0:+n[0]["total"];case 10:case"end":return e.stop()}}),e,this)})));function t(){return e.apply(this,arguments)}return t}()},mounted:function(){var e=Object(i["a"])(regeneratorRuntime.mark((function e(){var t,r,n,a;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,Object(l["b"])({code:"areaclothing"});case 2:return t=e.sent,r=t.data,this.channelComponents=r["values"].map((function(e){return{value:e,label:e}})),e.next=7,u();case 7:n=e.sent,a=n.data,this.selectForm[1].options=a;case 10:case"end":return e.stop()}}),e,this)})));function t(){return e.apply(this,arguments)}return t}()},b=f,g=(r("43e3"),r("2877")),d=Object(g["a"])(b,n,a,!1,null,null,null);t["default"]=d.exports},b808:function(e,t,r){}}]);