import format from '../../util/lib/format';
import dateParse from '../../util/lib/dateParse';
import getMonthLength from '../../util/lib/getMonthLength';
import getMonthFirstDay from '../../util/lib/getMonthFirstDay';
import divideArr from '../../util/lib/divideArr';
import './css/datePicker.less';

const WEEK_LABLE = ['一','二','三','四','五','六','日'];
const TODAY_BTN_TEXT = ['','今年','本月','今天','本周'];
/**
 * 日期组件
 */
export default class DatePicker {
    /**
     * 构造方法
     * @param input 模板input
     * @param type one of ['year','month','day','week']  默认day
     * @param currentDate 当前时间
     * @param startDate 开始时间
     * @param endDate 结束时间
     * @param defaultFormat 日期格式
     * @param onDateChange 日期改变回调函数
     * @param canClose 是否显示清空按钮 默认显示
     * @param dropUp 向上弹出
     */
    constructor({ input, type='day', currentDate, startDate, endDate, defaultFormat, onDateChange=()=>{},canClose=true,dropUp }) {
        if(!(input instanceof $) || (input instanceof $ && input.length !== 1)) throw new Error('DatePicker param input must be an one length jqueryDom');
        this.input = input;
        this.type = {'year':1,'month':2,'day':3,'week':4}[type] || 3;
        this.startDate = new Date(startDate);
        this.endDate = new Date(endDate);
        if(!this.startDate.getTime()) this.startDate = new Date('1970/1/1');
        if(!this.endDate.getTime()) this.endDate = null;
        if(this.startDate && this.endDate && this.startDate.getTime()>this.endDate.getTime()){
            this.startDate = new Date('1970/1/1');
        }
        this.todayDisabled = (this.startDate && this.startDate.getTime()>Date.now()) || (this.endDate && this.endDate.getTime()<Date.now());
        if(defaultFormat){
            this.defaultFormat = defaultFormat;
        }else {
            this.defaultFormat = ['','yyyy','yyyy-MM','yyyy-MM-dd','yyyy-MM'][this.type];
        }
        this.onDateChange = onDateChange;
        this.canClose = canClose;

        if(this.input[0].tagName !== 'INPUT') throw new Error('DatePicker param input must be input tag');

        this.id = 'datePicker'+Math.round(Math.random()*100000);

        if(currentDate){
            if(new Date(currentDate).getTime()){
                this.input.val(format(currentDate,this.defaultFormat));
                this.currentDate = new Date(currentDate);
            }else {
                this.input.val(currentDate);
                this.currentDate = dateParse(currentDate,this.defaultFormat);
            }
        }else {
            this.currentDate = new Date(currentDate || this.input.val()).getTime()?new Date(currentDate || this.input.val()):new Date();
        }

        if(this.endDate && this.endDate.getTime()<this.currentDate.getTime()){
            this.currentDate = new Date(this.endDate);
        } else if(this.startDate && this.startDate.getTime()>this.currentDate.getTime()) {
            this.currentDate = new Date(this.startDate);
        }
        this.currentYear = this.currentDate.getFullYear();
        this.currentMonth = this.currentDate.getMonth()+1;
        this.currentDay = this.currentDate.getDate();

        this.dropUp = dropUp;

        this.outer = null;

        this._init();
    }

