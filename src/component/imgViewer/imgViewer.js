import './css/imgViewer.less';

/**
 * 单图片预览
 */
export default class ImgViewer {
    constructor() {
        this.id = 'imgViewer'+Math.ceil(Math.random()*1000000);
        this._init();
    }

    _renderHtml() {
        const html = `<div id="${ this.id }" class="view-img-container"><span>单击任意区域或按ESC退出预览</span><div style="vertical-align: middle;width: 0;height: 100%;display: inline-block"></div><img src=""></div>`;
        $('body').append(html);

        this.outer = $('#'+this.id);
        this.img = this.outer.find('img');
    }

    /**
     * 预览图片
     * @param url 图片的url
     */
    show =(url)=> {
        this.img.attr('src',url);
        this.outer.show();
    };

    _bindEvent() {
        const that = this;
        this.outer.on('click',function () {
            that.outer.hide();
        });
        $('body').on('keyup',function (e) {
            if(e.keyCode === 27){
                that.outer.hide();
            }
        })
    }

    _init() {
        this._renderHtml();
        this._bindEvent();
    }
}