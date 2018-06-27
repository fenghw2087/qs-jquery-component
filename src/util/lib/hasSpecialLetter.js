/**
 * 验证字符串是否包含以下特殊字符
 * @param str
 * @returns {boolean}
 */
const hasSpecialLetter = (str) => {
    return new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]").test(str)
};

export default hasSpecialLetter;