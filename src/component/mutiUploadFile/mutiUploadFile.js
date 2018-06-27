/**
**create by 2087, Thu May 24 2018
**/

import $ from 'jquery';

import './less/mutiUploadFile.less';
import message from "../message/message";
import uploadFile from "../../util/lib/uploadFile";
import FloatModal from "../floatModal/floatModal";

const FILE_TYPES = ['doc','docx','pdf','xls','xlsx'];

const FILE_ICON = {
    'excel': 'fa-file-excel-o',
    'word':'fa-file-word-o',
    'pdf':'fa-file-pdf-o',
    'file':'fa-file-o'
};
/**
 * 多文件上传
 */
//TODO 目前文件不上传，可扩展实施上传，并附带进度条
export default class MutiUploadFile {
    /**
     * 构造函数
     * @param outer 外部容器
     * @param fileTypes 允许上传的文件类型 数组
     * @param files 已有的文件 数组
     */
    constructor({ outer, fileTypes=FILE_TYPES,files=[] }) {
        if(!(outer instanceof $) || (outer instanceof $ && outer.length !== 1)) throw new Error('MutiUploadFile param outer must be one length jqueryDom');
        this.outer = outer;
        this.fileTypes = fileTypes;
        this.files = files.map(v=>{
            const trail = v.split('.').pop().toLowerCase();
            const name = v.split('/').pop().split('-');
            name.shift();
            return {
                name:name.join('-'),
                trail,
                type:getTypeByTrail(trail),
                path:v
            }
        });

        this._init();
    }

    /**
     * 获取当前文件
     * @returns {any[] | *}
     */
    getFiles =()=> {
        return this.files;
    };

    /**
     * 设置文件
     * @param files
     */
    setFiles =(files)=> {
        const newFiles = files.map(v=>{
            const trail = v.split('.').pop().toLowerCase();
            const name = v.split('/').pop().split('-');
            return {
                name:name.join('-'),
                trail,
                type:getTypeByTrail(trail),
                path:v
            }
        });
        this.outer.find('.muti-file-list').prepend(newFiles.map(v=>{
            return this._getImgHtml(v);
        }));
        this.files = [ ...newFiles,...this.files];
    };

    /**
     * 重置
     */
    reset =()=> {
        this.files = [];
        this.outer.find('.muti-file-list').empty();
    };

    _renderFiles =()=> {
        this.outer.find('.muti-file-list').html(this.files.map(v=>{
            return this._getImgHtml(v);
        }))
    };

    _renderFile =()=> {
        this.outer.find('.muti-file-list').append(this._getImgHtml([...this.files].pop()));
        return this.outer.find('.muti-file-list').children(':last');
    };

    _getImgHtml =(file)=> {
        return `<div class="file-item-c">
<div class="file-icon"><i class="fa ${FILE_ICON[file.type]}"></i></div>
<div class="file-progress">${file.name}<div class="file-bar" style="width:0"></div></div>
<div class="file-result full"><i class="fa fa-check-circle-o"></i><i class="fa fa-trash-o"></i></div>
</div>`
    };

    _uploadFile =(file)=> {
        const fileName = file.name;
        const trail = fileName.split('.').pop();
        if(this.fileTypes.indexOf(trail) === -1){
            return message({
                msg:`仅允许上传${this.fileTypes.join(' ')}类型的文件`
            })
        }
        this.files.push({
            name:fileName,
            trail,
            type:getTypeByTrail(trail),
            file
        });
        this._renderFile();
        //TODO 实时上传文件逻辑
        // uploadFile({
        //     url:'upload/uploadFile',
        //     fd,
        //     onprogress:( ()=>{
        //         const bar = fileDom.find('.file-bar');
        //         return (e)=>{
        //             const _p = Math.round(e.loaded/e.total*100);
        //             bar.width(_p+'%');
        //             if(_p>=100){
        //                 bar.addClass('full');
        //                 fileDom.find('.file-result').addClass('full');
        //             }
        //         }
        //     })(),
        //     success:(data)=>{
        //         if(data.success){
        //             this.files[this.files.length-1].path = window.location.protocol+'//'+window.location.host+(window.basePath || '/')+'upload/downloadFile?filename='+data.data;
        //         }
        //     }
        // })
    };

    _bindEvent = () => {
        const that = this;
        this.outer.on('click','.muti-add-btn',function () {
            that.outer.find('input[type="file"]').trigger('click');
        }).on('change','input[type="file"]',function () {
            const file = this.files[0];
            that._uploadFile(file);
        }).on('click','.fa-trash-o',function () {
            const parent = $(this).parents('.file-item-c');
            const index = parent.index();
            that.floatModal.show({
                obj:$(this),
                title:'删除这个文件？',
                side:3,
                fn:()=>{
                    that.files.splice(index,1);
                    parent.remove();
                    that.floatModal.hide();
                }
            })
        })
    };

    _renderHtml =()=> {
        this.outer.html(`<div class="muti-upload-outer">
    <div class="muti-file-list"></div>
    <div class="muti-add-c"><button class="btn muti-add-btn"><i class="iconfont icon-daochu"></i>选择文件</button><div class="muti-tips">支持上传 ${this.fileTypes.map(v=>' .'+v).join(' ')} 文件</div></div>
    <input type="file" />
</div>`);
    };

    _init = () => {
        this._renderHtml();
        this._renderFiles();
        this.floatModal = new FloatModal({ noInput:true });
        this._bindEvent();
    }
}

function getTypeByTrail(trail) {
    switch (trail){
        case 'doc':
        case 'docx':{
            return 'word'
        }
        case 'xls':
        case 'xlsx':{
            return 'excel'
        }
        case 'pdf':{
            return 'pdf'
        }
        default:{
            return 'file'
        }
    }
}
