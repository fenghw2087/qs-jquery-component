/**
 * Created by 2087 on 2018/1/11.
 */
const path = require('path');
const entry = [
    'login',//登录
    'platform',//平台管理
    'userManage',//账号管理
    'statistics',//运营统计
    'setting'//系统设置
];

const getEntry = (fns) => {
    let entrys = {};
    fns.forEach(function (fn) {
        entrys[fn] = path.resolve(__dirname, '../src/sz-admin/views/'+fn+'/'+fn+'.js');
    });
    entrys.reset = path.resolve(__dirname, '../src/common/sz-admin/reset/reset.js');
    return entrys;
};

module.exports = getEntry(entry);


