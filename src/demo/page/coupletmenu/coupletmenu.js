import $ from 'jquery';

import * as CommonUtil from '../../common/common';
import {propsList, apiList} from "./paramsAndApi";

import './less/coupletmenu.less';
import CoupletMenu from "../../../component/coupletMenu/coupletMenu";
import message from "../../../component/message/message";
import doRequest from "../../../util/lib/doRequest";

class CoupletmenuPage {
    constructor() {
        this.outer = $('#coupletmenuPageOuter');

        this._init();
    }

    init = () => {

    };

    getPlaces =(keywords)=>{
        return doRequest({
            url:'http://restapi.amap.com/v3/config/district?key=48a5cede312f0221ecc0e70b1b6dba3f&subdistrict=1',
            data:{
                keywords
            }
        });
    };

    _bindEvent = () => {
        const that = this;
        this.outer.on('click', function () {

        })
    };

    _init = () => {
        this.couplet1 = new CoupletMenu({
            obj:$('#test1'),
            placeholder:'请选择',
            list:new Array(8).fill(1).map((v,i)=>{
                return {
                    name:'选项'+(i+1),
                    id:i+1,
                    children:(()=>{
                        return new Array(12).fill(1).map((v2,i2)=>{
                            return {
                                name:'选项'+(i+1)+'-'+(i2+1),
                                id:(i+1)+'-'+(i2+1)
                            }
                        })
                    })()
                }
            }),
            renderLi:row=>row.name,
            renderNext:(checks,current)=>{
                return new window.Promise(res=>{
                    res(current.children)
                })
            },
            renderResult:(checks,list)=>{
                const row = checks.reduce((o,v)=>{
                    o = o.children[v];
                    return o;
                },{ children:list });
                return row.name
            },
            onSelectChange:(checks,list)=>{
                const row = checks.reduce((o,v)=>{
                    o = o.children[v];
                    return o;
                },{ children:list });
                message({
                    type:'info',
                    msg:'当前选中：'+row.name
                })
            }
        });

        this.couplet2 = new CoupletMenu({
            obj:$('#test2'),
            placeholder:'选择地区',
            titles:['选择省','选择市','选择区'],
            hasNext:row=>row.level === 'province' || row.level === 'city',
            list:[],
            renderNext:(checks,current)=>{
                return new window.Promise(res=>{
                    if(current.children) return res(current.children);
                    this.getPlaces(current.name).then(data=>{
                        if(data.status === '1'){
                            res(data.districts[0].districts);
                        }
                    })
                })
            },
            renderResult:(checks,list)=>{
                const province = checks[0] !== undefined?list[checks[0]]:{};
                const city = checks[1] !== undefined?province.children[checks[1]]:{};
                const area = checks[2] !== undefined?city.children[checks[2]]:{};
                return [province.name,city.name,area.name].filter(v=>v).join('/');
            },
            onSelectChange:(checks,list)=>{
                const province = checks[0] !== undefined?list[checks[0]]:{};
                const city = checks[1] !== undefined?province.children[checks[1]]:{};
                const area = checks[2] !== undefined?city.children[checks[2]]:{};
                message({
                    type:'success',
                    msg:`当前选中：${[province.name,city.name,area.name].filter(v=>v).join('/')}`
                })
            }
        });

        this.getPlaces('中国').then(data=>{
            if(data.status === '1'){
                this.couplet2.renderList(data.districts[0].districts);
            }
        });

        CommonUtil.initCode(this.outer);

        CommonUtil.createDetailTable({outer: this.outer, propsList, apiList});
        this._bindEvent();
    }
}

new CoupletmenuPage().init();