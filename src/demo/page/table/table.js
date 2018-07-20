import $ from 'jquery';

import './css/table.css';

import * as CommonUtil from '../../common/common';
import {propsList, apiList} from "./paramsAndApi";
import message from "../../../component/message/message";
import Table from "../../../component/table/table";
import FloatModal from "../../../component/floatModal/floatModal";
import notification from "../../../component/notification/notification";

class tablePage {
    constructor() {
        this.outer = $('#table');

        this._init();
    }

    init = () => {

    };

    _bindEvent = () => {
        const that = this;
        this.outer.on('click','.btn-test1', function () {
            that.table2.setData({
                dataSource:null
            });
            message({
                type:'info',
                msg:'开始请求数据'
            });
            setTimeout(()=>{
                that.table2.setData({
                    dataSource:that._getMockData()
                });
                message({
                    type:'success',
                    msg:'请求数据成功'
                });
            },2000);
        }).on('click','.btn-test2',function () {
            that.table2.setData({
                dataSource:[]
            });
        }).on('click','.remove-item',function () {
            const index = $(this).data('index');
            const rowData = that.table3.getRowData(index);
            that.floatModal.show({
                title:'是否删除'+rowData.name+'的成绩?',
                obj:$(this),
                side:3,
                fn:()=>{
                    that.floatModal.hide();
                    notification({
                        title:'删除成功',
                        msg:rowData.name+'的成绩成功删除'
                    });
                    that.table3.removeItem(index).then(()=>{
                        const _list = that.table3.getDataSource();
                        _list.splice(index,1);
                        _list.push(that._getMockData()[0]);
                        that.table3.setData({
                            dataSource:_list,
                            conditionChange:true
                        })
                    })
                }
            })
        }).on('click','.update-item',function () {
            const index = $(this).data('index');
            const rowData = that.table3.getRowData(index);
            that.floatModal2.show({
                title:'修改'+rowData.name+'的成绩',
                placeholder:'输入新成绩',
                obj:$(this),
                side:3,
                fn:(score)=>{
                    that.floatModal2.hide();
                    notification({
                        title:'修改成功',
                        msg:rowData.name+'的成绩修改为'+score
                    });
                    const _list = that.table3.getDataSource();
                    _list[index].score = score;
                    that.table3.setData({
                        dataSource:_list,
                        conditionChange:true
                    }).then(()=>{
                        that.table3.updateItem(index);
                    });
                }
            })
        })
    };

    _getMockData =()=> {
        return new Array(5).fill(1).map(()=>{
            return {
                name:this._getRandomName(),
                age:Math.ceil(Math.random()*20)+10,
                score:Math.ceil(Math.random()*60)+40
            }
        })
    };

    _getRandomName =()=> {
        const a = '赵钱孙李陈周吴郑王冯陈褚卫蒋沈韩杨朱秦尤许叶唐张姜'.split('');
        const b = '浩伟杰珂斌恒芹钟祥键明华彬自成静涛利江君欢丽默岑翔轻雪薇';
        const _x = a[Math.ceil(Math.random()*(a.length-1))];
        const _m1 = b[Math.ceil(Math.random()*(b.length-1))];
        const _m2 = b[Math.ceil(Math.random()*(b.length-1))];
        return Math.random()>0.4?(_x+_m1+_m2):(_x+_m1);
    };

