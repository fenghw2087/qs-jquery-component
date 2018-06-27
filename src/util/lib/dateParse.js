/**
 * Created by Administrator on 2018/1/24.
 */
/**
 * 日期解析函数
 * @param date 带格式的日期
 * @param format 日期格式
 * @returns {*} 返回标准格式时间
 */
const dateParse = (date,format) => {
    let TOKEN = /yy(?:yy)?|M{1,4}|d{1,2}|E{1,4}|([Hhms])\1?|S(?:SS)?|[azZG]/g;
    let tIndex = [];
    let regx = {
        yy : "(\\d{2})", // 2位数字
        yyyy : "(\\d{4})", // 4位数字
        M : "([1-9]|1[012])", // 1到9和10，11，12
        MM : "([1-9]|0[1-9]|1[0-2])",// 01到12
        MMM : "(\\S+)", // 简单处理，非空白字符多个
        MMMM : "(\\S+)", // 简单处理，非空白字符多个
        d : "([1-9]|[12][0-9]|3[01])", // 1到31
        dd : "(0[1-9]|[12][0-9]|3[01])", // 01到31
    };

    let str = format.replace(TOKEN, function($0){

        tIndex.push($0); // 按顺序记录模式符号的位置
        if(typeof regx[$0] === "string"){
            return regx[$0];
        }
        return $0;
    });
    let dateArr = date.match(new RegExp(str));
    if(!dateArr) return '';
    let f_date = new Date();
    for(let i = 0;i<tIndex.length;i++){
        switch (tIndex[i]){
            case 'yyyy':{
                f_date.setFullYear(dateArr[i+1]);
                break;
            }
            case 'MM':{
                f_date.setMonth(dateArr[i+1]-1);
                break;
            }
            case 'dd':{
                f_date.setDate(dateArr[i+1]);
                break;
            }
            case 'hh':{
                f_date.setHours(dateArr[i+1]);
                break;
            }
            case 'mm':{
                f_date.setMinutes(dateArr[i+1]);
                break;
            }
            case 'ss':{
                f_date.setSeconds(dateArr[i+1]);
                break;
            }
        }
    }
    return f_date;
};

export default dateParse;