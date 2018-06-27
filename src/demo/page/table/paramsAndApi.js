export const propsList = [
    {
        param:'outer',
        description:'组件容器，一个长度的jqueryDom',
        type:'jQueryObject',
        default:''
    },{
        param:'headers',
        description:'表头数据',
        type:'Array | { name:String 表头文字, width:Number 表头表格宽度， sorter: Object 排序参数, ...表头其他attr }',
        default:'()=>{}'
    },{
        param:'dataSource',
        description:'表格数据源',
        type:'Array',
        default:''
    },{
        param:'renderTr',
        description:'(已不推荐使用)行渲染回调，3个参数：row 当前行数据, index 当前行下标, pagination:当前分页数据',
        type:'Function',
        default:''
    },{
        param:'renderTrs',
        description:'行内td渲染回调数据，有该方法时renderTr无效',
        type:'Array | Function || Object | { renderTd:Function }',
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
        default:'false'
    },{
        param:'loading',
        description:'是否显示loading',
        type:'Boolean',
        default:'true'
    },{
        param:'singleTr',
        description:'单元格是否单行显示数据，过长数据...，鼠标划过时显示全部',
        type:'Boolean',
        default:'true'
    },{
        param:'emptyMsg',
        description:'缺省文案',
        type:'String',
        default:'暂无数据'
    },{
        param:'afterRender',
        description:'表格渲染完成回调函数',
        type:'Function',
        default:'()=>{}'
    },{
        param:'sorter',
        description:'排序点击回调函数，参数 sortName:排序名称, type 排序标识 1，0，-1 正序，不排序，倒序',
        type:'Function',
        default:'()=>{}'
    },{
        param:'renderEmpty',
        description:'自定义loading渲染函数',
        type:'Function',
        default:''
    }
];

export const apiList = [
    {
        funcName:'setData',
        description:'设置表格数据分页数据',
        params:'{ dataSource: Array 表格数据, pagination:Object | { current,total,pageSize } 分页数据, conditionChange:Boolean 是否条件改变 }'
    },{
        funcName:'getDataSource',
        description:'获取当前表格数据，返回一个数组',
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
        funcName:'resetSort',
        description:'重置所有排序按钮',
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