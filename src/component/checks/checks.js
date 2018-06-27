/**
**create by 2087, Tue May 08 2018
**/

import $ from 'jquery';

import './less/checks.less';
import CheckBox from "../checkbox/checkBox";

/**
 * 多选条件
 */
export default class Checks {
    /**
     * 构造函数
     * @param obj 外部容器
     * @param list 数据数组
     * @param renderLi 选项渲染回调
     * @param checkIds 默认选中的id
     */
    constructor({ obj, list=[], renderLi=row=>row.name, checkIds='',onChange=()=>{} }) {
        this.outer = obj;
        this.list = list;
        this.renderLi = renderLi;
        this.checkIds = checkIds?checkIds.split(','):[];
        this.list = this.list.map(v=>{
            v.checked = this.checkIds.indexOf(v.id+'')>-1;
            return v;
        });
        this.onChange = onChange;

        this._init();
    }

    _bindEvent =()=> {

    };

    /**
     * 设置选中的id
     * @param ids
     */
    setData =(ids='')=> {
        this.checkIds = ids?ids.split(','):[];
        this.checkboxs.forEach((v,i)=>{
            if(this.checkIds.indexOf(this.list[i].id+'')>-1){
                v.setChecked(true,true);
            }else {
                v.setChecked(false,true);
            }
        })
    };

    /**
     * 动态设置选项
     * @param list
     */
    setList =(list)=> {
        this.list = list;
        this._renderList();
    };

    _renderList =()=> {
        this.outer.find('.checks-item-outer').html(this.list.map((v,i)=>{
            return `<div class="checks-item-c flexbox aic"><div class="checks-item-check-box"></div><div class="checks-item-name">${ this.renderLi(v,i) }</div></div>`
        }).join(''));
        this.checkboxs = [].map.call(this.outer.find('.checks-item-check-box'),(v,i)=>{
            return new CheckBox({
                obj:$(v),
                onChange:(checked)=>{
                    this.list[i].checked = checked;
                    this.onChange(this.list[i],i,this.list)
                },
                checked:this.list[i].checked
            })
        });
    };

    /**
     * 获取选中的ids
     * @returns {any | *}
     */
    getData =()=> {
        this.checkIds = this.list.reduce((o,v)=>{
            if(v.checked){
                o.push(v.id);
            }
            return o;
        },[]);
        return this.checkIds;
    };

    /**
     * 获取选中的选项
     * @returns {*}
     */
    getItems =()=> {
        this.checkItems = this.list.reduce((o,v)=>{
            if(v.checked){
                o.push(v);
            }
            return o;
        },[]);
        return this.checkItems;
    };

    _renderHtml =()=> {
        this.outer.html(`<div class="checks-item-outer"><div>`);
        this._renderList();
    };

    _init = () => {
        this._renderHtml();
        this._bindEvent();
    }
}
