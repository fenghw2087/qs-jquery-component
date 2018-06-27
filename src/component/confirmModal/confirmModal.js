import CommonModal from '../commonModal/commonModal';
import $ from "jquery";

const MODAL_ID = 'confirmModal';
export default class ConfirmModal extends CommonModal {
    constructor({
                    title = '', confirmFn = () => {
        }
                }) {
        super();
        this.title = title;
        this.id = MODAL_ID + Math.ceil(Math.random()*10000000);
        this.confirmFn = confirmFn;
        if (typeof this.confirmFn !== 'function') throw new Error('confirmModal param confirmFn must be a function');

        this._init();
    }

    _renderHtml() {
        if (!$('#' + this.id).length) {
            $('body').append(this.getBasicHtml({
                id: this.id,
                title: this.title,
                body: this._getBodyHtml(),
                contentStyle: 'top:100px;width: 500px;left: 50px'
            }));
        }
        this.modal = $('#' + this.id);
    }

    _getBodyHtml() {
        return `<div class="msg" style="padding: 50px 20px 0;text-align: center"></div>`;
    }

    setData =({ title, confirmFn, msg })=> {
        this.setTitle(title);
        this.setConfirmFn(confirmFn);
        this.modal.find('.msg').text(msg);
        this.resetMsg();
        this.toggleloading();
        return this;
    };

    _bindEvent() {
        const that = this;
        this.modal.on('click', '.confirm-btn', function () {
            that.toggleloading(true);
            that.confirmFn();
        })
    }

    _init() {
        this._renderHtml();
        this._bindEvent();
    }
}