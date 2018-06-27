/**
 * 如果字符串为空 null undefined ，则返回placeholder
 * @param str
 * @param placeholder
 * @returns {*|string}
 */
const toHtmlStr = (str,placeholder='') => {
    if(str === undefined || str === null) return placeholder;
    return str;
};

export default toHtmlStr;
