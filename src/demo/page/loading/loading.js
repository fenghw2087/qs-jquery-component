import $ from 'jquery';

import './css/loading.css';

import * as CommonUtil from '../../common/common';
import {propsList, apiList} from "./paramsAndApi";
import loading from "../../../component/loading/loading";

class LoadingPage {
    constructor() {
        this.outer = $('#loading');

        this._init();
    }

    init = () => {

    };

    _bindEvent = () => {
    };

    _init = () => {
        $('#test1').html( loading() );
        $('#test2').html( loading('small') );

        CommonUtil.initCode(this.outer);

        CommonUtil.createDetailTable({outer: this.outer, propsList, apiList});
        this._bindEvent();
    }
}

new LoadingPage().init();