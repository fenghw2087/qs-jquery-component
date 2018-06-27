/**
 * 转换日期格式
 * @param time 可以标准化的日期
 * @param format 日期格式
 * @returns {*}
 */
const format = (time,format='yyyy-MM-dd') => {
    if(typeof time === 'string' && time.indexOf('+')>-1 && time.indexOf('T')>-1){
        time = time.substr(0,10);
    }
    const date = new Date(time);
    if(!date.getTime()) return '';
    const o = {
        "M+": date.getMonth() + 1,
        "d+": date.getDate(),
        "h+": date.getHours(),
        "m+": date.getMinutes(),
        "s+": date.getSeconds(),
        "q+": Math.floor((date.getMonth() + 3) / 3),
        "S": date.getMilliseconds()
    };
    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (let k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
};

export default format;
