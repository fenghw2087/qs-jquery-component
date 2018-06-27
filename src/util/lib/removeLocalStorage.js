import hasLetter from './hasLetter';

/**
 * 移除本地存储中的某个字段
 * @param key
 * @param error
 * @returns {*}
 */
const removeLocalStorage = (key,error = ()=>{return ''}) => {
    if(!key) return error(new Error('LocalStorage must has a param key'));
    if(!hasLetter(key)) return error(new Error('LocalStorage param key must contains letter'));
    if(window.localStorage){
        return window.localStorage.removeItem(key);
    }else {
        return error(new Error('Your browser does not support localStorage'));
    }
};

export default removeLocalStorage;
