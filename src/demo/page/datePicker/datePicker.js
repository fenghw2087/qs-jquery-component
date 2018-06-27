import $ from 'jquery';

import './css/datePicker.css';
import './css/date.less';

import * as CommonUtil from '../../common/common';
import {propsList, apiList} from "./paramsAndApi";
import message from "../../../component/message/message";
import DatePicker from "../../../component/datePicker/datePicker";

class datePickerPage {
    constructor() {
        this.outer = $('#datePicker');

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
        new DatePicker({
            input:$('#test1'),
            onDateChange:(date)=>{
                message({
                    type:'success',
                    msg:'当前选中日期：'+date
                })
            }
        });

        new DatePicker({
            input:$('#test2'),
            defaultFormat:'yyyy/MM/dd',
            currentDate:Date.now(),
            onDateChange:(date)=>{
                message({
                    type:'success',
                    msg:'当前选中日期：'+date
                })
            }
        });

        new DatePicker({
            input:$('#test3'),
            defaultFormat:'yyyy年MM月dd日',
            currentDate:Date.now(),
            onDateChange:(date)=>{
                message({
                    type:'success',
                    msg:'当前选中日期：'+date
                })
            }
        });

        new DatePicker({
            input:$('#test4'),
            type:'year',
            defaultFormat:'yyyy年',
            onDateChange:(date)=>{
                message({
                    type:'success',
                    msg:'当前选中日期：'+date
                })
            }
        });

        new DatePicker({
            input:$('#test5'),
            type:'month',
            defaultFormat:'yyyy年MM月',
            onDateChange:(date)=>{
                message({
                    type:'success',
                    msg:'当前选中日期：'+date
                })
            }
        });

        this.startDatePicker = new DatePicker({
            input:$('#test6'),
            onDateChange:(date)=>{
                this.endDatePicker.setStartDate(date).pickerShow();
            }
        });

        this.endDatePicker = new DatePicker({
            input:$('#test7'),
            onDateChange:(date)=>{
                this.startDatePicker.setEndDate(date)
            }
        });

        CommonUtil.initCode(this.outer);

        CommonUtil.createDetailTable({outer: this.outer, propsList, apiList});
        this._bindEvent();
    }
}

new datePickerPage().init();