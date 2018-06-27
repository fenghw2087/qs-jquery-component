/**
 * Created by Administrator on 2018/1/15.
 */
import $ from "jquery";

/**
 * 验证码冷却按钮
 */
export default class CoolDownBtn {
    /**
     * 构造
     * @param obj 模板button
     * @param text 初始文字
     * @param postfix 冷却
     * @param cd 冷却时间
     * @param disableStyle 冷却样式
     * @param onClick 点击事件
     * @param coolDownFn 冷却完成回调
     */
    constructor({obj,text,postfix='后重新获取',cd=60,disableStyle={},onClick=()=>{},coolDownFn=()=>{}}){
        this.obj = obj;
        if(!(obj instanceof $) || (obj instanceof $ && obj.length !== 1) || obj[0].tagName !== 'BUTTON') throw new Error('CoolDownBtn param obj must be a one length jqueryDom');
        this.text = text;
        this.postfix = postfix;
        this.cd = cd;
        this.disableStyle = disableStyle;
        this.onClick = onClick;
        this.coolDownFn = coolDownFn;
        this.defaultStyle = this.obj.attr('style') || '';
        this.surTime = 0;
        this.isCD = false;

        this._init();
    }

    _init(){
        this._bindEvent();
    }

    _bindEvent(){
        this.obj.on('click',this.onClick);
    }

    /**
     * 开始进入冷却
     * @param st cd
     */
    startCD(st=this.cd){
        if(this.isCD) return;
        this.surTime = st-1;
        if(this.surTime >= 0){
            if(!this.obj.hasClass('is-cd')){
                this.obj.css(this.disableStyle).addClass('is-cd').attr('disabled',true);
            }
            this.obj.text((this.surTime+1)+'S'+this.postfix);
            setTimeout(()=>{
                this.startCD(this.surTime);
            },1000);
        }else {
            this.obj.attr({'style':this.defaultStyle,'disabled':false}).text(this.text).removeClass('is-cd');
            this.isCD = false;
            typeof this.coolDownFn === 'function' && this.coolDownFn();
        }
    }
}