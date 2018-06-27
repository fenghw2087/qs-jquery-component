/**
 * 前端字符串加密
 * @param str
 * @returns {string}
 */
const fhwfroms = (str) => {
    str = str.toString();
    if(!str) return '';
    let s = '';
    while (str.length>0){
        s += String.fromCharCode(str.substr(1,str[0]));
        str = str.substr(str[0]-0+2).toString();
    }
    return s;
};

export default fhwfroms;
