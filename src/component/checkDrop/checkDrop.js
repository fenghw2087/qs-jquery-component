import './less/checkDrop.less';
import $ from "jquery";

//TODO 暂未实现传入checkIds功能
/**
 * 下拉多选
 */
export default class CheckDrop {
    /**
     * 构造函数
     * @param obj 外部容器
     * @param renderLi 选项渲染回调
     * @param list 数据数组
     * @param placeholder 未选择时的占位符
     * @param checkIds 默认选中的下标组
     * @param onSelectChange 确认选中后触发回调
     */
    constructor({ obj, renderLi=row=>row, list=[], placeholder='不限', checkIds='', onSelectChange=()=>{} }){
        if(!(obj instanceof $) || (obj instanceof $ && obj.length !== 1)) throw new Error('CheckDrop params obj must be an one length jqueryDom');
        this.obj = obj;
        this.renderLi = renderLi;
        this.placeholder = placeholder;
        this.list = list;
        this.checkIds = checkIds?checkIds.split(','):[];
        this.checkDic = this.list.map((v,i)=>this.checkIds.indexOf(i)>-1);
        this.onSelectChange = onSelectChange;

        this._init();
    }

    _renderHtml =()=> {
        this.obj.html(`<div class="ys-check-drop-c">
<div class="ys-check-drop-btn"><span class="ys-check-drop-value">${this.placeholder}</span><i class="fa fa-caret-down"></i></div>
<div class="ys-check-drop-list-o">
<div class="ys-check-drop-list-c"></div>
<div class="ys-check-drop-cbtn">确认选择</div>
</div>
</div>`);
        this.outer = this.obj.find('.ys-check-drop-c');
        this.drop = this.outer.find('.ys-check-drop-list-o');
        this.valueC = this.outer.find('.ys-check-drop-value');
        this.renderList();
    };

    /**
     * 动态塞选项函数
     * @param list 数据数组
     */
    renderList =(list=this.list)=> {
        this.list = list;
        this.drop.find('.ys-check-drop-list-c').html([`<div class="ys-check-drop-i ${this.checkIds.length?'':'checked'}" data-index="-1">不限</div>`,...list.map((v,i)=>{
            return `<div class="ys-check-drop-i ${this.checkIds.indexOf(i)>-1?'checked':''}" data-index="${i}">${ this.renderLi(v,i) }</div>`
        })]);
        this.checkItems = this.drop.find('.ys-check-drop-i');
        this.checkDic = this.list.map((v,i)=>this.checkIds.indexOf(i)>-1);
    };

    /**
     * 重置
     */
    reset =()=> {
        [].forEach.call(this.checkItems,(v,i)=>{
            this.checkItems.eq(i).removeClass('checked');
            this.checkDic[i] = false;
        });
        this.checkItems.eq(0).addClass('checked');
        this.valueC.text(this.placeholder).removeClass('has-value');
    };

    /**
     * 打开/关闭下拉
     * @param type bol
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

    /**
     * 获取选中的下标
     * @returns {T | Array}
     */
    getChecked =()=> {
        const checkIds = this.list.reduce((o,v,i)=>{
            if(this.checkDic[i]){
                o.push(i)
            }
            return o;
        },[]);
        this.valueC.text(checkIds.length?this.renderLi(this.list[checkIds[0]],checkIds[0])+'等':this.placeholder).toggleClass('has-value',checkIds.length>0);
        return checkIds;
    };

    _bindEvent =()=> {
        const that = this;
        this.outer.on('click','.ys-check-drop-btn',function () {
            that.toggleDrop();
        }).on('click','.ys-check-drop-i',function () {
            const index = $(this).data('index');
            if(index === -1){
                [].forEach.call(that.checkItems,(v,i)=>{
                    that.checkItems.eq(i).removeClass('checked');
                    that.checkDic[i] = false;
                });
                that.checkItems.eq(0).addClass('checked');
            }else {
                that.checkItems.eq(index+1).toggleClass('checked');
                that.checkDic[index] = that.checkItems.eq(index+1).hasClass('checked');
                that.checkItems.eq(0).toggleClass('checked',!that.checkDic.some(v=>v));
            }
        }).on('click','.ys-check-drop-cbtn',function () {
            that.onSelectChange(that.getChecked());
            that.toggleDrop('close');
        });

        $(document).on('mousedown',function (e) {
            if($(e.target).closest('.ys-open').length === 0 && that.isOpen){
                that.onSelectChange(that.getChecked());
                that.toggleDrop('close');
            }
        });
    };

    _init =()=> {
        this._renderHtml();
        this._bindEvent();
    }
}