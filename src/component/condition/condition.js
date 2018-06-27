/**
**create by 2087, Thu Apr 19 2018
**/

import $ from 'jquery';

import './less/condition.less';

/**
 * 多选条件
 * 适应场合，条件过多时，换行，并有一个更多选项的按钮来查看更多条件
 */
export default class Condition {
    constructor({ outer, list,activeIndexs=[], renderLi=row=>row, onClick=()=>{}, resetBtn={ show:true,text:'全部' } }) {
        if(!(outer instanceof $) || (outer instanceof $ && outer.length !== 1)) throw new Error('Condition param outer must be one length jqueryDom');
        if(typeof renderLi !== 'function') throw new Error('Condition param renderLi must be function');
        if(!Array.isArray(list)) throw new Error('Condition param list must be Array');
        if(typeof onClick !== 'function') throw new Error('Condition param onClick must be function');

        this.outer = outer;
        this.list = list;
        this.renderLi = renderLi;
        this.onClick = onClick;
        this.resetBtn = resetBtn;

        this.activeIndexs = activeIndexs;

        this._init();
    }

    reset =(change=true)=> {
        this.activeIndexs = [];
        this.conditionBtns.removeClass('active').eq(0).addClass('active');
        change && this._conditionChange();
    };

    _conditionChange =()=> {
        this.activeIndexs.sort((a,b)=>a-b);
        this.onClick(this.activeIndexs);
    };

    _bindEvent = () => {
        const that = this;
        this.outer.on('click','.ys-condition-btn',function () {
            const index = $(this).data('index');
            if(index === -1){
                that.reset();
            }else {
                if(that.activeIndexs.indexOf(index)>-1){
                    that.activeIndexs.splice(that.activeIndexs.indexOf(index),1);
                    if(!that.activeIndexs.length){
                        that.reset();
                    }else {
                        $(this).removeClass('active');
                        that._conditionChange();
                    }
                }else {
                    if(!that.activeIndexs.length){
                        that.conditionBtns.eq(0).removeClass('active');
                    }
                    that.activeIndexs.push(index);
                    $(this).addClass('active');
                    that._conditionChange();
                }
            }
        }).on('click','.ys-condition-hide-more',function () {
            const _height = that.conditionBtns.eq(0)[0].clientHeight;
            $(this).parent().height(_height);
            $(this).hide().prev().show();
        }).on('click','.ys-condition-see-more',function () {
            const _height = that.conditionBtns.eq(0)[0].clientHeight;
            $(this).parent().height(_height+Number(that.conditionBtns.last().position().top));
            $(this).hide().next().show();
        })
    };

    _renderHtml =()=> {
        this.btnStr = this.list.map(v=>this.renderLi(v));
        this.maxLength = this.outer.width()-75;
        this.finalBtn = this.btnStr.reduce((o,v)=>{
            if(o.full) return o;
            const _width = v.length*13+20+10;
            if(o.width+_width < this.maxLength){
                o.width+=_width;
            }else {
                o.full = true;
            }
            return o;
        },{ width:0, full:false });

        this.outer.html(`<div class="ys-condition-outer${ this.finalBtn.full?' full':'' }">
${ this.finalBtn.full?`<div class="ys-condition-see-more">更多选项<i class="fa fa-angle-down"></i></div><div class="ys-condition-hide-more">收起更多<i class="fa fa-angle-up"></i></div>`:'' }
${this.resetBtn.show?`<div class="ys-condition-btn active" data-index="-1">${this.resetBtn.text}</div>`:''}
${ this.btnStr.map((v,i)=>{
    return `<div class="ys-condition-btn" data-index="${i}">${ v }</div>`
        }).join('') }
</div>`);
        this.conditionBtns = this.outer.find('.ys-condition-btn');
    };

    _init = () => {
        this._renderHtml();
        this._bindEvent();
    }
}
