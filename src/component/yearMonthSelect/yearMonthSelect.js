/**
**create by 2087, Tue May 22 2018
**/

import $ from 'jquery';

import './less/yearMonthSelect.less';
import CoupletMenu from "../coupletMenu/coupletMenu";
import format from "../../util/lib/format";

/**
 * 年月周级联选择器
 */
export default class YearMonthSelect {
    /**
     * 构造函数
     * @param obj 外部容器
     * @param onSelectChange 选择后回调
     * @param placeholder 文案提示
     * @param yearList 年份列表，必须返回一个promise对象
     * @param getMonthsByYear 获取月份的回调函数
     * @param activeValue 当前显示的值
     * @param hasWeek 是否可以选择周
     * @param hasFullYear 月份选择里是否有一个全年选项
     */
    constructor({ obj, onSelectChange,placeholder='选择年月', yearList, getMonthsByYear,activeValue, hasWeek, hasFullYear=true }) {
        this.obj = obj;
        this.onSelectChange = onSelectChange;
        this.yearList = yearList;
        this.getMonthsByYear = getMonthsByYear || this._getMonthsByYear;
        this.activeValue = activeValue;
        this.hasWeek = hasWeek;
        this.placeholder = placeholder;
        this.hasFullYear = hasFullYear;
        this._init();
    }

    _getMonthsByYear =(year)=> {
        let list = [];
        if(year === new Date().getFullYear()){
            const nm = new Date().getMonth()+1;
            list = new Array(nm).join(',').split(',').map((v,i)=>{
                return {
                    name: (nm-i)+'月',
                    month:nm-i,
                    hasNext:this.hasWeek
                }
            });
        }else {
            list = new Array(12).join(',').split(',').map((v,i)=>{
                return {
                    name: (12-i)+'月',
                    month:12-i,
                    hasNext:this.hasWeek
                }
            });
        }
        if(this.hasFullYear){
            list = [ { name:'全年',month:'' }, ...list ];
        }
        return list;
    };

    /**
     * 设置显示的值，但不选中选项
     * @param value
     */
    setValue =(value)=> {
        this.select.setData(value);
    };

    _renderYearList =()=> {
        this.yearList.then(list=>{
            this.select.renderList(list);
            if(this.activeValue !== undefined || this.activeValue !== null) this.select.setData(this.activeValue);
        });
    };

    _getWeeks =(year,month)=> {
        const m1d = new Date(`${year}/${month}/1`);
        const midw = m1d.getDay();
        const fwday = (9-midw)%7 || 7;
        const mld = new Date(`${year}/${month}/1`);
        mld.setMonth(month);
        mld.setDate(-1);
        const mlength = mld.getDate();
        const wnum = Math.floor((mlength - fwday+1)/7)+1;
        return new Array(wnum).fill(1).map((v,i)=>{
            const start = new Date(`${year}/${month}/${fwday+7*i}`);
            return {
                name:`第${i+1}周`,
                weekNum:i+1,
                start:format(start),
                end:format(start.setDate(fwday+7*i+6))
            }
        })
    };

    _init = () => {
        //本组件本身调用级联下拉组件实现
        this.select = new CoupletMenu({
            obj:this.obj,
            renderLi:row=>row.name,
            list:[],
            placeholder:this.placeholder,
            hasNext:row=>row.hasNext,
            renderNext:(checks,row,list)=>{
                if(checks.length === 1){
                    const year = row.year;
                    const months = this.getMonthsByYear(year);
                    return new window.Promise(res=>{
                        res(months);
                    })
                }else {
                    const yearData = list[checks[0]];
                    const monthData = yearData.children[checks[1]];
                    const month = monthData.month;
                    const year = yearData.year;
                    return new window.Promise(res=>{
                        res(this._getWeeks(year,month));
                    })
                }
            },
            titles:['选择年份','选择月份','选择周'],
            renderResult:(checks,list)=>{
                const yearData = list[checks[0]] || '';
                const monthData = yearData.children[checks[1] || 0];
                if(!yearData) return '';
                if(checks.length === 3){
                    const weekData = monthData.children[checks[2]];
                    return `${yearData.name}-${monthData.name}-${weekData.name}`
                }else {
                    return yearData.name+'-'+(monthData?monthData.name:'全年')
                }
            },
            onSelectChange:(checks,list)=>{
                const yearData = list[checks[0]] || '';
                const monthData = yearData.children[checks[1] || 0];
                const year = yearData.year;
                const month = monthData?monthData.month:'';
                const week = (monthData && this.hasWeek)? ( checks.length>2?monthData.children[checks[2]]:null ) :null;
                this.onSelectChange(year,month,week);
            }
        });

        this._renderYearList();
    }
}
