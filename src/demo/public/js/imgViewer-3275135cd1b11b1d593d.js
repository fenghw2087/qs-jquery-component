webpackJsonp([36],{"0iPh":function(t,i){t.exports=window.jQuery},KSvA:function(t,i,n){"use strict";var e=u(n("0iPh"));n("NTJL");var r=function(t){if(t&&t.__esModule)return t;var i={};if(null!=t)for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&(i[n]=t[n]);return i.default=t,i}(n("6QEj")),o=n("ypLk"),s=u(n("5SDb"));function u(t){return t&&t.__esModule?t:{default:t}}(new function t(){var i=this;!function(t,i){if(!(t instanceof i))throw new TypeError("Cannot call a class as a function")}(this,t),this.init=function(){},this._bindEvent=function(){var t=i;i.outer.on("click","#test1",function(){t.imgViewer.show((0,e.default)(this).attr("src"))})},this._init=function(){i.imgViewer=new s.default,r.initCode(i.outer),r.createDetailTable({outer:i.outer,propsList:o.propsList,apiList:o.apiList}),i._bindEvent()},this.outer=(0,e.default)("#imgViewer"),this._init()}).init()},NTJL:function(t,i){},ypLk:function(t,i,n){"use strict";Object.defineProperty(i,"__esModule",{value:!0});i.propsList=[],i.apiList=[{funcName:"show",description:"预览图片",params:"src | String 图片src"}]}},["KSvA"]);