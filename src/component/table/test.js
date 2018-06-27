/**
 * Created by Administrator on 2018/1/19.
 */
import Table from './table';

const testHtml = `<div id="test"></div>`;

const btn = `<button id="btn1">改变条件</button>`;

$('body').prepend(testHtml).prepend(btn);

$('#btn1').on('click',() => {
    table.removeItem(2).then((data)=>{
        table.setData({
            dataSource:getList(2)
        })
    })
    // table.setData({
    //     dataSource:getList(2),
    //     pagination:{
    //         current:2
    //     }
    // }).then(()=>{
    //     table.updateItem(3);
    // })
});

const table = new Table({
    outer:$('#test'),
    headers:[
        {name:'标题1',width:60},
        {name:'标题2',width:160},
        {name:'标题3',width:160},
        {name:'标题4',width:160},
        {name:'标题5',width:160}
    ],
    renderTr:(row,index,pagination) => {
        return `<tr>
<td>${(pagination.current-1)*pagination.pageSize+index+1}</td>
<td>${row.key2}</td>
<td>${row.key3}</td>
<td>${row.key4}</td>
<td>${row.key5}</td></tr>`;
    },
    renderTrs:[
        (row,index,pagination)=>{ return (pagination.current-1)*pagination.pageSize+index+1 },
        row=>row.key2,
        {
            renderTd:row=>`<td style="background-color: #d52740">${ row.key3 }</td>`
        },
        row=>row.key4,
        (row,index)=>{
            return `<a class="btn btn-link" data-index="${index}">编辑</a>`
        }
    ],
    emptyMsg:'暂无数据',
    pagination:{
        show:true,
        pageSize:10,
        onChange: ({current,pageSize,total})=> {
            setTimeout(()=>{
                table.setData({
                    dataSource:getList(current),
                    pagination:{
                        current:current
                    }
                });
            },1000)

        },
        isJump:true
    },
    storage:true
});

const getList = (current) => {
    console.log('do api');
    return new Array(10).join(',').split(',').map((v,i)=>{
        return {
            key1:'efswsd'+current+i,
            key2:'efsgrd'+current+i,
            key3:'e43fsd'+current+i,
            key4:'yjhtyhrsd'+current+i,
            key5:'tdwfefwsd'+current+i,
        }
    })
};

table.setData({
    dataSource:getList(1),
    pagination:{
        current:1,
        total:1000
    }
});