/**
 * 获取某月第一天是星期几
 * @param year 年
 * @param month 月
 * @returns {number} 星期几
 */
const getMonthFirstDay = (year,month) => {
    if(month < 1 || month > 12) throw new Error('getMonthLength param month must between 1-12');
    const date = new Date(year+'/'+month+'/'+'1');
    return date.getDay();
};

export default getMonthFirstDay;
