import CommonModal from '../../../../component/commonModal2/commonModal2';
import $ from "jquery";
import Dropdown from "../../../../component/dropDown/dropdown";
import notification from '../../../../component/notification/notification';
import FloatModal from '../../../../component/floatModal/floatModal';
import tips from '../../../../component/tips/tips';

import doRequest from "../../../../util/lib/doRequest";
import hasSpecialLetter from '../../../../util/lib/hasSpecialLetter';

const MODAL_ID = 'uploadTax';
export default class uploadTax extends CommonModal {
    constructor({
                    title = '字段关联', confirmFn = () => {
        }
                }) {
        super();
        this.title = title;
        this.id = MODAL_ID;
        this.confirmFn = confirmFn;
        if (typeof this.confirmFn !== 'function') throw new Error('RoleModal param confirmFn must be a function');

        //  模板列表
        this.tplList = [];
        //  当前模板序号
        this.tplIndex = 0;

        //  模板类型
        this.type = 1;
        //  模板编辑标志  0 不编辑 1 新增模板 2 编辑模板
        this.editType = 0;
        //  左侧表格及数据列表
        this.excelTable = null;
        //  excel头字段数据
        this.excelTableList = [];
        //  右侧表格及数据列表
        this.tplTable = null;
        this.tplTableList = [];
        //  系统字段查询字典
        this.tplDic = {};

        this._init();
    }

    init =(type)=> {
        this.type = type;
        this.tplList = [];
        this._getTplData(true);

        this._getTplList();
    };

    /**
     * 设置模板类型
     * @param type 1，2，3，4
     * @returns {uploadTax}
     */
    setType = (type)=> {
        this.type = type;
        return this;
    };

    /**
     * 设置组件编辑标志
     * @param n 0，1，2
     * @returns {uploadTax}
     */
    setEditType =(n)=> {
        this.editType = n;
        return this;
    };

    /**
     * 获取（更新）模板列表
     */
    _getTplList =(index)=> {
        doRequest({
            url:'upload/getPlatTemplate',
            data:{
                type:this.type,
                ts:Date.now()
            },
            success:(data)=> {
                if(data.success){
                    //  判断之前是否有模板列表，如果有，进行更新操作，将没有的id，push入模板list
                    if(this.tplList.length){
                        data.data.forEach((v)=> {
                            const index = this.tplList.findIndex(function (v2) {
                                return v2.id === v.id;
                            });
                            if(index === -1){
                                this.tplList.push(v);
                            }else if(this.tplList[index].hasEdit){
                                this.tplList[index] = v;
                            }
                        });
                    }else {
                        this.tplList = data.data || [];
                    }
                    if(index){
                        this.tplIndex = index;
                        this.renderExcelTable();
                    }else {
                        this.tplIndex = 0;
                    }
                    //  渲染模板下拉组件的下来列表，并设置下拉组件当前值
                    this.tplSelect.renderList(this.tplList.map(function (v) {
                        return v.name;
                    })).setData(this.tplIndex);
                }
            }
        });
    };

    /**
     * 获取系统字段
     * @param preload 预获取标识 bol
     */
    _getTplData =(preload)=> {
        //  预获取时，只请求并存储
        if(preload || !this.tplTableList.length){
            doRequest({
                url:'upload/getPlatUploadSystem',
                data:{
                    type:this.type
                },
                success: (data)=> {
                    if(data.success){
                        this.tplTableList = data.data || [];
                        data.data.forEach( (v,i)=> {
                            this.tplDic[v.content] = {
                                field:v.field,
                                index:i+1,
                                sysContent:v.content
                            };
                        });
                    }else {
                        window.DialogModal.show('获取系统模板字段失败，请重试！');
                    }
                    !preload && this._renderTplTable();
                }
            });
        }else {
            //  不是预加载时，则使用系统字段渲染右侧表格
            this._renderTplTable();
        }
    };

