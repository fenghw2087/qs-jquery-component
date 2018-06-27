import PdfViewer from '../../../../component/pdfViewer/pdfViewer';
import notification from '../../../../component/notification/notification';

import doRequest from '../../../../util/lib/doRequest';
import tips from '../../../../component/tips/tips';

import UploadTax from '../modal/uploadTax';

export const toggleMainContainer =(id)=> {
    $('.main-container').hide();
    $('#'+id).show();
    $('#sectionNav').find('a.active').removeClass('active').end().find('a[data-page="'+ id +'"]').addClass('active');
};

const getDateRange =()=> {
    return new window.Promise((resolve => {
        doRequest({
            url:'label/getDateRange',
            success:(data)=>{
                if(data.success){
                    resolve(parseInt(data.data));
                }
            }
        })
    }))
};

export const getDateRangePromise = getDateRange();

const PDFViewer = new PdfViewer();

export const uploadTaxModal = new UploadTax({});

export class DocTools {
    constructor({ id, data, type, stageUpdate=()=>{} }){
        this.outer = $('#'+id);
        this.data = data;
        this.type = type;
        this.stageUpdate = stageUpdate;

        this.fileData = this.data[['uploadTaxFile', 'shelingFile','investmentFile','entFile'][this.type-1]] || {};

        this.stage = 'empty';
        if(this.fileData.fileName){
            this.stage = 'done';
            this.fileData.shortName = this.fileData.fileName.split('-');
            this.fileData.shortName.shift();
            this.fileData.shortName = this.fileData.shortName.join('-');
        }

        this._init();
    }

    getFileData =()=> {
        return this.fileData;
    };

    _bindEvent =()=> {
        const that = this;
        this.outer.on('click','.cloud-download',function () {
            if(that.stage !== 'done') return;
            window.open(window.basePath + 'upload/downloadFile?filename='+that.fileData.fileName);
        }).on('click','.folder-open',function () {
            that.outer.find('input[type="file"]').trigger('click');
        }).on('change','input[type="file"]',function () {
            //  选择文件事件
            const file = this.files[0];
            if(!file) return that._openFile(file);
            const fileName = file.name.toString();
            const filepost = fileName.split('.').pop();
            //  验证文件名合法性
            if(filepost !== 'xls' && filepost !== 'xlsx'){
                return tips({
                    obj:that.outer.find('.file-open'),
                    msg:'仅允许上传xls,xlsx类型的文件！'
                })
            }
            that._openFile(file);
        }).on('click','.eye',function () {
            //  文件预览
            PDFViewer.show(window.basePath+'upload/previewOnHtml?filename='+that.fileData.fileName);
        })
    };

    _openFile =(file)=> {
        this.fileData = {};
        if(!file){
            this._setStage('empty');
        }else {
            this._setStage('upload');
            this.fileData.shortName = file.name;
            this._uploadFile();
        }
    };

    _uploadFile =()=> {
        const fd = new FormData(this.outer.find('form')[0]);
        fd.append('monthId',this.data.id);
        fd.append('type',this.type);
        this._setStage('upload');
        setTimeout(()=>{
            doRequest({
                url: this.type === 4?'entFile/uploadFile':'upload/uploadEconomicFile',
                type: 'POST',
                headers: {
                    'Accept': 'application/json;charset=UTF-8'
                },
                data: fd,
                async: false,
                cache: false,
                contentType: false,
                processData: false,
                success: (data)=> {
                    if(data.success){
                        notification({
                            title:'文件上传成功',
                            msg:'EXCEL文件已上传至服务器，请继续进行数据关联操作'
                        });
                        if(this.type === 4){
                            this.fileData = data.data;
                            this.fileData.shortName = this.fileData.fileName.split('-');
                            this.fileData.shortName.shift();
                            this.fileData.shortName = this.fileData.shortName.join('-');
                        }else {
                            this.fileData.fileName = data.data;
                        }
                        this._setStage('done');
                    }else {
                        notification({
                            type: 'error',
                            title:'文件上传失败',
                            msg:'EXCEL文件上传失败，请稍后重试'
                        });
                        this.fileData = {};
                        this._setStage('empty');
                    }
                }
            });
        },0);
    };

