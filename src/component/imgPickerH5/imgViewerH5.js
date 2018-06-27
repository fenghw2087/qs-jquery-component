
export default class ImgViewerH5 {
    constructor() {
        this.id = 'imgViewerH5'+Math.ceil(Math.random()*1000000);
        this._init();
    }

    _renderHtml() {
        const html = `<div id="${ this.id }" class="view-img-h5-container"><div class="img-c-h5"></div><div class="img-h5-tool"><i class="fa fa-trash-o"></i></div></div>`;
        $('body').append(html);

        this.outer = $('#'+this.id);
        this.img = this.outer.find('img');
    }

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