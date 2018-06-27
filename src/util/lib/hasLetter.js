/**
 * 验证字符串中是否包含字母
 * @param str
 * @returns {boolean}
 */
const hasLetter = (str) => {
    return /[a-z]/i.test(str+'');
};

export default hasLetter;