    /**
     * 渲染右侧列表
     */
    _renderTplTable =()=> {
        //  将当前右侧列表的数据，生产一个以content为key的字段，并存储在tplDic(系统字段字段)或当前模板数据的dic下
        this.tplTable.find('.ys-table-tbody').html(this.tplTableList.map( (v,i)=> {
            return '<div class="flexbox ys-table-tr">' +
                '<div class="ys-table-td" style="width: 50px">'+ (i+1) +'</div>' +
                '<div class="flex1 ys-table-td">'+ v.content +'</div>' +
                '</div>';
        }));
        if(this.editType){
            this.modal.find('.editType1').show().end().find('.editType0').hide();
        }else {
            this.modal.find('.editType0').show().end().find('.editType1').hide();
        }
    };

    /**
     * 渲染右侧表格
     * @param list excel头字段列表
     * @returns {uploadTax}
     */
    renderExcelTable = (list=this.excelTableList)=> {
        //  将list存储
        this.excelTableList = list;
        //  如果当前模板没有详情，则去请求详情，然后渲染左侧列表
        if(this.tplList[this.tplIndex].data){
            this._renderExcelTableByTpl();
        } else {
            const tplId = this.tplList[this.tplIndex].id;
            doRequest({
                url:'upload/getPlatTemplateDetailById',
                data:{
                    templateId:tplId,
                    ts:Date.now()
                },
                success: (data)=> {
                    if(data.success){
                        this.tplList[this.tplIndex].data = data.data || [];
                        this.tplList[this.tplIndex].dic = {};
                        data.data.forEach( (v)=> {
                            const sys_index = this.tplTableList.findIndex(function (t) {
                                return t.field === v.field;
                            });
                            this.tplList[this.tplIndex].dic[v.content] = {
                                index:sys_index+1,
                                field:v.field,
                                sysContent:this.tplTableList[sys_index].content
                            };
                        });
                    }else {
                        notification({
                            type:'error',
                            title:'获取模板详情失败',
                            msg:'获取模板详情失败，请尝试刷新页面！'
                        });
                    }
                    this._renderExcelTableByTpl();
                }
            });
        }
        return this;
    };

    /**
     * 渲染左侧列表
     * @param type 编辑表示 ‘edit’
     * @param dic 字典
     */
    _renderExcelTableByTpl(type,dic) {
        //  根据编辑标识拿模板字典，
        if(!dic) dic = this.editType?this.tplDic:(this.tplList[this.tplIndex]?this.tplList[this.tplIndex].dic:{});
        let list;
        //  左侧list字段与右侧模板（或系统）字段匹配
        if(type === 'edit'){
            list = this.tplList[this.tplIndex].data;
            list = list.map( (v)=> {
                const relIndex = this.tplTableList.findIndex(function (v2) {
                    return v.field === v2.field;
                });
                v.relIndex = relIndex+1;
                v.relContent = relIndex!==-1?this.tplTableList[relIndex].content :'';
                return v;
            });
        } else {
            list = this.excelTableList;
            list = list.map((v)=> {
                v.relIndex = dic[v.content]?dic[v.content].index:-1;
                v.field = dic[v.content]?dic[v.content].field:'';
                v.relContent = dic[v.content]?dic[v.content].sysContent:'';
                return v;
            });
        }
        if(type !== 'edit') this.excelTableList = list;
        //  选择左侧列表
        if(list.length){
            this.excelTable.find('.ys-table-tbody').html(list.map( (v,i)=> {
                return `<div class="flexbox ys-table-tr">
                <div class="ys-table-td" style="width: 50px">${i+1}</div>
                <div class="flex1 ys-table-td flexbox"><div class="flex1">${v.content}</div>${this.editType === 2?`<div class="tpl-key-edit" style="margin: 0 10px;cursor: pointer"><i style="color: #00b793" class="fa fa-edit"></i></div>`:''}</div>
                <div class="ys-table-td rel-td" style="width:200px">${this._getRelTdHtml(v)}</div>
                </div>`;
            }));
        }else {
            this.excelTable.find('.ys-table-tbody').html(`<div class="flexbox ys-table-tr jcc aic" style="padding: 40px 20px;color: #999;border-left: 1px solid #ccc;border-right: 1px solid #ccc"><span>没有获取到该EXCEL头文件字段，请检查您上传的EXCEL文件！</span></div>`);
        }

        //  如果不在编辑状态，使用当前模板list渲染右侧列表
        if(!this.editType){
            this._renderTplTable();
        }
    }

