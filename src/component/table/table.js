import './css/table.less';
import Pagination from '../pagination/pagination';
import loading from '../loading/loading';

/**
 * 表格组件
 */
export default class Table {
    /**
     * 构造方法
     * @param outer 表格容器dom
     * @param headers 表头数据 {name,width}
     * @param mutiHeaders 多行表头
     * @param dataSource 报个数据
     * @param renderTr 行渲染回调
     * @param renderTrs td渲染回调组
     * @param pagination 分页相关参数 {show,pageSize,current,total,isJump,position,onChange}
     * @param storage 是否开启数据存储，存储相同条件相同页码的数据，开启后，将不再进行重复请求，条件改变后，需在setData方法里，传入conditionChange进行数据清空，默认false
     * @param loading 数据为null时展示一个loading 默认true
     * @param singleTr 表格是否单行...显示内容 默认true
     * @param emptyMsg 表格没数据时的提示文案，默认 暂无数据
     * @param afterRender 渲染完成回调
     * @param sorter 排序点击回调
     * @param renderEmpty 缺省方法
     */
    constructor({ outer, headers, mutiHeaders, dataSource, renderTr=()=>{}, renderTrs, pagination={show:false}, storage=false, loading=true, singleTr=true, emptyMsg='暂无数据', afterRender=()=>{}, sorter=()=>{}, renderEmpty }) {
        this.outer = outer;
        this.headers = headers;
        this.mutiHeaders= mutiHeaders;
        this.dataSource = dataSource;
        this.renderTr = renderTr;
        this.renderTrs = renderTrs;
        this.loading = loading;
        this.pagination = this._formatPagination(pagination);
        this.storage = storage;
        this.singleTr = !!singleTr;
        this.emptyMsg = emptyMsg;
        this.afterRender = afterRender;
        this.sorter = sorter;
        this.renderEmpty = renderEmpty;

        if(!(outer instanceof $) || (outer instanceof $ && outer.length !== 1)) throw new Error('Table param outer must be one length jqueryDom');
        if(!Array.isArray(this.headers) && !Array.isArray(this.mutiHeaders)) throw new Error('Table param headers or mutiHeaders must be an Array');
        if(typeof this.renderTr !== 'function') throw new Error('Table param renderTr must be a function');
        if(typeof this.afterRender !== 'function') throw new Error('Table param afterRender must be a function');
        if(typeof this.sorter !== 'function') throw new Error('Table param sorter must be a function');
        this.outer.addClass('rel').css('overflow-x','hidden');

        this.table = null;
        this.paginarC = null;
        this.paginar = null;
        this.noMsgC = null;
        this.loadingC = null;

        this.dataSourceMap = {};

        this._init();
    }

    _init() {
        this._renderHtml();
        this._bindEvent();
    }

    /**
     * 格式化分页参数
     * @param pagination
     * @returns {{show: *, pageSize: *, current: *, total: *, isJump: *, position: *, loading: boolean|*, onChange: *}}
     */
    _formatPagination(pagination){
        let {show,pageSize,current,total,isJump,position,onChange} = pagination;
        if(!show) return pagination;
        current = current || 1;
        pageSize = pageSize || this.dataSource.length;
        isJump = isJump || false;
        position = position || 'right';
        const loading = this.loading;
        return {show,pageSize,current,total,isJump,position,loading,onChange}
    }

    /**
     * 设置表格数据
     * @param dataSource 列表数据
     * @param pagination 分页数据 {show,current,pageSize,total}
     * @param conditionChange 条件是否改变，如果为true,则清空存储的所有数据，默认false
     */
    setData({dataSource,pagination=this.pagination,conditionChange=false}){
        this.dataSource = dataSource;
        if(this.paginar){
            let {show=true,current,pageSize,total} = pagination;
            const {show:o_show,current:o_current,pageSize:o_pageSize,total:o_total} = this.pagination;
            if(!current || current<1) current = 1;
            if(!pageSize || pageSize<1) pageSize = o_pageSize;
            if(total<0) total = o_total;
            if(!(show === o_show && current === o_current && pageSize === o_pageSize && total === o_total)){
                this.pagination = $.extend(this.pagination,{show: Boolean(show),current:Number(current),pageSize:Number(pageSize),total:Number(total) });
                this.paginar.setPageData(this.pagination);
            }
            if((total === o_total || current === 1 || conditionChange) && this.storage){
                if(conditionChange) this.dataSourceMap = {};
                this.dataSourceMap['current'+current] = this.dataSource;
            }
        }
        this._renderTable();
        this.loading && this.paginar && this.paginar.toggleLoading();
        return new window.Promise((resolve)=>{
            resolve()
        });
    }

    resetSort(){
        this.outer.find('.table-sorter').removeClass('up down');
    }

