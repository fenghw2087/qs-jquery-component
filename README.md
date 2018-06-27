前端使用webpack进行代码压缩

   1.base.jsp中的 min变量  生产环境'min.' 开发环境 ''

   2.js引入页面事例

    <script src="<%=basePath%>decision/dist/js/oneCompany.<%=min%>js?t=<%=version%>"></script>

   3. 测试和上线前，进行js压缩，参照package.json内脚本

   4. 测试和上线前修改base.jsp min变量

   5. 引入了esLint 配置参照http://eslint.cn/docs/rules/中的推荐配置
   
    idea中安装eslint步骤
    1. npm install eslint -g
       npm install eslint-plugin-import -g
       npm install eslint-config-airbnb -g
       npm install eslint-plugin-jsx-a11y -g
       npm install eslint-plugin-react -g
       npm install babel-eslint -g
       
    2. 打开setting配置，找到eslint，打开enable