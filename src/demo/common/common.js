import hljs from "highlight.js";
import 'highlight.js/styles/idea.css';
import ClipboardJS from 'clipboard';
import message from "../../component/message/message";
import Table from "../../component/table/table";

export const initCode =(outer)=> {
    outer.on('click','.fa-code',function () {
        $(this).parents('.demo-des').toggleClass('open');
    });
    outer.find('pre').each(function () {
        hljs.highlightBlock(this);
    });
    new ClipboardJS(outer[0].querySelectorAll('.fa-copy'),{
        text:function (e) {
            return $(e).parents('.demo-section').find('pre').text()
        }
    }).on('success',function () {
        message({
            type:'success',
            msg:'代码已复制到剪切板'
        })
    });
};

export const createPropsTable =({ outer, list })=> {
    new Table({
        outer:outer.find('.params-props-table'),
        headers:[
            { name:'参数',width:150 },
            { name:'说明' },
            { name:'类型',width:200 },
            { name:'默认值',width:100 }
        ],
        renderTrs:[
            row=>row.param,
            {
                renderTd:row=>`<td style="text-align: left">${ row.description }</td>`
            },
            row=>row.type,
            row=>row.default
        ],
        dataSource:list,
        renderEmpty:()=>'<div class="flexbox aic jcc" style="line-height: 40px;color: #999">本组件/方法无参数</div>',
        singleTr:false
    })
};

export const createApiTable =({ outer, list })=> {
    new Table({
        outer:outer.find('.params-api-table'),
        headers:[
            { name:'方法',width:150 },
            { name:'说明',width:400 },
            { name:'参数说明' }
        ],
        renderTrs:[
            row=>row.funcName,
            {
                renderTd:row=>`<td style="text-align: left">${ row.description }</td>`
            },
            {
                renderTd:row=>`<td style="text-align: left">${ row.params }</td>`
            }
        ],
        dataSource:list,
        renderEmpty:()=>'<div class="flexbox aic jcc" style="line-height: 40px;color: #999">本组件/方法无方法</div>',
        singleTr:false
    })
};

export const createDetailTable =({ outer, propsList, apiList })=> {
    createPropsTable({ outer, list:propsList });
    createApiTable({ outer, list:apiList });
};