import $ from 'jquery';

/**
 * 请求
 * @param options
 * @returns {*}
 */
const doRequest = (options) => {
    if(options.url && options.url[0] !== '/' && options.url.indexOf('http')) options.url = window.basePath+options.url;
    return $.ajax(options);
};

export default doRequest;
