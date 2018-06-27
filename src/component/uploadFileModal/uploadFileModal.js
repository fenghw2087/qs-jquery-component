import CommonModal2 from '../commonModal2/commonModal2';
import $ from "jquery";
import tips from '../tips/tips';
import './less/uploadFileModal.less';

const MODAL_ID = 'uploadFileModal';
/**
 * 弹框式文件上传
 */
export default class UploadFileModal extends CommonModal2{
    /**
     * 构造函数
     * @param title 标题
     * @param confirmFn 确认回调
     * @param postFix 允许上传的文件类型
     */
    constructor({ title='', confirmFn=()=>{}, postFix=['xls','xlsx'] }) {
        super();
        this.title = title;
        this.id = MODAL_ID+Math.ceil(Math.random()*10000000);
        this.confirmFn = confirmFn;
        if(typeof this.confirmFn !== 'function') throw new Error('uploadModal param confirmFn must be a function');

        this.postFix = postFix;

        this._init();
    }

    _renderHtml() {
        if(!$('#'+this.id).length){
            $('body').append(this.getBasicHtml({
                id:this.id,
                title:this.title,
                body:this._getBodyHtml(),
                contentStyle:'top:100px;width: 400px;left: 150px'
            }));
        }
        this.modal = $('#'+this.id);
        this.form = this.modal.find('form');
        this.file = this.form.find('input');
        this.fileNameC = this.modal.find('.file-name');
    }

    _getBodyHtml(){
        return `<div style="width: 350px;margin: 0 auto;height: 100px" class="flexbox jcc aic">
<div>文件：</div>
<div class="flex1">
<div class="input-group">
    <input type="text" class="form-control file-name" placeholder="请选择${this.postFix.join('、')}类型的文件" readonly />
    <span class="input-group-addon open-file"><i class="fa fa-folder-open"></i></span>
</div>
    <form style="display: none"><input type="file" name="file" /></form>
</div>
</div>`;
    }

    openFile(){
        this.file.trigger('click');
        return this;
    }

    /**
     * 重置，并返回自身
     * @returns {UploadFileModal}
     */
    reset(){
        this.fileNameC.val('');
        this.form[0].reset();
        return this;
    }

    /**
     * 设置标题和确认回调函数
     * @param fn 点击确认回调函数
     * @param title 弹框标题
     * @returns {UploadFileModal}
     */
    setData({ fn,title }){
        this.setConfirmFn(fn);
        this.setTitle(title);
        return this;
    }

    _bindEvent() {
        const that = this;
        this.modal.on('click','.confirm-btn',function () {
            if(!that.fileNameC.val()){
                return tips({
                    msg:'请选择文件！',
                    obj:that.fileNameC,
                    side:3
                })
            }
            const fd = new FormData((that.form[0]));
            that.confirmFn({fd});
        }).on('click','.open-file,.file-name',function () {
            that.openFile();
        }).on('change','input[type="file"]',function () {
            const file = this.files[0];
            if(!file){
                return that.reset();
            }
            if(that.postFix.indexOf(file.name.split('.').pop()) === -1){
                that.reset();
                return tips({
                    msg:'仅允许上传'+that.postFix.join('、')+'类型的文件！',
                    obj:that.fileNameC,
                    side:3
                })
            }
            that.fileNameC.val(file.name);
        })
    }

    _init() {
        this._renderHtml();
        this._bindEvent();
    }
}