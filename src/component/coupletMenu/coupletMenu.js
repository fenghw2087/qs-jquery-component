/**
**create by 2087, Fri May 18 2018
**/

import $ from 'jquery';

import './less/coupletMenu.less';

/**
 * 联级下拉
 */
export default class CoupletMenu {
    /**
     * 构造函数
     * @param obj 外部容器
     * @param renderLi 行渲染回调
     * @param titles 级联表头标题
     * @param list 数据数组
     * @param hasNext 当前选中是否包含下级选项的回调函数
     * @param renderNext 获取下级数据的回调函数，必须返回一个promise对象
     * @param renderResult 显示选中结果的回调函数
     * @param placeholder 未选择时的文案
     * @param onSelectChange 选中回调函数
     */
    constructor({ obj, renderLi=row=>row.name,titles=[], list=[],hasNext=row=>row.children && row.children.length, renderNext, renderResult, placeholder='不限', onSelectChange=()=>{} }) {
        if(!(obj instanceof $) || (obj instanceof $ && obj.length !== 1)) throw new Error('CoupletMenu params obj must be an one length jqueryDom');
        this.obj = obj;
        this.renderLi = renderLi;
        this.list = list;
        this.onSelectChange = onSelectChange;
        this.placeholder = placeholder;
        this.hasNext = hasNext;
        this.renderNext = renderNext;
        this.renderResult = renderResult;
        this.titles = titles;
        this.checks = [];
        this._init();
    }

    _renderHtml =()=> {
        this.obj.html(`<div class="ys-couple-menu-c">
<div class="ys-couple-menu-btn"><span class="ys-couple-menu-value">${this.placeholder}</span><i class="fa fa-caret-down"></i></div>
<div class="ys-couple-menu-list-o" style="width: 120px">
    ${this._getLevelOuter(1)}
</div>
</div>`);
        this.outer = this.obj.find('.ys-couple-menu-c');
        this.drop = this.outer.find('.ys-couple-menu-list-o');
        this.valueC = this.outer.find('.ys-couple-menu-value');
        this.level1C = this.drop.find('.level1 .couple-menu-c');
        this.renderList();
    };

    _getLevelOuter =(n)=>{
        return `<div class="ys-couple-menu-list-c level${n}" style="left: ${120*(n-1)}px"><div class="couple-menu-header">${this.titles[n-1] || `${n}级分类`}</div><div class="couple-menu-c"></div><div class="couple-menu-footer">${n===1?`<div class="ys-couple-menu-cbtn">确认选择</div>`:''}</div></div>`
    };

    /**
     * 动态设置一级选项
     * @param list
     * @returns {CoupletMenu}
     */
    renderList =(list=this.list)=> {
        this.list = list;
        this.level1C.html(list.map((v,i)=>{
            const _h = this.renderLi(v,i);
            return `<div class="ys-couple-menu-i" data-index="${i}" title="${_h}">${_h}${this.hasNext(v)?`<i class="fa fa-caret-right"></i>`:''}</div>`
        }));
        return this;
    };

    /**
     * 设置当前显示的值，但并不处理选项
     * @param data
     */
    setData =(data)=> {
        this.valueC.text(data).toggleClass('has-value',true);
    };

    /**
     * 重置组件
     */
    reset =()=> {
        this._hideLevel(1);
        this.drop.find(`.level1`).find('.ys-couple-menu-i').removeClass('active');
        this.valueC.text(this.placeholder);
    };

    /**
     * 打开/关闭下拉
     * @param type
     */
    toggleDrop =(type)=> {
        if(type === 'open'){
            if(this.isOpen) return;
            this.outer.addClass('ys-open');
        }else if(type === 'close'){
            if(!this.isOpen) return;
            this.outer.removeClass('ys-open');
        }else {
            this.outer.toggleClass('ys-open');
        }
        this.isOpen = !this.isOpen;
        this.outer.hasClass('ys-open')?this._openDrop():this._closeDrop();
    };

