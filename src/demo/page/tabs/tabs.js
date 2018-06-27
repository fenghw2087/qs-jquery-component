import $ from 'jquery';

import * as CommonUtil from '../../common/common';
import {propsList, apiList} from "./paramsAndApi";

import './css/tabs.css';

class TabsPage {
    constructor() {
        this.outer = $('#tabsPageOuter');

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

new TabsPage().init();