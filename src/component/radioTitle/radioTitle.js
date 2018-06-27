/**
 * Created by Administrator on 2018/1/11.
 */
import $ from 'jquery';

/**
 * 单选按钮组组件
 * 传入按钮组的父元素jqDom，按钮组目前不由组件生成，即必须已经拥有按钮组dom才可以调用本组件
 * 组件仅做绑定事件，及提供set get方法
 * @params {obj} 组件父jqDom，确保长度为1，因此最好使用id选择器
 * @params {activeClass} 按钮激活class 默认为active
 * @params {activeIndex} 当前按钮激活下标 默认为0,传入非法下标，默认为0
 * @params {onSelectChange(index)} 按钮组select回调函数，传出当前激活index
 */
export default class RadioTitle {
    constructor(props = {}){
        this.props = props;
        this.tabs = this.props.obj.children();
        this.onSelectChange = this.props.onSelectChange;
        this.activeClass = this.props.activeClass || 'active';
        this.activeIndex = parseInt(this.props.activeIndex) || 0;
        if(!this.tabs.eq(this.activeIndex).length) this.activeIndex = 0;

        this.setActive(this.activeIndex);
        this.bindEvent();
    }

    /**
     * 设置激活按钮
     * @param n 下标
     * @returns {RadioTitle}
     */
    setActive(n){
        if(n === -1){
            this.tabs.removeClass(this.activeClass);
            return this;
        }
        this.tabs.eq(n).addClass(this.activeClass).siblings().removeClass(this.activeClass);
        this.activeIndex = n;
        return this;
    }

    /**
     * 获取当前激活按钮下标
     * @returns {*|number}
     */
    getActive(){
        return this.activeIndex;
    }

    bindEvent(){
        const that = this;
        this.tabs.on('click',function () {
            const index = $(this).index();
            that.setActive(index);
            that.props.onSelectChange(index);
        })
    }
}