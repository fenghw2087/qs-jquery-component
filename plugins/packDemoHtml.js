const fs = require('fs');

function PackDemoHtml(options){
    this.options = options;
}

PackDemoHtml.prototype.apply = function(compiler) {
    let configPath = this.options.config;
    if(configPath.indexOf('.js') === -1){
        configPath+='.js'
    }
    const mode = this.options.mode;
    const oldConfig = require(configPath);
    let hasInit = false;

    compiler.plugin('done',(compilation)=>{
        if(hasInit) return;
        hasInit = true;
        let hashChunksStr = '{}';
        if(mode !== 'dev'){
            const hashChunks = {};
            const assets = compilation.compilation.assets;
            for(const fileName in assets){
                if(assets.hasOwnProperty(fileName) && fileName.split('.').pop() === 'js'){
                    const  jsName = fileName.split('/').pop().split('.')[0];
                    hashChunks[jsName.split('-')[0]] = jsName.split('-')[1]?('-'+jsName.split('-')[1]):'';
                }
            }
            hashChunksStr = `{`;
            for(const js in hashChunks){
                if(hashChunks.hasOwnProperty(js)){
                    hashChunksStr+=`
        ${js}:'${hashChunks[js]}',`
                }
            }
            hashChunksStr+=`
    }`;
        }

        const configStr = `//不允许手动修改该文件的mode项和hashChunks项,仅允许修改filePath
        
module.exports = {
    mode:'${mode}',
    hashChunks:${hashChunksStr},
    devConfig:{
        filePath:'${oldConfig.devConfig.filePath}'
    },
    prodConfig:{
        filePath:'${oldConfig.prodConfig.filePath}'
    }
};`;
        fs.writeFile(configPath,configStr,()=>{
            console.log(`----update config success`);
        });
    })
};

module.exports = PackDemoHtml;