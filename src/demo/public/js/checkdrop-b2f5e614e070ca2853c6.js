webpackJsonp([12],{"0iPh":function(e,t){e.exports=window.jQuery},"2WEq":function(e,t){},DcMY:function(e,t,n){"use strict";var c=a(n("0iPh")),i=function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n]);return t.default=e,t}(n("6QEj")),s=n("dsm9");n("2WEq");var o=a(n("WU09")),r=a(n("gntN"));function a(e){return e&&e.__esModule?e:{default:e}}(new function e(){var t=this;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.init=function(){},this._bindEvent=function(){var e=t;t.outer.on("click",".btn-test1",function(){e.checkDrop2.renderList(new Array(20).fill(1).map(function(e,t){return{name:"选项"+t,id:t}})),(0,r.default)({type:"success",msg:"设置选项成功"})}).on("click",".btn-test2",function(){e.checkDrop2.renderList([]),(0,r.default)({type:"success",msg:"清空选项成功"})})},this._init=function(){t.checkDrop=new o.default({obj:(0,c.default)("#test1"),renderLi:function(e){return e.name},list:new Array(20).fill(1).map(function(e,t){return{name:"选项"+t,id:t}}),onSelectChange:function(e){(0,r.default)({type:"info",msg:"当前选中下标："+e.join(",")})}}),t.checkDrop2=new o.default({obj:(0,c.default)("#test2"),renderLi:function(e){return e.name},onSelectChange:function(e){(0,r.default)({type:"info",msg:"当前选中下标："+e.join(",")})}}),i.initCode(t.outer),i.createDetailTable({outer:t.outer,propsList:s.propsList,apiList:s.apiList}),t._bindEvent()},this.outer=(0,c.default)("#checkdropPageOuter"),this._init()}).init()},"Q0Q/":function(e,t){},WU09:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),n("Q0Q/");var c,i=n("0iPh"),s=(c=i)&&c.__esModule?c:{default:c};var o=function(){var e=this;this._renderHtml=function(){e.obj.html('<div class="ys-check-drop-c">\n<div class="ys-check-drop-btn"><span class="ys-check-drop-value">'+e.placeholder+'</span><i class="fa fa-caret-down"></i></div>\n<div class="ys-check-drop-list-o">\n<div class="ys-check-drop-list-c"></div>\n<div class="ys-check-drop-cbtn">确认选择</div>\n</div>\n</div>'),e.outer=e.obj.find(".ys-check-drop-c"),e.drop=e.outer.find(".ys-check-drop-list-o"),e.valueC=e.outer.find(".ys-check-drop-value"),e.renderList()},this.renderList=function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:e.list;e.list=t,e.drop.find(".ys-check-drop-list-c").html(['<div class="ys-check-drop-i '+(e.checkIds.length?"":"checked")+'" data-index="-1">不限</div>'].concat(function(e){if(Array.isArray(e)){for(var t=0,n=Array(e.length);t<e.length;t++)n[t]=e[t];return n}return Array.from(e)}(t.map(function(t,n){return'<div class="ys-check-drop-i '+(e.checkIds.indexOf(n)>-1?"checked":"")+'" data-index="'+n+'">'+e.renderLi(t,n)+"</div>"})))),e.checkItems=e.drop.find(".ys-check-drop-i"),e.checkDic=e.list.map(function(t,n){return e.checkIds.indexOf(n)>-1})},this.reset=function(){[].forEach.call(e.checkItems,function(t,n){e.checkItems.eq(n).removeClass("checked"),e.checkDic[n]=!1}),e.checkItems.eq(0).addClass("checked"),e.valueC.text(e.placeholder).removeClass("has-value")},this.toggleDrop=function(t){if("open"===t){if(e.isOpen)return;e.outer.addClass("ys-open")}else if("close"===t){if(!e.isOpen)return;e.outer.removeClass("ys-open")}else e.outer.toggleClass("ys-open");e.isOpen=!e.isOpen,e.outer.hasClass("ys-open")?e._openDrop():e._closeDrop()},this._openDrop=function(){e.drop.addClass("open-start"),setTimeout(function(){e.drop.addClass("opening"),setTimeout(function(){e.drop.removeClass("open-start").addClass("open-end")},0)},0)},this._closeDrop=function(){e.drop.removeClass("open-end").addClass("open-start"),setTimeout(function(){e.drop.removeClass("opening"),setTimeout(function(){e.drop.removeClass("open-start")},0)},100)},this.getChecked=function(){var t=e.list.reduce(function(t,n,c){return e.checkDic[c]&&t.push(c),t},[]);return e.valueC.text(t.length?e.renderLi(e.list[t[0]],t[0])+"等":e.placeholder).toggleClass("has-value",t.length>0),t},this._bindEvent=function(){var t=e;e.outer.on("click",".ys-check-drop-btn",function(){t.toggleDrop()}).on("click",".ys-check-drop-i",function(){var e=(0,s.default)(this).data("index");-1===e?([].forEach.call(t.checkItems,function(e,n){t.checkItems.eq(n).removeClass("checked"),t.checkDic[n]=!1}),t.checkItems.eq(0).addClass("checked")):(t.checkItems.eq(e+1).toggleClass("checked"),t.checkDic[e]=t.checkItems.eq(e+1).hasClass("checked"),t.checkItems.eq(0).toggleClass("checked",!t.checkDic.some(function(e){return e})))}).on("click",".ys-check-drop-cbtn",function(){t.onSelectChange(t.getChecked()),t.toggleDrop("close")}),(0,s.default)(document).on("mousedown",function(e){0===(0,s.default)(e.target).closest(".ys-open").length&&t.isOpen&&(t.onSelectChange(t.getChecked()),t.toggleDrop("close"))})},this._init=function(){e._renderHtml(),e._bindEvent()}};t.default=function e(t){var n=this,c=t.obj,i=t.renderLi,r=void 0===i?function(e){return e}:i,a=t.list,d=void 0===a?[]:a,l=t.placeholder,u=void 0===l?"不限":l,h=t.checkIds,p=void 0===h?"":h,f=t.onSelectChange,k=void 0===f?function(){}:f;if(function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),o.call(this),!(c instanceof s.default)||c instanceof s.default&&1!==c.length)throw new Error("CheckDrop params obj must be an one length jqueryDom");this.obj=c,this.renderLi=r,this.placeholder=u,this.list=d,this.checkIds=p?p.split(","):[],this.checkDic=this.list.map(function(e,t){return n.checkIds.indexOf(t)>-1}),this.onSelectChange=k,this._init()}},dsm9:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.propsList=[{param:"obj",description:"外部容器，一个长度的jqueryDom",type:"jQueryObject",default:""},{param:"renderLi",description:"选项渲染回调",type:"Function",default:"row=>row"},{param:"list",description:"数据数组",type:"Array",default:"[]"},{param:"placeholder",description:"未选择时的占位符",type:"String",default:"不限"},{param:"checkIds",description:"默认选中的下标组",type:"String",default:""},{param:"onSelectChange",description:"确认选中后触发回调",type:"Function",default:"()=>{}"}],t.apiList=[{funcName:"renderList",description:"动态塞选项函数",params:"list: Array"},{funcName:"reset",description:"重置",params:""},{funcName:"getChecked",description:"获取选中项",params:""}]}},["DcMY"]);