import isStartWithNum from './isStartWithNum';
/**
 * 调用localStorage 存储方法
 * @param key
 * @param value
 * @param fn 成功回调
 * @param error
 */
const setLocalStorage = (key,value,fn = ()=>{},error = ()=>{}) => {
    if(!key) return error(new Error('LocalStorage must has a param key'));
    if(isStartWithNum(key)) return error(new Error('LocalStorage param key must contains letter'));
    if(typeof value === 'object') return error(new Error('LocalStorage param value type must not be an object'));
    if(window.localStorage){
        try{
            window.localStorage.setItem(key,value);
            typeof fn === 'function' && fn();
        }catch (e){
            return error(e);
        }

    }else {
        return error(new Error('Your browser does not support localStorage'));
    }
};

export default setLocalStorage;