    _getDays(year,month){
        const firstDay = getMonthFirstDay(year,month) || 7;
        const thisMonthLength = getMonthLength(year,month);
        const PreMonthLength = getMonthLength(year,month-1);
        const defaultDay = this.defaultDate.getDate();
        let startF,endF;
        if(this.startDate && format(this.startDate,'yyyy/MM') === format(year+'/'+month,'yyyy/MM')){
            startF = true;
        }
        if(this.endDate && format(this.endDate,'yyyy/MM') === format(year+'/'+month,'yyyy/MM')){
            endF = true;
        }

        let dayArr = [];
        for(let i=0;i<firstDay-1;i++){
            dayArr.unshift({
                day:PreMonthLength - i,
                type:'prev',
                disabled:startF
            });
        }
        for(let i=0;i<thisMonthLength;i++){
            let disabled;
            if(!startF && !endF){
                disabled = false;
            }else if(startF && !endF){
                disabled = i+1 < this.startDate.getDate();
            }else if(!startF && endF){
                disabled = i+1 > this.endDate.getDate();
            }else {
                disabled = i+1 < this.startDate.getDate() || i+1 > this.endDate.getDate();
            }
            dayArr.push({
                day:i+1,
                type:'now',
                disabled
            });
        }
        for(let i = 0;i<42-firstDay-thisMonthLength+1;i++){
            dayArr.push({
                day:i+1,
                type:'next',
                disabled:endF
            });
        }
        const divDays = divideArr(dayArr,7);
        const ci = divDays.findIndex(v=>{
            return v[0].type === 'now' && v[0].day <= defaultDay && v[0].day+7>defaultDay
        });
        if(ci>-1 && this.defaultDate.getFullYear() === this.currentYear && this.defaultDate.getMonth()+1 === this.currentMonth){
            divDays[ci][0].currentWeek = true;
        }
        return {
            days:divDays,
            startF,
            endF
        };
    }

    _init() {
        this._renderHtml();
    }

    /**
     * 设置日期
     * @param date
     */
    setData(date){
        const p_date = new Date(dateParse(date,this.defaultFormat));
        if(p_date.getTime()){
            this.currentDate = new Date(dateParse(date,this.defaultFormat));
            this.currentYear = this.currentDate.getFullYear();
            this.currentMonth = this.currentDate.getMonth()+1;
            this.currentDay = this.currentDate.getDate();
        }
        this.input.val(date);
        this.onDateChange(date);
    }

    _getYearTable({yearArr,sy,ey}){
        return `<table class="data-picker-table">
                    <thead>
                    <tr>
                        <th class="go-btn go-prev-10year${(this.startDate && this.startDate.getFullYear()>sy+1)?' disabled':''}"><i class="fa fa-arrow-left"></i></th>
                        <th colSpan="5" style="cursor: default" class="switch">${(sy+1)+'-'+(ey-1)}</th>
                        <th class="go-btn go-next-10year${(this.endDate && this.endDate.getFullYear()<ey-1)?' disabled':''}"><i class="fa fa-arrow-right"></i></th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr><td colspan="7">${yearArr.map((v)=>{
                        return `<span class="year${v.active?' active':''}${v.disabled?' disabled':''}">${v.year}</span>`;
                    }).join('')}</td></tr>
                    </tbody>
                    <tfoot>
                    <tr><th colSpan="7" class="today-btn${this.todayDisabled?' disabled':''}">${TODAY_BTN_TEXT[this.type]}</th></tr>
                    </tfoot>
                </table>`;
    }

    /**
     * 日期置空
     */
    reset(){
        this.input.val('');
        this.onDateChange('');
    }

    _renderYearTable(year){
        const sy = (Math.ceil(year/10)-1)*10-1,ey = sy+11;
        let yearArr = new Array(12).join(',').split(',').map((v,i)=> {
            return {
                year:sy+i,
                active:sy+i === this.currentYear,
                disabled:(this.startDate && sy+i<this.startDate.getFullYear()) || (this.endDate && sy+i>this.endDate.getFullYear())
            }
        });
        this.picker.find('.year-table-c').html(this._getYearTable({yearArr,sy,ey}));
    }

