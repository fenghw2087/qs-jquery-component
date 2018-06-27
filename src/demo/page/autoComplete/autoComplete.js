import $ from 'jquery';

import './css/autoComplete.css';

import * as CommonUtil from '../../common/common';
import {propsList, apiList} from "./paramsAndApi";
import message from "../../../component/message/message";

import { _search } from "../../common/nav";

import AutoComplete from '../../../component/autoComplete/autoComplete';

class autoCompletePage {
    constructor() {
        this.outer = $('#autoComplete');

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
        new AutoComplete({
            input:$('#test1'),
            getData:(name)=>{
                return _search(name)
            },
            formatList:(data)=>{
                return data
            },
            delay:200,
            renderLi:row=>row.name,
            onSelect:(current)=>{
                const url = '/component'+current.url;
                message({
                    type:'info',
                    msg:'当前选择项目的url为：'+url
                })
            }
        });

        CommonUtil.initCode(this.outer);

        CommonUtil.createDetailTable({outer: this.outer, propsList, apiList});
        this._bindEvent();
    }
}

new autoCompletePage().init();