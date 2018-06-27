export const getUrlParams = ( search=window.location.search ) => {
    const params = {};
    search.substr(1).split('&').forEach(function (v) {
        const value = v.split('=')[1] || '';
        const key = v.split('=')[0];
        if(!key) return;
        params[key] = decodeURI(value);
    });
    return params;
};

export const getUrlParam = (name) => {
    const reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    const r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURI(r[2]);
    return null;
};

export const createSearch = ( params ) => {
    let search = [];
    for(let i in params){
        if(params.hasOwnProperty(i)){
            let param = params[i];
            if(params === undefined || params === null) param = '';
            search.push(i+'='+param);
        }
    }
    return search.length?('?'+search.join('&')):'';
};

export const getSearchFromStr = (str='') => {
    const search = str.split('?')[1];
    return search?('?'+search):'';
};

