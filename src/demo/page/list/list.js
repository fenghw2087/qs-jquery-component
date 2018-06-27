import $ from 'jquery';

import * as CommonUtil from '../../common/common';
import {propsList, apiList} from "./paramsAndApi";

import './css/list.css';
import List from "../../../component/list/list";
import notification from "../../../component/notification/notification";
import FloatModal from "../../../component/floatModal/floatModal";

class ListPage {
    constructor() {
        this.outer = $('#listPageOuter');

        this._init();
    }

    _getMorkListData =(current)=> {
        return new Array(5).fill(1).map((v,i)=>{
            return {
                name:'项目项目'+current+(i+1),
                qz:5+Math.ceil(Math.random()*15),
                result:70+Math.ceil(Math.random()*30)
            }
        });
    };

    _getMorkList =(current,type)=> {
        const list = this._getMorkListData(current);
        this.list.setData({
            dataSource:list,
            pagination:{
                current,
                total:56
            },
            conditionChange:!!type
        })
    };

    init = () => {
        setTimeout(()=>{
            this._getMorkList(1);
        },1000);
    };

    _bindEvent = () => {
        const that = this;
        this.outer.on('click','.btn-test1', function () {
            const index = $(this).data('index');
            const rowData = that.list.getRowData(index);
            that.floatModal.show({
                title:'修改完成度',
                obj:$(this),
                side:3,
                placeholder:'输入完成度0-100',
                fn:(value)=>{
                    if(value<0 || value>100){
                        that.floatModal.showMsg('范围不对')
                    }else {
                        that.floatModal.hide();
                        const dataSource = that.list.getDataSource();
                        dataSource[index].result = value;
                        that.list.setData({
                            dataSource
                        }).then(()=>{
                            that.list.updateItem(index)
                        })
                    }
                }
            });
        }).on('click','.btn-test2', function () {
            const index = $(this).data('index');
            const rowData = that.list.getRowData(index);
            that.list.removeItem(index).then(()=>{
                that._getMorkList(that.list.getPagination().current,'delete');
                notification({
                    title:'删除成功',
                    msg:`${rowData.name}删除成功！`
                });
            })
        })
    };

    _init = () => {
        this.list = new List({
            outer:$('#test1'),
            renderTr:(row,index)=>{
                return `<div class="item-outer flexbox aic">
<div class="flex1">${row.name}</div><div class="flex1">权重${row.qz+'%'}</div><div class="flex1">完成度${row.result+'%'}</div><div class="flex1"><button class="btn btn-default btn-test1" style="margin-right: 5px" data-index="${index}">修改</button><button class="btn btn-default btn-test2" data-index="${index}">删除</button></div>
</div>`
            },
            pagination:{
                show:true,
                pageSize:5,
                onChange:({current})=>{
                    setTimeout(()=>{
                        this._getMorkList(current);
                    },500);
                }
            },
            storage:true
        });

        this.floatModal = new FloatModal({});

        CommonUtil.initCode(this.outer);

        CommonUtil.createDetailTable({outer: this.outer, propsList, apiList});
        this._bindEvent();
    }
}

new ListPage().init();