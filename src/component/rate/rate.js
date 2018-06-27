import $ from 'jquery';

import './css/rate.less';

import { toFixed } from '../../util/lib/dataParse';

/**
 * 评分组件
 */
export default class Rate {
    /**
     * 构造函数
     * @param outer 外部容器
     * @param rateTotal 总分，总星数
     * @param currentRate 当前分
     * @param readOnly 是否只读，只读时不可点击
     * @param colorCB 星颜色
     * @param textCB 文字提示回调函数
     */
    constructor({ outer, rateTotal=5,currentRate=0, readOnly=true, colorCB=()=>'#333', textCB }) {
        if(!(outer instanceof $) || (outer instanceof $ && outer.length !== 1 )) throw new TypeError('Rate param outer must be one length jqueryDom');

        this.outer = outer;

        this.rateTotal = Math.abs(parseInt(rateTotal+''));

        this.currentRate = Math.abs(Number(currentRate));
        if(this.currentRate > this.rateTotal) this.currentRate = this.rateTotal;

        this.readOnly = readOnly;

        this.colorCB = colorCB;
        this.textCB = textCB || this._defaultTextCB;

        this._init();
    }

    _renderHtml() {
        this.outer.html(`<div style="color: ${ this.colorCB(this.currentRate) }" class="ys-rate-outer${ this.readOnly?' readOnly':'' }">
${ this._getStarHtml(this.currentRate) }<span class="rate-text">${ this.textCB(this.currentRate) }</span>
</div>`);
        this.stars = this.outer.find('.ys-rate-star');
        this.starOuter = this.outer.find('.ys-rate-outer');
        this.rateText = this.outer.find('.rate-text');
        this._setStar();
    }

    _getStarHtml =()=> {
        return new Array(this.rateTotal+1).fill(1).map(()=>{
            return `<span class="ys-rate-star"><i class="fa"></i></span>`
        }).join('');
    };

    _setStar =(n=this.currentRate)=> {
        n = Math.abs(Math.round(Number(n)*2))/2;

        this.stars.removeClass('active');
        this.stars.eq(parseInt(Math.floor(n)+'')).addClass('active').toggleClass('half-star',!!((2*n)%2));
    };

    _setColAndText =(n=this.currentRate)=>{
        this.starOuter.css('color',this.colorCB(n));
        this.rateText.text(this.textCB(n));
    };

    /**
     * 设置星级
     * @param n
     */
    setStar =(n)=> {
        this.currentRate = Math.abs(Number(n));
        this._setStar();
        this._setColAndText();
    };

    _defaultTextCB =(n=this.currentRate)=> {
        return n>0?toFixed(n,1):'';
    };

    _bindEvent() {
        const that = this;
        this.outer.on('mouseenter','.fa',function () {
            if(that.readOnly) return;
            const index= $(this).parent().index();
            that._setStar(index);
            that._setColAndText(index);
        }).on('mouseleave','.ys-rate-outer',function () {
            if(that.readOnly) return;
            that._setStar(that.currentRate);
            that._setColAndText(that.currentRate);
        }).on('click','.fa',function () {
            if(that.readOnly) return;
            const index = $(this).parent().index();
            that.setStar(that.currentRate === index?0:index);
        })
    }

    _init() {
        this._renderHtml();
        this._bindEvent();
    }
}