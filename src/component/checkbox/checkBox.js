/**
 * Created by Administrator on 2018/1/12.
 */
import $ from 'jquery';
import './css/checkbox.less';

/**
 * 复选框
 */
export default class CheckBox {
    /**
     * 构造
     * @param obj 复选框容器
     * @param onChange 触发状态改变回调
     * @param checked 初始是否被选中，默认不选中
     * @param color 颜色，默认000
     * @param id
     */
    constructor({ obj, onChange=()=>{},id, checked = false, color='inherit' }){
        this.obj = obj;
        if(!(obj instanceof $) || (obj instanceof $ && obj.length !== 1)) throw new Error('CheckBox params obj must be an one length jqueryDom');
        if(typeof onChange !== 'function') throw new Error('CheckBox params onChange must be an Function');
        this.onChange = onChange;
        this.checked = checked;
        this.color = color;

        this.checkbox = null;
        this.name = id || 'checkbox'+Math.round(Math.random()*100000000);

        this._render();
    }

    _getHtmlStr(){
        return `<div class="ys-checkbox"><input type="checkbox" ${this.checked?'checked':''} id="${this.name}"><label style="border-color: ${this.color};color: ${this.color}" for="${this.name}"></label></div>`;
    }

    _render(){
        this.obj.html(this._getHtmlStr());
        this._bindEvent();
    }

    /**
     * 设置复选框选中状态
     * @param checked
     * @param change
     * @returns {CheckBox}
     */
    setChecked(checked,change=false){
        this.checked = checked;
        this.checkbox && this.checkbox.prop('checked',checked);
        change && this.onChange(this.checked);
        return this;
    }

    /**
     * 获取复选框选中状态
     * @returns {*}
     */
    getChecked(){
        return this.checked;
    }

    _bindEvent(){
        const that = this;
        this.obj.on('change','input[type="checkbox"]',function () {
            const checked = $(this).prop('checked');
            that.checked = checked;
            that.onChange(checked);
        });
        this.checkbox = this.obj.find('input[type="checkbox"]');
    }
}