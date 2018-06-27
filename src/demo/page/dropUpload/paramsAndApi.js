export const propsList = [
    {
        param:'outer',
        description:'外部容器，一个长度的jqueryDom',
        type:'jQueryObject',
        default:''
    },{
        param:'maxImgs',
        description:'最大图片数',
        type:'number',
        default:'3'
    },{
        param:'imgs',
        description:'已经有的图片，图片地址的数组',
        type:'Array',
        default:'[]'
    },{
        param:'url',
        description:'图片上传的url地址',
        type:'String',
        default:''
    }
];

export const apiList = [
    {
        funcName:'setImgs',
        description:'设置已有图片',
        params:'imgs: Array'
    },{
        funcName:'getImgs',
        description:'获取已经上传的图片列表',
        params:''
    }
];