import './css/pagination.less';

/**
 * 分页器组件
 */
export default class Pagination {
    /**
     * 构造方法
     * @param outer 分页容器
     * @param current 当前页码 默认1
     * @param total 总条数 默认1
     * @param pageSize 每页条数 默认10
     * @param position 页码位置 left center right   默认right
     * @param onChange 页码改变回调函数
     * @param isJump 是否显示跳转输入框 默认false
     * @param loading 是否拥有一个loading 默认false
     */
    constructor({ outer, current=1, total=1, pageSize=10, position='right', onChange=()=>{}, isJump=false, loading=false }) {
        this.outer = outer;
        this.current = current;
        this.total = total;
        this.pageSize = pageSize;
        this.position = position;
        this.onChange = onChange;
        this.isJump = isJump;
        this.pageTotal = Math.ceil(this.total/this.pageSize);
        this.loading = loading;

        this.isLoading = false;

        if(!(outer instanceof $) || (outer instanceof $ && outer.length !== 1)) throw new Error('Pagination param outer must be one length jqueryDom');

        this._init();
    }

    _init() {
        this._renderHtml();
        this._bindEvent();
    }

    _getHtml(){
        return `<div class="ys-page-pagination ys-page-pos-${this.position} ${this.total}">${this.position === 'right'?this._getLoadingHtml():``}<span class="ys-page-prev${this.current === 1?' disabled':''}"><i class="fa fa-angle-left"></i></span>`+
            this._getPagesHtml()+
            `<span class="ys-page-next${this.current === this.pageTotal?' disabled':''}"><i class="fa fa-angle-right"></i></span>`+
            (this.isJump?this._getJumpInput():``)+
            `${this.position !== 'right'?this._getLoadingHtml():``}</div>`;
    }

    _getLoadingHtml(){
        return `<span class="ys-page-loading"><i class="fa fa-pulse fa-spinner"></i></span>`;
    }

    _getJumpInput(){
        return `<input class="ys-page-go-input form-control" type="text" /><span class="ys-page-go">GO</span>`;
    }

    _getPagesHtml(){
        if(this.pageTotal < 6){
            return `${new Array(this.pageTotal).join(',').split(',').map((v,i)=>{
                return this._getPageHtml(i+1);
            }).join('')}`;
        }else {
            let c_s = this.current - 2>1?(this.current-2):2,
                c_e = this.current+2<this.pageTotal?(this.current+2):(this.pageTotal-1);
            if(this.current < 3) c_e = 4;
            if(this.current > this.pageTotal-2) c_s = this.pageTotal-3;
            return this._getPageHtml(1)+
                (this.current>4?`<span>...</span>`:``)+
                (new Array(c_e-c_s+1).join(',').split(',').map((v,i)=>{
                    return this._getPageHtml(c_s+i);
                }).join(''))+
                (this.current<this.pageTotal-3?`<span>...</span>`:``)+
                this._getPageHtml(this.pageTotal);
        }
    }

    _getPageHtml(n){
        return `<span class="ys-page-pager${n === this.current?' current':''}">${n}</span>`;
    }

    _renderHtml() {
        this.outer.html(this._getHtml());
    }

    _pageChange(){
        this._renderHtml();
        this.loading && this.toggleLoading(true);
        this.onChange({current:this.current,total:this.total,pageSize:this.pageSize});
    }

    _bindEvent() {
        const that = this;
        this.outer.on('click','.ys-page-prev:not(.disabled)',function () {
            if(that.isLoading) return;
            that.current--;
            that._pageChange();
        }).on('click','.ys-page-next:not(.disabled)',function () {
            if(that.isLoading) return;
            that.current++;
            that._pageChange();
        }).on('click','.ys-page-pager:not(.current)',function () {
            if(that.isLoading) return;
            that.current = $(this).text()-0;
            that._pageChange();
        }).on('click','.ys-page-go',function () {
            if(that.isLoading) return;
            const current = Number(that.outer.find('.ys-page-go-input').val());
            if(!current || current == that.current) return;
            that.current = current;
            that._pageChange();
        }).on('keydown','.ys-page-go-input',function (e) {
            if(that.isLoading) return;
            if(e.which == 13){
                const current = Number($(this).val());
                if(!current || current == that.current) return;
                that.current = current;
                that._pageChange();
            }
        });
    }

    /**
     * 设置分页数据
     * @param current 当前页码
     * @param pageSize 每页条数
     * @param total 总条数
     */
    setPageData({ current=this.current, pageSize=this.pageSize, total=this.total}){
        this.current = Number(current)>0?Number(current):this.current;
        this.pageSize = Number(pageSize)>0?Number(pageSize):this.pageSize;
        this.total = Number(total) >= 0 ? Number(total):this.total;
        this.pageTotal = Math.ceil(this.total/this.pageSize);
        this.pageTotal === 0 && (this.pageTotal = 1);
        if(this.current > this.pageTotal) this.current = this.pageTotal;
        this._renderHtml();
    }

    /**
     * loading开关
     * @param bol
     */
    toggleLoading(bol){
        this.isLoading = !!bol;
        bol?this.outer.find('.ys-page-loading').show():this.outer.find('.ys-page-loading').hide();
    }
}