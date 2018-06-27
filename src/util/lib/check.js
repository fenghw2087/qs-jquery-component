import checkPhone2 from './checkPhone';
/**
 * 验证是不是数字
 * @param val
 * @returns {boolean}
 */
export const isNumber = (val) => {
    if(val === null || val === undefined || Math.abs(val) === Infinity) return false;
    return !isNaN(parseFloat(val-0));
};

/**
 * 验证正整数
 * @param num
 * @returns {boolean}
 */
export const isPosInteger = (num) => {
    num = num - 0;
    return num !== 0 && /^[0-9]+$/.test(num);
};

/**
 * 验证手机号
 * @param phone
 * @returns {boolean}
 */
export const checkPhone = checkPhone2;

export const checkTelPhone =(tp)=>{
    return /^(0\d{2,3}(-|\s|)\d{7,8})$/.test(tp);
};