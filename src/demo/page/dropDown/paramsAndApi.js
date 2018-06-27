export const propsList = [
    {
        param:'obj',
        description:'组件容器，一个长度的jqueryDom',
        type:'jQueryObject',
        default:''
    },{
        param:'placeholder',
        description:'未选择时的提示文字',
        type:'String',
        default:'请选择'
    },{
        param:'list',
        description:'下拉列表数据，如果有二级列表，二级列表数据放在一级列表的children字段',
        type:'Array | [ String || Object ]',
        default:'[]'
    },{
        param:'renderLi',
        description:'一级列表行渲染回调方法，返回当行的html内容，参数 row:当前行数据，index:行下标',
        type:'Function',
        default:''
    },{
        param:'renderSecLi',
        description:'二级列表行渲染回调方法，返回当行的html内容，hasChildren为true时生效，参数 row:当前行数据，index:一级列表行下标，secIndex:二级列表行下标',
        type:'Function',
        default:''
    },{
        param:'activeIndex',
        description:'一级列表选中下标',
        type:'Number',
        default:'-1'
    },{
        param:'activeSecIndex',
        description:'二级列表选中下标',
        type:'Number',
        default:'-1'
    },{
        param:'beforeClick',
        description:'列表选项点击前回调函数，如果返回true将阻止默认点击事件，参数 current:当前点击行数据',
        type:'Function',
        default:'()=>{}'
    },{
        param:'onSelectChange',
        description:'列表选中后回调函数，参数 current:当前选中数据，index:当前选中下标， secIndex:当前选中二级下标',
        type:'Function',
        default:'()=>{}'
    },{
        param:'hasReset',
        description:'列表第一项是否未重置项，如果是，选中第一项后组件将置为初始状态',
        type:'Boolean',
        default:'false'
    },{
        param:'hasChildren',
        description:'是否拥有二级列表',
        type:'Boolean',
        default:'false'
    },{
        param:'menuStyle',
        description:'下拉列表容器样式，通常用来限制最大高度',
        type:'String:styleSheet',
        default:''
    },{
        param:'dropup',
        description:'是否向上弹出选项',
        type:'Boolean',
        default:'false'
    },{
        param:'disabled',
        description:'是否禁用下拉列表',
        type:'Boolean',
        default:'false'
    },{
        param:'autoShow',
        description:'是否开启鼠标hover打开下拉列表',
        type:'Boolean',
        default:'false'
    }
];

export const apiList = [
    {
        funcName:'toggleDrop',
        description:'打开/关闭下拉列表',
        params:'type: close or open，可为空'
    },{
        funcName:'setData',
        description:'设置选中项',
        params:'index: 一级列表下标<br>secIndex: 二级列表下标，可为空'
    },{
        funcName:'renderList',
        description:'设置选项',
        params:'list: 下拉数据 | Array'
    },{
        funcName:'reset',
        description:'重置下拉选项',
        params:'change: 是否触发onSelectChange回调,Boolean默认true'
    },{
        funcName:'setDisabled',
        description:'设置下拉是否被禁用',
        params:'type: Boolean'
    },{
        funcName:'setValue',
        description:'设置列表显示文字，通常用于当你不想找到选项下标时使用',
        params:'value: String'
    },{
        funcName:'getList',
        description:'获取当前下拉数据源，返回一个list',
        params:''
    }
];