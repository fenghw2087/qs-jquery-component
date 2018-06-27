/**
 * Created by Administrator on 2018/1/22.
 */
import './css/notification.less';

const NOTI_OUTER_CLASS = ['ys-notification-topRight','ys-notification-bottomRight'];
/**
 * 边角提示组件
 * @param type 提示类型 one of [success ,info ,error ,warning]
 * @param title 提示标题
 * @param msg 提示主要信息
 * @param time 提示出现时间，默认5S，传入0则不自动关闭
 * @param confirmBtn 确认按钮 show:是否显示这个按钮 onClick：点击回调
 * @param closeBtn 取消按钮 show:是否显示这个按钮 onClick：点击回调
 */
const notification = ({
    type = 'success',
    title,
    msg,
    time=5,
    confirmBtn = {
        show:false
    },
    closeBtn = {
        show:false
    }
})=> {
    const side = 1;
    let outer = $('.'+NOTI_OUTER_CLASS[side-1]);
    if(!outer.length){
        $('body').append(getOuter(NOTI_OUTER_CLASS[side-1]));
        outer = $('.'+NOTI_OUTER_CLASS[side-1]);
        outer.on('click','.ys-notification-close',function () {
            const infoC = $(this).parent();
            infoC.css({marginTop: -(infoC[0].clientHeight+18)+'px',opacity: 0.3});
            setTimeout(()=>{
                infoC.remove();
            },300);
        });
    }
    outer.append(getInfo(type,title,msg,confirmBtn,closeBtn));

    const infoC = outer.children(':last');
    confirmBtn.show && infoC.one('click','.ys-notification-confirm',()=>{
        typeof confirmBtn.onClick === 'function' && confirmBtn.onClick(()=>{
            infoC.css({marginTop: -(infoC[0].clientHeight+18)+'px',opacity: 0.3});
            setTimeout(()=>{
                infoC.remove();
            },300);
        });
    });
    closeBtn.show && infoC.one('click','.ys-notification-close-btn',()=>{
        infoC.css({marginTop: -(infoC[0].clientHeight+18)+'px',opacity: 0.3});
        setTimeout(()=>{
            infoC.remove();
        },300);
    });
    setTimeout(()=>{
        infoC.addClass('active');
    },50);
    if(time>0){
        setTimeout(()=>{
            infoC.css({marginTop: -(infoC[0].clientHeight+18)+'px',opacity: 0.3});
            setTimeout(()=>{
                infoC.remove();
            },300);
        },time*1000);
    }
};

const getOuter = (className) => {
    return `<div class="ys-notification ${className}"></div>`;
};

const getInfo = (type,title,msg,confirmBtn,closeBtn) => {
    const typeClass = {
        success:{className:'fa-check-circle-o'},
        info:{className:'fa-info-circle'},
        warning:{className:'fa-exclamation-circle'},
        error:{className:'fa-times-circle-o'}
    };
    return `<div class="ys-notification-info-c"><div class="ys-notification-close"><i class="fa fa-times"></i></div><div class="ys-notification-icon"><i class="fa ${typeClass[type].className}"></i></div><div class="ys-notification-info-content">
    <div class="ys-notification-info-title">${title}</div><div class="ys-notification-info-msg">${msg}</div>
    <div class="ys-notification-tool-btn-c">
    ${confirmBtn.show?`<a href="javascript:;" class="ys-notification-confirm">${confirmBtn.text||'确认'}</a>`:``}${closeBtn.show?`<a href="javascript:;" class="ys-notification-close-btn">${closeBtn.text || '关闭'}</a>`:``}
</div>
</div></div>`;
};


export default notification;