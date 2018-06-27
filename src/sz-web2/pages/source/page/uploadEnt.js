import * as CommonUtil from "./common";
import $ from "jquery";

import format from "../../../../util/lib/format";
import toHtmlStr from "../../../../util/lib/toHtmlStr";
import Table from "../../../../component/table/table";
import doRequest from "../../../../util/lib/doRequest";
import {switchPage} from "../../common/common";

export default class UploadEnt {
    constructor(){
        this.router = null;
        this.state = {};

        this.id = 'uploadEntPage';
        this.outer = $('#'+this.id);

        this.type = 4;

        this.docToolRefs = [];
        this.proToolRefs = [];

        this._init();
    }

    init =( route,router )=>{
        this.router = router;
        this.state = route.state;
        switchPage(this.id);
        CommonUtil.uploadTaxModal.init(this.type);

        this._getUploadENTList();
    };

    _bindEvent =()=> {

    };

    _getUploadENTList =()=> {
        doRequest({
            url:'entFile/getEntFileUploadList',
            data:{
                ts:Date.now()
            },
            success:(data)=>{
                if(data.success && data.data){
                    const list = data.data.map((v)=>{
                        return {
                            entFile:v
                        }
                    });
                    if(list.length === 10){
                        list.pop();
                    }
                    list.unshift({entFile:{}});

                    this.entTable.setData({
                        dataSource:list || []
                    });
                }else {
                    this.entTable.setData({
                        dataSource:[{entFile:{}}]
                    });
                }
            }
        })
    };

    _renderDocAndPro =()=> {
        this.proToolRefs = this.entTable.getDataSource().map((v,i)=>{
            return new CommonUtil.ProgressTool({
                id:'proToolENT'+i,
                data:v,
                type:this.type,
                uploadTaxType:this.uploadTaxType,
                year:this.year
            });
        });
        this.docToolRefs = this.entTable.getDataSource().map((v,i)=>{
            return new CommonUtil.DocTools({
                id:'docToolENT'+i,
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

        this.entTable = new Table({
            outer:$('#entTable'),
            headers:[
                {name:'序号',width:80},
                {name:'上传文件',width:280},
                {name:'数据关联',width:380},
                {name:'操作人',width:80},
                {name:'操作时间',width:100}
            ],
            renderTrs:[
                (row,index)=>index+1,
                {
                    renderTd:(row,index)=>`<td style="padding: 0 5px" id="${'docToolENT'+index}"></td>`
                },
                {
                    renderTd:(row,index)=>`<td style="padding: 0 5px" id="${'proToolENT'+index}"></td>`
                },
                row=>toHtmlStr( row.entFile?row.entFile.userName:'-' ),
                row=>row.entFile?format(row.entFile.updateTime,'yyyy-MM-dd'):'-'
            ],
            emptyMsg:'暂无企业批量导入信息',
            afterRender:()=>{
                this._renderDocAndPro();
            }
        });


        this._bindEvent();
    }
}