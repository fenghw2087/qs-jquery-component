import $ from 'jquery';

import * as CommonUtil from '../../common/common';
import {propsList, apiList} from "./paramsAndApi";

import './css/alert.css';

class AlertPage {
    constructor() {
        this.outer = $('#alertPageOuter');

        this._init();
    }

    init = () => {
        // console.log(1)
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

new AlertPage().init();