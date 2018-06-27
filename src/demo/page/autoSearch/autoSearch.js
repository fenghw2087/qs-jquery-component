import $ from 'jquery';

import './css/autoSearch.css';

import * as CommonUtil from '../../common/common';
import {propsList, apiList} from "./paramsAndApi";

import AutoSearch from '../../../component/autoSearch/autoSearch';

class autoSearchPage {
    constructor() {
        this.outer = $('#autoSearch');

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
        new AutoSearch({
            input:$('#test1').find('input'),
            fn:(value)=>{
                $('#test-result').text(value)
            }
        });

        new AutoSearch({
            input:$('#test2').find('input'),
            fn:(value)=>{
                $('#test-result2').text(value)
            },
            delay:0
        });

        CommonUtil.initCode(this.outer);

        CommonUtil.createDetailTable({outer: this.outer, propsList, apiList});
        this._bindEvent();
    }
}

new autoSearchPage().init();