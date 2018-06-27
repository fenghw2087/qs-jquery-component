import notification from '../../../component/notification/notification';

const userAgent = navigator.userAgent;
const IE_STR = ['MSIE 9.0','MSIE 8.0','MSIE 7.0',];
for(let i of IE_STR){
    if(userAgent.indexOf(i)>-1){
        notification({
            title:'您的浏览器版本过低',
            msg:'您的浏览器版本过低，建议您升级您的IE浏览器版本（IE9以上）。如果您正在使用360浏览器，建议您切换至极速模式！（点击地址栏右侧 e 图标进行切换）',
            time:0,
            type:'warning'
        });
        break;
    }
}