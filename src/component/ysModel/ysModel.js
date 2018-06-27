import $ from 'jquery';
import toHtmlStr from '../../util/lib/toHtmlStr';
import * as Check from '../../util/lib/check';
import tips from '../tips/tips';

/**
 * 简单数据绑定，ys-controller设置容器，ys-bind单向绑定，ys-model双向绑定
 */
export default class YsModel {
    /**
     * 构造函数
     * @param controller 外层容器标识，通过在dom上添加 ys-controller属性来设置
     * @param data 数据源
     * @param onChange 数据变化回调函数
     */
    constructor({ controller,data={},onChange=()=>{} }) {
        if(!controller) throw new Error('YsModel param controller can not be undefined');
        this.outer = $('[ys-controller="'+ controller +'"]');
        if(this.outer.length !== 1) throw new Error('YsModel param controller is invalid');
        if(typeof onChange !== 'function') throw new Error('YsModel param onChange must be a function');

        this.onChange = onChange;

        this.modelDoms = {};
        [].forEach.call(this.outer.find('[ys-model]'),(v)=>{
            const $v = $(v);
            const key = $v.attr('ys-model');
            this.modelDoms[key] = this.modelDoms[key]?this.modelDoms[key].add($v):$v;
        });
        this.bindDoms = {};
        [].forEach.call(this.outer.find('[ys-bind]'),(v)=>{
            const $v = $(v);
            const key = $v.attr('ys-bind');
            this.bindDoms[key] = this.bindDoms[key]?this.bindDoms[key].add($v):$v;
        });
        this.data = data;

        this._init();
    }

    _bindEvent() {
        for(let i in this.modelDoms){
            if(this.modelDoms.hasOwnProperty(i)){
                this.modelDoms[i].on('keyup',()=>{
                    const newData = {...this.data};
                    newData[i] = this.modelDoms[i].val();
                    this.setData(newData);
                    this.onChange(this.data);
                }).on('change',()=>{
                    const newData = {...this.data};
                    newData[i] = this.modelDoms[i].val();
                    this.setData(newData);
                    this.onChange(this.data);
                });
                if(this.modelDoms[i].data('valid') === 'number'){
                    this.modelDoms[i].on('change',()=> {
                        if(!Check.isNumber(this.modelDoms[i].val())){
                            this.modelDoms[i].val('');
                            this.data[i] = '';
                            this.onChange(this.data);
                            tips({
                                obj:this.modelDoms[i],
                                msg:'仅允许输入数字'
                            })
                        }
                    });
                }
            }
        }
    }

    /**
     * 设置值，传入data与原有data合并
     * @param data
     * @returns {YsModel}
     */
    setData(data={}){
        for(let i in data){
            if(data.hasOwnProperty(i) && data[i] !== this.data[i]){
                if(this.modelDoms[i]){
                    this.modelDoms[i].val(toHtmlStr(data[i]));
                }
                if(this.bindDoms[i]){
                    this.bindDoms[i].text(toHtmlStr(data[i],this.bindDoms[i].data('placeholder')));
                }
            }
        }
        this.data = $.extend(this.data,data);
        return this;
    }

    /**
     * 重置
     * @returns {YsModel}
     */
    reset(){
        for(const i in this.modelDoms){
            if(this.modelDoms.hasOwnProperty(i)){
                this.modelDoms[i].val('');
            }
        }
        for(const i in this.bindDoms){
            if(this.bindDoms.hasOwnProperty(i)){
                this.bindDoms[i].text(toHtmlStr(this.bindDoms[i].data('placeholder')));
            }
        }
        this.data = {};
        return this;
    }

    /**
     * 获取当前数据
     * @returns {*|{}}
     */
    getData(){
        return this.data;
    }

    _init() {
        this._bindEvent();
        this.reset();
    }
}