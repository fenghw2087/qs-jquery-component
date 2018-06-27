import TouchHandler from './touchHandler';
import $ from 'jquery';

/**
 * 测试事件
 * 在每一个事件中都使用 TouchHandler.isAllow(e) 判断事件是否可执行
 * 在 touchstart 和 touchmove、touchend、touchcancel
 */
(function(){
    $(document)
        .on(TouchHandler.START, function(e){
            if (!TouchHandler.isAllow(e)) {
                return;
            }
            TouchHandler.register(e)
            console.log(e.type + " process");
        })
        .on(TouchHandler.MOVE, function (e) {
            if (!TouchHandler.isAllow(e)) {
                return;
            }
            console.log(e.type + " process");
         })
         .on(TouchHandler.END, function (e) {
            if (!TouchHandler.isAllow(e)) {
                return;
            }
            console.log(e.type + " process");
         })
        .on(TouchHandler.UNLOCK, TouchHandler.register);
})();
