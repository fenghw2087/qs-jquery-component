export const propsList = [
    {
        param:'btn',
        description:'原始按钮',
        type:'jQueryObject | button',
        default:''
    },{
        param:'onClick',
        description:'点击回调函数',
        type:'Function',
        default:'()=>{}'
    },{
        param:'type',
        description:'按钮类型',
        type:'String | one of ["search","reset"]',
        default:''
    },{
        param:'iconAutoShow',
        description:'是否点击时显示icon动画',
        type:'Boolean',
        default:'true'
    }
];

export const apiList = [
    {
        funcName:'toggleIcon',
        description:'开始/停止icon动画',
        params:'bol: Boolean'
    }
];