import * as UrlUtil from '../../util/lib/urlUtil';
import $ from 'jquery';
/**
 * 简单路由组件，依赖historyAPI，如不支持将回退到正常的页面刷新
 */
export default class YsRouter {
    /**
     * 构造方法
     * @param router 路由数据对象 {key:value}形式   key为路由的url
     */
    constructor({ router }) {
        if(!router) throw new Error('YsRouter must has a router param');
        this.router = router;
        this.history = window.history;
        this.historySupport = typeof this.history.pushState === 'function';
        this.currentRoute = '';
        this.selfHistory = [];

        this._init();
    }

    getRouterConfig(){
        return this.router;
    }

    /**
     * 页面前进
     * @param state
     * @param title
     * @param url
     * @param page
     */
    push({state={},title='',url='',page}){
        let route;
        if(page){
            route = this.getRouteByName(page);
            url = route.path;
        }else {
            const params = UrlUtil.getUrlParams(UrlUtil.getSearchFromStr(url));
            state = $.extend(state,params);
            url = url.split('?').shift();
            route = this._findRouteByPath(url);
        }
        if(!route) throw new Error(url+' 404 not found');
        this.selfHistory.push(route);
        const search = UrlUtil.createSearch(state);
        if(!this.historySupport){
            return window.location.href = url+search;
        }
        this.history.pushState(state,title,url+search);

        route.state = state;
        this.currentRoute = route;
        this.currentRoute.page.init(this.currentRoute,this,'push');
    }

    /**
     * 页面替换
     * @param state
     * @param title
     * @param url
     * @param page
     */
    replace({state={},title='',url='',page}){
        let route;
        if(page){
            route = this.getRouteByName(page);
            url = route.path;
        }else {
            const params = UrlUtil.getUrlParams(UrlUtil.getSearchFromStr(url));
            state = $.extend(state,params);
            url = url.split('?').shift();
            route = this._findRouteByPath(url);
        }
        if(!this.historySupport){
            return window.location.href = route.path;
        }
        if(!route) throw new Error(url+' 404 not found');
        const search = UrlUtil.createSearch(state);
        this.selfHistory.pop();
        this.selfHistory.push(route);
        this.history.replaceState(state,title,url+search);
        route.state = state;
        this.currentRoute = route;
        this.currentRoute.page.init(this.currentRoute,this,'replace');
    }

    /**
     * 页面回退
     */
    pop(){
        if(this.selfHistory.length>1){
            this.history.go(-1);
            this.selfHistory.pop();
            this.currentRoute = this.selfHistory[this.selfHistory.length-1];
        }else {
            const parentRoute = this._findParentRoute(this.currentRoute.path);
            if(typeof parentRoute.page.emptyPop === "function"){
                parentRoute.page.emptyPop({
                    router:this,
                    route:parentRoute,
                    childRoute:this.currentRoute
                });
            }else {
                this.replace({ url:parentRoute.path });
            }
        }
    }

    /**
     * 获取当前state
     * @returns {any | {}}
     */
    getState(){
        return this.currentRoute.state;
    }

    /**
     * 获取当前路由信息
     * @returns {{url: string|*, state}}
     */
    getCurrent(){
        return {
            route:this.currentRoute,
            index:this.router.findIndex((v)=>{
                return v.path === this.currentRoute.path;
            })
        };
    }

    _init(){
        this._bindEvent();
    }

    getRouteByName(name){
        return this.router.find(function (v) {
            return v.name === name;
        });
    }

    _findRouteByPath(path){
        return this.router.find(function (v) {
            return v.path === path;
        });
    }

    initCurrent(){
        const path = window.location.pathname;
        const route = this._findRouteByPath(path);
        if(!route) throw new Error(path+' 404 not found');
        const search = window.location.search;
        if(this.historySupport){
            if(!route.state && search){
                const state = {};
                search.substr(1).split('&').forEach((v)=>{
                    state[v.split('=')[0]] = v.split('=')[1];
                });
                return this.replace({
                    state,
                    url:path+search
                });
            }
            return this.replace({
                state:route.state,
                url:route.path
            });
        }else {
            const state = {};
            search.substr(1).split('&').forEach((v)=>{
                state[v.split('=')[0]] = v.split('=')[1];
            });
            route.state = state;
            this.currentRoute = route;
            this.currentRoute.page.init(this.currentRoute,this);
        }

    }

    _findParentRoute(path){
        const current = this._findRouteByPath(path);
        return this.router.find(function (v) {
            return v.name === current.parent;
        });
    }

    _bindEvent(){
        window.onpopstate = ()=> {
            this.currentRoute = this._findRouteByPath(window.location.pathname);
            this.currentRoute.state = this.history.state;
            this.currentRoute.page.init(this.currentRoute,this,'pop');
        }
    }
}