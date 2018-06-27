/**
 * 获取某月有几天
 * @param year 年
 * @param month 月
 * @returns {number} 天数
 */
const getMonthLength = (year,month) => {
    if(month == 0){
        month = 12;
        year--;
    }else if(month == 13){
        month = 1;
        year++;
    }
    if(month < 1 || month > 12) throw new Error('getMonthLength param month must between 1-12');
    const date = new Date(year+'/'+month+'/'+'1');
    date.setMonth(month);
    date.setDate(0);
    return date.getDate();
};

export default getMonthLength;
