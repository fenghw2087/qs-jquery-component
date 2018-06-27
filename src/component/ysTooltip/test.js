import YsTooltip from './ysTooltip.js';
import $ from 'jquery';

$("body").append("<span class='test-tooltip'>JC ToolTip</span>");
$("<span ys-tooltip='{content:\"document ready tooltip\"}' >JC ToolTip</span>").appendTo("body");

var inst = new YsTooltip('.test-tooltip', {
    position: 'auto',     // 提示所在位置
    delay: 0,             // 延迟，单位毫秒
    content: '<div style="text-align: center;border: 1px solid #fff;">' +
        '<span>JianCha Print</span>' +
        '<img src="https://yscredit.oss-cn-hangzhou.aliyuncs.com/dc1e274b32e446b6943a2c6f8e43268f">' +
    '</div>',          // 提示文本，允许包含 HTML
});

