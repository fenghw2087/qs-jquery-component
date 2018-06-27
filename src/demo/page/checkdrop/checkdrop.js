import $ from 'jquery';

import * as CommonUtil from '../../common/common';
import {propsList, apiList} from "./paramsAndApi";

import './less/checkdrop.less';
import CheckDrop from "../../../component/checkDrop/checkDrop";
import message from "../../../component/message/message";

class CheckdropPage {
    constructor() {
        this.outer = $('#checkdropPageOuter');

        this._init();
    }

    init = () => {

    };

    _bindEvent = () => {
        const that = this;
        this.outer.on('click','.btn-test1', function () {
            that.checkDrop2.renderList(new Array(20).fill(1).map((v,i)=>{
                return {
                    name:'选项'+i,
                    id:i
                }
            }));
            message({
                type:'success',
                msg:'设置选项成功'
            })
        }).on('click','.btn-test2', function () {
            that.checkDrop2.renderList([]);
            message({
                type:'success',
                msg:'清空选项成功'
            })
        })
    };

    _init = () => {
        this.checkDrop = new CheckDrop({
            obj:$('#test1'),
            renderLi:row=>row.name,
            list:new Array(20).fill(1).map((v,i)=>{
                return {
                    name:'选项'+i,
                    id:i
                }
            }),
            onSelectChange:ids=>{
                message({
                    type:'info',
                    msg:'当前选中下标：'+ids.join(',')
                })
            }
        });

        this.checkDrop2 = new CheckDrop({
            obj:$('#test2'),
            renderLi:row=>row.name,
            onSelectChange:ids=>{
                message({
                    type:'info',
                    msg:'当前选中下标：'+ids.join(',')
                })
            }
        });

        CommonUtil.initCode(this.outer);

        CommonUtil.createDetailTable({outer: this.outer, propsList, apiList});
        this._bindEvent();
    }
}

new CheckdropPage().init();