    _getMonthTable(){
        return `<table class="data-picker-table">
                    <thead>
                    <tr>
                        <th class="go-btn go-prev-year"><i class="fa fa-arrow-left"></i></th>
                        <th colSpan="5" class="switch">${this.currentYear+'年'}</th>
                        <th class="go-btn go-next-year"><i class="fa fa-arrow-right"></i></th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr><td colspan="7">
                    ${new Array(12).join(',').split(',').map((v,i)=>{
                        return `<span class="month${this.currentMonth === i+1?' active':''}">${i+1}月</span>`;    
                    }).join('')}
                    </td></tr>
                    </tbody>
                    <tfoot>
                    <tr><th colSpan="7" class="today-btn${this.todayDisabled?' disabled':''}">${TODAY_BTN_TEXT[this.type]}</th></tr>
                    </tfoot>
                </table>`;
    }

    _getDayTable(){
        const { days, startF, endF } = this._getDays(this.currentYear,this.currentMonth);
        return `<table class="data-picker-table${this.type === 4?' week':''}">
                    <thead>
                    <tr>
                        <th class="go-btn go-prev-month${startF?' disabled':''}"><i class="fa fa-arrow-left"></i></th>
                        <th colSpan="5" class="switch">${this.currentYear+'年'+this.currentMonth+'月'}</th>
                        <th class="go-btn go-next-month${endF?' disabled':''}"><i class="fa fa-arrow-right"></i></th>
                    </tr>
                    <tr>
                    ${WEEK_LABLE.map((v)=>{return `<th>${v}</th>`}).join('')}
                    </tr>
                    </thead>
                    <tbody>
                    ${days.map((v)=>{
                        const weekCan = v.some(v2=>!v2.disabled);
                        return `<tr class="${weekCan?'':'disabled'}${v[0].currentWeek?'current-week':''}">${v.map((v2)=>{
                            return `<td class="day${' '+v2.type}${v2.day === this.currentDay?' today':''}${v2.disabled?' disabled':''}">${v2.day}</td>`;
                        }).join('')}</tr>`;
                    }).join('')}
                    </tbody>
                    <tfoot>
                    <tr><th colSpan="7" class="today-btn${this.todayDisabled?' disabled':''}">${TODAY_BTN_TEXT[this.type]}</th></tr>
                    </tfoot>
                </table>`;
    }

    _renderDayTable(type){
        const date = this.currentDate;
        switch (type){
            case 'prev':{
                date.setMonth(this.currentMonth-2);
                break;
            }
            case 'next':{
                date.setMonth(this.currentMonth);
                break;
            }
        }
        this.currentDate = date;
        this.currentYear = this.currentDate.getFullYear();
        this.currentMonth = this.currentDate.getMonth()+1;
        this.currentDay = this.currentDate.getDate();
        this.picker.find('.day-table-c').html(this._getDayTable());
    }


    _getHtml(){
        return `<div id="${this.id}" class="data-picker-container${this.dropUp?' drop-up':''}">
                    <div class="data-picker-days year-table-c ${this.type === 1?'table-show':''}"></div>
                    <div class="data-picker-days month-table-c ${this.type === 2?'table-show':''}">${this._getMonthTable()}</div>
                    <div class="data-picker-days day-table-c ${this.type > 2?'table-show':''}"></div>
                </div>`;
    }

    _renderHtml() {
        if($('#'+this.id).length === 0){
            $('body').append(this._getHtml());
            if(!this.input.closest('.datepicker-input-c').length){
                this.input.wrap(`<div id="${this.id+'Input'}" class="datepicker-input-c"></div>`).after(`<i class="fa fa-calendar"></i><i class="fa fa-times"></i>`);
            }
            this.picker = $('#'+this.id);
            this.outer = $('#'+this.id+'Input');
            this._bindEvent();
        }
    }

    /**
     * 打开日期
     */
    pickerShow(){
        this.defaultDate = new Date(this.currentDate);
        this._switchTable(this.type-1);
        if(this.dropUp){
            const {left,top:offt} = this.input.offset(),top = offt-this.picker.height()-20;
            this.picker.css({left,top}).fadeIn(200);
        }else {
            const {left,top:offt} = this.input.offset(),top = offt+this.input[0].clientHeight;
            this.picker.css({left,top}).fadeIn(200);
        }
        this.outer.find('.fa-calendar').hide();
        this.outer.find('.fa-times').toggle(this.canClose);
    }