    /**
     * 获取左侧列表字段关联情况html
     * @param data 当前行数的数据
     * @returns {string} html
     */
    _getRelTdHtml =(data)=> {
        if(data.relIndex > 0){
            return '<div style="width: 100%;height:100%;padding: 0 20px" class="flexbox jcsb aic">' +
                '<i style="color: #00b793" class="fa fa-check-circle-o" title="已关联"></i>' +
                '<div class="flex1 rel-td-content" style="margin: 0 5px" title="'+ data.relContent +'">'+ data.relIndex + '. ' + data.relContent +'</div>' +
                (this.editType?'<i style="color: #00b793" class="fa fa-random" title="重新关联"></i>':'') +
                (this.editType?'<img class="break-rel-img" src="'+ window.basePath +'dist/images/break.png" title="取消关联" />':'') +
                '</div>';
        }
        return '<div style="width: 100%;height:100%;padding: 0 20px" class="flexbox jcsb aic">' +
            '<i style="color: #d42740" class="fa fa-close" title="未关联"></i>' +
            (this.editType?'<i style="color: #00b793" class="fa fa-random" title="关联"></i>':'') +
            '</div>';
    };

    /**
     * 渲染左侧列表关联字段单元格
     * @param index 行数
     * @param data 数据
     */
    _renderRelTd = (index,data)=> {
        this.excelTable.find('.ys-table-tbody .ys-table-tr').eq(index).html(`<div class="ys-table-td" style="width: 50px">${index+1}</div>
            <div class="flex1 ys-table-td flexbox"><div class="flex1">${data.content}</div>${this.editType === 2?`<div class="tpl-key-edit" style="margin: 0 10px;cursor: pointer"><i style="color: #00b793" class="fa fa-edit"></i></div>`:''}</div>
            <div class="ys-table-td rel-td" style="width:200px">${this._getRelTdHtml(data)}</div>`);
    };

    _renderHtml() {
        if (!$('#' + this.id).length) {
            $('body').append(this.getBasicHtml({
                id: this.id,
                title: this.title,
                body: this._getBodyHtml(),
                contentStyle: 'top:20px;width: 800px;left: -100px'
            }));
        }
        this.modal = $('#' + this.id);
        this.excelTable = $('#excelTable');
        this.tplTable = $('#tplTable');
    }

    _getBodyHtml() {
        return `<div class="flexbox aic editType0">选择导入模板：<div id="tplSelect"></div></div>
                <div class="flexbox aic editType1">新模板名称：<div><input type="text" class="form-control" style="height: 32px" id="newTplName" placeholder="请输入新模板名称" /></div><span class="text-danger" style="display: inline-block;margin-left: 10px;font-size: 12px;">PS：已为您自动匹配名称相同的字段</span></div>
                <div class="flexbox jcsb" style="height: 400px;margin-top: 10px;margin-bottom: 20px">
                    <div style="width: 450px;">
                        <div style="text-align: left"><span class="editType0">excel字段列表</span><span class="editType1">模板字段列表</span></div>
                        <div id="excelTable" class="div-table" style="">
                            <div class="ys-table-thead">
                                <div class="flexbox ys-table-tr">
                                    <div class="ys-table-th" style="width: 50px">序号</div>
                                    <div class="flex1 ys-table-th editType0">导入字段</div>
                                    <div class="flex1 ys-table-th editType1">模板字段</div>
                                    <div class="ys-table-th" style="width:200px">关联情况</div>
                                </div>
                            </div>
                            <div class="ys-table-tbody"></div>
                        </div>
                    </div>
                    <div style="width: 250px">
                        <div style="text-align: left"><span class="">系统字段列表</span><span class="" style="display: none">模板字段列表</span></div>
                        <div id="tplTable" class="div-table">
                            <div class="ys-table-thead">
                                <div class="flexbox ys-table-tr">
                                    <div class="ys-table-th" style="width: 50px">序号</div>
                                    <div class="flex1 ys-table-th" style="display: none">模板字段</div>
                                    <div class="flex1 ys-table-th">系统字段</div>
                                </div>
                            </div>
                            <div class="ys-table-tbody"></div>
                        </div>
                    </div>
                </div>`;
    }

