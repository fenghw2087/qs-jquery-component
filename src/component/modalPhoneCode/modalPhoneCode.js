/**
 * Created by Administrator on 2018/1/15.
 */
import $ from 'jquery';
import CommonModal from '../commonModal/commonModal';
import tips from '../tips/tips';

import './css/modalPhoneCode.less';

const MODAL_ID = 'modalPhoneCode';
/**
 * 发短信 图形验证码 modal
 */
export default class ModalPhoneCode extends CommonModal {
    constructor(props){
        super(props);
        this.props = props;
        this.modal = null;
        this.imgSrc = this.props.imgSrc;//图形验证码src
        this.fn = this.props.fn;//确认回调

        this._init();
    }

    _init(){
        this._renderHtml();
        this._bindEvent();
    }

    _renderHtml(){
        if(!$('#'+MODAL_ID).length) $('body').append(this._getHtml());
        this.modal = $('#'+MODAL_ID);
    }

    _getBodyHtml(){
        return `<div style="text-align: center;width: 250px;margin: 0 auto">
            <img class="ver-img" src="${this.imgSrc+'&t='+Date.now()}" />
            <div style="margin: 10px 0">PS:看不清？点击图片换一张</div>
            <input class="form-control" name="code" auto-focus placeholder="请输入上方图形验证码" />
        </div>`;
    }

    _getHtml(){
        const body = this._getBodyHtml();
        const contentStyle = 'width:500px;left:50px;top:100px';
        return this.getBasicHtml({
            title:'图形验证',
            id:MODAL_ID,
            body,
            contentStyle
        });
    }

    _bindEvent(){
        const that = this;
        this.modal && this.modal.on('click','.ver-img',function () {
            $(this).attr('src',that.imgSrc+'&t='+Date.now());
        }).on('click','.confirm-btn',function () {
            const codeInput = that.modal.find('input[name="code"]');
            const code = $.trim(codeInput.val());
            if(!code){
                return tips({
                    msg:'请输入图形验证码',
                    obj:codeInput,
                    side:3
                });
            }
            that.fn(code);
        });
    }
}