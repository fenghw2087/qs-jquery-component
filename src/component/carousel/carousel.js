import './css/carousel.less';

/**
 * 轮播组件
 */
export default class Carousel {
    /**
     * 构造函数
     * @param outer 外部容器，容器内预先写好所有section
     * @param current 默认展示的section下标
     * @param during 自动切换间隔，默认5s
     * @param autoChange 是否自动切换
     * @param hasPager 是否包含顶部页面
     * @param hasSidePager 是否包含侧边翻页
     */
    constructor({ outer,current=0,during=5,autoChange,hasPager=true,hasSidePager=true }) {
        if(!(outer instanceof $) || (outer instanceof $ && outer.length !== 1)) throw new TypeError('Carousel param outer must be a one length jquery dom');
        this.outer = outer.addClass('carousel-outer');
        this.section = this.outer.children().addClass('carousel-section');
        this.current = current;
        this.during = during;
        this.autoChange = autoChange;
        this.hasPager = hasPager;
        this.hasSidePager = hasSidePager;

        this._init();
    }

    _setPosition =(type)=> {
        if(this.current === 0 && !type){
            this.section.eq(0).removeClass('trans');
            setTimeout(()=>{
                this.section.eq(0).css({ marginLeft:'100%' });
            },20);
            setTimeout(()=>{
                this.section.eq(0).addClass('trans');
                setTimeout(()=>{
                    [].forEach.call(this.section,(v,i)=>{
                        this.section.eq(i).css({ marginLeft:100*(-(this.section.length-i+this.current)%this.section.length)+'%' });
                    });
                },20);
            },110);

            setTimeout(()=>{
                [].forEach.call(this.section,(v,i)=>{
                    this.section.eq(i).removeClass('trans');
                });
            },500);
            setTimeout(()=>{
                [].forEach.call(this.section,(v,i)=>{
                    this.section.eq(i).css({ marginLeft:100*(i-this.current)+'%' });
                });
                setTimeout(()=>{
                    [].forEach.call(this.section,(v,i)=>{
                        this.section.eq(i).addClass('trans');
                    });
                },100);
            },900);

        }else {
            [].forEach.call(this.section,(v,i)=>{
                this.section.eq(i).css({ marginLeft:100*(i-this.current)+'%' });
            });
        }
        this.hasPager && this.navs.removeClass('active').eq(this.current).addClass('active');

        this.autoChange && (this.timer = setTimeout(()=>{
            this.current = (this.current+1)%this.section.length;
            this._setPosition();
        },this.during*1000));
    };

    _initPosition =()=> {
        [].forEach.call(this.section,(v,i)=>{
            this.section.eq(i).css({ marginLeft:100*(i-this.current)+'%' }).addClass('trans');
        });
        this.hasPager && this.navs.removeClass('active').eq(this.current).addClass('active');
    };

    _renderNavs =()=> {
        this.outer.append(`<div class="carousel-nav">${ [].map.call(this.section,(v,i)=>{
            return `<div class="carousel-nav-icon${ i === this.current?' active':'' }"><span class="carousel-nav-i"></span></div>`;
        }).join('') }</div>`);

        this.navs = this.outer.find('.carousel-nav-icon');
    };

    _renderSidePager =()=> {
        this.outer.append(`<div class="carousel-side-pager carousel-left-side-pager fa fa-arrow-left"></div><div class="carousel-side-pager carousel-right-side-pager fa"></div>`)
    };

    _bindEvent() {
        const that = this;
        this.outer.on('click','.carousel-nav-icon',function () {
            that.current = $(this).index();
            that.timer && clearTimeout(that.timer);
            that._setPosition(true);
        }).on('click','.carousel-side-pager',function () {
            if($(this).hasClass('carousel-left-side-pager')){
                that.current = (that.current+that.section.length-1)%that.section.length;
            }else {
                that.current = (that.current+1)%that.section.length;
            }
            that.timer && clearTimeout(that.timer);
            that._setPosition($(this).hasClass('carousel-left-side-pager'));
        });
    }

    _init() {
        this.hasPager && this._renderNavs();

        this.hasSidePager && this._renderSidePager();

        this._initPosition();
        if(this.autoChange){
            this.timer = setTimeout(()=>{
                this.current = (this.current+1)%this.section.length;
                this._setPosition();
            },this.during*1000);
        }

        this._bindEvent();
    }
}