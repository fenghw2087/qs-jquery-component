import $ from 'jquery';

import * as CommonUtil from '../../common/common';
import {propsList, apiList} from "./paramsAndApi";

import './less/uploadfilemodal.less';

class UploadfilemodalPage {
    constructor() {
        this.outer = $('#uploadfilemodalPageOuter');

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

        CommonUtil.initCode(this.outer);

        CommonUtil.createDetailTable({outer: this.outer, propsList, apiList});
        this._bindEvent();
    }
}

new UploadfilemodalPage().init();