import './css/button.less';
import $ from "jquery";

const TYPE = ['search','reset'];
const DEFLAUT_ACTIVE = {
    'search':'search-animate',
    'reset':'fa-spin'
};
const DEFALUT_ICON = {
    'search':'fa-search',
    'reset':'fa-refresh'
};
/**
 * 特殊按钮构造
 */
export default class Button {
    /**
     * 构造函数
     * @param btn 模板button jqueryDom
     * @param onClick 按钮点击回调函数
     * @param type 按钮类型
     * @param iconAutoShow 是否点击就展示图标动作，默认是
     */
    constructor({btn,onClick=()=>{}, type, iconAutoShow=true}) {
        if(!(btn instanceof $) || (btn instanceof $ && btn.length !== 1) || btn[0].tagName !== 'BUTTON') throw new Error('Button param btn must be a button tag dom');
        this.btn = btn;
        this.onClick = onClick;
        this.type = type;
        this.iconAutoShow = iconAutoShow;
        if(TYPE.indexOf(this.type) === -1) throw new Error('Button param type must be one of '+ TYPE.toString());
        this.activeClass = DEFLAUT_ACTIVE[this.type];
        this.iconClass = DEFALUT_ICON[this.type];

        if(typeof this.onClick !== 'function') throw new Error('Button param onClick must be a function');

        this.icon = null;
        this.isActive = false;

        this._init();
    }

    _init() {
        this._renderHtml();
        this._bindEvent();
    }

    _renderHtml() {
        if(!this.btn.find('i').length){
            this.btn.prepend(`<i class="fa ${this.iconClass}"></i>`);
        }
        this.icon = this.btn.find('.'+this.iconClass);
    }

    toggleIcon(bol){
        this.isActive = !!bol;
        this.icon && this.icon.toggleClass(this.activeClass,!!bol);
    }

    _bindEvent() {
        this.btn.on('click',()=> {
            if(this.isActive) return;
            !!this.iconAutoShow && this.toggleIcon(true);
            this.onClick();
        });
    }
}