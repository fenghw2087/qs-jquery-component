/**
 * Created by Administrator on 2018/1/12.
 */
import './css/tips.less';
import $ from 'jquery';

const getTipHtml = (msg,id,side) => {
    return `<div id="${id}" class="ys-tips-outer side${side}">${msg}</div>`;
};
/**
 * 浮动提示信息方法
 * @param options obj:依附dom side: 1,2,3,4 上右下左，默认3  msg:提示信息  time:提示持续时间，默认2000
 */
const tips = (options = {}) => {
    if(!options.msg) return;
    if(options.obj.length !==1) return;
    options.side = options.side || 3;
    if(options.obj[0].tagName === 'INPUT'){
        options.obj.focus();
    }
    const id = 'myTips'+Math.round(Math.random()*10000000);

    const tipHtml = getTipHtml(options.msg,id,options.side);
    $('body').append(tipHtml);
    const tipsDom = $('#'+id);
    let left,top;
    const objw = options.obj[0].clientWidth,objh = options.obj[0].clientHeight,{left:offl,top:offt} = options.obj.offset(),tipw = tipsDom.width()+20,tiph = tipsDom.height()+10;
    switch (options.side - 0){
        case 1:{
            left = offl;
            top = offt - tiph - 10;
            break;
        }
        case 2:{
            left = offl + objw + 10;
            top = offt + objh/2 - tiph/2;
            break;
        }
        case 3:{
            left = offl;
            top = offt + objh + 10;
            break;
        }
        case 4:{
            left = offl - tipw - 10;
            top = offt + objh/2 - tiph/2;
            break;
        }
        default:{
            left = offl;
            top = offt - tiph - 10;
            break;
        }
    }
    tipsDom.css({left,top}).fadeIn(300).delay(options.time || 2000).fadeOut(300);
    setTimeout(function () {
        tipsDom.remove();
    },(options.time+1000) || 3000);
};

export default tips;