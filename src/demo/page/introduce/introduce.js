import $ from 'jquery';

import { data as morkData } from './data/data';

import './css/introduce.css';
import Table from "../../../component/table/table";
import loading from "../../../component/loading/loading";
import FloatModal from "../../../component/floatModal/floatModal";
import notification from "../../../component/notification/notification";

class Introduce {
    constructor() {
        this.outer = $('#introduce');

        this.tableC = this.outer.find('#tables');

        //所有数据
        this.totalData = [];

        //type列表
        this.typeList = new Array(30).join(',').split(',').map((v,i)=>{
            return 'type'+(i+1)
        });
        //当前type下标
        this.typeIndex = 0;
        //当前所有表格ref
        this.tableRefs = [];

        this._init();
    }

    init = () => {
        //获取所有数据，并渲染当前列表
        this._getAllData().then((data)=>{
            this.totalData = data;
            this._renderPage();
        })
    };

    /**
     * 获取全部数据
     * @private
     */
    _getAllData =()=> {
        return new window.Promise((resolve)=>{
            setTimeout(()=>{
                resolve(morkData);
            },1000)
        });
    };

    /**
     * 获取分页数据
     * @param current 当前页码
     * @param tableIndex 表格下标
     * @param type 类型
     * @private
     */
    _getPageData =(current,tableIndex,type)=> {
        //从表格ref中那表格实例
        const table = this.tableRefs[tableIndex];

        if(type === 'delete'){
            current = table.getPagination().current;
        }

        //渲染分页数据
        const _list = table.getDataSource();
        setTimeout(()=>{
            table.setData({
                dataSource:_list,
                pagination:{
                    current
                },
                conditionChange:!!type
            })
        },500);

    };

    /**
     * 渲染当前数据
     * @private
     */
    _renderPage =()=> {
        //找到对应数据
        this.currentData = this.totalData.find((v)=>{
            return v.type === this.typeList[this.typeIndex]
        });
        if(!this.currentData) return;

        //情况原来所有表格
        this.tableC.empty();

        //渲染所有表格，并存储ref
        this.tableRefs = this.currentData.list.map((v,i)=>{
             this.tableC.append(`<div class="ent-section" style="margin-bottom: 30px">
<div class="ent-name-c" style="margin-bottom: 10px">${v.entName}</div>
<div class="table-c"></div>
</div>`);
             //按需渲染不同的表格
             let _headers,_renderTrs;
             switch (this.currentData.type){
                 //一个绑定点击事件的例子
                 case 'type2':
                 case 'type4':{
                     _headers = [{ name:'序号',width:60 },...this.currentData.keys.map((v2)=>{
                         return {
                             name:this.currentData.options[v2],
                             width:100
                         }
                     }),{ name:'操作',width:60 }];
                     _renderTrs = [ (row,index,pagination)=>(pagination.current-1)*pagination.pageSize+index+1,...this.currentData.keys.map((v2,i2)=>{
                         return row=>row[this.currentData.keys[i2]]
                     }), (row,index)=>`<a class="btn btn-link edit-row" style="padding: 0" data-index="${i+'-'+index}">删除</a>` ];
                     break;
                 }
                 default:{
                     _headers = [{ name:'序号',width:60 }].concat(this.currentData.keys.map((v2)=>{
                         return {
                             name:this.currentData.options[v2],
                             width:100
                         }
                     }));
                     _renderTrs = [ (row,index,pagination)=>(pagination.current-1)*pagination.pageSize+index+1 ].concat(this.currentData.keys.map((v2,i2)=>{
                         return row=>row[this.currentData.keys[i2]]
                     }))
                 }
             }
             //实例表格
             return new Table({
                 outer: this.tableC.children(':last').find('.table-c'),
                 headers:_headers,
                 emptyMsg:'该企业无数据',
                 renderTrs:_renderTrs,
                 dataSource:v.detail,
                 pagination:{
                     show:true,
                     pageSize:5,
                     total:v.totalRecord,
                     onChange: ({current})=> {
                         //分页
                         this._getPageData(current,i);
                     },
                     isJump:true
                 },
                 storage:true
             })
        });
    };

    _bindEvent = () => {
        const that = this;
        this.outer.on('click','.item-title',function () {
            that.typeIndex = $(this).data('index');
            that._renderPage();
        }).on('click','.edit-row',function () {
            //点击事件如何拿到数据
            //演示一个删除事例
            const index = $(this).data('index');
            const t_index = index.split('-')[0];
            const r_index = index.split('-')[1];
            const rowData = that.tableRefs[t_index].getRowData(r_index);
            console.log(rowData);

            that.floatModal.show({
                title:'删除该列？',
                obj:$(this),
                side:3,
                fn:()=>{
                    that.floatModal.hide();
                    notification({
                        title:'删除成功',
                        msg:that.typeList[that.typeIndex]+' 表格'+t_index+' 第'+r_index+'列成功删除'
                    });
                    that.tableRefs[t_index].removeItem(r_index).then(()=>{
                        that._getPageData(1,t_index,'delete');
                    })
                }
            });

        })
    };

    _init = () => {
        this.outer.find('.items-title').html(this.typeList.map((v,i)=>{
            return `<button class="btn btn-default item-title" style="margin: 5px" data-index="${i}">${ v }</button>`
        }));

        //加入loading
        this.tableC.html( `<div style="height: 300px" class="flexbox aic jcc">${loading()}</div>` );

        this.floatModal = new FloatModal({ noInput:true });

        this._bindEvent();
    }
}

new Introduce().init();