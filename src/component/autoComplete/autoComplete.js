import $ from 'jquery';
import AutoSearch from '../autoSearch/autoSearch';

import './css/autoComplete.less';
import loading from "../loading/loading";

/**
 * 自动搜索填充列表
 */
export default class AutoComplete {
    /**
     * 构造函数
     * @param input 目标input
     * @param getData 数据获取函数，该函数必须返回一个promise
     * @param delay 键入触发延时。默认500ms
     * @param renderLi 行渲染回调
     * @param formatList getData返回的数据，进行一个规则化，返回新的数据数组
     * @param onSelect 点击选项触发回调
     * @param emptyMsg 未匹配显示提示信息
     * @param keyTigger 键盘上下键选择时，是否触发onSelect回调
     */
    constructor({ input,getData=()=>{},delay=500,renderLi,formatList,onSelect=()=>{},emptyMsg='没有匹配的结果',keyTigger=true }) {
        if(!(input instanceof $) || (input instanceof $ && input.length !== 1) || input[0].tagName !== 'INPUT') throw new TypeError('AutoComplete param input must be a input jquery dom');
        this.input = input;
        if(typeof getData !== 'function') throw new TypeError('AutoComplete param getData must be a function');
        this.getData = getData;
        this.delay = delay;
        if(typeof renderLi !== 'function') throw new TypeError('AutoComplete param renderLi must be a function');
        this.renderLi = renderLi;
        if(typeof formatList !== 'function') throw new TypeError('AutoComplete param formatList must be a function');
        this.formatList = formatList;
        if(typeof onSelect !== 'function') throw new TypeError('AutoComplete param onSelect must be a function');
        this.onSelect = onSelect;
        this.emptyMsg = emptyMsg;
        this.keyTigger = keyTigger;

        this.id = 'AutoComplete'+Math.ceil(Math.random()*1000000);

        this._init();
    }

    _bindEvent() {
        const that = this;
        $(document).on('mousedown',(e)=> {
            if($(e.target).closest('#'+this.id).length !== 1 && $(e.target).closest(this.input).length !== 1){
                this._closeComplete();
            }
        });
        this.input.on('focus', ()=> {
            if(this.input.val()) this.autoSearch.triggerSearch();
        }).on('keydown',(e)=>{
            if(this.outer && this.outer.length){
                const items = this.outer.find('.ys-auto-complete-item');
                if(!items.length) return;
                switch (e.which){
                    case 40:{
                        const activeIndex =  this.outer.find('.ys-auto-complete-item.active').index();
                        const nextIndex = (activeIndex+1)%items.length;
                        items.eq(nextIndex).addClass('active').siblings().removeClass('active');
                        this._selectLi(nextIndex,this.keyTigger);
                        break;
                    }
                    case 38:{
                        let activeIndex =  this.outer.find('.ys-auto-complete-item.active').index();
                        if(activeIndex === -1) activeIndex = items.length;
                        let nextIndex = (activeIndex-1)%items.length;
                        if(nextIndex === -1) nextIndex = 4;
                        items.eq(nextIndex).addClass('active').siblings().removeClass('active');
                        this._selectLi(nextIndex,this.keyTigger);
                        break;
                    }
                    case 13:{
                        const activeIndex =  this.outer.find('.ys-auto-complete-item.active').index();
                        !this.keyTigger && this._selectLi(activeIndex);
                        if(activeIndex !== -1) this._closeComplete();
                        break;
                    }
                }
            }

        });
        this.outer.on('click','.ys-auto-complete-item',function () {
            const activeIndex = $(this).index();
            that._selectLi(activeIndex);
            that._closeComplete();
        });
    }

    _selectLi(index,type=true){
        this.input.val(this.renderLi(this.list[index]));
        type && this.onSelect(this.list[index]);
    }

    _renderHtml(){
        if(!$('#'+this.id).length) {
            $('body').append(this._getOuterHtml());
        }
        this.outer = $('#'+this.id);
    }

    _renderList(){
        this.outer.html(this._getHtml());
        this._adjustPosition();
    }

    _adjustPosition(){
        const { top:it,left:il } = this.input.offset(),ih = this.input[0].clientHeight,iw = this.input[0].clientWidth;
        this.outer.css({
            width:iw-4,
            top:it+ih+5,
            left:il+2
        }).show();
    }

    _getOuterHtml(){
        return `<div class="ys-auto-complete-outer" id="${this.id}"></div>`;
    }

    _getHtml(){
        if(this.list.length){
            return this.list.map((v)=>{
                return `<div class="ys-auto-complete-item"><a href="javascript:void(0)">${this.renderLi(v)}</a></div>`;
            });
        }else {
            return this._getEmptyHtml();
        }
    }

    _getEmptyHtml(){
        return `<div class="ys-auto-complete-empty">${this.emptyMsg}</div>`;
    }

    _closeComplete(){
        this.outer.hide();
    }

    _renderLoading =()=> {
        this.outer.html(`<div class="ys-auto-complete-loading">${loading('small')} 正在为您拼命搜索中...</div>`);
        this._adjustPosition();
    };

    _init() {
        this.autoSearch = new AutoSearch({
            input:this.input,
            delay:this.delay,
            fn:(val)=>{
                if(!val){
                    return this._closeComplete();
                }
                this._renderLoading();
                const dataPromise = this.getData(val);
                if(!dataPromise || typeof dataPromise.then !== 'function') throw new TypeError('AutoComplete param getData must return a Promise obj at least contain then method');
                dataPromise.then((data)=>{
                    this.list = this.formatList(data);
                    this._renderList();
                });
            }
        });
        this._renderHtml();
        this._bindEvent();
    }
}