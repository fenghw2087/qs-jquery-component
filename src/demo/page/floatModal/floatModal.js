import $ from 'jquery';

import './css/floatModal.css';

import * as CommonUtil from '../../common/common';
import {propsList, apiList} from "./paramsAndApi";
import message from "../../../component/message/message";
import FloatModal from "../../../component/floatModal/floatModal";

class floatModalPage {
    constructor() {
        this.outer = $('#floatModal');

        this._init();
    }

    init = () => {

    };

    _bindEvent = () => {
        const that = this;
        this.outer.on('click','.btn-test1', function () {
            that.floatModal2.show({
                title:'向上的弹框',
                obj:$(this),
                side:1,
                fn:()=>{
                    that.floatModal2.hide();
                    message({
                        type:'success',
                        msg:'确认向上的弹框'
                    })
                }
            })
        }).on('click','.btn-test2', function () {
            that.floatModal2.show({
                title:'向右的弹框',
                obj:$(this),
                side:2,
                fn:()=>{
                    that.floatModal2.hide();
                    message({
                        type:'success',
                        msg:'确认向右的弹框'
                    })
                }
            })
        }).on('click','.btn-test3', function () {
            that.floatModal2.show({
                title:'向下的弹框',
                obj:$(this),
                side:3,
                fn:()=>{
                    that.floatModal2.hide();
                    message({
                        type:'success',
                        msg:'确认向下的弹框'
                    })
                }
            })
        }).on('click','.btn-test4', function () {
            that.floatModal2.show({
                title:'向左的弹框',
                obj:$(this),
                side:4,
                fn:()=>{
                    that.floatModal2.hide();
                    message({
                        type:'success',
                        msg:'确认向左的弹框'
                    })
                }
            })
        }).on('click','.btn-test5', function () {
            const k = 4234;
            that.floatModal.show({
                title:'请输入'+k+'进行确认',
                obj:$(this),
                side:1,
                placeholder:'请输入验证数字',
                fn:(value)=>{
                    if(value-0 === k){
                        message({
                            type:'success',
                            msg:'验证正确'
                        });
                        that.floatModal.hide();
                    }else {
                        that.floatModal.showMsg('输入不正确')
                    }
                }
            })
        })
    };

    _init = () => {
        this.floatModal = new FloatModal({});

        this.floatModal2 = new FloatModal({ noInput:true });

        CommonUtil.initCode(this.outer);

        CommonUtil.createDetailTable({outer: this.outer, propsList, apiList});
        this._bindEvent();
    }
}

new floatModalPage().init();