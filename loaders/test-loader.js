const loaderUtils = require('loader-utils');

module.exports = function (str) {
    console.log(this.resourcePath);
    const params = loaderUtils.getOptions(this);
    console.log(params);
    return str;
};