    getFooterHtml() {
        return  `<div class="modal-footer default" style="padding: 15px;">
            <div class="modal-footer-fail"><i class="fa fa-exclamation-circle fa-lg" style="color: #d42740;"></i><span class="msg"></span></div>
        <button class="btn btn-main delete-tpl-btn editType0" style="margin-left: 20px"><i style="display: none" class="fa fa-spin fa-spinner mr10"></i>删除当前模板</button>
        <button class="btn btn-ys-default cancel-tpl-btn editType1" style="margin-left: 20px"><i style="display: none" class="fa fa-spin fa-spinner mr10"></i>取 消</button>
        <button class="btn btn-main save-tpl-btn editType1" style="margin-left: 20px"><i style="display: none" class="fa fa-spin fa-spinner mr10"></i>保存模板</button>
        <button class="btn btn-main add-tpl-btn editType0" style="margin-left: 20px"><i style="display: none" class="fa fa-spin fa-spinner mr10"></i>新建模板</button>
        <button class="btn btn-ys-default btn-cancel editType0" style="margin-left: 20px" data-dismiss="modal">取 消</button>
        <button class="btn btn-main confirm-btn editType0" style="margin-left: 20px"><i style="display: none" class="fa fa-spin fa-spinner mr10"></i>确 认</button>
        </div>`;
    }

