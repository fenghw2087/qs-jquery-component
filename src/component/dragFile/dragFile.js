/**
**create by 2087, Thu May 31 2018
**/

import $ from 'jquery';

import './less/dragFile.less';
import message from "../message/message";

/**
 * 文件拖拽上传
 */
export default class DragFile {
    /**
     * 构造函数
     * @param outer 拖拽相应容器
     * @param placeholder 提示文案
     * @param fileTypes 允许上传的文件类型数组
     * @param title 标题
     * @param onFileReady 文件选择后的回调函数
     */
    constructor({ outer, placeholder='支持Excel文件，默认识别第一个sheet文件', fileTypes, title, onFileReady=()=>{} }) {
        if(!(outer instanceof $) || (outer instanceof $ && outer.length !== 1)) throw new Error('Table param outer must be one length jqueryDom');
        this.outer = outer;
        this.placeholder = placeholder;
        this.fileTypes = fileTypes;
        this.title = title;
        this.currentFile = '';
        this.onFileReady = onFileReady;
        this._init();
    }

    /**
     * 获取当前文件
     * @returns {string}
     */
    getFile =()=> {
        return this.currentFile;
    };

    /**
     * 重置
     */
    reset =()=> {
        this.currentFile = '';
        this.fileNameC.text('');
        this.dragC.removeClass('full');
        this.dragC.find('input[type="file"]').remove();
        this.dragC.append('<input type="file">');
    };

    _bindEvent = () => {
        const that = this;
        const dropbox = this.dragOuter[0];
        dropbox.addEventListener("dragenter", function(e){
            e.stopPropagation();
            e.preventDefault();
        }, false);
        dropbox.addEventListener("dragover", function(e){
            e.stopPropagation();
            e.preventDefault();
        }, false);
        dropbox.addEventListener("drop", function(e){
            e.stopPropagation();
            e.preventDefault();
            that._receiveImg(e.dataTransfer.files);
        }, false);
        this.outer.on('click','.drag-delete-btn',function () {
            that.currentFile = '';
            that.fileNameC.text('');
            that.dragC.removeClass('full');
            that.dragC.find('input[type="file"]').remove();
            that.dragC.append('<input type="file">');
        }).on('click','.upload-file-btn-link',function () {
            that.dragC.find('input[type="file"]').trigger('click');
        }).on('change','input[type="file"]',function () {
            that._receiveImg(this.files);
        })
    };

    _receiveImg =(file)=> {
        if(file && file[0]){
            const _file = file[0];
            const trail = _file.name.split('.').pop();
            if(this.fileTypes.indexOf(trail) === -1){
                return message({
                    msg:`仅允许上传${this.fileTypes.join(',')}类型的文件`
                })
            }
            this.currentFile = file[0];
            this.fileNameC.text(_file.name);
            this.dragC.addClass('full');
            this.onFileReady(this.currentFile);
        }
    };

    _renderHtml =()=> {
        this.outer.html(`<div class="ys-drag-file-outer">
    <div class="drag-outer">
        <i class="iconfont icon-wenjianshangchuan"></i>${this.title}
        <div><span class="upload-file-btn-link">点击上传文件</span>或将文件拖拽到这里上传，${this.placeholder}</div>
    </div>
    <div class="drag-file-name-c">
        <div class="drag-file-name"></div>
        <div class="drag-delete-btn"><i class="fa fa-trash-o"></i>移除当前文件</div>
    </div>
    <input type="file">
</div>`);
    };

    _init = () => {
        this._renderHtml();
        this.dragC = this.outer.find('.ys-drag-file-outer');
        this.dragOuter = this.outer.find('.drag-outer');
        this.fileNameC = this.outer.find('.drag-file-name');
        this._bindEvent();
    }
}
