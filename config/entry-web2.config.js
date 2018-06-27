/**
 * Created by 2087 on 2018/1/11.
 */
const path = require('path');
const entry = require('./web-file2');

const getEntry = (fns) => {
    let entrys = {};
    fns.forEach(function (fn) {
        entrys[fn] = path.resolve(__dirname, '../src/sz-web2/pages/'+fn+'/'+fn+'.js');
    });
    entrys.reset = path.resolve(__dirname, '../src/common/sz-web2/reset/reset.js');
    return entrys;
};

module.exports = getEntry(entry);


