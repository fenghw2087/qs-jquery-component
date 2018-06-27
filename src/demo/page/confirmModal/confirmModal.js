import $ from 'jquery';

import './css/confirmModal.css';

import * as CommonUtil from '../../common/common';
import {propsList, apiList} from "./paramsAndApi";
import message from "../../../component/message/message";
import ConfirmModal from "../../../component/confirmModal/confirmModal";

class confirmModalPage {
    constructor() {
        this.outer = $('#confirmModal');

        this._init();
    }

    init = () => {

    };

    _bindEvent = () => {
        const that = this;
        this.outer.on('click','.btn-test1', function () {
            that.confirmModal.setData({
                title:'确认删除',
                msg:'是否确认删除本条信息？',
                confirmFn:()=>{
                    that.confirmModal.modalHide();
                    message({
                        type:'success',
                        msg:'删除成功！'
                    })
                }
            }).modalShow()
        })
    };

    _init = () => {
        this.confirmModal = new ConfirmModal({});

        CommonUtil.initCode(this.outer);

        CommonUtil.createDetailTable({outer: this.outer, propsList, apiList});
        this._bindEvent();
    }
}

new confirmModalPage().init();