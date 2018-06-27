webpackJsonp([11],{"/p3+":function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.propsList=[{param:"obj",description:"组件容器，一个长度的jqueryDom",type:"jQueryObject",default:""},{param:"onChange",description:"状态变化时触发回调，参数 checked:当前选中状态",type:"Function",default:"()=>{}"},{param:"checked",description:"是否被选中",type:"Boolean",default:"false"},{param:"color",description:"颜色",type:"String | color",default:"#000"}],t.apiList=[{funcName:"setChecked",description:"设置选中状态",params:"checked: Boolean，change:Boolean,是否触发onChange事件"},{funcName:"getChecked",description:"获取选中状态，返回一个Boolean",params:""}]},"0iPh":function(e,t){e.exports=window.jQuery},"3CqZ":function(e,t){},QiFc:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o,c=function(){function e(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,n,o){return n&&e(t.prototype,n),o&&e(t,o),t}}(),i=n("0iPh"),r=(o=i)&&o.__esModule?o:{default:o};n("3CqZ");var a=function(){function e(t){var n=t.obj,o=t.onChange,c=void 0===o?function(){}:o,i=t.checked,a=void 0!==i&&i,u=t.color,h=void 0===u?"inherit":u;if(function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.obj=n,!(n instanceof r.default)||n instanceof r.default&&1!==n.length)throw new Error("CheckBox params obj must be an one length jqueryDom");if("function"!=typeof c)throw new Error("CheckBox params onChange must be an Function");this.onChange=c,this.checked=a,this.color=h,this.checkbox=null,this.name="checkbox"+Math.round(1e8*Math.random()),this._render()}return c(e,[{key:"_getHtmlStr",value:function(){return'<div class="ys-checkbox"><input type="checkbox" '+(this.checked?"checked":"")+' id="'+this.name+'"><label style="border-color: '+this.color+";color: "+this.color+'" for="'+this.name+'"></label></div>'}},{key:"_render",value:function(){this.obj.html(this._getHtmlStr()),this._bindEvent()}},{key:"setChecked",value:function(e){var t=arguments.length>1&&void 0!==arguments[1]&&arguments[1];return this.checked=e,this.checkbox&&this.checkbox.prop("checked",e),t&&this.onChange(this.checked),this}},{key:"getChecked",value:function(){return this.checked}},{key:"_bindEvent",value:function(){var e=this;this.obj.on("change",'input[type="checkbox"]',function(){var t=(0,r.default)(this).prop("checked");e.checked=t,e.onChange(t)}),this.checkbox=this.obj.find('input[type="checkbox"]')}}]),e}();t.default=a},RZVr:function(e,t){},YBXk:function(e,t,n){"use strict";var o=u(n("0iPh"));n("RZVr");var c=u(n("QiFc")),i=function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n]);return t.default=e,t}(n("6QEj")),r=n("/p3+"),a=u(n("gntN"));function u(e){return e&&e.__esModule?e:{default:e}}(new function e(){var t=this;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.init=function(){},this._bindEvent=function(){var e=t;t.outer.on("click",".btn-test1",function(){e.check.setChecked(!0)}).on("click",".btn-test2",function(){e.check.setChecked(!1)}).on("click",".btn-test3",function(){var t=e.check.getChecked();(0,a.default)({type:"info",msg:"当前选中状态："+(t?"选中":"未选中")})})},this._init=function(){new c.default({obj:(0,o.default)("#test1"),onChange:function(e){(0,a.default)({type:"info",msg:e?"选中":"未选中"})}});var e=["#ff8b00","#00b793","#d52740"];(0,o.default)("#colorTest").find(".test-check").each(function(t,n){new c.default({obj:(0,o.default)(n),color:e[t],checked:t%2})}),t.check=new c.default({obj:(0,o.default)("#test2"),onChange:function(e){}}),i.initCode(t.outer),i.createDetailTable({outer:t.outer,propsList:r.propsList,apiList:r.apiList}),t._bindEvent()},this.outer=(0,o.default)("#checkbox"),this._init()}).init()}},["YBXk"]);