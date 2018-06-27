export const propsList = [
    {
        param:'obj',
        description:'button，一个长度的jqueryDom',
        type:'jQueryObject | button',
        default:''
    },{
        param:'text',
        description:'初始显示的文字',
        type:'String',
        default:''
    },{
        param:'postfix',
        description:'冷却期间文案后缀',
        type:'String',
        default:'后重新获取'
    },{
        param:'cd',
        description:'冷却时间',
        type:'Number | 正整数',
        default:'60'
    },{
        param:'disableStyle',
        description:'冷却期间样式',
        type:'Object | StyleSheet',
        default:'{}'
    },{
        param:'onClick',
        description:'按钮点击事件',
        type:'Function',
        default:'()=>{}'
    },{
        param:'coolDownFn',
        description:'冷却完成回调函数',
        type:'Function',
        default:'()=>{}'
    }
];

export const apiList = [
    {
        funcName:'startCD',
        description:'开始冷却',
        params:'st | Number 冷却时间'
    }
];