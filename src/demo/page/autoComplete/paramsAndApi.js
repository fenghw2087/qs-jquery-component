export const propsList = [
    {
        param:'input',
        description:'目标input',
        type:'jQueryObject | input',
        default:''
    },{
        param:'getData',
        description:'获取数据函数，需要返回一个Promise对象，如：$.ajax对象',
        type:'Function | return: Promise',
        default:''
    },{
        param:'delay',
        description:'触发延时，ms',
        type:'Number | 非负整数',
        default:'500'
    },{
        param:'renderLi',
        description:'列表行渲染回调函数，返回该行的html，参数 row:当前行数据',
        type:'Function',
        default:''
    },{
        param:'formatList',
        description:'格式化数据，将请求返回的数据格式化为数据，参数 data:getData Promise中带的第一个参数',
        type:'Function',
        default:''
    },{
        param:'onSelect',
        description:'行点击回调，参数 rowData:选择数据',
        type:'Function',
        default:'()=>{}'
    },{
        param:'emptyMsg',
        description:'没有匹配结果文案',
        type:'String',
        default:'没有匹配的结果'
    },{
        param:'keyTigger',
        description:'键盘上下方向键是否触发onSelect',
        type:'Boolean',
        default:'true'
    }
];

export const apiList = [];