const createPage = require('./lib/createPage');

const pages = require('../src/demo/common/navList');

pages.forEach((v)=>{
    const _params = 'demo'+v.url;
    console.log(`----start create ${_params} page----`);
    createPage(_params);
});