import './css/loading.less';

/**
 * 生成一个loading的html
 * @param type small or big
 * @returns {string}
 */
const loading =(type)=>{
    if(type === 'small'){
        return `<svg viewBox="12 12 24 24" class="ys-circular-small"><circle cx="24" cy="24" r="10" fill="none" class="ys-circular-path-small"></circle></svg>`
    }
    return `<svg viewBox="25 25 50 50" class="ys-circular"><circle cx="50" cy="50" r="20" fill="none" class="ys-circular-path"></circle></svg>`
};

export default loading;