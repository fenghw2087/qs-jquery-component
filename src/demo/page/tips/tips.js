import $ from 'jquery';

import './css/tips.css';

import * as CommonUtil from '../../common/common';
import {propsList, apiList} from "./paramsAndApi";
import tips from "../../../component/tips/tips";

class TipsPage {
    constructor() {
        this.outer = $('#tips');

        this._init();
    }

    init = () => {

    };

    _bindEvent = () => {
        this.outer.on('click','.btn-test1', function () {
            tips({
                obj:$(this),
                side:1,
                msg:'位于上方的错误提示'
            })
        }).on('click','.btn-test2', function () {
            tips({
                obj:$(this),
                side:2,
                msg:'位于右方的错误提示'
            })
        }).on('click','.btn-test3', function () {
            tips({
                obj:$(this),
                side:3,
                msg:'位于下方的错误提示'
            })
        }).on('click','.btn-test4', function () {
            tips({
                obj:$(this),
                side:4,
                msg:'位于左方的错误提示'
            })
        })
    };

    _init = () => {

        CommonUtil.initCode(this.outer);

        CommonUtil.createDetailTable({outer: this.outer, propsList, apiList});
        this._bindEvent();
    }
}

new TipsPage().init();