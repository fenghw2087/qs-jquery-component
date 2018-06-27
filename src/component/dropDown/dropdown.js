import './css/dropDown.less';
import AutoSearch from "../autoSearch/autoSearch";

export default class Dropdown {
    /**
     * 构造方法
     * @param obj 容器dom
     * @param placeholder 空置占位
     * @param list 列表数据
     * @param renderLi 列表渲染单行回调
     * @param renderSecLi 二级列表渲染行回调
     * @param activeIndex 选中的下标
     * @param activeSecIndex 选中的二级下标
     * @param beforeClick 点击前事件
     * @param onSelectChange 点击回调函数
     * @param hasReset 列表第一位是否是重置键 默认false
     * @param hasChildren 是否有二级类别
     * @param menuStyle 下拉列表样式
     * @param dropup 是否向上弹出
     * @param disabled 是否禁用
     * @param autoShow 是否启用鼠标划入打开
     * @param btnStyle 按钮样式
     * @param hasSearch 是否包含搜索
     */
    constructor({obj={}, placeholder='请选择', list=[], renderLi, renderSecLi, activeIndex=-1, activeSecIndex=-1, beforeClick=()=>{}, onSelectChange=()=>{}, hasReset = false, hasChildren = false, menuStyle='', dropup, disabled, autoShow, btnStyle='', hasSearch }) {
        this.obj = obj;
        this.placeholder = placeholder;
        this.list = list;
        this.renderLi = renderLi;
        this.renderSecLi = renderSecLi;
        this.activeIndex = activeIndex;
        this.activeSecIndex = activeSecIndex;
        this.onSelectChange = onSelectChange;
        this.hasReset = hasReset?1:0;
        this.hasChildren = !!hasChildren;
        this.beforeClick = beforeClick;
        this.menuStyle = menuStyle;
        this.dropup = dropup;
        this.disabled = disabled;
        this.autoShow = autoShow;
        this.btnStyle = btnStyle;
        this.hasSearch = hasSearch;

        if(!(obj instanceof $) || (obj instanceof $ && obj.length !== 1)) throw new Error('Dropdown param obj must be an one length jqueryDom');
        if(typeof this.onSelectChange !== 'function') throw new Error('Dropdown param onSelectChange must be a function');
        if(this.renderLi && typeof this.renderLi !== 'function') throw new Error('Dropdown param renderLi must be a function');
        if(this.renderSecLi && typeof this.renderSecLi !== 'function') throw new Error('Dropdown param renderSecLi must be a function');
        if(typeof this.beforeClick !== 'function') throw new Error('Dropdown param beforeClick must be a function');

        this.current = this.list[this.activeIndex];

        this.valueC = null;
        this.listC = null;
        this.btn = null;

        this.itemDetail = [];

        this.isOpen = false;

        this._init();
    }

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
        this.outer.hasClass('ys-open')?this._openDrop():this._closeDrop()
    };

    setData(activeIndex,activeSecIndex){
        if(activeSecIndex || activeSecIndex === 0){
            this.activeIndex = activeIndex;
            this.activeSecIndex = activeSecIndex;
            this.current = this.list[activeIndex].children[activeSecIndex];
            this.valueC.text(this.renderSecLi?this.renderSecLi(this.current,this.activeIndex,this.activeSecIndex):this.current).addClass('active');
            return;
        }
        if(activeIndex < this.hasReset || this.list[activeIndex] === undefined) return this.reset();
        this.activeIndex = activeIndex;
        this.current = this.list[this.activeIndex];
        this.valueC.text( this.renderLi?this.renderLi(this.current,this.activeIndex):this.current ).addClass('active');
        return this;
    }

    renderList(list=this.list){
        this.list = list;
        this.listC.html(this._renderListHtml());
        return this;
    }

    reset =( change=true )=> {
        this.activeIndex = -1;
        this.current = null;
        this.valueC.text(this.placeholder).removeClass('active');
        change && this.onSelectChange(this.current,this.activeIndex);
        return this;
    };

    setDisabled(disabled){
        this.btn.attr('disabled',!!disabled);
        return this;
    }

    setValue(txt){
        if(txt === '' || txt === null || txt === undefined) return this;
        this.valueC.text(txt).addClass('active');
        return this;
    }

    getList =()=> {
        return this.list;
    };

    getData =()=> {
        return {current:this.current,activeIndex:this.activeIndex,activeSecIndex:this.activeSecIndex};

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

    _itemClick =()=> {
        this.current = this.list[this.activeIndex];
        this.valueC.text( this.renderLi?this.renderLi(this.current,this.activeIndex):this.current ).addClass('active');
        this.onSelectChange( this.current, this.activeIndex, this.activeSecIndex );
        this.hasSearch && this._resetSearch();
    };

    _searchItem =(val)=> {
        let _hasItem = false;
        [].forEach.call(this.listC.find('li'),(v,i)=>{
            const y = this.itemDetail[i].indexOf(val)>-1;
            if(y) _hasItem = true;
            $(v).toggle(y);
        });
        this.searchEmpty.toggle(!_hasItem);
    };

    _resetSearch =()=> {
        this.autoSearch.reset();
        this.listC.find('li').show();
        this.searchEmpty.hide();
    };

    _bindEvent =()=> {
        const that = this;
        this.outer.on('click','.ys-dropdown-btn',function () {
            that.toggleDrop();
        }).on('click','.ys-dropdown-li > div',function () {
            that.toggleDrop('close');
            const index = $(this).parent().index();
            if(that.beforeClick( that.list[index] )) return;
            that.activeIndex = index;
            if(that.hasReset && that.activeIndex === 0){
                return that.reset();
            }
            that._itemClick();
        }).on('click','.ys-sec-li',function (e) {
            e.stopPropagation();
            that.toggleDrop('close');
            const activeSecIndex = $(this).index();
            const activeIndex = $(this).parents('li').index();
            if(that.beforeClick( that.list[activeIndex].children[activeSecIndex] )) return;
            that.activeSecIndex = activeSecIndex;
            that.activeIndex = activeIndex;
            that.setData(that.activeIndex,that.activeSecIndex);
            that.onSelectChange(that.current,that.activeIndex,that.activeSecIndex);
        }).on('click','.fa-times',function () {
            that._resetSearch();
        });

        if(this.autoShow){
            this.obj.on('mouseenter',function () {
                that.toggleDrop('open');
            }).on('mouseleave',function () {
                that.toggleDrop('close');
            });
        }

        $(document).on('mousedown',function (e) {
            if($(e.target).closest('.ys-open').length === 0){
                that.toggleDrop('close');
            }
        });
    };

    _renderListHtml =()=> {
        return this.list.map((v,i)=>{
            const _li = this.renderLi?this.renderLi(v,i):v;
            this.itemDetail.push(_li);
            return `<li class="ys-dropdown-li"><div>${_li}</div>${this.hasChildren?this._renderChildren(v.children,i):''}</li>`
        }).join('')
    };

    _renderChildren(children,activeIndex){
        if(children && children.length){
            return `<i class="fa fa-caret-right"></i>
            <div class="ys-dropdown-sec-div"><ul class="ys-dropdown-sec-menu">${children.map((v,i) => {
                return `<li class="ys-sec-li">${this.renderSecLi?this.renderSecLi(v,activeIndex,i):v}</li>`
            }).join('')}</ul></div>`
        }
        return ``;
    }

    _renderSearch =()=>{
        return this.hasSearch?`<div class="ys-dropdown-search-outer"><i class="fa fa-search"></i><input pattern="^[\\s]{0,}$" placeholder="输入关键字" type="text" /><i class="fa fa-times"></i></div><div class="ys-dropdown-search-empty">没有匹配选项</div>`:'';
    };

    _renderHtml =()=> {
        const _value = this.activeIndex >= this.hasReset?(this.renderLi?this.renderLi(this.current,this.activeIndex):this.current): this.placeholder;
        this.obj.html(`<div class="ys-dropdown-outer${ this.dropup?' ys-dropdown-dropup':'' }">
<button class="btn ys-dropdown-btn" style="${this.btnStyle}" ${ this.disabled?'disabled':'' }>
<span class="ys-dropdown-value${ this.activeIndex >= this.hasReset?' active':'' }">${ _value }</span><i class="fa fa-caret-down"></i>
</button>
<div class="ys-dropdown-menu">${this._renderSearch()}
<ul class="ys-dropdown-ul" style="${this.menuStyle}">${ this._renderListHtml() }</ul>
</div>
</div>`);

        this.outer = this.obj.find('.ys-dropdown-outer');
        this.drop = this.obj.find('.ys-dropdown-menu');
        this.listC = this.obj.find('.ys-dropdown-ul');
        this.valueC = this.obj.find('.ys-dropdown-value');
        this.btn = this.obj.find('.ys-dropdown-btn');
        if(this.hasSearch){
            this.autoSearch = new AutoSearch({
                input:this.outer.find('input'),
                delay:0,
                fn:val=>{
                    this._searchItem(val);
                }
            });
            this.searchEmpty = this.outer.find('.ys-dropdown-search-empty');
        }
        
        this._bindEvent();
    };

    _init(){
        this._renderHtml();
    }
}

