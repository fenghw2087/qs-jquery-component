export default class Nav {
    /**
     * 导航
     * @param navs 一系列的a标签，href为页面路径
     * @param router 路由
     */
    constructor({ navs, router }) {
        this.navs = navs;
        this.router = router;
        this._init();
    }

    _renderHtml() {

    }

    _bindEvent() {
        const that = this;
        /**
         * 阻止a标签默认跳转，重写为路由跳转
         */
        this.navs.on('click',function () {
            const href = $(this).attr('href');
            that.navs.removeClass('active');
            $(this).addClass('active');
            that.router.replace({url:href});
            return false;
        })
    }

    _init() {
        this._renderHtml();
        this._bindEvent();
    }
}