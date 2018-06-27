import hasLetter from './hasLetter';

/**
 * 获取本地存储
 * @param key 
 * @param error
 * @returns {*}
 */
const getLocalStorage = (key,error = ()=>{return ''}) => {
    if(!key) return error(new Error('LocalStorage must has a param key'));
    if(!hasLetter(key)) return error(new Error('LocalStorage param key must contains letter'));
    if(window.localStorage){
        return window.localStorage.getItem(key);
    }else {
        return error(new Error('Your browser does not support localStorage'));
    }
};

export default getLocalStorage;
