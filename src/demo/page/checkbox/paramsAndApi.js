export const propsList = [
    {
        param:'obj',
        description:'组件容器，一个长度的jqueryDom',
        type:'jQueryObject',
        default:''
    },{
        param:'onChange',
        description:'状态变化时触发回调，参数 checked:当前选中状态',
        type:'Function',
        default:'()=>{}'
    },{
        param:'checked',
        description:'是否被选中',
        type:'Boolean',
        default:'false'
    },{
        param:'color',
        description:'颜色',
        type:'String | color',
        default:'#000'
    }
];

export const apiList = [
    {
        funcName:'setChecked',
        description:'设置选中状态',
        params:'checked: Boolean，change:Boolean,是否触发onChange事件'
    },{
        funcName:'getChecked',
        description:'获取选中状态，返回一个Boolean',
        params:''
    }
];