const createPage = require('./lib/createPage');

const params = process.argv[2];
if(!params) throw new Error('node set must have a param');
createPage(params);
