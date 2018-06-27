export const propsList = [
    {
        param:'outer',
        description:'组件容器，一个长度的jqueryDom，轮播各块的父容器',
        type:'jQueryObject',
        default:''
    },{
        param:'current',
        description:'初始展示块下标',
        type:'Number | 非负整数',
        default:'0'
    },{
        param:'during',
        description:'自动切换间隔时长',
        type:'Number | 正整数',
        default:'5'
    },{
        param:'autoChange',
        description:'是否自动切换',
        type:'Boolean',
        default:'false'
    },{
        param:'hasPager',
        description:'包含中部翻页按钮',
        type:'Boolean',
        default:'true'
    },{
        param:'hasSidePager',
        description:'包含两侧翻页按钮',
        type:'Boolean',
        default:'true'
    }
];

export const apiList = [];