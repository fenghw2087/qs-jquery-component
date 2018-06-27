export const propsList = [
    {
        param:'input',
        description:'目标input',
        type:'jQueryObject | input',
        default:''
    },{
        param:'delay',
        description:'触发回调的间隔延时，单位ms',
        type:'Number',
        default:'500'
    },{
        param:'fn',
        description:'回调函数，value: String | 当前键入input的值',
        type:'Function',
        default:''
    }
];

export const apiList = [
    {
        funcName:'triggerSearch',
        description:'立即触发一次回调函数',
        params:''
    },{
        funcName:'reset',
        description:'重置input值，但不出发回调函数',
        params:''
    }
];