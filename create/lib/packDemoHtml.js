//废弃方法

const fs = require('fs');
const path = require('path');

const colors = require('colors');

const pathConfig = require('./filePath');
const glob = require('glob');

function packDemoHtml() {
    const jsFiles = glob.sync(pathConfig.demo.packHtml.staticPath+'/js/*.js');

    const jsChunks = jsFiles.reduce((o,v)=>{
        const _file = v.split('/').pop().split('-');
        o[_file[0]] = _file[1].split('.')[0];
        return o;
    },{});

    const cssFiles = glob.sync(pathConfig.demo.packHtml.staticPath+'/css/*.css');

    const cssChunks = cssFiles.reduce((o,v)=>{
        const _file = v.split('/').pop().split('-');
        o[_file[0]] = _file[1].split('.')[0];
        return o;
    },{});

    const htmlFiles = glob.sync(pathConfig.demo.packHtml.path+'/*.html');

    htmlFiles.forEach((v)=>{
        const htmlName = v.split('/').pop();
        console.log(`----start create ${htmlName}`.blue);
        new Promise((res)=>{
            res(fs.readFileSync(v).toString());
        }).then((htmlStr)=>{
            const jss = htmlStr.match(/<%=filePath%>(\S*).js/g) || [];
            const csss = htmlStr.match(/<%=filePath%>(\S*).css/g) || [];
            jss.forEach((v2)=>{
                const _name = v2.split('/').pop().split('<%')[0];
                if(!jsChunks[_name]) return;
                const newStr = v2.replace('<%=hash%>','-'+jsChunks[_name]);
                htmlStr = htmlStr.replace(v2,newStr);
            });
            csss.forEach((v2)=>{
                const _name = v2.split('/').pop().split('<%')[0];
                if(!cssChunks[_name]) return;
                const newStr = v2.replace('<%=hash%>','-'+cssChunks[_name]);
                htmlStr = htmlStr.replace(v2,newStr);
            });

            fs.writeFile(path.join(pathConfig.demo.packHtml.output,htmlName),htmlStr,()=>{
                console.log(`----create ${htmlName} success`.green);
            })
        });
    });
}

packDemoHtml();


