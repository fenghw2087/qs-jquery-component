import $ from 'jquery';

import * as CommonUtil from '../../common/common';
import {propsList, apiList} from "./paramsAndApi";

import './css/coolDownBtn.css';
import CoolDownBtn from "../../../component/coolDownBtn/coolDownBtn";
import message from "../../../component/message/message";

class CoolDownBtnPage {
    constructor() {
        this.outer = $('#coolDownBtnPageOuter');

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
        this.cdBtn = new CoolDownBtn({
            obj:$('#test1'),
            text:'获取验证码',
            disableStyle:{
                backgroundColor:'#aaa'
            },
            cd:10,
            onClick:()=>{
                this.cdBtn.startCD();
                message({
                    type:'success',
                    msg:'发送验证码成功,10S后可再次发送'
                })
            },
            coolDownFn:()=>{
                message({
                    type:'info',
                    msg:'冷却完成'
                })
            }
        });

        CommonUtil.initCode(this.outer);

        CommonUtil.createDetailTable({outer: this.outer, propsList, apiList});
        this._bindEvent();
    }
}

new CoolDownBtnPage().init();