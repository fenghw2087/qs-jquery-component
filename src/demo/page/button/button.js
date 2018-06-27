import $ from 'jquery';

import './css/button.css';

import * as CommonUtil from '../../common/common';
import { propsList, apiList } from "./paramsAndApi";
import message from "../../../component/message/message";

import Button from '../../../component/button/button';

class ButtonPage {
    constructor() {
        this.outer = $('#button');

        this._init();
    }

    init = () => {

    };

    _bindEvent = () => {

    };

    _init = () => {
        this.btn1 = new Button({
            btn:$('#test1'),
            type:'search',
            onClick:()=>{
                message({
                    type:'info',
                    msg:'开始搜索动画，3s后结束'
                });
                setTimeout(()=>{
                    this.btn1.toggleIcon(false);
                },3000);
            }
        });

        this.btn2 = new Button({
            btn:$('#test2'),
            type:'reset',
            onClick:()=>{
                message({
                    type:'info',
                    msg:'开始重置动画，3s后结束'
                });
                setTimeout(()=>{
                    this.btn2.toggleIcon(false);
                },3000);
            }
        });

        this.btn3 = new Button({
            btn:$('#test3'),
            type:'search',
            onClick:()=>{
                this.btn3.toggleIcon(true);
                message({
                    type:'info',
                    msg:'手动触发动画，3s后结束'
                });
                setTimeout(()=>{
                    this.btn3.toggleIcon(false);
                },3000);
            },
            iconAutoShow:false
        });

        CommonUtil.initCode(this.outer);

        CommonUtil.createDetailTable({ outer:this.outer, propsList, apiList });
        this._bindEvent();
    }
}

new ButtonPage().init();