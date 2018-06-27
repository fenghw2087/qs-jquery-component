import $ from 'jquery';

import * as CommonUtil from '../../common/common';
import {propsList, apiList} from "./paramsAndApi";

import './less/dropUpload.less';
import DragUpload from "../../../component/dragUpload/dragUpload";

class DropUploadPage {
    constructor() {
        this.outer = $('#dropUploadPageOuter');

        this._init();
    }

    init = () => {

    };

    _bindEvent = () => {
        const that = this;
        this.outer.on('click', function () {

        })
    };

    _init = () => {
        this.uploadImg = new DragUpload({
            outer:$('#test1'),
            url:'uploadFile',
            maxImgs:3
        });


        CommonUtil.initCode(this.outer);

        CommonUtil.createDetailTable({outer: this.outer, propsList, apiList});
        this._bindEvent();
    }
}

new DropUploadPage().init();