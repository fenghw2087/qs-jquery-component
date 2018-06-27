const pages = require('../config/web-file2');

const createPage = require('./lib/createPage');

pages.forEach((v)=>{
    const _params = 'web2/'+v;
    console.log(`----start create ${_params} page----`);
    createPage(_params);
});