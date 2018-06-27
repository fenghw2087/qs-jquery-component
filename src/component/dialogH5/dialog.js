/**
 **create by 2087, Mon Apr 23 2018
 **/

import $ from 'jquery';

import './less/dialog.less';

export default class DialogH5 {
    constructor() {
        this.id = 'dialogH5'+Math.ceil(Math.random()*10000000);

        this._init();
    }


    _bindEvent = () => {
        const that = this;
        this.modal.on('click','.weui-dialog__btn_default',function () {
            that.modalHide();
        }).on('click','.weui-dialog__btn_primary',function () {
            that.confirmFn();
        }).on('click','.weui-mask',function () {
            that.modalHide();
        })
    };

    modalShow =()=> {
        this.modal.fadeIn();
    };

    modalHide =()=> {
        this.modal.fadeOut();
    };

    setData =({msg, fn})=>{
        this.confirmFn = fn;
        this.msgC.html(msg);
        return this;
    };

    _renderHtml =()=> {
        if(!$('#'+this.id).length){
            $('body').append(this._getHtml())
        }
        this.modal = $('#'+this.id);
        this.msgC = this.modal.find('.weui-dialog__bd');
    };

    _getHtml =()=> {
        return `<div class="js_dialog" id="${this.id}" style="display: none">
    <div class="weui-mask"></div>
    <div class="weui-dialog weui-skin_android">
        <div class="weui-dialog__bd"></div>
        <div class="weui-dialog__ft">
            <a href="javascript:;" class="weui-dialog__btn weui-dialog__btn_default">取消</a>
            <a href="javascript:;" class="weui-dialog__btn weui-dialog__btn_primary">确认</a>
        </div>
    </div>
</div>`
    };

    _init = () => {
        this._renderHtml();
        this._bindEvent();
    }
}
