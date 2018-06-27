const path = require('path');

const pathConfig = {
    'demo':{
        template:{
            js: [
                {
                    path:path.join(__dirname, '../template/demo/js.template')
                },{
                    path:path.join(__dirname, '../template/demo/api.template'),
                    name:'paramsAndApi.js'
                },
            ],
            html:path.join(__dirname, '../template/demo/html.template'),
            less:path.join(__dirname, '../template/demo/less.template')
        },
        output: {
            js:path.join(__dirname, '../../src/demo/page'),
            html:path.join(__dirname, '../../src/demo/views'),
            template:'html'
        },
        packHtml:{
            path:path.join(__dirname, '../../src/demo/views'),
            output:path.join(__dirname, '../../src/demo/views/pack'),
            staticPath:path.join(__dirname, '../../src/demo/public')
        }
    },
    'admin':{
        template:{
            js:path.join(__dirname, '../template/common/js.template'),
            html:path.join(__dirname, '../template/admin/html.template'),
            base:path.join(__dirname, '../template/admin/base.jsp.template'),
            less:path.join(__dirname, '../template/admin/less.template')
        },
        output: {
            js:path.join(__dirname, '../../src/sz-admin/views'),
            template:'jsp',
            html:path.join(__dirname, '../../../sz-admin/src/main/webapp/jsp'),
            static:path.join(__dirname, '../../../sz-admin/src/main/webapp/static'),
            base:path.join(__dirname, '../../../sz-admin/src/main/webapp/jsp/basic')
        }
    },
    'web':{
        template:{
            js:path.join(__dirname, '../template/web/js.template'),
            html:path.join(__dirname, '../template/web/html.template'),
            base:path.join(__dirname, '../template/web/base.jsp.template'),
            less:path.join(__dirname, '../template/web/less.template')
        },
        output: {
            js:path.join(__dirname, '../../src/sz-web'),
            template:'jsp',
            html:path.join(__dirname, '../../../sz-web/src/main/webapp/jsp'),
            static:path.join(__dirname, '../../../sz-web/src/main/webapp/static'),
            base:path.join(__dirname, '../../../sz-web/src/main/webapp/jsp/basic')
        }
    },
    'web2':{
        template:{
            js:path.join(__dirname, '../template/web2/js.template'),
            html:path.join(__dirname, '../template/web2/html.template'),
            base:path.join(__dirname, '../template/web2/base.jsp.template'),
            less:path.join(__dirname, '../template/web2/less.template')
        },
        output: {
            js:path.join(__dirname, '../../src/sz-web2/pages'),
            template:'jsp',
            html:path.join(__dirname, '../../../sz-web/src/main/webapp/jsp2'),
            static:path.join(__dirname, '../../../sz-web/src/main/webapp/static2'),
            base:path.join(__dirname, '../../../sz-web/src/main/webapp/jsp2/basic')
        }
    },
    'com':{
        template:{
            js:path.join(__dirname, '../template/component/js.template'),
            less:path.join(__dirname, '../template/component/less.template'),
            html:''
        },
        output: {
            js:path.join(__dirname, '../../src/component')
        }
    }
};

module.exports = pathConfig;