import { isPosInteger } from '../../util/lib/check';
import $ from "jquery";

/**
 * 自动搜索函数
 */
export default class AutoSearch {
    /**
     * 构造方法
     * @param input 模板input
     * @param delay 输入延时，默认500ms
     * @param fn 搜索回调函数
     * @param keyboard 键盘类型
     */
    constructor({ input,delay=500,fn,keyboard='pc' }) {
        if(!(input instanceof $) || (input instanceof $ && input.length !== 1) || input[0].tagName !== 'INPUT') throw new Error('AutoSearch param input must be a input dom');
        if(typeof fn !== 'function') throw new Error('AutoSearch param fn must be a function');
        if(delay!== 0 && !isPosInteger(delay)) throw new Error('AutoSearch param delay must be a 0或正整数');

        this.input = input;
        this.fn = fn;
        this.delay = delay;
        this.keyboard = keyboard;

        this.timer = null;

        this.oldVal = '';

        this._init();
    }

    _bindEvent() {
        if(this.keyboard === 'pc'){
            this.input.on('keyup',(e)=> {
                if(this.timer) clearTimeout(this.timer);
                this.timer = setTimeout(()=>{
                    const newVal = $.trim(this.input.val());
                    if(this.oldVal !== newVal && [13,38,40].indexOf(e.which) === -1){
                        this.fn(newVal);
                        this.oldVal = newVal;
                    }
                },this.delay);
            });
        }else {
            this.input.on('keyup',()=> {
                if(this.timer) clearTimeout(this.timer);
                this.timer = setTimeout(()=>{
                    const newVal = $.trim(this.input.val());
                    if(this.oldVal !== newVal){
                        this.fn(newVal);
                        this.oldVal = newVal;
                    }
                },this.delay);
            });
        }
    }

    triggerSearch(){
        if(this.timer) clearTimeout(this.timer);
        this.fn($.trim(this.input.val()));
    }

    /**
     * 重置搜索框
     */
    reset(){
        this.oldVal = '';
        this.input.val('');
    }

    _init() {
        this._bindEvent();
    }
}