import $ from 'jquery';

import './css/imgViewer.css';

import * as CommonUtil from '../../common/common';
import {propsList, apiList} from "./paramsAndApi";
import ImgViewer from "../../../component/imgViewer/imgViewer";

class imgViewerPage {
    constructor() {
        this.outer = $('#imgViewer');

        this._init();
    }

    init = () => {

    };

    _bindEvent = () => {
        const that = this;
        this.outer.on('click','#test1', function () {
            that.imgViewer.show($(this).attr('src'));
        })
    };

    _init = () => {
        this.imgViewer = new ImgViewer();

        CommonUtil.initCode(this.outer);

        CommonUtil.createDetailTable({outer: this.outer, propsList, apiList});
        this._bindEvent();
    }
}

new imgViewerPage().init();