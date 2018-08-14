/**
 * Created by Administrator on 2018/7/22.
 */
import './less/radio.less';

export default class Radio {
    constructor({ obj, list=[], renderLi=row=>row.name, activeIndex=-1, onChange=()=>{} }){
        if(!(obj instanceof $) || (obj instanceof $ && obj.length !== 1)) throw new Error('Radio param obj must be one length jqueryDom');
        this.obj = obj;
        this.list = list;
        this.renderLi = renderLi;
        this.activeIndex = activeIndex;
        this.onChange = onChange;
        this._init();
    }

    _bindEvents =()=> {
        const that = this;
        this.outer.on('click','.ys-com-radio-item',function () {
            const index = $(this).data('index');
            if(that.activeIndex !== index){
                that.activeIndex = index;
            }
            $(this).addClass('active').siblings().removeClass('active');
            that.onChange(that.activeIndex,that.list[that.activeIndex]);
        })
    };

    getChecked =()=> {
        return this.activeIndex;
    };

    setChecked =(index)=> {
        this.activeIndex = index;
        this.outer.find('.ys-com-radio-item').removeClass('active').eq(index).addClass('active');
    };

    setList =(list=[])=> {
        this.list = list;
        this._randerRadio();
    };

    reset =()=> {
        this.outer.find('.ys-com-radio-item').removeClass('active');
        this.activeIndex = -1;
    };

    _randerRadio =()=> {
        this.outer.html(this.list.map((v,i)=>{
            return `<div class="ys-com-radio-item${ this.activeIndex === i?' active':'' }" data-index="${i}">
    <div class="ys-com-radio-i"></div>
    <div class="ys-com-radio-name">${ this.renderLi(v,i) }</div>
</div>`
        }))
    };

    _renderHtml =()=> {
        this.obj.html(`<div class="ys-com-radio-outer"></div>`);
        this.outer = this.obj.find('.ys-com-radio-outer');
        this._randerRadio();
    };

    _init =()=> {
        this._renderHtml();
        this._bindEvents();
    }
}