    _init = () => {
        this.table1 = new Table({
            outer:$('#test1'),
            headers:[
                { name:'序号',width:50 },
                { name:'姓名',width:200 },
                { name: '年龄',width:200 },
                { name:'得分',width:300 }
            ],
            renderTrs:[
                (row,index,pagination)=> pagination.pageSize*(pagination.current-1)+index+1,
                row=>row.name,
                row=>row.age,
                row=>row.score
            ],
            dataSource:this._getMockData(),
            pagination:{
                show:true,
                total:56,
                pageSize:5,
                current:1,
                onChange:({ current })=>{
                    setTimeout(()=>{
                        this.table1.setData({
                            dataSource:this._getMockData(),
                            pagination:{
                                current,
                                total:56
                            }
                        });
                    },500);
                }
            }
        });

        this.table2 = new Table({
            outer:$('#test2'),
            headers:[
                { name:'序号',width:50 },
                { name:'姓名',width:200 },
                { name:'年龄',width:200 },
                { name:'得分',width:300 }
            ],
            renderTrs:[
                (row,index,pagination)=> pagination.pageSize*(pagination.current-1)+index+1,
                row=>row.name,
                row=>row.age,
                row=>row.score
            ],
            dataSource:this._getMockData(),
            pagination:{
                show:true,
                total:56,
                pageSize:5,
                current:1,
                onChange:({ current })=>{
                    setTimeout(()=>{
                        this.table2.setData({
                            dataSource:this._getMockData(),
                            pagination:{
                                current,
                                total:56
                            }
                        });
                    },500);
                }
            },
            renderEmpty:()=>`<div class="flexbox aic jcc" style="height: 100px;color: #999"><i class="fa fa-warning" style="margin-right: 10px;font-size: 16px"></i>我是自定义的缺省页</div>`
        });

        this.table3 = new Table({
            outer:$('#test3'),
            headers:[
                { name:'序号',width:50 },
                { name:'姓名',width:200 },
                { name:'年龄',width:250 },
                { name:'得分',width:250 },
                { name:'操作',width:150 }
            ],
            renderTrs:[
                (row,index,pagination)=> pagination.pageSize*(pagination.current-1)+index+1,
                row=>row.name,
                row=>row.age,
                {
                    renderTd:row=>`<td style="color:#fff;${ row.score>=60?'background-color: #00b793':'background-color: #d00'} ">${row.score}</td>`
                },
                (row,index)=>{
                    return `<a class="btn btn-link remove-item" data-index="${index}">删除</a><a class="btn btn-link update-item" data-index="${index}">修改</a>`
                }
            ],
            dataSource:this._getMockData(),
            pagination:{
                show:true,
                total:56,
                pageSize:5,
                current:1,
                onChange:({ current })=>{
                    setTimeout(()=>{
                        this.table3.setData({
                            dataSource:this._getMockData(),
                            pagination:{
                                current,
                                total:56
                            }
                        });
                    },500);
                }
            },
            storage:true
        });

        this.table4 = new Table({
            outer:$('#test4'),
            headers:[
                { name:'序号',width:50 },
                { name:'姓名',width:300 },
                { name:'年龄',width:200,
                    sorter:{
                        type:'age'
                    }
                },
                { name:'得分',width:200,
                    sorter:{
                        type:'score'
                    }
                }
            ],
            renderTrs:[
                (row,index,pagination)=> pagination.pageSize*(pagination.current-1)+index+1,
                row=>row.name,
                row=>row.age,
                {
                    renderTd:row=>`<td style="color:#fff;${ row.score>=60?'background-color: #00b793':'background-color: #d00'} ">${row.score}</td>`
                }
            ],
            dataSource:this._getMockData(),
            pagination:{
                show:true,
                total:56,
                pageSize:5,
                current:1,
                onChange:({ current })=>{
                    setTimeout(()=>{
                        this.table4.resetSort();
                        this.table4.setData({
                            dataSource:this._getMockData(),
                            pagination:{
                                current,
                                total:56
                            }
                        });
                    },500);
                }
            },
            sorter:({ sortName,type })=>{
                //不排序
                if(type === 0){
                    return this.table4.setData({
                        dataSource:this._getMockData()
                    })
                }
                const _list = this.table4.getDataSource();
                //排序，-1倒序，1正序
                _list.sort((a,b)=>{
                    return (b[sortName] - a[sortName])*type
                });
                this.table4.setData({
                    dataSource:_list
                })
            }
        });

        this.floatModal = new FloatModal({ noInput:true });
        this.floatModal2 = new FloatModal({});

        CommonUtil.initCode(this.outer);

        CommonUtil.createDetailTable({outer: this.outer, propsList, apiList});
        this._bindEvent();
    }
}

new tablePage().init();