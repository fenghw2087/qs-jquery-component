webpackJsonp([37],{"0iPh":function(t,e){t.exports=window.jQuery},"SD+S":function(t,e,n){"use strict";var o=u(n("0iPh"));n("epo8");var i=function(t){if(t&&t.__esModule)return t;var e={};if(null!=t)for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n]);return e.default=t,e}(n("6QEj")),s=n("vr/Z"),a=u(n("gntN")),l=u(n("1uvi"));function u(t){return t&&t.__esModule?t:{default:t}}(new function t(){var e=this;!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),this.init=function(){},this._bindEvent=function(){var t=e;e.outer.on("click",".btn-test1",function(){t.floatModal2.show({title:"向上的弹框",obj:(0,o.default)(this),side:1,fn:function(){t.floatModal2.hide(),(0,a.default)({type:"success",msg:"确认向上的弹框"})}})}).on("click",".btn-test2",function(){t.floatModal2.show({title:"向右的弹框",obj:(0,o.default)(this),side:2,fn:function(){t.floatModal2.hide(),(0,a.default)({type:"success",msg:"确认向右的弹框"})}})}).on("click",".btn-test3",function(){t.floatModal2.show({title:"向下的弹框",obj:(0,o.default)(this),side:3,fn:function(){t.floatModal2.hide(),(0,a.default)({type:"success",msg:"确认向下的弹框"})}})}).on("click",".btn-test4",function(){t.floatModal2.show({title:"向左的弹框",obj:(0,o.default)(this),side:4,fn:function(){t.floatModal2.hide(),(0,a.default)({type:"success",msg:"确认向左的弹框"})}})}).on("click",".btn-test5",function(){t.floatModal.show({title:"请输入4234进行确认",obj:(0,o.default)(this),side:1,placeholder:"请输入验证数字",fn:function(e){e-0==4234?((0,a.default)({type:"success",msg:"验证正确"}),t.floatModal.hide()):t.floatModal.showMsg("输入不正确")}})})},this._init=function(){e.floatModal=new l.default({}),e.floatModal2=new l.default({noInput:!0}),i.initCode(e.outer),i.createDetailTable({outer:e.outer,propsList:s.propsList,apiList:s.apiList}),e._bindEvent()},this.outer=(0,o.default)("#floatModal"),this._init()}).init()},epo8:function(t,e){},"vr/Z":function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});e.propsList=[{param:"noInput",description:"是否包含一个input",type:"Boolean",default:""}],e.apiList=[{funcName:"show",description:"设置信息并弹出弹框",params:"title: String | 弹框标题;<br>placeholder:String | input的placeholder；<r>side: Number |1234 上右下左,弹框依附方向；<br>obj: jQueryObject | 依附dom；<br>fn: Function | 点击确认回调，带一个参数value:String | input输入值"},{funcName:"hide",description:"关闭弹框",params:""},{funcName:"showMsg",description:"弹框展示一个错误信息",params:"msg:String | 错误信息"}]}},["SD+S"]);