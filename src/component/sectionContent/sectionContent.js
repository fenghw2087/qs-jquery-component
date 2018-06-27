/**
 * Created by Administrator on 2018/1/12.
 */

/**
 * 单选内容组组件
 * 传入一系列section jqDoms
 * 组件仅做绑定事件，及提供set get方法
 * @params {sections} 内容组
 * @params {activeIndex} 当前显示的section下标 默认为0,传入非法下标，默认为0
 * @params {onSectionChange(index)} 回调函数
 */
export default class SectionContent {
    constructor(props = {}){
        this.props = props;
        this.sections = this.props.sections;
        this.onSectionChange = this.props.onSectionChange || (()=>{});
        this.activeIndex = parseInt(this.props.activeIndex) || 0;
        if(!this.sections.eq(this.activeIndex).length) this.activeIndex = 0;

        this.setActive(this.activeIndex);
    }

    /**
     * 设置激活section
     * @param n 下标
     * @returns {SectionContent}
     */
    setActive(n){
        this.sections.hide().eq(n).show();
        this.activeIndex = n;
        this.onSectionChange(n);
        return this;
    }

    /**
     * 获取当前激活按钮下标
     * @returns {*|number}
     */
    getActive(){
        return this.activeIndex;
    }

}