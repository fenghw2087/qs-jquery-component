/**
 * Created by Administrator on 2018/1/16.
 */
import './css/floatModal.less';

const SIDE_CLASS = ['','float-modal-top','float-modal-right','float-modal-bottom','float-modal-left'];
/**
 * 浮动确认框
 */
export default class FloatModal {
    /**
     * 构造方法
     * @param props noInput:是否包含一个input
     */
    constructor({ noInput }){
        this.noInput = !!noInput;
        this.id = 'ysFloatModal'+Math.ceil(100000000*Math.random());
        this.outer = null;
        this.confirmFn = function () {};
        this.errorMsg = null;
        this.input = null;

        this._init();
    }

    /**
     * 浮动框展示方法
     * @param options title:标题  placeholder 输入框提示 side:方向 1，2，3，4 上右下左  obj:浮动依附的dom  fn：确认回调
     * @returns {FloatModal}
     */
    show (options) {
        this.errorMsg.hide();
        this.outer.find('.float-modal-title').html(options.title || '');
        //根据side，计算浮动组件的位置
        let offset = options.obj.offset(),
            objWidth = options.obj[0].clientWidth,
            objHeight = options.obj[0].clientHeight,
            fmWidth = this.outer.width()+10,
            fmHeight = this.outer.height()+10,
            left,top;
        switch (options.side-0){
            case 1:{
                left = offset.left + objWidth/2 - 20;
                top = offset.top  - fmHeight - 10;
                break;
            }
            case 2:{
                left = offset.left + objWidth + 10;
                top = offset.top  - fmHeight/2 + objHeight/2;
                break;
            }
            case 3:{
                left = offset.left - fmWidth + objWidth/2 + 20;
                top = offset.top  + objHeight + 10;
                break;
            }
            case 4:{
                left = offset.left - fmWidth - 10;
                top = offset.top  - fmHeight/2 + objHeight/2;
                break;
            }
            default:{
                left = offset.left + objWidth/2 - 20;
                top = offset.top  - fmHeight - 10;
                break;
            }
        }
        this.outer.attr('class','float-modal-outer '+SIDE_CLASS[(options.side - 0) || 1]).css('transform','translate('+ left +'px,'+ top +'px)').fadeIn(200).data('open',true);
        this.input.length && this.input.val(options.data || '').attr('placeholder',options.placeholder || '').focus();
        this.confirmFn = options.fn;
        return this;
    }

    /**
     * 关闭方法
     */
    hide() {
        this.outer.fadeOut(200).data('open',false);
    }

    /**
     * 展示一个错误信息
     * @param msg
     */
    showMsg(msg) {
        this.errorMsg.text(msg).show();
        this.outer.find('input').val('').focus();
    }

    _bindEvent(){
        let that = this;
        this.outer.on('click','.rel-close',function () {
            that.hide();
        }).on('click','.rel-confirm',function () {
            const val = that.outer.find('input').val();
            that.confirmFn(val);
        });
        $(document).on('mousedown',(e)=>{
            if($(e.target).closest('#'+this.id).length !== 1){
                this.hide();
            }
        })
    }

    _getHtml(){
        return `<div id="${this.id}" class="float-modal-outer">
                    <div class="float-modal-title" style="font-size: 12px;margin: 5px 0">请输入</div>
                    ${!this.noInput?`<input style="width: 100%;font-size: 12px;padding: 0 5px;height: 26px" type="text" class="form-control" placeholder="请输入" />`:``}
                    <div style="text-align: right;margin-top: 5px">
                        <span class="error-msg text-danger" style="margin-right: 5px;font-size: 12px;display: none"></span>
                        <button class="btn btn-default rel-close" style="padding: 2px 5px;font-size: 12px">取消</button>
                        <button class="btn btn-ys rel-confirm" style="padding: 2px 5px;font-size: 12px">确认</button>
                    </div>
               </div>`;
    }

    _renderHtml(){
        if(!$('#'+this.id).length){
            $('body').append(this._getHtml());
            this.outer = $('#'+this.id);
            this.errorMsg = this.outer.find('.error-msg');
            this.input = this.outer.find('input');
            this._bindEvent();
        }
    }

    _init(){
        this._renderHtml();
    }

}