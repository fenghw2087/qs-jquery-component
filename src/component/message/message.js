/**
 * Created by Administrator on 2018/1/22.
 */
import './css/message.less';

/**
 * 边角提示组件
 * @param type 提示类型 one of [success ,info ,error ,warning]
 * @param msg 提示主要信息
 * @param time 提示出现时间，默认3S，传入0则不自动关闭
 */
const message = ({
                          type = 'error',
                          msg,
                          time=3,
                      })=> {
    let outer = $('.ys-message-c');
    if(!outer.length){
        $('body').append(getOuter());
        outer = $('.ys-message-c');
    }
    outer.append(getInfo(type,msg));
    const infoC = outer.children(':last');
    setTimeout(()=>{
        infoC.addClass('active');
    },10);
    setTimeout(()=>{
        infoC.removeClass('active');
    },time*1000+310);
    setTimeout(()=>{
        infoC.remove();
    },time*1000+610)
};

const getOuter =()=> {
    return `<div class="ys-message-c"></div>`;
};

const getInfo = (type,msg) => {
    const typeClass = {
        success:{className:'fa-check-circle-o'},
        info:{className:'fa-info-circle'},
        warning:{className:'fa-exclamation-circle'},
        error:{className:'fa-times-circle-o'}
    };
    return `<div class="ys-message-item-c">
<div class="ys-message-item ys-message-item-${type}"><i class="fa ${typeClass[type].className}"></i>${msg}</div>
</div>`;
};


export default message;