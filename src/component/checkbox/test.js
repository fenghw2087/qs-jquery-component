/**
 * Created by Administrator on 2018/1/19.
 */
import Checkbox from './checkBox';

const testHtml = `<div id="test"></div>`;

$('body').append(testHtml);

const myCheck = new Checkbox({
    obj:$('#test'),
    checked:true,
    color:'red',
    onChange:function (checked) {
        console.log(checked);
    }
});

// myCheck.setChecked(false);