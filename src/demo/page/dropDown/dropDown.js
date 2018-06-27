import $ from 'jquery';

import './css/dropDown.css';
import Dropdown from "../../../component/dropDown/dropdown";

import * as CommonUtil from '../../common/common';
import { propsList, apiList } from "./paramsAndApi";
import message from "../../../component/message/message";

class DropDownPage {
    constructor() {
        this.outer = $('#dropDown');

        this._init();
    }

    init = () => {

    };

    _bindEvent = () => {
        const that = this;
        this.outer.on('click','.btn-test1',function () {
            const list = new Array(5).join(',').split(',').map((v,i)=>{
                return {
                    name:'选项'+(i+1),
                    id:i+1
                }
            });
            that.drop3.renderList(list);
            message({
                type:'success',
                msg:'设置选项成功'
            })
        }).on('click','.btn-test2',function () {
            that.drop3.renderList([]);
            message({
                type:'success',
                msg:'清空选项成功'
            })
        }).on('click','.btn-test3',function () {
            if(!that.drop3.getList().length){
                message({
                    type:'warning',
                    msg:'请先设置选项，没有选项时，setData方法将重置下拉为未选中状态'
                })
            }
            that.drop3.setData(2);
        }).on('click','.btn-test4',function () {
            that.drop3.setValue('无关的文字');
            message({
                type:'success',
                msg:'设置成功，该显示与选项无任何关联'
            })
        }).on('click','.btn-test5',function () {
            that.drop4.setDisabled(false);
            message({
                type:'success',
                msg:'启用下拉'
            })
        }).on('click','.btn-test6',function () {
            that.drop4.setDisabled(true);
            message({
                type:'success',
                msg:'禁用下拉'
            })
        }).on('click','.btn-test7',function () {
            that.drop5.toggleDrop('open');
        }).on('click','.btn-test8',function () {
            that.drop5.toggleDrop('close');
        })
    };

    _init = () => {
        this.drop = new Dropdown({
            obj:$('#test1'),
            list:['选项一','选项二','选项三'],
            onSelectChange:(current)=>{
                message({
                    type:'success',
                    msg:'当前选中 '+current
                })
            }
        });

        this.drop2 = new Dropdown({
            obj:$('#test2'),
            list:[{ name:'不限',id:'' },...new Array(10).join(',').split(',').map((v,i)=>{
                return {
                    name:'一级列表'+(i+1),
                    id:i,
                    children:new Array(5).join(',').split(',').map((v2,i2)=>{
                        return {
                            name:'二级列表'+i+'-'+i2,
                            id:i2
                        }
                    })
                }
            })],
            renderLi:row=>row.name,
            renderSecLi:row=>row.name,
            onSelectChange:(current)=>{
                if(current){
                    message({
                        type:'success',
                        msg: '当前选中 '+ current.name
                    })
                }else {
                    message({
                        type:'success',
                        msg: '列表重置'
                    })
                }
            },
            placeholder:'选择列表',
            hasReset:true,
            hasChildren:true
        });

        this.drop3 = new Dropdown({
            obj:$('#test3'),
            renderLi:row=>row.name,
            onSelectChange:(current)=>{

            }
        });

        this.drop4 = new Dropdown({
            obj:$('#test4'),
            list:['选项一','选项二','选项三'],
            onSelectChange:(current)=>{

            },
            dropup:true,
            disabled:true
        });

        this.drop5 = new Dropdown({
            obj:$('#test5'),
            list:new Array(20).join(',').split(',').map((v,i)=>{
                return '选项'+(i+1)
            }),
            onSelectChange:(current)=>{

            },
            menuStyle:'max-height:250px;overflow-y:auto',
            autoShow:true
        });

        CommonUtil.initCode(this.outer);

        CommonUtil.createDetailTable({ outer:this.outer, propsList, apiList });

        this._bindEvent();
    }
}

new DropDownPage().init();