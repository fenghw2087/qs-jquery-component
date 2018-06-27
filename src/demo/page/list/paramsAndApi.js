export const propsList = [
    {
        param:'outer',
        description:'组件容器，一个长度的jqueryDom',
        type:'jQueryObject',
        default:''
    },{
        param:'dataSource',
        description:'列表格数据源',
        type:'Array',
        default:''
    },{
        param:'renderTr',
        description:'行渲染回调，3个参数：row 当前行数据, index 当前行下标, pagination:当前分页数据',
        type:'Function',
        default:''
    },{
        param:'pagination',
        description:'分页相关参数',
        type:'Object | { show(false) | Boolean是否显示分页, total | Number总条数, pageSize | Number每页条数, current | Number当前页码 }',
        default:'{ show:false }'
    },{
        param:'storage',
        description:'是否缓存分页数据',
        type:'Boolean',
        default:'true'
    },{
        param:'loading',
        description:'日期input，一个长度的jqueryDom',
        type:'jQueryObject | input',
        default:''
    },{
        param:'emptyMsg',
        description:'缺省文案',
        type:'String',
        default:'暂无数据'
    },{
        param:'afterRender',
        description:'列表渲染完成回调函数',
        type:'Function',
        default:'()=>{}'
    }
];

export const apiList = [
    {
        funcName:'setData',
        description:'设置列表数据分页数据',
        params:'{ dataSource: Array 表格数据, pagination:Object | { current,total,pageSize } 分页数据, conditionChange:Boolean 是否条件改变 }'
    },{
        funcName:'getDataSource',
        description:'获取当前列表数据，返回一个数组',
        params:''
    },{
        funcName:'getRowData',
        description:'获取某一行数据',
        params:'index:Number 行数'
    },{
        funcName:'getPagination',
        description:'获取当前分页参数',
        params:''
    },{
        funcName:'removeItem',
        description:'某一行的移除动画',
        params:'index:Number 行数'
    },{
        funcName:'updateItem',
        description:'某一行的更新动画',
        params:'index:Number 行数'
    }
];