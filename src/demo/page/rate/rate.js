import $ from 'jquery';

import './css/rate.css';

import * as CommonUtil from '../../common/common';
import {propsList, apiList} from "./paramsAndApi";
import Rate from "../../../component/rate/rate";
import message from "../../../component/message/message";

class ratePage {
    constructor() {
        this.outer = $('#rate');

        this._init();
    }

    init = () => {

    };

    _bindEvent = () => {
        const that = this;
        this.outer.on('click','.btn-test1', function () {
            const rate = $(this).prev().find('input').val();
            that.rate.setStar(rate);
            message({
                type:'success',
                msg:'当前评分为'+rate
            })
        })
    };

    _init = () => {
        new Rate({
            outer:$('#test1'),
            readOnly:false
        });

        new Rate({
            outer:$('#test2'),
            currentRate:2
        });

        new Rate({
            outer:$('#test3'),
            currentRate:3.4
        });

        new Rate({
            outer:$('#test4'),
            readOnly:false,
            colorCB:n=>{
                n = parseInt(n);
                const color = [ '#ea6345', '#ea6345', '#aa6e92', '#4585f3', '#16a4c8', '#00bf8b' ];
                return color[n];
            },
            textCB:n=>{
                if(n === 0) return '';
                if(n<2) return '差';
                if(n<4) return '一般';
                return '很好'
            }
        });

        this.rate = new Rate({
            outer:$('#test5'),
            colorCB:n=>{
                n = parseInt(n);
                const color = [ '#ea6345', '#ea6345', '#aa6e92', '#4585f3', '#16a4c8', '#00bf8b' ];
                return color[n];
            },
            textCB:n=>{
                if(n === 0) return '';
                if(n<2) return '差';
                if(n<4) return '一般';
                return '很好'
            }
        });

        CommonUtil.initCode(this.outer);

        CommonUtil.createDetailTable({outer: this.outer, propsList, apiList});
        this._bindEvent();
    }
}

new ratePage().init();