    _openDrop =()=> {
        this.drop.addClass('open-start');
        setTimeout(()=>{
            this.drop.addClass('opening');
            setTimeout(()=>{
                this.drop.removeClass('open-start').addClass('open-end');
            },0);
        },0)
    };

    _closeDrop =()=> {
        this.drop.removeClass('open-end').addClass('open-start');
        setTimeout(()=>{
            this.drop.removeClass('opening');
            setTimeout(()=>{
                this.drop.removeClass('open-start');
            },0)
        },100)
    };

    _renderLevel =(index)=> {
        const n = index.length+1;
        if(!this.drop.find(`.level${n}`).length){
            this.drop.css({width:`${120*n}px`}).find(`.level${n-1}`).after(this._getLevelOuter(n));
        }else {
            this.drop.css({width:`${120*n}px`}).find(`.level${n}`).show().nextAll().hide();
        }
        const row = this.checks.reduce((o,v)=>{
            o = o.children[v];
            return o;
        },{ children:this.list });
        this.renderNext(this.checks,row,this.list).then(nextList=>{
            row.children = nextList;
            this.drop.find(`.level${n} .couple-menu-c`).html(nextList.map((v,i)=>{
                const _value = this.renderLi(v,i);
                return `<div class="ys-couple-menu-i" data-index="${index.join('-')+'-'+i}" title="${_value}">${_value}${this.hasNext(v)?`<i class="fa fa-caret-right"></i>`:''}</div>`
            }));
            this._bindScroll(n);
        });
    };

    _hideLevel =(n)=> {
        this.drop.css({width:`${120*n}px`}).find(`.level${n}`).nextAll().hide();
    };

    _bindEvent =()=> {
        const that = this;
        this.outer.on('click','.ys-couple-menu-btn',function () {
            that.toggleDrop();
        }).on('click','.ys-couple-menu-i',function () {
            const index = ($(this).data('index')+'').split('-');
            const row = index.reduce((o,v)=>{
                o = o.children[v];
                return o;
            },{ children:that.list });
            const level = index.length;
            const i = index[level-1]-0;
            that.checks[level-1] = i;
            that.checks.length = level;
            that.drop.find(`.level${level}`).find('.ys-couple-menu-i').eq(i).addClass('active').siblings().removeClass('active');
            if(that.hasNext(row)){
                that._renderLevel(index)
            }else {
                that._hideLevel(level);
            }
        }).on('click','.ys-couple-menu-cbtn',function () {
            that.checks.length && that.onSelectChange(that.checks,that.list);
            that.checks.length && that.valueC.text(that.renderResult(that.checks,that.list) || that.placeholder).toggleClass('has-value',!!that.renderResult(that.checks,that.list));
            that.toggleDrop('close');
        });

        $(document).on('mousedown',function (e) {
            if($(e.target).closest('.ys-open').length === 0 && that.isOpen){
                that.checks.length && that.onSelectChange(that.checks,that.list);
                that.checks.length && that.valueC.text(that.renderResult(that.checks,that.list) || that.placeholder).toggleClass('has-value',!!that.renderResult(that.checks,that.list));
                that.toggleDrop('close');
            }
        });
    };

    _bindScroll =(n)=> {
        const mc = this.drop.find(`.level${n}`);
        const messagesBody = mc.find('.couple-menu-c'),messagesHeader = mc.find('.couple-menu-header'),messagesFooter = mc.find('.couple-menu-footer');
        messagesBody.scrollTop(0);
        if(messagesBody.children(':last').position().top+30>messagesBody.height()){
            messagesFooter.addClass('shadow')
        }else {
            messagesFooter.removeClass('shadow')
        }
        messagesBody.length && messagesBody.off('scroll').on('scroll',( function() {
            const height = messagesBody.height();
            return function () {
                const scrollTop = messagesBody.scrollTop(),scrollHeight = this.scrollHeight;
                messagesHeader.toggleClass('shadow',scrollTop>0);
                messagesFooter.toggleClass('shadow',scrollTop+height+20 < scrollHeight);
            };
        })())
    };

    _init =()=> {
        this._renderHtml();
        this._bindEvent();
    }
}
