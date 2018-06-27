import * as CommonUtil from "./common";
import $ from "jquery";

import Dropdown from '../../../../component/dropDown/dropdown';
import Table from '../../../../component/table/table';
import notification from '../../../../component/notification/notification';

import getLocalStorage from '../../../../util/lib/getLocalStorage';
import toHtmlStr from "../../../../util/lib/toHtmlStr";
import doRequest from '../../../../util/lib/doRequest';
import format from '../../../../util/lib/format';
import {switchPage} from "../../common/common";
import ConfirmModal2 from "../../../../component/confirmModal2/confirmModal2";

export default class UploadSS {
    constructor(){
        this.router = null;
        this.state = {};

        this.id = 'uploadSSPage';
        this.router = $('#'+this.id);

        this.year = new Date().getMonth()?new Date().getFullYear():(new Date().getFullYear()-1);
        const lastyear = getLocalStorage('lastyear1');
        if(lastyear) this.year = parseInt(lastyear);

        this.uploadTaxType = 1;

        this.type = 1;

        this.docToolRefs = [];
        this.proToolRefs = [];

        this._init();
    }

    init =( route,router )=>{
        this.router = router;
        this.state = route.state;
        switchPage(this.id);
        CommonUtil.uploadTaxModal.init(this.type);

        this._getUploadSSList();
    };

    _bindEvent =()=> {

    };

    _getUploadSSList =()=> {
        doRequest({
            url:'economic/getEconomicList',
            data:{
                date:this.year,
                type:1,
                ts:Date.now()
            },
            success:(data)=>{
                if(data.success){
                    this.ssTable.setData({
                        dataSource:data.data.monthEconomic || []
                    });
                    this.uploadTaxType = data.data.yearEconomic[0]?data.data.yearEconomic[0].uploadTaxType:1;
                    this.uploadTaxType = this.uploadTaxType || 1;
                    this.uploadTaxTypeSelect.setData(this.uploadTaxType-1);
                    this.proToolRefs && this.proToolRefs.map((v)=>{
                        v.setUploadTaxType(this.uploadTaxType);
                    })
                }else {
                    this.ssTable.setData({
                        dataSource:[]
                    });
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

    _renderDocAndPro =()=> {
        this.proToolRefs = this.ssTable.getDataSource().map((v,i)=>{
            return new CommonUtil.ProgressTool({
                id:'proToolSS'+i,
                data:v,
                type:1,
                uploadTaxType:this.uploadTaxType,
                year:this.year
            });
        });
        this.docToolRefs = this.ssTable.getDataSource().map((v,i)=>{
            return new CommonUtil.DocTools({
                id:'docToolSS'+i,
                data:v,
                type:1,
                stageUpdate:(stage)=>{
                    switch (stage){
                        case 'empty':{
                            this.proToolRefs[i].setFileData({}).setStage('empty');
                            break;
                        }
                        case 'done':{
                            this.proToolRefs[i].setFileData(this.docToolRefs[i].getFileData()).setStage('upload');
                        }
                    }
                }
            });
        });
    };

    _switchUploadType =(type)=> {
        if(type === this.uploadTaxType){
            return;
        }
        this.confirmModal.setData({
            title:'变更导入数据类型',
            msg:'变更为 '+['单月','累月'][type-1]+'数据 导入，确认后将删除本年度已经导入的数据！',
            confirmFn:()=>{
                doRequest({
                    url:'uploadTaxCumulate/changeImportType',
                    data:{
                        year:this.year,
                        importType:type
                    },
                    success: (data)=> {
                        this.confirmModal.modalHide().toggleloading();
                        if(data.success){
                            notification({
                                title:'导入数据类型修改成功',
                                msg:'税收数据导入类型已成功切换为 '+['单月','累月'][type-1]+'导入'
                            });
                            this._getUploadSSList();
                        }
                    }
                });
            }
        }).modalShow();
    };

    _init =()=> {
        this.confirmModal = new ConfirmModal2({});
        this.uploadTaxTypeSelect = new Dropdown({
            obj:$('#uploadTaxTypeSelect'),
            list:[ {name:'单月导入',type:1}, {name:'累月导入',type:2} ],
            renderLi:(row)=>{
                return row.name
            },
            beforeClick:(row)=>{
                this._switchUploadType(row.type);
                return true;
            }
        });

        this.yearSelect = new Dropdown({
            obj:$('#ssYearSelect'),
            renderLi:(row)=>{
                return row + '年'
            },
            list:[],
            onSelectChange:(year)=>{
                this.year = year;
                this._getUploadSSList();
            }
        });
        this._getYearRange();

        this.ssTable = new Table({
            outer:$('#ssTable'),
            headers:[
                {name:'数据日期',width:100},
                {name:'上传文件',width:280},
                {name:'数据关联',width:380},
                {name:'操作人',width:80},
                {name:'操作时间',width:100}
            ],
            renderTrs:[
                row=>toHtmlStr(row.target),
                {
                    renderTd:(row,index)=>`<td style="padding: 0 5px" id="${'docToolSS'+index}"></td>`
                },
                {
                    renderTd:(row,index)=>`<td style="padding: 0 5px" id="${'proToolSS'+index}"></td>`
                },
                row=>toHtmlStr( row.uploadTaxFile?row.uploadTaxFile.userName:'-' ),
                row=>row.uploadTaxFile?format(row.uploadTaxFile.updateTime,'yyyy-MM-dd'):'-'
            ],
            emptyMsg:'本年度暂无税收指标计划',
            afterRender:()=>{
                this._renderDocAndPro();
            }
        });

        this._bindEvent();
    }
}