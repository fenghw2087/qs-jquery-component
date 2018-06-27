import $ from 'jquery';

import './css/message.css';

import * as CommonUtil from '../../common/common';
import {propsList, apiList} from "./paramsAndApi";
import message from "../../../component/message/message";

class messagePage {
    constructor() {
        this.outer = $('#message');

        this._init();
    }

    init = () => {

    };

    _bindEvent = () => {
        this.outer.on('click','.btn-test1', function () {
            message({
                type:'success',
                msg:'成功提示'
            })
        }).on('click','.btn-test2', function () {
            message({
                type:'info',
                msg:'信息提示'
            })
        }).on('click','.btn-test3', function () {
            message({
                type:'warning',
                msg:'警告提示'
            })
        }).on('click','.btn-test4', function () {
            message({
                type:'error',
                msg:'错误提示'
            })
        })
    };

    _init = () => {

        CommonUtil.initCode(this.outer);

        CommonUtil.createDetailTable({outer: this.outer, propsList, apiList});
        this._bindEvent();
    }
}

new messagePage().init();