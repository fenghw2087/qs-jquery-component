import $ from 'jquery';

import './css/checkbox.css';

import CheckBox from "../../../component/checkbox/checkBox";

import * as CommonUtil from '../../common/common';
import { propsList, apiList } from "./paramsAndApi";
import message from "../../../component/message/message";

class CheckboxPage {
    constructor() {
        this.outer = $('#checkbox');

        this._init();
    }

    init = () => {

    };

    _bindEvent = () => {
        const that = this;
        this.outer.on('click','.btn-test1',function () {
            that.check.setChecked(true);
        }).on('click','.btn-test2',function () {
            that.check.setChecked(false);
        }).on('click','.btn-test3',function () {
            const checked = that.check.getChecked();
            message({
                type:'info',
                msg:'当前选中状态：'+(checked?'选中':'未选中')
            })
        })
    };

    _init = () => {
        new CheckBox({
            obj:$('#test1'),
            onChange:(checked)=>{
                message({
                    type:'info',
                    msg:checked?'选中':'未选中'
                })
            }
        });

        const colors = ['#ff8b00','#00b793','#d52740'];
        $('#colorTest').find('.test-check').each((i,target)=> {
            new CheckBox({
                obj:$(target),
                color:colors[i],
                checked:i%2
            })
        });

        this.check = new CheckBox({
            obj:$('#test2'),
            onChange:(checked)=>{

            }
        });

        CommonUtil.initCode(this.outer);

        CommonUtil.createDetailTable({ outer:this.outer, propsList, apiList });

        this._bindEvent();
    }
}

new CheckboxPage().init();