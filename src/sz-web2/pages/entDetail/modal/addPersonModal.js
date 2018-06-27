import CommonModal2 from '../../../../component/commonModal2/commonModal2';
import $ from "jquery";
import Dropdown from "../../../../component/dropDown/dropdown";
import tips from "../../../../component/tips/tips";
import checkPhone from "../../../../util/lib/checkPhone";

const MODAL_ID = 'addPersonModal4254';
export default class AddPersonModal extends CommonModal2 {
    constructor({
                    title = '添加企业人才', confirmFn = () => {
        }
                }) {
        super();
        this.title = title;
        this.id = MODAL_ID;
        this.confirmFn = confirmFn;
        if (typeof this.confirmFn !== 'function') throw new Error('addPersonModal param confirmFn must be a function');

        this.data = {};

        this._init();
    }

    setData =({fn,data={}})=>{
        this.setConfirmFn(fn);
        this.data = data;
        this.nameC.val(data.name);
        this.phoneC.val(data.phone);
        this.positionC.val(data.position);
        this.gdSelect.setData(['是','否'].indexOf(data.isgd));
        return this;
    };

    _reset =()=> {
        this.data = {};
        this.nameC.val('');
        this.phoneC.val('');
        this.positionC.val('');
        this.gdSelect.reset();
    };

    _renderHtml() {
        if (!$('#' + this.id).length) {
            $('body').append(this.getBasicHtml({
                id: this.id,
                title: this.title,
                body: this._getBodyHtml(),
                contentStyle: 'top:100px;width: 500px;left: 50px'
            }));
        }
        this.modal = $('#' + this.id);
    }

    _checkData =()=> {
        this.data.name = this.nameC.val().trim();
        if(!this.data.name){
            tips({
                obj:this.nameC,
                msg:'姓名不能为空'
            });
            return false;
        }
        this.data.position = this.positionC.val().trim();
        if(!this.data.position){
            tips({
                obj:this.positionC,
                msg:'职务不能为空'
            });
            return false;
        }
        this.data.phone = this.phoneC.val().trim();
        if(!checkPhone(this.data.phone)){
            tips({
                obj:this.phoneC,
                msg:'请输入正确的手机号'
            });
            return false;
        }
        if(!this.data.isgd){
            tips({
                obj:this.modal.find('.isgd-select'),
                msg:'请选择是否是股东'
            });
            return false;
        }
        return true;
    };

    _getBodyHtml() {
        return `<div style="padding: 0 20px">
    <div class="modal-c-i-o">
        <div class="modal-c-i">
            <div class="modal-c-i-t is-must">姓名</div>
            <div class="modal-c-i-c"><input name="name" type="text" placeholder="请输入姓名" /></div>
        </div>
        <div class="modal-c-i">
            <div class="modal-c-i-t is-must">职务</div>
            <div class="modal-c-i-c"><input name="position" type="text" placeholder="请输入职务" /></div>
        </div>
    </div>
    <div class="modal-c-i-o">
        <div class="modal-c-i">
            <div class="modal-c-i-t is-must">联系电话</div>
            <div class="modal-c-i-c"><input name="phone" type="number" placeholder="请输入手机号" /></div>
        </div>
        <div class="modal-c-i">
            <div class="modal-c-i-t is-must">是否股东</div>
            <div class="modal-c-i-c"><div class="drop-c isgd-select" style="width: 90px"></div></div>
        </div>
    </div>
</div>`;
    }

    _bindEvent() {
        const that = this;
        this.modal.on('click', '.confirm-btn', function () {
            that._checkData() && that.confirmFn(that.data);
        })
    }

    _init() {
        this._renderHtml();
        this.gdSelect = new Dropdown({
            obj:this.modal.find('.isgd-select'),
            list:['是','否'],
            onSelectChange:current=>{
                this.data.isgd = current;
            }
        });

        this.nameC = this.modal.find('[name="name"]');
        this.positionC = this.modal.find('[name="position"]');
        this.phoneC = this.modal.find('[name="phone"]');

        this._bindEvent();
    }
}