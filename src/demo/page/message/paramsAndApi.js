export const propsList = [
    {
        param:'type',
        description:'类型，4种类型',
        type:'String | one of [success, info, warning, error]',
        default:'error'
    },{
        param:'msg',
        description:'提示信息',
        type:'String',
        default:''
    },{
        param:'time',
        description:'提示持续时间，单位s',
        type:'Number | 正整数',
        default:'3'
    }
];

export const apiList = [];