    _renderHtml =()=> {
        const htmlStr = `<div class="file-open" style="width: 250px;display: inline-block;vertical-align: middle"><div class="input-group input-group-sm">
            <input type="text" class="form-control file-name-input" readonly />
            <span class="input-group-addon eye" style="border-left: none" title="预览"><i class="fa fa-eye"></i></span>
            <span class="input-group-addon cloud-download" style="border-left: none" title="下载"><i class="fa fa-cloud-download upload-icon"></i></span>
            <span class="input-group-addon folder-open" title="选择文件"><i class="fa fa-folder-open"></i></span>
            </div></div><form style="display: none"><input type="file" name="fileUpload" /></form>`;
        this.outer.html(htmlStr);
    };

    _setStage =(stage)=> {
        if(stage !== this.stage){
            this.stageUpdate(stage);
        }
        this.stage = stage;
        this._update();
    };

    _update =()=> {
        switch (this.stage){
            case 'empty':{
                this.outer.find('.eye, .cloud-download').hide();
                this.outer.find('.file-name-input').val('').attr('title','');
                break;
            }
            case 'upload':{
                this.outer.find('.cloud-download').show().attr('title','上传中').end().find('.eye').hide().end().find('.upload-icon').removeClass('fa-cloud-download').addClass('fa-pulse fa-spinner');
                this.outer.find('.file-name-input').val(this.fileData.shortName).attr('title',this.fileData.shortName);
                break;
            }
            case 'done':{
                this.outer.find('.eye, .cloud-download').show().end().find('.cloud-download').attr('title','下载').find('.upload-icon').addClass('fa-cloud-download').removeClass('fa-pulse fa-spinner');
                this.outer.find('.file-name-input').val(this.fileData.shortName).attr('title',this.fileData.shortName);
                break;
            }
        }
    };

    _init =()=> {
        this._renderHtml();
        this._update();

        this._bindEvent();
    }
}

export class ProgressTool {
    constructor({ id, data, type, uploadTaxType, year }){
        this.outer = $('#'+id);
        this.data = data;
        this.type = type;
        this.uploadTaxType = uploadTaxType;
        this.year = year;

        this.fileData = this.data[['uploadTaxFile', 'shelingFile','investmentFile','entFile'][this.type-1]] || {};

        this.stage = 'empty';
        if(this.fileData.linkPercent) this.stage = 'done';
        if(!this.fileData.linkPercent && this.fileData.fileName) this.stage = 'upload';

        this.fileHeaderList = null;

        this._init();
    }

    _renderHtml =()=> {
        this.outer.html(`<div class="flexbox aic">
            <div class="ys-progress-outer"><div style="width: ${this.fileData.linkPercent ? 100 : 0}%" class="ys-progress-bar"></div></div>
            <div class="ys-progress-num">${this.fileData.linkPercent ?100 : 0}%</div>
            <div class="ys-progress-fail ${this.fileData.failNum?'pointer':''}">失败${this.fileData.failNum || '0'}</div>
            <button class="btn btn-link">关联</button>
            </div>`);
    };

    setUploadTaxType =(type)=> {
        this.uploadTaxType = type;
    };

    setStage =(stage)=> {
        this.stage = stage;
        this._update();
    };

    setFileData =(fileData)=> {
        this.fileData = fileData;
        return this;
    };

    _update =()=> {
        switch (this.stage){
            case 'empty':{
                this.outer.find('.ys-progress-fail').hide();
                this.outer.find('.ys-progress-num').text('0%').removeClass('active');
                this.outer.find('.ys-progress-bar').css('width',0);
                this.outer.find('.btn-link').attr('disabled',true).text('关联');
                break;
            }
            case 'upload':{
                this.outer.find('.ys-progress-fail').hide();
                this.outer.find('.ys-progress-num').text('0%').removeClass('active');
                this.outer.find('.ys-progress-bar').css('width',0);
                this.outer.find('.btn-link').attr('disabled',false).text('关联');
                break;
            }
            case 'uploading':{
                this.outer.find('.ys-progress-fail').show().text('导入中');
                this.outer.find('.ys-progress-num').text((this.fileData.linkPercent ? 100 : 0)+'%').addClass('active');
                this.outer.find('.ys-progress-bar').css('width',(this.fileData.linkPercent ? 100 : 0)+'%');
                this.outer.find('.btn-link').attr('disabled',true).text('重新关联');
                break;
            }
            case 'done':{
                this.outer.find('.ys-progress-fail').show().text(`失败${this.fileData.failNum || '0'}`);
                this.outer.find('.ys-progress-num').text((this.fileData.linkPercent ? 100 : 0)+'%').addClass('active');
                this.outer.find('.ys-progress-bar').css('width',(this.fileData.linkPercent ? 100 : 0)+'%');
                this.outer.find('.btn-link').attr('disabled',false).text('重新关联');
                break;
            }
        }
    };

