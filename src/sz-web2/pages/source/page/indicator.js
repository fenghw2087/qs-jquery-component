import * as CommonUtil from "./common";
import $ from "jquery";

import DropDown from '../../../../component/dropDown/dropdown';
import Table from '../../../../component/table/table';
import YsModel from '../../../../component/ysModel/ysModel';
import notification from '../../../../component/notification/notification';

import doRequest from '../../../../util/lib/doRequest';
import tips from "../../../../component/tips/tips";
import {switchPage} from "../../common/common";

export default class Indicator {
    constructor(){
        this.router = null;
        this.state = {};

        this.id = 'indicatorPage';
        this.outer = $('#'+this.id);

        this.year = new Date().getFullYear();
        if(!new Date().getMonth()) this.year--;

        this.currentYear = null;

        this.editYearData = {};
        this.editMonthData = {};

        this._init();
    }

    init =( route,router )=>{
        this.router = router;
        this.state = route.state;
        switchPage(this.id);
        this._backMain();

        this._getEconomic();
    };

    _bindEvent =()=> {
        const that = this;
        this.outer.on('click','.edit-year',function () {
            that.currentYear = that.yearTable.getRowData($(this).data('index'));
            that._openEditYear();
        }).on('click','.edit-month',function () {
            that.monthSelect.setData($(this).data('index'));
            that._openEditMonth();
            that._getMonthEconomic();
        }).on('click','.confirm-edit-year',function () {
            that._saveYearEconomic();
        }).on('click','.back-to-main',function () {
            that._backMain();
        }).on('click','.confirm-edit-month',function () {
            that._saveMonthEconomic();
        })
    };

    _saveMonthEconomic =()=> {
        const newData = {
            id:this.editMonthData.id
        };
        for(const i in this.editMonthData){
            if(this.editMonthData.hasOwnProperty(i)){
                if(i.indexOf('Rank') > -1 || i.indexOf('Finish') > -1 || i.indexOf('After') > -1){
                    newData[i] = this.editMonthData[i];
                }
            }
        }
        doRequest({
            url:'economic/uploadAll',
            data:newData,
            type:'post',
            success:(data)=>{
                if(data.success){
                    notification({
                        title:'月度经济指标上传成功',
                        msg:this.editMonthData.name + ' 月度经济指标上传成功'
                    });
                    this._backMain();
                }else {
                    notification({
                        type:'error',
                        title:'月度经济指标上传失败',
                        msg:'月度经济指标上传失败，请稍后重试！'
                    });
                }
            }
        })
    };

    _getMonthEconomic =()=> {
        const { current } = this.monthSelect.getData();
        if(!current || !current.id) return;
        doRequest({
            url:'economic/getMonthEconomicById',
            data:{
                id:current.id,
                ts:Date.now()
            },
            success:(data)=>{
                if(data.success){
                    this.monthModel.reset();
                    this.editMonthData = data.data;
                    this.monthModel.setData(this.editMonthData);
                }else {
                    this.monthModel.reset();
                }
            }
        })
    };

    _saveYearEconomic =()=> {
        const c_data = JSON.parse(JSON.stringify(this.editYearData));
        const { target } = c_data;
        delete c_data.target;
        delete c_data.name;
        delete c_data.platFrom;
        delete c_data.uploadTaxType;
        delete c_data.createTime;
        delete c_data.updateTime;
        delete c_data.gtSdqPlan;
        for(const i in c_data){
            if(c_data.hasOwnProperty(i)){
                if(c_data[i] && c_data[i]<=0){
                    return tips({
                        obj:this.outer.find('[ys-model="'+ i +'"]'),
                        msg:'不能输入0或负数'
                    })
                }
            }
        }
        doRequest({
            url: 'economic/uploadYearEconomic' ,
            type: 'POST',
            data: c_data,
            success:(data)=> {
                if(data.success){
                    notification({
                        title:'年度经济指标修改成功',
                        msg:target+' 年度经济指标修改成功！'
                    });
                    this._backMain();
                }else {
                    notification({
                        type:'error',
                        title:'年度经济指标修改失败',
                        msg:target+' 年度经济指标修改失败，请稍后重试!'
                    });
                }
            }
        });
    };

    _openEditYear =()=> {
        this.outer.find('.sm-section-content').hide().eq(1).show();
    };

    _backMain =()=> {
        this.outer.find('.sm-section-content').hide().eq(0).show();
        this.outer.find('#indicatorMonthSelect').hide();
    };

    _openEditMonth =()=> {
        this.outer.find('.sm-section-content').hide().eq(2).show();
        this.outer.find('#indicatorMonthSelect').show();
    };

    _getEconomic =()=> {
        doRequest({
            url:'economic/getEconomicList',
            data:{
                date:this.year,
                ts:Date.now()
            },
            success:(data)=> {
                if(data.success){
                    this.yearTable.setData({
                        dataSource:data.data.yearEconomic || []
                    });
                    this.monthTable.setData({
                        dataSource:data.data.monthEconomic || []
                    });
                    this.editYearData = data.data.yearEconomic[0];
                    this.yearModel.setData(this.editYearData);
                    this.monthSelect.renderList((data.data.monthEconomic || [])).setData(0);
                    if($('#indicatorMonthSelect').css('display') === 'block'){
                        this._getMonthEconomic();
                    }
                }
            }
        })
    };

    _getYearRange =()=> {
        CommonUtil.getDateRangePromise.then((sy)=>{
            const date = new Date();
            const ey = date.getMonth()?date.getFullYear():(date.getFullYear()-1);
            this.yearSelect.renderList(new Array(ey-sy+1).join(',').split(',').map((v,i)=>{
                return ey-i;
            }));
            this.yearSelect.setData(ey-this.year);
        });
    };

    _init =()=> {
        this.yearSelect = new DropDown({
            obj:$('#indicatorYearSelect'),
            renderLi:(row)=>{
                return row + '年'
            },
            list:[],
            onSelectChange:(year)=>{
                this.year = year;
                this._getEconomic();
            }
        });
        this.monthSelect = new DropDown({
            obj:$('#indicatorMonthSelect'),
            renderLi:(row)=>{
                return row.target.substr(5,2)-0+'月'
            },
            list:[],
            onSelectChange:()=>{
                this._getMonthEconomic();
            }
        });
        this._getYearRange();

        this.yearTable = new Table({
            outer:$('#indicatorYearTable'),
            headers:[
                {name:'年度',width:200},
                {name:'标题',width:500},
                {name:'操作',width:120}
            ],
            renderTr:(row,index)=>{
                return `<tr><td>${row.target}</td><td>${row.name}</td><td><a class="btn btn-link edit-year" data-index="${index}">编辑年度计划</a></td></tr>`;
            }
        });

        this.monthTable = new Table({
            outer:$('#indicatorMonthTable'),
            headers:[
                {name:'指标时间',width:200},
                {name:'标题',width:500},
                {name:'操作',width:100}
            ],
            renderTr:(row,index)=>{
                return `<tr><td>${row.target}</td><td>${row.name}</td><td><a class="btn btn-link edit-month" data-index="${index}">录入</a></td></tr>`;
            }
        });

        this.yearModel = new YsModel({
            controller:'yearEdit',
            data:{},
            onChange:(data)=> {
                this.editYearData = data;
            }
        });

        this.monthModel = new YsModel({
            controller:'monthEdit',
            data:{},
            onChange:(data)=> {
                this.editMonthData = data;
            }
        });

        this._bindEvent();
    }
}