    /**
     * 获取表格当前列表数据
     * @returns {*}
     */
    getDataSource(){
        return this.dataSource;
    }

    getRowData(index){
        return this.dataSource[index];
    }

    /**
     * 获取表格当前分页数据
     * @returns {*}
     */
    getPagination(){
        return this.pagination;
    }

    _getHtml(thead){
        return `<table class="ys-table${this.singleTr?' single-tr':''}">
    <thead>
    ${thead}
    </thead>
    <tbody>
    </tbody>
</table><div class="ys-table-no-msg-c">${this._getNomsgHtml()}</div>${this._getLoadingHtml()}${this.pagination.show?`<div class="ys-paginar"></div>`:``}`;
    }

    _getNomsgHtml(){
        if(typeof this.renderEmpty === 'function'){
            return this.renderEmpty();
        }
        return `<div class="ys-table-no-msg">${this.emptyMsg}</div>`;
    }

    _getLoadingHtml(){
        return `<div class="ys-table-loading"><span class="ys-table-loading-span">${ loading('small') }</span>数据加载中...</div>`;
    }

    _getThead(){
        return `<tr>
    ${this.headers.map((v,i)=>{
        return `<th width="${v.width}" ${v.colspan?`colspan="${v.colspan}"`:''}>${v.name}${ this._renderSorter(v.sorter,i) }</th>`;
    }).join('')}
</tr>`;
    }

    _renderSorter(sorter,index){
        if(!sorter){
            return ''
        }
        return `<div class="table-sorter" data-index="${index}"><i class="fa fa-sort-up"></i><i class="fa fa-sort-down"></i></div>`
    }

    _getTbody(){
        return this.dataSource.map((v,i)=>{
            if(this.renderTrs && this.renderTrs.length){
                return `<tr>${ this.renderTrs.map((v2,i2)=>{
                    let _td;
                    if(typeof v2 === 'function'){
                        _td = v2(v,i,this.pagination,i2)
                    }else if(typeof v2.renderTd === 'function'){
                        return v2.renderTd(v,i,this.pagination,i2)
                    }
                    return `<td>${ _td }</td>`
                }) }</tr>`;
            }
            return this.renderTr(v,i,this.pagination);
        }).join('');
    }

    _renderTable(){
        if(!this.dataSource){
            this.table.hide();
            this.noMsgC.hide();
            this.paginarC.hide();
            this.loadingC.show();
            return;
        }
        this.loadingC.hide();
        this.noMsgC.toggle(!this.dataSource.length);
        this.paginarC.toggle(!!this.dataSource.length && this.pagination.show);
        this.table.toggle(!!this.dataSource.length);
        if(this.dataSource.length) {
            this.table.find('tbody').html(this._getTbody());
            this.afterRender();
        }
    }

    _renderHtml() {
        this.outer.html(this._getHtml(this._getThead()));
        this.table = this.outer.find('.ys-table');
        this.noMsgC = this.outer.find('.ys-table-no-msg-c');
        this.paginarC = this.outer.find('.ys-paginar');
        this.loadingC = this.outer.find('.ys-table-loading');
        this._renderTable();

        if(this.pagination.show) this.paginar = new Pagination({
            outer:this.paginarC,
            ...this.pagination,
            onChange: ({current,pageSize,total}) => {
                this.pagination.current = current;
                const hasStorage = this.storage && this.dataSourceMap['current'+current];
                if(hasStorage){
                    this.dataSource = this.dataSourceMap['current'+current];
                    this._renderTable();
                    this.loading && this.paginar.toggleLoading();
                }else {
                    this.pagination.onChange({current,pageSize,total});
                }
            }
        })
    }

    removeItem =(index,type='center')=> {
        return new window.Promise((resolve)=>{
            const tr = this.table.find('tbody tr').eq(index);
            tr.addClass('tr-removing-'+type);
            setTimeout(()=>{
                tr.addClass('tr-removed-'+type);
            },10);
            setTimeout(resolve,400,'yes');
        });
    };

    updateItem =(index)=> {
        const tr = this.table.find('tbody tr').eq(index);
        setTimeout(()=>{
            tr.addClass('tr-updated');
        },10);
        setTimeout(()=>{
            tr.removeClass('tr-updated');
        },3000);
    };

    _bindEvent() {
        const that = this;
        this.outer.on('click','.table-sorter',function () {
            const sorters = that.outer.find('.table-sorter');
            const current = $(this);
            const index = current.data('index');
            let type = '';
            if(current.hasClass('down')){
                sorters.removeClass('up down');
                current.addClass('up');
                type = 1;
            }else if(current.hasClass('up')){
                sorters.removeClass('up down');
                type = 0;
            } else {
                sorters.removeClass('up down');
                current.addClass('down');
                type = -1;
            }
            that.sorter({ sortName:that.headers[index].sorter.type, type });
        })
    }
}