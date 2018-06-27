/**
 * Created by Administrator on 2018/1/15.
 */
import $ from 'jquery';
import './css/commonModal.less';
//防止bootstrap modal打开时无法聚焦modal外input
$.fn.modal.Constructor.prototype.enforceFocus = function () {};
/**
 * modal基类
 */
export default class CommonModal {
    constructor(){

    }

    /**
     * 弹框出现
     * @returns {CommonModal}
     */
    modalShow(){
        this.resetMsg();
        this.modal.modal('show').find('input[auto-focus]').focus();
        return this;
    }

    /**
     * 弹框收起
     * @returns {CommonModal}
     */
    modalHide(){
        this.modal.modal('hide');
        return this;
    }

    /**
     * 确认按钮开关loading
     * @param bol
     */
    toggleloading(bol) {
        bol?this.modal.find('.confirm-loading').show():this.modal.find('.confirm-loading').hide();
    }

    /**
     * 展示全局错误信息
     * @param msg 信息
     * @param time 展示时间，默认2s
     */
    showFail(msg,time=2000) {
        this.modal.find('.modal-footer-fail').show().find('.msg').text(msg);
        setTimeout(()=> {
            this.modal.find('.modal-footer-fail').hide();
        },time);
    }

    /**
     * 重置消息
     */
    resetMsg() {
        this.modal.find('.modal-footer-fail').hide();
        this.modal.find('.modal-footer.default').show();
    }

    /**
     * 设置弹框标题
     * @param title
     */
    setTitle(title){
        this.modal.find('.modal-title').text(title);
    }

    setConfirmFn(fn) {
        typeof fn === 'function' && (this.confirmFn = fn);
        return this;
    };

    /**
     * modal骨架html
     * @param id
     * @param title 标题
     * @param body modal-body
     * @param contentStyle 设置modal的宽度和位置
     * @param footer modal-footer
     * @returns {string}
     */
    getBasicHtml({id,title,body='',contentStyle='',footer=this.getFooterHtml()}){
        return `<div class="modal fade modal-ys" id="${id}" tabindex="-1" role="dialog" aria-labelledby="${id}" data-backdrop="static">
    <div class="modal-dialog modal-md" role="document">
        <div class="modal-content" style="overflow: visible;${contentStyle}">
            <div class="modal-header">
                <button class="close" data-dismiss="modal" aria-label="Close"></button>
                <h4 class="modal-title">${title}</h4>
            </div>
            <div class="modal-body" style="min-height: 150px">
                ${body}
            </div>
            ${footer}
        </div>
    </div>
</div>`
    }

    /**
     * modal默认footer
     * @returns {string}
     */
    getFooterHtml(){
        return `<div class="modal-footer default" style="padding: 15px;">
                <div class="modal-footer-fail" style="display: none"><i class="fa fa-exclamation-circle fa-lg" style="color: #d42740;"></i><span class="msg"></span></div>
                <button class="btn btn-default btn-cancel" data-dismiss="modal">取 消</button>
                <button class="btn btn-ys confirm-btn" style="margin-left: 20px"><i style="display: none" class="fa fa-spin fa-spinner mr10 confirm-loading"></i>确 认</button>
            </div>`;
    }
}