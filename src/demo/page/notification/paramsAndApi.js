export const propsList = [
    {
        param:'type',
        description:'通知类型',
        type:'String | one of [success,info, warning,error]',
        default:'success'
    },{
        param:'title',
        description:'通知标题',
        type:'Sting',
        default:''
    },{
        param:'msg',
        description:'通知内容',
        type:'String',
        default:''
    },{
        param:'time',
        description:'通知持续秒数，0不会自动关闭',
        type:'Number | 非负整数',
        default:'5'
    },{
        param:'confirmBtn',
        description:'确认按钮',
        type:'Object | { show:Boolean, onClick:Function, text:String }',
        default:'{ show:false }'
    },{
        param:'closeBtn',
        description:'关闭按钮',
        type:'Object | { show:Boolean, text:String }',
        default:'{ show:false }'
    }
];

export const apiList = [];