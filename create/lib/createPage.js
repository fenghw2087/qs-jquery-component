const fs = require('fs');
const path = require('path');

const colors = require('colors');

const pathConfig = require('./filePath');

function createPage(params) {
    let project = 'demo';
    let name = '';
    if(params.indexOf('/')>-1){
        project = params.split('/')[0];
        name = params.split('/')[1];
    }else {
        name = params;
    }

    const fileConfig = pathConfig[project];

    if(!fileConfig){
        return console.log(`----no such pathConfig "${project}"`.red)
    }

    createHtml(name,fileConfig);

    if(fs.existsSync(path.join(fileConfig.output.js,name))){
        console.log(`----current file or path "${name}" has excited`.yellow);
        createJs(name,fileConfig);
        if(fs.existsSync(path.join(fileConfig.output.js,name+'/less'))){
            console.log(`----current file or path "${name+'/less'}" has excited`.yellow);
            cleateCss(name,fileConfig);
        }else {
            fs.mkdir(path.join(fileConfig.output.js,name+'/less'),() =>{
                cleateCss(name,fileConfig);
            });
        }
    }else {
        const basicDirP = new Promise((res,rej)=>{
            fs.mkdir(path.join(fileConfig.output.js,name),(err) =>{
                if(err) rej(err);
                res(path.join(fileConfig.output.js,name))
            })
        });
        basicDirP.then(()=>{
            createJs(name,fileConfig);
            fs.mkdir(path.join(fileConfig.output.js,name+'/less'),() =>{
                cleateCss(name,fileConfig);
            });
        })
    }
}


function createJs(name,fileConfig) {
    if(!Array.isArray(fileConfig.template.js)){
        fileConfig.template.js = [{path:fileConfig.template.js}];
    }
    fileConfig.template.js.forEach((v)=>{
        let fileName = name+'.js';
        if(v.name) fileName = v.name;
        console.log(`----start create ${fileName}`.blue);

        if(fs.existsSync(path.join(fileConfig.output.js,name+'/'+fileName))){
            console.log(`----${fileName} has excited`.yellow);
        }else {
            new Promise((res)=>{
                res(fs.readFileSync(v.path).toString());
            }).then((data)=>{
                const nameU = name[0].toUpperCase()+name.substr(1);
                const jsStr = data.replace(/\${NAME-U}/g,nameU).replace(/\${NAME}/g,name).replace(/\${TIME}/g,new Date().toDateString());
                fs.writeFile(path.join(fileConfig.output.js,name+'/'+fileName),jsStr,()=>{
                    console.log(`----create ${fileName} success`.green);
                })
            })
        }
    });
}

function cleateCss(name,fileConfig) {
    console.log(`----start create ${name}.less`.blue);
    if(fs.existsSync(path.join(fileConfig.output.js,name+'/less/'+name+'.less'))){
        console.log(`----${name}.css has excited`.yellow);
    }else {
        new Promise((res)=>{
            res(fs.readFileSync(fileConfig.template.less).toString());
        }).then((data)=>{
            fs.writeFile(path.join(fileConfig.output.js,name+'/less/'+name+'.less'),data,()=>{
                console.log(`----create ${name}.less success`.green);
            })
        });
    }
}

function createHtml(name,fileConfig) {
    if(!fileConfig.template.html || !fileConfig.output.html) return;
    fileConfig.output.template = fileConfig.output.template || 'html';
    console.log(`----start create ${name+'.'+fileConfig.output.template}`.blue);
    if(fs.existsSync( path.join(fileConfig.output.html,name+'.'+fileConfig.output.template) )){
        console.log(`----${name+'.'+fileConfig.output.template} has excited`.yellow);
    }else {
        new Promise((res)=>{
            res(fs.readFileSync(fileConfig.template.html).toString());
        }).then((data)=>{
            const nameU = name[0].toUpperCase()+name.substr(1);
            const htmlStr = data.replace(/\${NAME-U}/g,nameU).replace(/\${NAME}/g,name).replace(/\${TIME}/g,new Date().toDateString());
            fs.writeFile(path.join(fileConfig.output.html,name+'.'+fileConfig.output.template),htmlStr,()=>{
                console.log(`----create ${name+'.'+fileConfig.output.template} success`.green);
            })
        })
    }
}

module.exports = createPage;