    _bindEvent() {
        const that = this;
        this.modal.on('click', '.confirm-btn', function () {

        }).on('click','.fa-random',function () {
            //  关联按钮点击事件
            //  获取点击行数
            const tr_index = $(this).parents('.ys-table-tr').index();
            //  弹出浮动输入框
            that.floatModal.show({
                title:'关联序号',
                placeholder:'请输入序号',
                obj:$(this),
                side:3,
                fn:function (index) {
                    //  关联字段，判断输入下标合法性
                    index = parseInt(index);
                    if(!index) return that.floatModal.showMsg('请输入序号');
                    if(index > that.tplTableList.length || index <= 0){
                        return that.floatModal.showMsg('字段不存在');
                    }
                    if(that.editType === 1){
                        if(that.excelTableList.findIndex(function (v) {
                                return v.relIndex === index;
                            }) > -1){
                            return that.floatModal.showMsg('字段重复');
                        }
                    }else {
                        if(that.tplList[that.tplIndex].data.findIndex(function (v) {
                                return v.relIndex === index;
                            }) > -1){
                            return that.floatModal.showMsg('字段重复');
                        }
                    }

                    that.floatModal.hide();
                    //  更新左侧列表数据，并重新渲染当前行
                    const leftList = that.editType === 2?that.tplList[that.tplIndex].data:that.excelTableList;
                    leftList[tr_index].old_relIndex = leftList[tr_index].relIndex;
                    leftList[tr_index].relIndex = index;
                    leftList[tr_index].old_relContent = leftList[tr_index].relContent;
                    leftList[tr_index].relContent = that.tplTableList[index-1].content;
                    leftList[tr_index].old_field = leftList[tr_index].field;
                    leftList[tr_index].field = that.tplTableList[index-1].field;
                    that._renderRelTd(tr_index,leftList[tr_index]);
                }
            });
        }).on('click','.tpl-key-edit',function () {
            //  编辑左侧列表字段名称
            //  获取行数
            const tr_index = $(this).parents('.ys-table-tr').index();
            that.floatModal.show({
                title:'字段名称',
                placeholder:'请输入字段名称',
                obj:$(this),
                side:3,
                fn:function (data) {
                    //  关联字段
                    //  验证字段名称合法性
                    data = $.trim(data);
                    if(!data) return that.floatModal.showMsg('请输入名称');
                    const dataIndex = that.tplList[that.tplIndex].data.findIndex(function (v) {
                        return data === v.content;
                    });
                    if(dataIndex !== -1 && dataIndex !== tr_index) return that.floatModal.showMsg('名称重复');
                    if(hasSpecialLetter(data)) return that.floatModal.showMsg('禁止特殊字符');
                    that.floatModal.hide();
                    //  修改当前行数据，并重新渲染
                    const leftList = that.editType === 2?that.tplList[that.tplIndex].data:that.excelTableList;
                    leftList[tr_index].oldContent = leftList[tr_index].content;
                    leftList[tr_index].content = data;
                    that._renderRelTd(tr_index,leftList[tr_index]);
                }
            });
        }).on('click','.break-rel-img',function () {
            //  取消关联点击事件
            //  获取行数
            const tr_index = $(this).parents('.ys-table-tr').index();
            //  修改数据，并重新渲染该行
            const leftList = that.editType === 2?that.tplList[that.tplIndex].data:that.excelTableList;
            leftList[tr_index].relIndex = -1;
            that._renderRelTd(tr_index,leftList[tr_index]);
        }).on('click','.add-tpl-btn',function () {
            //  新增模板事件
            //  修改组件编辑状态为1，新增模式
            that.editType = 1;
            //  模板名称输入框置空
            $('#newTplName').val('');
            //  重新渲染左侧表格和右侧表格
            that._renderExcelTableByTpl();
            that._getTplData();
        }).on('click','.cancel-tpl-btn',function () {
            //  取消编辑模板或新增模板事件
            //  如果使需求编辑模板，将编辑过的数据，置回到编辑前
            that.editType === 2 && (that.tplList[that.tplIndex].data = that.tplList[that.tplIndex].data.map(function (v) {
                v.content = v.oldContent || v.content;
                v.field = v.old_field || v.field;
                v.relContent = v.old_relContent || v.relContent;
                delete v.oldContent;
                delete v.old_field;
                delete v.old_relContent;
                return v;
            }));
            //  编辑状态置为0，并重新渲染左侧表格
            that.editType = 0;
            that._renderExcelTableByTpl();
        }).on('click','.save-tpl-btn',function () {
            //  保存模板事件
            //  获取模板名称，并验证名称合法性
            const tplNameInput = $('#newTplName');
            const tplName = $.trim(tplNameInput.val());
            if(!tplName) return tips({
                msg:'请输入新模板名称',
                obj:tplNameInput
            });
            const tplNameIndex = that.tplList.findIndex(function (v) {
                return v.name === tplName;
            });
            // 新增
            if(that.editType === 1){
                if(tplNameIndex !== -1) return tips({
                    msg:'模板名称重复',
                    obj:tplNameInput
                });
            }else {
                // 修改
                if(tplNameIndex !== -1 && tplNameIndex !== that.tplIndex) return tips({
                    msg:'模板名称重复',
                    obj:tplNameInput
                });
            }
            if(hasSpecialLetter(tplName)) return tips({
                msg:'模板名称禁止特殊字符',
                obj:tplNameInput
            });
            //  获取新模板字段list
            const newTplList = [];
            const leftList = that.editType === 2?that.tplList[that.tplIndex].data:that.excelTableList;
            leftList.forEach(function (v) {
                if(v.relIndex > -1){
                    newTplList.push({
                        content:v.content,
                        field:v.field
                    });
                }
            });
            //  是否未关联任何一个字段
            if(!newTplList.length) return tips({
                msg:'请至少关联一个字段',
                obj:$(this)
            });
            that.editType === 2 && (that.tplList[that.tplIndex].hasEdit = true);
            //  请求
            doRequest({
                url:that.editType === 2?'upload/updateTemplate':'upload/createTemplate',
                method:'POST',
                data:{
                    templateDetailList:JSON.stringify(newTplList),
                    templateName:tplName,
                    type:that.type,
                    templateId:that.editType === 2?that.tplList[that.tplIndex].id:''
                },
                success:function (data) {
                    if(data.success){
                        that._getTplList(that.editType === 1?that.tplList.length:that.tplIndex);
                        notification({
                            title:that.editType === 1?'新增模板成功':'修改模板成功',
                            msg:(that.editType === 1?'新增 ':'修改 ')+ tplName +' 模板成功'
                        });
                        that.editType = 0;
                    }else {
                        notification({
                            type:'error',
                            title:that.editType === 1?'新增模板失败':'修改模板失败',
                            msg:(that.editType === 1?'新增模板失败':'修改模板失败')+'，请稍后重试！'
                        });
                    }
                }
            });
        }).on('click','.delete-tpl-btn',function () {
            //  删除当前模板事件
            //  不可删除默认模板
            if(that.tplIndex === 0) return tips({
                msg:'默认模板不可删除',
                obj:$(this)
            });
            //  生产一个随机验证码，用来让用户确认删除操作
            const randomNum = 1000+Math.ceil(Math.random()*8999);
            that.floatModal.show({
                title:'请输入 <span class="text-danger">'+ randomNum +'</span> 进行删除',
                placeholder:'请输入数字',
                side:1,
                obj:$(this),
                fn:function (num) {
                    if(num-0 === randomNum){
                        that.floatModal.hide();
                        doRequest({
                            url:'upload/deleteTemplate',
                            data:{
                                templateId:that.tplList[that.tplIndex].id,
                                ts:Date.now()
                            },
                            success:function (data) {
                                if(data.success){
                                    //  删除成功移除当前模板数据，重新渲染模板下拉列表，并使用默认模板渲染左侧右侧表格
                                    that.tplList.splice(that.tplIndex,1);
                                    that.tplIndex = 0;
                                    that.tplSelect.renderList(that.tplList.map(function (v) {
                                        return v.name;
                                    })).setData(0);
                                    that._renderExcelTableByTpl();
                                }else {
                                    notification({
                                        type:'error',
                                        title:'删除模板失败',
                                        msg:'删除模板失败，请稍后重试！'
                                    });
                                }
                            }
                        });
                    }else {
                        that.floatModal.showMsg('数字不正确！');
                    }
                }
            });
        }).on('click','.confirm-btn',function () {
            //  确认关联事件
            //  判断excel字段是否与所选模板有匹配的字段，如果没有，不能确认
            let num = 0;
            that.excelTableList.forEach(function (v) {
                if(v.relIndex !== -1) num++;
            });
            if(!num){
                return that.showFail('所选模板与上传文件完全不匹配！请选择其它模板或创建新模板');
            }
            //  触发确认回调函数，传出模板id，和关联度
            that.confirmFn(that.tplList[that.tplIndex].id,Math.round(num/that.excelTableList.length*100));
        }).on('click','.edit-tpl-btn',function () {
            //  编辑模板事件
            //  默认模板不可编辑
            if(that.tplIndex === 0) return tips({
                msg:'默认模板不可编辑',
                obj:$(this)
            });
            //  编辑状态置为2，并渲染左侧右侧列表
            $('#newTplName').val(that.tplList[that.tplIndex].name);
            that.editType = 2;
            that._renderExcelTableByTpl('edit');
            that._getTplData();
        });

        //  两个列表在滚动时，固定头部
        this.excelTable.on('scroll',function () {
            $(this).find('.ys-table-thead').css('transform','translate(0,'+ $(this).scrollTop() +'px)');
        });

        this.tplTable.on('scroll',function () {
            $(this).find('.ys-table-thead').css('transform','translate(0,'+ $(this).scrollTop() +'px)');
        });
    }

    _init() {
        this._renderHtml();
        this.tplSelect = new Dropdown({
            obj:$('#tplSelect'),
            onSelectChange:(current,index)=> {
                this.tplIndex = index;
                this.renderExcelTable();
            },
            menuStyle:'max-height:300px;overflow-y:auto'
        });

        this.floatModal = new FloatModal({});

        this._bindEvent();
    }
}