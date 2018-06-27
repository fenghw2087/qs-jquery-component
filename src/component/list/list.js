import Pagination from '../pagination/pagination';

import '../table/css/table.less';
import './css/list.less';
import loading from "../loading/loading";

/**
 * 列表
 */
export default class List {
    /**
     * 构造函数
     * @param outer 外部容器
     * @param dataSource 数据源 数组
     * @param renderTr 行渲染回调
     * @param pagination 分页相关参数
     * @param storage 是否开启数据缓存
     * @param loading 是否展示loading
     * @param emptyMsg 缺省文案
     * @param afterRender 渲染完成回调
     * @param renderEmpty 缺省渲染函数
     */
    constructor({ outer, dataSource, renderTr, pagination={show:false}, storage=false, loading=true, emptyMsg='暂无数据', afterRender=()=>{}, renderEmpty }) {
        this.dataSource = dataSource;
        this.renderTr = renderTr;
        this.loading = loading;
        this.pagination = this._formatPagination(pagination);
        this.storage = storage;
        this.emptyMsg = emptyMsg;

        if(!(outer instanceof $) || (outer instanceof $ && outer.length !== 1)) throw new Error('List param outer must be one length jqueryDom');
        if(typeof this.renderTr !== 'function') throw new Error('List param renderTr must be a function');
        if(typeof afterRender !== 'function') throw new Error('List param afterRender must be a function');

        this.outer = outer.addClass('rel').css('overflow-x','hidden');
        this.table = null;
        this.paginarC = null;
        this.paginar = null;
        this.noMsgC = null;
        this.loadingC = null;
        this.afterRender = afterRender;
        this.renderEmpty = renderEmpty;

        this.dataSourceMap = {};

        this._init();
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
                this.pagination = $.extend(this.pagination,{current:Number(current),pageSize:Number(pageSize),total:Number(total) });
                this.paginar.setPageData(this.pagination);
            }
            if((total === o_total || current === 1 || conditionChange) && this.storage){
                if(conditionChange) this.dataSourceMap = {};
                this.dataSourceMap['current'+current] = this.dataSource;
            }
        }
        this._renderList();
        this.loading && this.paginar && this.paginar.toggleLoading();
        return new window.Promise((resolve)=>{
            resolve()
        });
    }

    /**
     * 重载数据
     */
    reload =()=> {
        this._renderList();
    };

    /**
     * 获取表格当前列表数据
     * @returns {*}
     */
    getDataSource(){
        return this.dataSource;
    }

    /**
     * 获取当行数据
     * @param index
     * @returns {*}
     */
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

    /**
     * 更新某一行的样式
     * @param index
     */
    updateItem =(index)=> {
        const _c = this.listC.children().eq(index);
        setTimeout(()=>{
            _c.addClass('tr-updating');
        },10);
        setTimeout(()=>{
            _c.addClass('tr-updated');
        },10);
        setTimeout(()=>{
            _c.removeClass('tr-updated');
        },3000);
    };

    /**
     * 移除某一行样式
     * @param index
     * @param type
     */
    removeItem =(index,type='center')=> {
        return new window.Promise((resolve)=>{
            const _c = this.listC.children().eq(index);
            _c.addClass('tr-removing-'+type);
            setTimeout(()=>{
                _c.addClass('tr-removed-'+type);
            },10);
            setTimeout(resolve,400,'yes');
        });
    };

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

    _getHtml(){
        return `<div class="list-container"></div><div class="ys-table-no-msg-c">${this._getNomsgHtml()}</div>${this._getLoadingHtml()}${this.pagination.show?`<div class="ys-paginar"></div>`:``}`;
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

    _renderList(){
        if(!this.dataSource){
            this.listC.hide();
            this.noMsgC.hide();
            this.paginarC.hide();
            this.loadingC.show();
            return;
        }
        this.loadingC.hide();
        this.noMsgC.toggle(!this.dataSource.length);
        this.paginarC.toggle(!!this.dataSource.length && this.pagination.show);
        this.listC.toggle(!!this.dataSource.length);
        if(this.dataSource.length) {
            this.listC.html(this._getList());
            this.afterRender();
        }
    }

    _renderHtml() {
        this.outer.html(this._getHtml());
        this.listC = this.outer.find('.list-container');
        this.noMsgC = this.outer.find('.ys-table-no-msg-c');
        this.paginarC = this.outer.find('.ys-paginar');
        this.loadingC = this.outer.find('.ys-table-loading');
        this._renderList();

        if(this.pagination.show) this.paginar = new Pagination({
            outer:this.paginarC,
            ...this.pagination,
            onChange: ({current,pageSize,total}) => {
                this.pagination.current = current;
                const hasStorage = this.storage && this.dataSourceMap['current'+current];
                if(hasStorage){
                    this.dataSource = this.dataSourceMap['current'+current];
                    this._renderList();
                    this.loading && this.paginar.toggleLoading();
                }else {
                    this.pagination.onChange({current,pageSize,total});
                }
            }
        })
    }

    _getList(){
        return this.dataSource.map((v,i)=>{
            return this.renderTr(v,i,this.pagination);
        }).join('');
    }

    _init() {
        this._renderHtml();
    }
}