(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-00e530a9"],{7364:function(e,t,r){"use strict";r.d(t,"g",(function(){return a})),r.d(t,"b",(function(){return i})),r.d(t,"d",(function(){return c})),r.d(t,"c",(function(){return o})),r.d(t,"f",(function(){return l})),r.d(t,"e",(function(){return u})),r.d(t,"i",(function(){return s})),r.d(t,"h",(function(){return p})),r.d(t,"a",(function(){return f}));var n=r("b775");function a(e){return Object(n["a"])({url:"character/query",method:"get",params:e})}function i(e){return Object(n["a"])({url:"character/BannedAskCancel",method:"put",data:e})}function c(){return Object(n["a"])({url:"character/findServername",method:"get"})}function o(){return Object(n["a"])({url:"character/findServerid",method:"get"})}function l(e){return Object(n["a"])({url:"character/prohibitedMute",method:"put",data:e})}function u(e){return Object(n["a"])({url:"character/outputConsume",method:"get",params:e})}function s(e){return Object(n["a"])({url:"character/uploadFile",method:"post",data:e,form:e})}function p(e){return Object(n["a"])({url:"backpack/queryServer",method:"get",params:e})}function f(e){return Object(n["a"])({url:"backpack/BackPackRecycle",method:"post",data:e})}},c82a:function(e,t,r){"use strict";r.d(t,"b",(function(){return a})),r.d(t,"a",(function(){return i})),r.d(t,"c",(function(){return c}));r("96cf");var n=r("1da1");function a(e){e.$loading({lock:!0,text:"拼命加载中",spinner:"el-icon-loading",background:"rgba(0, 0, 0, 0.8)"})}function i(e){e.$loading().close()}function c(e,t){return o.apply(this,arguments)}function o(){return o=Object(n["a"])(regeneratorRuntime.mark((function e(t,r){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,t.$confirm(r,"提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).catch((function(e){return!1}));case 2:return e.abrupt("return",e.sent);case 3:case"end":return e.stop()}}),e)}))),o.apply(this,arguments)}},c967:function(e,t,r){"use strict";r.r(t);var n=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{ref:"rechaContainer",staticClass:"recha-container"},[r("div",{staticClass:"role-container-header"},[r("ul",{staticStyle:{margin:"5px 10px","margin-bottom":"-5px"}},[r("li",[r("el-button",{staticClass:"button-with-header",attrs:{slot:"reference",icon:"el-icon-refresh-right",size:"small"},on:{click:function(t){return e.filterFormChange("flush")}},slot:"reference"},[e._v("刷新")])],1),e._v(" "),r("li",[e.grade?r("el-button",{staticClass:"button-with-header",attrs:{slot:"append",icon:"el-icon-thumb",size:"small",disabled:e.Replenishment},on:{click:e.Replenishmentclick},slot:"append"},[e._v("补单")]):e._e()],1)])]),e._v(" "),r("div",{staticClass:"role-container-search"},[r("div",{staticClass:"server-container"},[r("span",[e._v("角色ID：")]),e._v(" "),r("el-input",{staticClass:"input-with-select",attrs:{placeholder:"请输入角色ID",size:"small"},model:{value:e.filterForm.roleid,callback:function(t){e.$set(e.filterForm,"roleid",t)},expression:"filterForm.roleid"}}),e._v(" "),r("el-button",{staticClass:"button-with-select",attrs:{slot:"append",icon:"el-icon-search",size:"small",name:"truesearch"},on:{click:function(t){return e.filterFormChange("click")}},slot:"append"})],1),e._v(" "),r("div",{staticClass:"comprehensive-container"},[e._l(e.selectForm,(function(t,n){return r("div",{key:n,staticClass:"select-item"},[e._v(" "+e._s(t.label)+":\n      "),r("el-select",{staticStyle:{"border-radius":"10px"},attrs:{multiple:t["multiple"],clearable:"",placeholder:"请选择",size:"small"},on:{change:function(t){return e.filterFormChange("change")}},model:{value:e.filterForm[t.key],callback:function(r){e.$set(e.filterForm,t.key,r)},expression:"filterForm[i.key]"}},e._l(t.options,(function(e,t){return r("el-option",{key:t,attrs:{label:e.label,value:e.value}})})),1)],1)})),e._v("\n   下单时间：\n    "),r("el-date-picker",{attrs:{size:"small",type:"datetimerange","range-separator":"至","start-placeholder":"开始日期","end-placeholder":"结束日期"},on:{change:function(t){return e.filterFormChange("change")}},model:{value:e.filterForm["srttime"],callback:function(t){e.$set(e.filterForm,"srttime",t)},expression:"filterForm['srttime']"}})],2)]),e._v(" "),r("div",{staticClass:"role-container-body",attrs:{id:"body"}},[r("el-table",{ref:"multipleTable",attrs:{border:"",data:e.tableData,"row-class-name":e.tableRowClassName},on:{"selection-change":e.handleSelectionChange}},[r("el-table-column",{attrs:{"cell-class-name":e.selectionClassName,type:"selection",width:"40"}}),e._v(" "),e._l(e.tablecolumn,(function(t,n){return r("el-table-column",{key:n,attrs:{label:t.label},scopedSlots:e._u([{key:"default",fn:function(r){return[e._v(e._s(r.row[t.prop]))]}}],null,!0)})}))],2)],1),e._v(" "),r("div",{staticClass:"role-container-bottom"},[r("el-pagination",{staticStyle:{"text-align":"right"},attrs:{"page-size":e.filterForm["pagesize"],"page-sizes":[20,40,60,80],background:"",layout:"total, sizes, prev, pager, next, jumper","pager-count":9,"hide-on-single-page":!1,total:e.total,"current-page":e.filterForm.page},on:{"update:pageSize":function(t){return e.$set(e.filterForm,"pagesize",t)},"update:page-size":function(t){return e.$set(e.filterForm,"pagesize",t)},"update:currentPage":function(t){return e.$set(e.filterForm,"page",t)},"update:current-page":function(t){return e.$set(e.filterForm,"page",t)},"size-change":function(t){return e.filterFormChange("change")},"current-change":function(t){return e.filterFormChange("change")}}})],1)])},a=[],i=(r("7514"),r("ac6a"),r("96cf"),r("1da1")),c=r("74eb"),o=r("7364"),l=r("b775");function u(e){return Object(l["a"])({url:"recharge/query",method:"get",params:e})}function s(e){return Object(l["a"])({url:"recharge/replenishment",method:"post",data:e})}var p=r("c82a"),f={name:"rechargedetails",data:function(){return{total:0,filterForm:{roleid:"",stime:"",plaform:"",channel:"",servername:"",page:1,pagesize:20},selectForm:[{label:"游戏平台",multiple:!1,key:"plaform",value:"",options:[{label:"不限制",value:""},{label:"安卓",value:"1"},{label:"苹果",value:"2"}]},{label:"游戏渠道",key:"channel",multiple:!1,value:"",options:[]},{label:"区服名称",key:"servername",multiple:!1,value:"",options:[{label:"不限制",value:""}]}],tableData:[],tablecolumn:[{label:"角色ID",prop:"roleId"},{label:"账户ID",prop:"uid"},{label:"昵称",prop:"roleName"},{label:"平台",prop:"type"},{label:"渠道",prop:"channel"},{label:"设备ID",prop:"deviceid"},{label:"设备类型",prop:"platform"},{label:"区服ID",prop:"serverId"},{label:"充值金额",prop:"price"},{label:"商品ID",prop:"pid"},{label:"订单状态",prop:"status"},{label:"订单号",prop:"tid"},{label:"下单时间",prop:"createdAt"},{label:"到账时间",prop:"updatedAt"}],tableTrue:[]}},computed:{Replenishment:function(){return!(this.tableTrue.length>0)},grade:function(){return 0!==+this.$route.meta.grade}},methods:{tableRowClassName:function(e){var t=e.row;e.rowIndex;if("发货失败"!==t.status)return"success-row"},selectionClassName:function(e){var t=e.row;if(console.log("单元格级"),t.status)return"send-success"},Replenishmentclick:function(){var e=Object(i["a"])(regeneratorRuntime.mark((function e(){var t,r,n,a;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,Object(p["c"])(this,"您正在修改数据，请谨慎处理！是否继续?");case 2:if(t=e.sent,t){e.next=5;break}return e.abrupt("return");case 5:return Object(p["b"])(this),e.next=8,s({value:this.tableTrue});case 8:if(r=e.sent,Object(p["a"])(this),200===r.code){e.next=12;break}return e.abrupt("return");case 12:n=r.data,a=n["100"].concat(n["200"]),a.length>0&&this.$message.success("补单成功的单号有, ".concat(a.map((function(e){return e.tid+","})))),n["300"].length>0&&this.$message.warning("补单失败得订单号有，".concat(n[300].map((function(e){return e.tid+","})))),this.filterFormChangeChange();case 17:case"end":return e.stop()}}),e,this)})));function t(){return e.apply(this,arguments)}return t}(),filterFormChange:function(){var e=Object(i["a"])(regeneratorRuntime.mark((function e(t){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:e.t0=t,e.next="click"===e.t0?3:"change"===e.t0?5:"flush"===e.t0?7:"page"===e.t0?9:11;break;case 3:return this.filterFormChangeClick(),e.abrupt("break",11);case 5:return this.filterFormChangeChange(),e.abrupt("break",11);case 7:return this.filterFormChangeFlush(),e.abrupt("break",11);case 9:return this.filterFormChangepage(),e.abrupt("break",11);case 11:case"end":return e.stop()}}),e,this)})));function t(t){return e.apply(this,arguments)}return t}(),filterFormChangeClick:function(){var e=Object(i["a"])(regeneratorRuntime.mark((function e(){var t;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:e.t0=regeneratorRuntime.keys(this.filterForm);case 1:if((e.t1=e.t0()).done){e.next=8;break}if(t=e.t1.value,!(["roleid","page","pagesize"].indexOf(t)>=0)){e.next=5;break}return e.abrupt("continue",1);case 5:this.filterForm[t]="",e.next=1;break;case 8:this.rechargeDetails();case 9:case"end":return e.stop()}}),e,this)})));function t(){return e.apply(this,arguments)}return t}(),filterFormChangeChange:function(){var e=Object(i["a"])(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:this.rechargeDetails();case 1:case"end":return e.stop()}}),e,this)})));function t(){return e.apply(this,arguments)}return t}(),filterFormChangeFlush:function(){var e=Object(i["a"])(regeneratorRuntime.mark((function e(){var t;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:e.t0=regeneratorRuntime.keys(this.filterForm);case 1:if((e.t1=e.t0()).done){e.next=8;break}if(t=e.t1.value,!(["page","pagesize"].indexOf(t)>=0)){e.next=5;break}return e.abrupt("continue",1);case 5:this.filterForm[t]="",e.next=1;break;case 8:this.tableData=[];case 9:case"end":return e.stop()}}),e,this)})));function t(){return e.apply(this,arguments)}return t}(),filterFormChangepage:function(){var e=Object(i["a"])(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:this.rechargeDetails();case 1:case"end":return e.stop()}}),e,this)})));function t(){return e.apply(this,arguments)}return t}(),rechargeDetails:function(){var e=Object(i["a"])(regeneratorRuntime.mark((function e(){var t;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,u(this.filterForm);case 2:t=e.sent,this.tableData=t.data.res,this.total=t.data.total,this.tableData=t.data.res.filter((function(e){return"发货失败"===e.status})).concat(t.data.res.filter((function(e){return"发货失败"!==e.status}))),this.$refs["rechaContainer"].parentElement.scrollTo({top:0,behavior:"smooth"});case 7:case"end":return e.stop()}}),e,this)})));function t(){return e.apply(this,arguments)}return t}(),handleSelectionChange:function(e){this.tableTrue=e.filter((function(e){return"发货失败"===e.status}))}},mounted:function(){var e=Object(i["a"])(regeneratorRuntime.mark((function e(){var t,r,n=this;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return Object(c["d"])({code:"areaclothing",gameid:this.gameid}).then((function(e){var t=e.data.values.map((function(e){return{label:e,value:e}}));n.selectForm[1].options=n.selectForm[1].options.concat(t),n.clientOptions=t})),e.next=3,Object(o["d"])();case 3:t=e.sent,r=t.data,r.map((function(e){n.selectForm[2].options.find((function(t){return t.label===e.label}))||!e.label||n.selectForm[2].options.push(e)})),this.filterFormChange("click");case 7:case"end":return e.stop()}}),e,this)})));function t(){return e.apply(this,arguments)}return t}()},h=f,m=(r("f311"),r("2877")),d=Object(m["a"])(h,n,a,!1,null,null,null);t["default"]=d.exports},e229:function(e,t,r){},f311:function(e,t,r){"use strict";var n=r("e229"),a=r.n(n);a.a}}]);