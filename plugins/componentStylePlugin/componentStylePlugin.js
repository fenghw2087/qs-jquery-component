const fs = require('fs');


function ComponentStylePlugin(options){
    this.options = options;
}

ComponentStylePlugin.prototype.apply = function(compiler) {
    console.log('--------------before-run');
    const defaultStyle = require('./config');
    const _style = Object.assign(defaultStyle,this.options.style || {});
    let lessStr = '';
    for(const i in _style){
        if(_style.hasOwnProperty(i)){
            lessStr += `@${i}:${_style[i]};\n`
        }
    }
    let hasInit = false;
    compiler.plugin('make',(c,callback)=>{
        if(!hasInit){
            fs.writeFile(this.options.path,lessStr,()=>{
                hasInit = true;
                console.log(`\n----component style has init!----\n`);
                callback();
            });
        }else {
            callback();
        }
    })
};

module.exports = ComponentStylePlugin;