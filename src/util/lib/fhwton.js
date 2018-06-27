/**
 * 前端字符串解密
 * @param str
 * @returns {string}
 */
const fhwton = (str) => {
    str = str.toString();
    let s = '';
    for(let i=0;i<str.length;i++){
        let _s = str[i].charCodeAt()+'';
        _s = _s.length +''+ _s + '' + Math.floor(Math.random()*10);
        s += _s;
    }
    return s;
};

export default fhwton;
