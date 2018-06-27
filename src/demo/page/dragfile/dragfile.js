import $ from 'jquery';

import * as CommonUtil from '../../common/common';
import {propsList, apiList} from "./paramsAndApi";

import './less/dragfile.less';
import DragFile from "../../../component/dragFile/dragFile";
import message from "../../../component/message/message";

class DragfilePage {
    constructor() {
        this.outer = $('#dragfilePageOuter');

        this._init();
    }

    init = () => {

    };

    _bindEvent = () => {

    };

    _init = () => {
        this.dragFile = new DragFile({
            outer:$('#test1'),
            fileTypes:['xls','xlsx'],
            title:'文件上传样例',
            onFileReady:(files)=>{
                message({
                    type:'success',
                    msg:'已导入文件：'+files.name
                })
            }
        });

        CommonUtil.initCode(this.outer);

        CommonUtil.createDetailTable({outer: this.outer, propsList, apiList});
        this._bindEvent();
    }
}

new DragfilePage().init();