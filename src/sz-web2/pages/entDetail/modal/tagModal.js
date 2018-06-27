import './tagModal.less';

import CommonModal2 from '../../../../component/commonModal2/commonModal2';
import $ from "jquery";
import List from "../../../../component/list/list";

const MODAL_ID = 'tagModalevrg34v';
export default class TagModal extends CommonModal2 {
    constructor({
                    title = '', confirmFn = () => {
        }
                }) {
        super();
        this.title = title;
        this.id = MODAL_ID;
        this.confirmFn = confirmFn;
        this.currentTagList = [];

        this.tagList = [];

        this._init();
    }

    setTagList =(list)=> {
        this.tagList = list;
        this._renderTagNav();
    };

    setData =({fn,title,list,addTag,removeTag})=>{
        this.setConfirmFn(fn);
        this.setTitle(title);
        this.currentTagList = list;
        this.existList.setData({
            dataSource:this.currentTagList
        });
        this._addTagRequest = addTag;
        this._removeTagRequest = removeTag;
        return this;
    };

    _addTagRequest =()=> {
    };

    _removeTagRequest =()=> {
    };

    _toggleTag =(data,addFlag)=> {
        if(addFlag){
            if(!data.isMuti) {
                const level2Row = this.currentTagList.find(v=>v.type === data.type+'二级');
                level2Row && this._removeTagRequest(level2Row,this.currentTagList);
                this.currentTagList = this.currentTagList.filter(v=>v.type !== data.type)
            }
            this.currentTagList.push(data);
            this._addTagRequest(data,this.currentTagList);
        }else {
            const index = this.currentTagList.findIndex(v=>{
                return v.type === data.type && v.key === data.key && v.value === v.value
            });
            index > -1 && this.currentTagList.splice(index,1);
        }
        this.existList.setData({
            dataSource:this.currentTagList
        })
    };

    _removeSec =(row)=> {
        this.newTagC2.find('.add-tag-i').removeClass('checked');
        this.currentTagList = this.currentTagList.filter(v=>v.type !== row.type+'二级');
        this.existList.setData({
            dataSource:this.currentTagList
        });
    };

    _removeTag =(index)=> {
        const row = this.existList.getRowData(index);
        this.currentTagList.splice(index,1);
        this._removeTagRequest(row,this.currentTagList);
        if(row.list && row.list.length){
            this.currentTagList = this.currentTagList.filter(v=>v.type !== row.type+'二级');
            this._removeTagRequest(row.list[0],this.currentTagList);
        }
        this.existList.setData({
            dataSource:this.currentTagList
        });
        this.newTagList1.reload();
        this.newTagList2.reload();
    };

    _renderAllTag =(index)=> {
        const _indexArr = (index+'').split('-');
        const current = _indexArr.reduce((o,v)=>{
            return o.children[v];
        },{ children:this.tagList });
        const list = current.list || [];
        this.newTagList1.setData({
            dataSource:list
        });
        this.newTagList2.setData({
            dataSource:[]
        })
    };

    _renderTagNav =()=> {
        this.navC.html(this.tagList.map((v,i)=>{
            return `<div class="tag-tool-bar-i-c${ v.hasSec?' has-sec':'' }">
    <div class="tag-tool-bar-i" data-index="${i}">${v.name}</div>
    ${v.hasSec?`<div class="tag-tool-bar-sec-c">
        ${ v.children.map((v2,i2)=>{
            return `<div class="tag-tool-sec-i" data-index="${i}-${i2}">${v2.name}</div>`
            }).join('') }
    </div>`:''}
</div>`;
        }))
    };

    _renderHtml() {
        if (!$('#' + this.id).length) {
            $('body').append(this.getBasicHtml({
                id: this.id,
                title: this.title,
                body: this._getBodyHtml(),
                contentStyle: 'top:100px;width: 800px;left: -100px;top:20px'
            }));
        }
        this.modal = $('#' + this.id);
        this.existC = this.modal.find('.exist-tag-o');
        this.navC = this.modal.find('.tag-tool-nav-c');
        this.newTagC1 = this.modal.find('.new-tag-c-1');
        this.newTagC2 = this.modal.find('.new-tag-c-2');
        this.existList = new List({
            outer:this.existC,
            renderTr:(row,index)=>{
                return `<div class="exist-tag-c${row.static?'':' can-delete'}">${row.name}<div data-index="${index}" class="tag-delete-icon">x</div></div>`
            },
            dataSource:this.currentTagList,
            renderEmpty:()=>'该企业还没有标签'
        });
        this.newTagList1 = new List({
            outer:this.newTagC1,
            renderTr:(row,index)=>{
                return `<div data-index="${index}" class="add-tag-i${ row.isMuti?' is-muti':'' }${this._isCheckedTag(row)?' checked':''}">${row.name}</div>`
            },
            renderEmpty:()=>''
        });
        this.newTagList2 = new List({
            outer:this.newTagC2,
            renderTr:(row,index)=>{
                return `<div data-index="${index}" data-level="2" class="add-tag-i${ row.isMuti?' is-muti':'' }${this._isCheckedTag(row)?' checked':''}">${row.name.split('-')[1]}</div>`
            },
            renderEmpty:()=>''
        });
    }

    _getBodyHtml() {
        return `<div style="padding: 0 20px">
    <div class="exist-tag-o">
        <div class="exist-tag-c">标签1<div class="tag-delete-icon">x</div></div>
    </div>
    <div class="tag-tool-o">
        <div class="tag-tool-nav-c"></div>
        <div class="tag-tool-add-c">
            <div class="new-tag-c-1"></div>
            <div class="new-tag-c-2"></div>
        </div>
    </div>
</div>`;
    }

    _isCheckedTag =(row)=> {
        return this.currentTagList.some(v=>{
            return v.key === row.key && v.value === row.value
        })
    };

    _bindEvent() {
        const that = this;
        this.modal.on('click', '.confirm-btn', function () {
            that.confirmFn();
        }).on('click','.tag-tool-bar-i',function () {
            $(this).parent().addClass('active').siblings().removeClass('active');
            $(this).next().find('.tag-tool-sec-i').removeClass('active');
            const index = $(this).data('index');
            that._renderAllTag(index);
        }).on('click','.tag-tool-sec-i',function () {
            $(this).addClass('active').siblings().removeClass('active');
            const index = $(this).data('index');
            that._renderAllTag(index);
        }).on('click','.add-tag-i',function () {
            const level = $(this).data('level')-0;
            const row = level === 2? that.newTagList2.getRowData($(this).data('index')) : that.newTagList1.getRowData($(this).data('index'));
            level !== 2 && that.newTagList2.setData({
                dataSource:row.list || []
            });
            if($(this).hasClass('checked')) return;
            $(this).addClass('checked');
            if(!row.isMuti){
                $(this).siblings().removeClass('checked');
            }
            that._toggleTag(row,$(this).hasClass('checked'));
            if(row.list){
                that._removeSec(row);
            }
        }).on('click','.tag-delete-icon',function () {
            that._removeTag($(this).data('index'));
        })
    }

    _init() {
        this._renderHtml();
        this._bindEvent();
    }
}