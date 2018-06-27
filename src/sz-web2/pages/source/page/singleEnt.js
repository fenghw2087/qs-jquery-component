import * as CommonUtil from "./common";
import $ from "jquery";
import {switchPage} from "../../common/common";
import {addEnt, getEntList} from "../../../../sz-web/source/request/request";
import notification from "../../../../component/notification/notification";
import toHtmlStr from "../../../../util/lib/toHtmlStr";
import Button from "../../../../component/button/button";
import Table from "../../../../component/table/table";
import tips from "../../../../component/tips/tips";

export default class SingleEnt {
    constructor(){
        this.router = null;
        this.state = {};

        this.id = 'singleEntPage';
        this.outer = $('#'+this.id);

        this.keywordC = this.outer.find('#keyword');

        this._init();
    }

    init =( route,router )=>{
        this.router = router;
        this.state = route.state;
        switchPage(this.id);
    };

    _bindEvent =()=> {
        const that = this;
        this.outer.on('click','.add-ent:not(.active)',function () {
            const $this = $(this);
            const index = $this.data('index');
            $this.addClass('active');
            addEnt({
                rowData:that.entListTable.getDataSource()[index],
                success:(rowData)=>{
                    let entList = that.entListTable.getDataSource();
                    entList[index] = rowData;
                    that.entListTable.setData({
                        dataSource:entList
                    });
                },
                always:()=>{
                    $this.removeClass('active');
                }
            });
        });
    };

    _renderTable =(data,current)=> {
        this.searchBtn.toggleIcon();
        if(data.code === '0000'){
            this.entListTable.setData({
                dataSource:data.data.results || [],
                pagination:{
                    total:data.data.totalRecord,
                    current
                }
            })
        } else {
            this.entListTable.setData({
                dataSource:[]
            });
            notification({
                type:'warning',
                title:'查询无记录',
                msg:'没有查询到相关企业，请输入更准确的关键字！'
            })
        }
    };


    _init =()=> {
        this.searchBtn = new Button({
            btn:$('#searchBtn'),
            type:'search',
            iconAutoShow:false,
            onClick:()=>{
                const keyWord = $.trim(this.keywordC.val());
                if(!keyWord){
                    return tips({
                        obj:this.keywordC,
                        msg:'请输入关键字',
                        side:3
                    });
                }
                this.searchBtn.toggleIcon(true);
                this.entListTable.setData({
                    dataSource:null
                });
                getEntList({pageNum:1,keyWord,success:this._renderTable});
            }
        });

        this.entListTable = new Table({
            outer:$('#entListTable'),
            headers:[
                {name:'序号',width:55},
                {name:'企业名称',width:230},
                {name:'法定代表人',width:120},
                {name:'注册地址',width:350},
                {name:'注册时间',width:100},
                {name:'操作',width:80}
            ],
            dataSource:[],
            emptyMsg:'请输入企业关键字进行搜索',
            renderTrs:[
                (row,index,pagination)=>(pagination.current-1)*pagination.pageSize+index+1,
                row=>toHtmlStr(row.entName),
                row=>toHtmlStr(row.frname),
                row=>toHtmlStr(row.address),
                row=>toHtmlStr(row.regTime),
                (row,index)=>`${row.id?`<a target="_blank" href="${window.basePath+'entFile/entDetail2?entName='+row.entName+'&eid='+row.eid}">已添加</a>`:`<a href="javascript:;" class="add-ent btn-loading" data-index="${index}">添加</a>`}`
            ],
            pagination:{
                show:true,
                pageSize:10,
                onChange: ({current})=> {
                    getEntList({pageNum:current,keyWord:this.keywordC.val(),success:this._renderTable});
                },
                isJump:true
            },
            storage:true
        });
        this._bindEvent();
    }
}