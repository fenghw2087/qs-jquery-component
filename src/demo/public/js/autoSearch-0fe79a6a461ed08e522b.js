webpackJsonp([38],{"0iPh":function(t,e){t.exports=window.jQuery},"9W6P":function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});e.propsList=[{param:"input",description:"目标input",type:"jQueryObject | input",default:""},{param:"delay",description:"触发回调的间隔延时，单位ms",type:"Number",default:"500"},{param:"fn",description:"回调函数，value: String | 当前键入input的值",type:"Function",default:""}],e.apiList=[{funcName:"triggerSearch",description:"立即触发一次回调函数",params:""},{funcName:"reset",description:"重置input值，但不出发回调函数",params:""}]},faso:function(t,e,n){"use strict";var i=o(n("0iPh"));n("q0Cz");var u=function(t){if(t&&t.__esModule)return t;var e={};if(null!=t)for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n]);return e.default=t,e}(n("6QEj")),a=n("9W6P"),r=o(n("hPQL"));function o(t){return t&&t.__esModule?t:{default:t}}(new function t(){var e=this;!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),this.init=function(){},this._bindEvent=function(){e.outer.on("click",function(){})},this._init=function(){new r.default({input:(0,i.default)("#test1").find("input"),fn:function(t){(0,i.default)("#test-result").text(t)}}),new r.default({input:(0,i.default)("#test2").find("input"),fn:function(t){(0,i.default)("#test-result2").text(t)},delay:0}),u.initCode(e.outer),u.createDetailTable({outer:e.outer,propsList:a.propsList,apiList:a.apiList}),e._bindEvent()},this.outer=(0,i.default)("#autoSearch"),this._init()}).init()},q0Cz:function(t,e){}},["faso"]);