    _storageLastYear =()=> {
        const key = 'lastyear'+this.type;
        if(window.localStorage){
            window.localStorage.setItem(key,this.year);
        }
    };

    /**
     * 关联文件方法
     * @param tid 模板id
     * @param percent 关联度
     */
    uploadFile =(tid,percent)=> {
        percent = 0;
        //  企业档案导入走这里
        if(this.type === 4){
            doRequest({
                url:'entFile/analysisExcelRecord',
                data:{
                    templateId:tid,
                    fileId:this.fileData.id || this.fileData.historyId,
                    ts:Date.now()
                },
                success: (data)=> {
                    if(data.success){
                        //  导入成功后，更新文件数据，并将组件状态更新到uploading
                        this.fileData.linkPercent = percent;
                        this.fileData.failNum = null;
                        this.data.uploadStatus = 1;
                        this.setStage('uploading');
                        this._storageLastYear();
                        notification({
                            title:'数据关联成功',
                            msg:'数据关联成功，正在异步导入中，请耐心等待，期间您可以刷新页面查看是否导入完成。'
                        });
                        uploadTaxModal.modalHide();
                    } else {
                        uploadTaxModal.showFail('数据关联失败，请稍后重试！');
                    }
                }
            });
            return;
        }
        //  其余导入走这里
        doRequest({
            url:this.uploadTaxType === 2?'uploadTaxCumulate/parseCumulateTax':'upload/resolveEconomicFile',
            data:{
                monthId:this.data.id,
                monthEcoId:this.data.id,
                type:this.type,
                templateId:tid,
                ts:Date.now()
            },
            success: (data)=> {
                if(data.success){
                    this.fileData.linkPercent = percent;
                    this.fileData.failNum = null;
                    this.data.uploadStatus = 1;
                    this.setStage('uploading');
                    this._storageLastYear();
                    notification({
                        title:'数据关联成功',
                        msg:'数据关联成功，正在异步导入中，请耐心等待，期间您可以刷新页面查看是否导入完成。'
                    });
                    uploadTaxModal.modalHide();
                } else {
                    uploadTaxModal.showFail('数据关联失败，请稍后重试！');
                }
            }
        });
    };

    _bindEvent =()=> {
        const that = this;
        this.outer.on('click','.btn-link',function () {
            //  请求头字段，并打开模板组件
            !that.fileHeaderList ? doRequest({
                url: that.type === 4? 'entFile/analysisExcelField':'upload/getEconomicHeader',
                data:{
                    monthId:that.data.id,
                    type:that.type,
                    fileId:that.fileData.id || that.fileData.historyId
                },
                success: (data)=> {
                    if(data.success){
                        that.fileHeaderList = (data.data || []).map(function (v) {
                            return {
                                content:v
                            };
                        });
                        //  设置模板组件类型，确认回调，编辑类型，并渲染excel头字段列表
                        uploadTaxModal.setType(that.type).setConfirmFn( (tid,percent)=> {
                            that.uploadFile(tid,percent);
                        }).setEditType(0).modalShow().renderExcelTable(that.fileHeaderList);
                    }else {
                        notification({
                            type:'error',
                            title:'获取文件表头字段失败',
                            msg:'获取EXCEL文件表头字段失败，请检查您上传的EXCEL文件是否正确！'
                        })
                    }
                }
            }):uploadTaxModal.setType(that.type).setConfirmFn( (tid,percent)=> {
                that.uploadFile(tid,percent);
            }).setEditType(0).modalShow().renderExcelTable(that.fileHeaderList);
        }).on('click','.ys-progress-fail.pointer',function () {
            window.open(window.basePath+'user/message/detailInfo?msgId='+that.fileData.msgId);
        })
    };

    _init =()=> {
        this._renderHtml();
        this._update();

        this._bindEvent();
    }
}