import './css/pdfViewer.less'

/**
 * PDF预览容器
 */
export default class PdfViewer {
    constructor() {
        this.id = 'PDFViewer'+Math.ceil(Math.random()*1000000000);
        this._init();
    }

    _renderHtml() {
        const html = `<div class="PDFViewer-outer" id="${ this.id }">
    <i class="fa fa-close fa-3x"></i>
    <div class="PDFViewer-back">
        <iframe id="${ this.id+'I' }" src=""></iframe>
    </div>
</div>`;
        if(!$('#'+this.id).length) $('body').append(html);
        this.viewer = $('#'+this.id);
        this.iframe = $('#'+this.id+'I');
    }

    /**
     * 预览
     * @param src pdf路径
     */
    show = (src)=> {
        this.iframe.attr('src',src);
        this.viewer.show();
    };

    _bindEvent() {
        const that = this;
        this.viewer.on('click','.PDFViewer-back',function () {
            if(this.className === 'PDFViewer-back'){
                that.iframe.attr('src','');
                that.viewer.hide();
            }
        }).on('click','.fa-close',function () {
            that.iframe.attr('src','');
            that.viewer.hide();
        })
    }

    _init() {
        this._renderHtml();
        this._bindEvent();
    }
}