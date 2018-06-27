export const propsList = [
    {
        param:'noInput',
        description:'是否包含一个input',
        type:'Boolean',
        default:''
    }
];

export const apiList = [
    {
        funcName:'show',
        description:'设置信息并弹出弹框',
        params:'title: String | 弹框标题;<br>' +
        'placeholder:String | input的placeholder；<r>' +
        'side: Number |1234 上右下左,弹框依附方向；<br>' +
        'obj: jQueryObject | 依附dom；<br>' +
        'fn: Function | 点击确认回调，带一个参数value:String | input输入值'
    },{
        funcName:'hide',
        description:'关闭弹框',
        params:''
    },{
        funcName:'showMsg',
        description:'弹框展示一个错误信息',
        params:'msg:String | 错误信息'
    }
];