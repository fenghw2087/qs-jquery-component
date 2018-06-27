/**
 * Created by 2087 on 2018/1/11.
 */
const pages = require('../src/demo/common/navList');

const path = require('path');
const entry = pages.map((v)=>{
    return v.url.substr(1)
});

const getEntry = (fns) => {
    let entrys = {};
    fns.forEach(function (fn) {
        entrys[fn] = path.resolve(__dirname, '../src/demo/page/'+fn+'/'+fn+'.js');
    });
    entrys.reset = path.resolve(__dirname, '../src/demo/common/reset.js');
    entrys.introduce = path.resolve(__dirname, '../src/demo/page/introduce/introduce.js');
    return entrys;
};

module.exports = getEntry(entry);
