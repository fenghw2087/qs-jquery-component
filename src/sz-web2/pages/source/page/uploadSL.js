import * as CommonUtil from "./common";
import $ from "jquery";

import Table from '../../../../component/table/table';

import getLocalStorage from '../../../../util/lib/getLocalStorage';
import toHtmlStr from "../../../../util/lib/toHtmlStr";
import doRequest from '../../../../util/lib/doRequest';
import format from '../../../../util/lib/format';
import Dropdown from "../../../../component/dropDown/dropdown";
import {switchPage} from "../../common/common";

export default class UploadSL {
    constructor(){
        this.router = null;
        this.state = {};

        this.id = 'uploadSLPage';
        this.router = $('#'+this.id);

        this.type = 2;

        this.year = new Date().getMonth()?new Date().getFullYear():(new Date().getFullYear()-1);
        const lastyear = getLocalStorage('lastyear'+this.type);
        if(lastyear) this.year = parseInt(lastyear);

        this.docToolRefs = [];
        this.proToolRefs = [];

        this._init();
    }

    init =( route,router )=>{
        this.router = router;
        this.state = route.state;
        switchPage(this.id);
        CommonUtil.uploadTaxModal.init(this.type);

        this._getUploadSLList();
    };

    _bindEvent =()=> {

    };

    _getUploadSLList =()=> {
        doRequest({
            url:'economic/getEconomicList',
            data:{
                date:this.year,
                type:this.type,
                ts:Date.now()
            },
            success:(data)=>{
                if(data.success){
                    this.slTable.setData({
                        dataSource:data.data.monthEconomic || []
                    });
                }else {
                    this.slTable.setData({
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
        this.proToolRefs = this.slTable.getDataSource().map((v,i)=>{
            return new CommonUtil.ProgressTool({
                id:'proToolSL'+i,
                data:v,
                type:this.type,
                uploadTaxType:this.uploadTaxType,
                year:this.year
            });
        });
        this.docToolRefs = this.slTable.getDataSource().map((v,i)=>{
            return new CommonUtil.DocTools({
                id:'docToolSL'+i,
                data:v,
                type:this.type,
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

    _init =()=> {
        this.yearSelect = new Dropdown({
            obj:$('#slYearSelect'),
            renderLi:(row)=>{
                return row + '年'
            },
            list:[],
            onSelectChange:(year)=>{
                this.year = year;
                this._getUploadSLList();
            }
        });
        this._getYearRange();

        this.slTable = new Table({
            outer:$('#slTable'),
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
                    renderTd:(row,index)=>`<td style="padding: 0 5px" id="${'docToolSL'+index}"></td>`
                },
                {
                    renderTd:(row,index)=>`<td style="padding: 0 5px" id="${'proToolSL'+index}"></td>`
                },
                row=>toHtmlStr( row.shelingFile?row.shelingFile.userName:'-' ),
                row=>row.shelingFile?format(row.shelingFile.updateTime,'yyyy-MM-dd'):'-'
            ],
            emptyMsg:'本年度暂无税收指标计划',
            afterRender:()=>{
                this._renderDocAndPro();
            }
        });

        this._bindEvent();
    }
}