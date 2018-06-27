export const propsList = [
    {
        param:'outer',
        description:'组件容器，一个长度的jqueryDom',
        type:'jQueryObject',
        default:''
    },{
        param:'rateTotal',
        description:'总星数',
        type:'Number',
        default:'5'
    },{
        param:'currentRate',
        description:'当前星数',
        type:'Number',
        default:'0'
    },{
        param:'readOnly',
        description:'是否只读',
        type:'Boolean',
        default:'true'
    },{
        param:'colorCB',
        description:'颜色回调函数，参数 n:激活星数',
        type:'Function',
        default:'()=>"#333"'
    },{
        param:'textCB',
        description:'结果文字回调，参数 n:激活星数',
        type:'Function',
        default:''
    }
];

export const apiList = [
    {
        funcName:'setStar',
        description:'设置激活星数',
        params:'n:Number 激活星数'
    }
];