    /**
     * 关闭日期
     */
    pickerHide(){
        this.picker.fadeOut(200);
        this.outer.find('.fa-calendar').show();
        this.outer.find('.fa-times').hide();
    }

    _setFinDate(year,month,day,type){
        let date = new Date(year+'/'+month+'/'+day);
        switch (type){
            case 'prev':{
                date.setMonth(month-2);
                break;
            }
            case 'next':{
                date.setMonth(month);
                break;
            }
        }
        this.currentDate = date;
        this.currentYear = this.currentDate.getFullYear();
        this.currentMonth = this.currentDate.getMonth()+1;
        this.currentDay = this.currentDate.getDate();
        const f_date = format(date,this.defaultFormat);
        if(this.type === 4){
            const md1 = getMonthFirstDay(this.currentYear,this.currentMonth) || 7;
            const mw1d = 7-md1+2;
            const wn = Math.floor((this.currentDay - mw1d)/7)+1;
            this.input.val(f_date+` 第${wn}周`);
            this.onDateChange({
                start:this.currentDate,
                end:new Date(this.currentDate).setDate(this.currentDay+6),
                weekNumber:wn
            })
        }else {
            this.input.val(f_date);
            this.onDateChange(f_date);
        }
        this.pickerHide();
    }

    _switchTable(n){
        switch (n){
            case 0:{
                this._renderYearTable(this.currentYear);
                break;
            }
            case 1:{
                const startF = this.startDate?this.startDate.getFullYear() == this.currentYear:false,
                    endF = this.endDate?this.endDate.getFullYear() == this.currentYear:false,
                    that = this;
                this.picker.find('.month').each(function () {
                    $(this).toggleClass('disabled',(startF && $(this).index()<that.startDate.getMonth())
                                                    ||(endF && $(this).index()>that.endDate.getMonth()));
                }).eq(this.currentMonth-1).addClass('active').siblings().removeClass('active');
                this.picker.find('.month-table-c .switch').text(this.currentYear+'年');
                this.picker.find('.go-prev-year').toggleClass('disabled',startF);
                this.picker.find('.go-next-year').toggleClass('disabled',endF);
                break;
            }
            case 2:
            case 3:{
                this._renderDayTable();
                break;
            }
        }
        this.picker.find('.data-picker-days').eq(n).addClass('table-show').siblings().removeClass('table-show');
    }

    _formatADate(val){
        let date = new Date(val);
        date = date.getTime()?date:new Date();
        let currentDate;
        if((!this.startDate || this.startDate.getTime()<date.getTime()) && (!this.endDate || this.endDate.getTime()>date.getTime())){
            currentDate = new Date(date);
        }else if(!(!this.startDate || this.startDate.getTime()<date.getTime())){
            currentDate = new Date(this.startDate);
        }else {
            currentDate = new Date(this.endDate);
        }
        return currentDate;
    }

    /**
     * 设置开始时间
     * @param date
     */
    setStartDate(date){
        this.startDate = date?new Date(date):null;
        this.todayDisabled = (this.startDate && this.startDate.getTime()>Date.now()) || (this.endDate && this.endDate.getTime()+86400000<Date.now());
        if(this.startDate && this.currentDate<this.startDate){
            this.currentDate = new Date(this.startDate);
        }
        return this;
    }

    /**
     * 设置结束时间
     * @param date
     */
    setEndDate(date){
        this.endDate = date?new Date(date):null;
        this.todayDisabled = (this.startDate && this.startDate.getTime()>Date.now()) || (this.endDate && this.endDate.getTime()+86400000<Date.now());
        if(this.endDate && this.currentDate > this.endDate){
            this.currentDate = new Date(this.endDate);
        }
    }

