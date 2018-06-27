import doRequest from './doRequest';

/**
 * 文件上传方法
 * @param fd 包含文件的formData
 * @param url 请求url
 * @param success 成功回调
 * @param error 失败回调
 * @param always 总是回调
 * @param onprogress 进度回调
 */
const uploadFile = ({ fd,url,success,error=()=>{},always=()=>{}, onprogress }) => {
    if(!url) throw new Error('uploadFile param url is must');
    if(!fd) throw new Error('uploadFile param fd is must');
    typeof error !== 'function' && (error = ()=>{});
    typeof success !== 'function' && (success = ()=>{});
    typeof always !== 'function' && (always = ()=>{});

    return doRequest({
        url,
        type: 'POST',
        headers: {
            'Accept': 'application/json;charset=UTF-8'
        },
        data: fd,
        // async: false,
        cache: false,
        contentType: false,
        processData: false,
        xhr:xhrOnProgress(onprogress),
        success,
        error
    }).always(()=>{
        always();
    });
};

const xhrOnProgress=function(fun) {
    //使用闭包实现监听绑
    return function() {
        //通过$.ajaxSettings.xhr();获得XMLHttpRequest对象
        const xhr = $.ajaxSettings.xhr();
        //判断监听函数是否为函数
        if (typeof fun !== 'function')
            return xhr;
        //如果有监听函数并且xhr对象支持绑定时就把监听函数绑定上去
        if (fun && xhr.upload) {
            xhr.upload.addEventListener('progress',fun, false);
        }
        return xhr;
    }
};

export default uploadFile