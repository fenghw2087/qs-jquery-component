import $ from 'jquery';

import './css/notification.css';

import * as CommonUtil from '../../common/common';
import {propsList, apiList} from "./paramsAndApi";
import notification from "../../../component/notification/notification";
import message from "../../../component/message/message";

class NotificationPage {
    constructor() {
        this.outer = $('#notification');

        this._init();
    }

    init = () => {

    };

    _bindEvent = () => {
        const that = this;
        this.outer.on('click','.btn-test1', function () {
            notification({
                type:'success',
                title:'成功提示',
                msg:'成功内容'
            })
        }).on('click','.btn-test2', function () {
            notification({
                type:'info',
                title:'信息提示',
                msg:'信息内容'
            })
        }).on('click','.btn-test3', function () {
            notification({
                type:'warning',
                title:'警告提示',
                msg:'警告内容'
            })
        }).on('click','.btn-test4', function () {
            notification({
                type:'error',
                title:'错误提示',
                msg:'错误内容'
            })
        }).on('click','.btn-test5', function () {
            notification({
                type:'success',
                title:'成功提示',
                msg:'我不会自动消失',
                time:0
            })
        }).on('click','.btn-test6', function () {
            notification({
                title:'成功提示',
                msg:'请点击下方按钮',
                time:0,
                confirmBtn:{
                    show:true,
                    text:'点我确认',
                    onClick:( close )=>{
                        message({
                            type:'success',
                            msg:'可以在这里执行自定义事件'
                        });
                        //关闭通知
                        close();
                    }
                },
                closeBtn:{
                    show:true,
                    text:'点我关闭'
                }
            })
        })
    };

    _init = () => {

        CommonUtil.initCode(this.outer);

        CommonUtil.createDetailTable({outer: this.outer, propsList, apiList});
        this._bindEvent();
    }
}

new NotificationPage().init();