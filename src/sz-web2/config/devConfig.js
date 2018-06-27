//开发时，静态资源文件的引入目录，一般为你node服务的端口
const port = 10245;
const ip = `127.0.0.1`;
const devConfig = {
    filePath:`"http://${ip}:${port}/"`,
    filePath2:"http://"+ ip +":"+port+"/"
};

module.exports = devConfig;