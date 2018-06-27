/**
 * 数组分割
 * @param arr 原数组
 * @param length 分割长度
 * @returns {*} 返回分割好的二维数组
 */
const divideArr = (arr,length) => {
    try{
        if(arr.forEach === undefined) return [];
    }catch (e){
        throw new Error('divideArr param arr must be an array');
    }
    if(length < 1) return [];
    const newArr = [[]];
    arr.forEach(function (v) {
        if(newArr[newArr.length-1].length < length){
            newArr[newArr.length-1].push(v);
        }else {
            newArr.push([v]);
        }
    });
    return newArr;
};

export default divideArr;
