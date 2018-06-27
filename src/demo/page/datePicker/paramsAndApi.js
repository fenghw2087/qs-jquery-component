export const propsList = [
    {
        param:'input',
        description:'日期input，一个长度的jqueryDom',
        type:'jQueryObject | input',
        default:''
    },{
        param:'type',
        description:'日期类型，年/月/日',
        type:'String | one of [year,month,day]',
        default:'day'
    },{
        param:'currentDate',
        description:'当前日期',
        type:'String',
        default:''
    },{
        param:'startDate',
        description:'开始日期',
        type:'String',
        default:''
    },{
        param:'endDate',
        description:'截止日期',
        type:'String',
        default:''
    },{
        param:'defaultFormat',
        description:'日期格式',
        type:'String',
        default:'yyyy-MM-dd'
    },{
        param:'onDateChange',
        description:'日期选择回调，有一个date参数，当前选择时间',
        type:'Function',
        default:'()=>{}'
    },{
        param:'canClose',
        description:'是否显示重置按钮',
        type:'Boolean',
        default:'true'
    }
];

export const apiList = [
    {
        funcName:'setData',
        description:'设置当前日期',
        params:'date: String'
    },{
        funcName:'reset',
        description:'清空输入',
        params:''
    },{
        funcName:'pickerShow',
        description:'显示日期选择器',
        params:''
    },{
        funcName:'pickerHide',
        description:'关闭日期选择器',
        params:''
    },{
        funcName:'setStartDate',
        description:'设置开始时间',
        params:'date: String'
    },{
        funcName:'setEndDate',
        description:'设置截止时间',
        params:'date: String'
    }
];