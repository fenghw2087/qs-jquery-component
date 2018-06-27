/**
 * 自动配置开发/生产环境，该文件由webpack调用
 */

const devConfig = require('./devConfig');
const prodConfig = require('./prodConfig');

const fs = require('fs');
const path = require('path');
const glob = require('glob');

const filePath = require('../../../create/lib/filePath');

console.log(`----set web2 config`);

const type = process.argv[2];
if(!type) throw new Error('set webConfig must have a param one of [dev,prod]');

function setConfig(type) {
    const config = type === 'dev'?devConfig:prodConfig;
    //获取打包目录下的所有js
    const jsf = glob.sync(path.join(filePath.web2.output.static,'js/*.js'));

    //读取base.jsp模板，生产base.jsp
    new Promise((res)=>{
        res(fs.readFileSync(filePath.web2.template.base).toString());
    }).then((data)=>{
        data = data.replace('${filePath}',config.filePath);
        fs.writeFile(path.join(filePath.web2.output.base,'base.jsp'),data,()=>{
            console.log(`----create web2 base.jsp success`);
        });
    });

    //获取js的hash
    const hashArr = jsf.map((v)=>{
        const name = v.split('/').pop().split('.')[0].split('-')[0];
        let hash = '';
        if(type === 'prod'){
            hash = '-'+v.split('-').pop().split('.')[0];
        }
        return `    String ${name}hash = "${hash}";
`
    });
    //生成hash.jsp
    const hashStr = `<%@ page import="java.util.Date" %>
<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<%
${hashArr.join('')}%>`;

    fs.writeFile(path.join(filePath.web2.output.base,'hash.jsp'),hashStr,()=>{
        console.log(`----create web hash.jsp success`);
    });
}

setConfig(type);