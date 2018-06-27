/**
**create by 2087, Thu May 24 2018
**/

import $ from 'jquery';

import './less/mutiImgViewer.less';

/**
 * 多图片预览组件
 */
export default class MutiImgViewer {
    constructor() {
        this.id = 'mutiImgViewer'+Math.ceil(Math.random()*100000000000);
        this._init();
    }

    /**
     * 预览图片
     * @param imgs 图片地址的数组
     * @param activeIndex 当前预览的下标
     */
    show =(imgs,activeIndex=0)=> {
        this.imgs = imgs;
        this.activeIndex = activeIndex;
        this._renderImgs();
        this.outer.show();
        $('body').addClass('static-body');
        this.ow = this.imgC.width();
        this.oh = this.imgC.height();
    };

    /**
     * 关闭预览
     */
    hide =()=> {
        this.outer.hide();
        $('body').removeClass('static-body');
    };

    _renderImgs =()=> {
        const lis = this.imgs[this.activeIndex-1];
        const cis = this.imgs[this.activeIndex];
        const ris = this.imgs[this.activeIndex+1];
        this.imgC.html([lis,cis,ris].map((v,i)=>{
            if(v && i === 1){
                const _img = new Image();
                _img.src = v;
                _img.onload =()=>{
                    const width = _img.width;
                    const height = _img.height;
                    let _width = width;
                    let _height = height;
                    const ib = width/height;
                    const cb = this.ow/this.oh;
                    if(width > this.ow){
                        if(ib>cb){
                            _width = this.ow;
                            _height = this.oh*cb/ib;
                        }else {
                            _height = this.oh;
                            _width = this.ow*ib/cb;
                        }
                    }else if(height > this.oh){
                        if(ib>cb){
                            _width = this.ow;
                            _height = this.oh*cb/ib;
                        }else {
                            _height = this.oh;
                            _width = this.ow*ib/cb;
                        }
                    }
                    this.imgC.find(`.img${i+1}`).data({ width:width,height:height }).css({width:`${_width}px`,height:`${_height}px`,display:'block',transform:'translateX(0)'});
                };
            }else if(v && i === 2){
                const _img = new Image();
                _img.src = v;
                _img.onload =()=>{
                    this.imgC.find(`.img${i+1}`).data({ width:_img.width,height:_img.height }).css({width:'100px',height:'70px',display:'block',transform:`translateX(${this.ow/2+60}px)`});
                };
            }else if(v && i === 0){
                const _img = new Image();
                _img.src = v;
                _img.onload =()=>{
                    this.imgC.find(`.img${i+1}`).data({ width:_img.width,height:_img.height }).css({width:'100px',height:'70px',display:'block',transform:`translateX(-${this.ow/2+60}px)`});
                };
            }
            return v?`<img src="${v}" class="img${i+1}" />`:''
        }));
        this.leftBtn.toggle(!!lis);
        this.rightBtn.toggle(!!ris);
    };

    _bindEvent = () => {
        const that = this;
        $('body').on('keydown',function (e) {
            if(e.keyCode === 27){
                that.hide();
            }
        });
        this.outer.on('click','.turn-right-btn',function () {
            that.activeIndex++;
            const li = that.imgC.find('.img1');
            li.remove();
            const ci = that.imgC.find('.img2');
            ci.css({width:'100px',height:'70px',display:'block',transform:`translateX(-${that.ow/2+60}px)`}).removeClass('img2').addClass('img1');
            that.leftBtn.show();
            const ri = that.imgC.find('.img3');
            const width = ri.data('width');
            const height = ri.data('height');
            let _width = width;
            let _height = height;
            const ib = width/height;
            const cb = that.ow/that.oh;
            if(width > that.ow){
                if(ib>cb){
                    _width = that.ow;
                    _height = that.oh*cb/ib;
                }else {
                    _height = that.oh;
                    _width = that.ow*ib/cb;
                }
            }else if(height > that.oh){
                if(ib>cb){
                    _width = that.ow;
                    _height = that.oh*cb/ib;
                }else {
                    _height = that.oh;
                    _width = that.ow*ib/cb;
                }
            }
            ri.removeClass('img3').addClass('img2').css({width:`${_width}px`,height:`${_height}px`,display:'block',transform:'translateX(0)'});
            const nis = that.imgs[that.activeIndex+1];
            if(nis){
                that.imgC.append(`<img src="${nis}" class="img3" />`);
                const _img = new Image();
                _img.src = nis;
                _img.onload =()=> {
                    that.imgC.find('.img3').data({ width:_img.width,height:_img.height }).css({width:'100px',height:'70px',display:'block',transform:`translateX(${that.ow/2+60}px)`});
                }
            }else {
                that.rightBtn.hide();
            }
        }).on('click','.turn-left-btn',function () {
            that.activeIndex--;
            const ri = that.imgC.find('.img3');
            ri.remove();
            const ci = that.imgC.find('.img2');
            ci.css({width:'100px',height:'70px',display:'block',transform:`translateX(${that.ow/2+60}px)`}).removeClass('img2').addClass('img3');
            that.rightBtn.show();
            const li = that.imgC.find('.img1');
            const width = li.data('width');
            const height = li.data('height');
            let _width = width;
            let _height = height;
            const ib = width/height;
            const cb = that.ow/that.oh;
            if(width > that.ow){
                if(ib>cb){
                    _width = that.ow;
                    _height = that.oh*cb/ib;
                }else {
                    _height = that.oh;
                    _width = that.ow*ib/cb;
                }
            }else if(height > that.oh){
                if(ib>cb){
                    _width = that.ow;
                    _height = that.oh*cb/ib;
                }else {
                    _height = that.oh;
                    _width = that.ow*ib/cb;
                }
            }
            li.removeClass('img1').addClass('img2').css({width:`${_width}px`,height:`${_height}px`,display:'block',transform:'translateX(0)'});
            const pis = that.imgs[that.activeIndex-1];
            if(pis){
                that.imgC.append(`<img src="${pis}" class="img1" />`);
                const _img = new Image();
                _img.src = pis;
                _img.onload =()=> {
                    that.imgC.find('.img1').data({ width:_img.width,height:_img.height }).css({width:'100px',height:'70px',display:'block',transform:`translateX(-${that.ow/2+60}px)`});
                }
            }else {
                that.leftBtn.hide();
            }
        }).on('click','.i-close-btn',function () {
            that.hide();
        })
    };

    _renderHtml =()=> {
        if(!$(`#${this.id}`).length){
            $('body').append(this._getHtml());
        }
        this.outer = $(`#${this.id}`);
        this.imgC = this.outer.find('.img-outer');
        this.leftBtn = this.outer.find('.turn-left-btn');
        this.rightBtn = this.outer.find('.turn-right-btn');
    };

    _getHtml =()=> {
        return `<div id="${this.id}" class="muti-img-viewer-outer">
    <div class="i-close-btn"><i class="fa fa-times-circle-o"></i></div>
    <div class="img-c">
        <div class="turn-left-btn">上一张</div>
        <div class="turn-right-btn">下一张</div>
        <div class="img-outer"></div>
    </div>
</div>`
    };

    _init = () => {
        this._renderHtml();
        this._bindEvent();
    }
}
