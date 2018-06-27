/**
 * 判断字符串是否以数字开头
 * @param str
 * @returns {boolean}
 */
const isStartWithNum = (str) => {
    return /^[1-9]/.test(str);
};

export default isStartWithNum;
