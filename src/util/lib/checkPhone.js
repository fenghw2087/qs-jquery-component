/**
 * 验证手机号
 * @param phone
 * @returns {boolean}
 */
const checkPhone = (phone) => {
    return /^[1][3,4,5,7,8][0-9]{9}$/.test(phone);
};

export default checkPhone;