    _bindEvent() {
        const that = this;
        this.outer.on('click',() => {
            if(this.input[0].disabled) return;
            this.pickerShow();
        }).on('keyup',()=>{
            this.currentDate = this._formatADate(this.input.val());
            this._switchTable(this.type-1);
        }).on('keydown',()=>{
            this.keyPress = true;
        }).on('click','.fa-calendar',()=> {
            if(this.input[0].disabled) return;
            this.input.focus();
        }).on('click','.fa-times',function (e) {
            e.stopPropagation();
            that.reset();
            that.pickerHide();
        });

        this.picker.on('click','.data-picker-table:not(.week) .day:not(.disabled)',function () {
            const $this = $(this),day = $this.text();
            if($this.hasClass('prev')){
                that._setFinDate(that.currentYear,that.currentMonth,day,'prev');
            }else if($this.hasClass('next')){
                that._setFinDate(that.currentYear,that.currentMonth,day,'next');
            }else {
                that._setFinDate(that.currentYear,that.currentMonth,day,'now');
            }
        }).on('click','.go-prev-month:not(.disabled)',function () {
            that._renderDayTable('prev');
        }).on('click','.go-next-month:not(.disabled)',function () {
            that._renderDayTable('next');
        }).on('click','.today-btn:not(.disabled)',function () {
            const date = new Date();
            if(that.type === 4){
                const tw = date.getDay() || 7;
                date.setDate(date.getDate()-tw+1);
            }
            that._setFinDate(date.getFullYear(),date.getMonth()+1,date.getDate(),'now');
        }).on('click','.day-table-c .switch',function () {
            that._switchTable(1);
        }).on('click','.month:not(.disabled)',function () {
            that.currentDate.setMonth($(this).index());
            if(that.type === 2){
                that.currentMonth = that.currentDate.getMonth()+1;
                return that._setFinDate(that.currentYear,that.currentMonth,1,'now');
            }
            that._switchTable(2);
        }).on('click','.go-prev-year:not(.disabled)',function () {
            that.currentYear--;
            that.currentDate = new Date(that.currentYear+'/'+that.currentMonth+'/'+that.currentDay);
            that._switchTable(1);
        }).on('click','.go-next-year:not(.disabled)',function () {
            that.currentYear++;
            that.currentDate = new Date(that.currentYear+'/'+that.currentMonth+'/'+that.currentDay);
            that._switchTable(1);
        }).on('click','.month-table-c .switch',function () {
            that._switchTable(0);
        }).on('click','.go-prev-10year:not(.disabled)',function () {
            const year = $(this).next().text().split('-')[0];
            that._renderYearTable(year);
        }).on('click','.go-next-10year:not(.disabled)',function () {
            const year = $(this).prev().text().split('-')[1] -0 + 10;
            that._renderYearTable(year);
        }).on('click','.year:not(.disabled)',function () {
            const year = $(this).text();
            that.currentDate.setFullYear(year);
            that.currentYear = year;
            if(that.type === 1){
                return that._setFinDate(that.currentYear,1,1,'now');
            }
            that._switchTable(1);
        }).on('click','.week tbody tr:not(.disabled)',function () {
            let weekType = 'now';
            const monday = $(this).find('td').eq(0);
            if(monday.hasClass('now')){
                weekType = 'now';
            }else if(monday.hasClass('prev')){
                weekType = 'prev';
            }else {
                weekType = 'next';
            }
            that._setFinDate(that.currentYear,that.currentMonth,monday.text(),weekType);
        });

        $(document).on('mousedown',function (e) {
            if($(e.target).closest('#'+that.id).length !== 1 && $(e.target).closest('#'+that.id+'Input').length !== 1){
                if(that.keyPress && that.input.val()){
                    const f_date = format(that.currentDate,that.defaultFormat);
                    that.input.val(f_date);
                    that.onDateChange(f_date);
                }
                that.pickerHide();
                that.keyPress = false;
            }
        });
    }
}