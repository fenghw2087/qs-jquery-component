import * as Check from './check';

export const toFixed = (num,length) => {
    if(!Check.isPosInteger(length)){
        length = parseInt(length) || 2;
    }
    if(Check.isNumber(num)){
        return num.toFixed(length);
    }
    return '';
};

export const toPercent = (num,length,placeholder='-') => {
    if(!Check.isPosInteger(length)){
        length = parseInt(length) || 2;
    }
    if(Check.isNumber(num)){
        return (num*100).toFixed(length)+'%';
    }
    return placeholder;
};

export const percentToFixed = (str,length)=>{
    if(!Check.isPosInteger(length)){
        length = parseInt(length) || 2;
    }
    if(!Check.isNumber(parseFloat(str)) || str === Infinity || str === -Infinity) return '';
    return toFixed(parseFloat(str),length)+'%';
};