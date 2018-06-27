export const propsList = [
    {
        param:'title',
        description:'modal标题',
        type:'String',
        default:''
    },{
        param:'confirmFn',
        description:'点击确认回调函数',
        type:'Function',
        default:'()=>{}'
    }
];

export const apiList = [
    {
        funcName:'modalShow',
        description:'展示modal',
        params:''
    },{
        funcName:'modalHide',
        description:'隐藏modal',
        params:''
    },{
        funcName:'showFail',
        description:'modal显示错误信息',
        params:'msg: String 错误信息<br>' +
        'time:显示持续时间 number 默认2000'
    },{
        funcName:'setData',
        description:'设置弹框数据',
        params:'props: object | { title:String 弹框标题, confirmFn:Function 确认回调, msg: String 信息 }'
    }
];