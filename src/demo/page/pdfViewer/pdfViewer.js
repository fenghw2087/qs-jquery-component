import $ from 'jquery';

import './css/pdfViewer.css';

import * as CommonUtil from '../../common/common';
import {propsList, apiList} from "./paramsAndApi";
import PdfViewer from "../../../component/pdfViewer/pdfViewer";

class PdfViewerPage {
    constructor() {
        this.outer = $('#pdfViewer');

        this._init();
    }

    init = () => {

    };

    _bindEvent = () => {
        const that = this;
        this.outer.on('click','.btn-test1', function () {
            that.pdfViewer.show('http://yscredit-test.oss-cn-hangzhou.aliyuncs.com/sz38af9f34b3eb4c98a051a20569e26118.pdf');
        })
    };

    _init = () => {
        this.pdfViewer = new PdfViewer();

        CommonUtil.initCode(this.outer);

        CommonUtil.createDetailTable({outer: this.outer, propsList, apiList});
        this._bindEvent();
    }
}

new PdfViewerPage().init();