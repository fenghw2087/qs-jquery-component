/**
 * Created by 2087 on 2018/1/11.
 */
const path = require('path');
const entry = require('./web-file');

const getEntry = (fns) => {
    let entrys = {};
    fns.forEach(function (fn) {
        entrys[fn] = path.resolve(__dirname, '../src/sz-web/'+fn+'/'+fn+'.js');
    });
    entrys.reset = path.resolve(__dirname, '../src/common/sz-web/reset/reset.js');
    return entrys;
};

module.exports = getEntry(entry);


