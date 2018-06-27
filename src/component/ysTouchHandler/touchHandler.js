/**
 * touch 事件后的 500ms 内禁用 mousedown 事件
 * 移动端click屏幕产生200-300 ms的延迟响应
 *
 * 不支持触控的屏幕上事件顺序为 mousedown -> mouseup -> click
 * 支持触控的屏幕上事件顺序为 touchstart -> touchend -> mousedown -> mouseup -> click
 *
 *
 * 测试事件:参见test.js
 *      在每一个事件中都使用 TouchHandler.isAllow(e) 判断事件是否可执行
 *      在 touchstart 和 touchmove、touchend、touchcancel
 * @type {{touches: number, isAllow: TouchHandler.isAllow, register: TouchHandler.register, START: string, MOVE: string, END: string, CANCEL: string, UNLOCK: string}}
 */
var TouchHandler = {
    touches: 0,

    /**
     * 该事件是否被允许
     * 在执行事件前调用该方法判断事件是否可以执行
     *
     * @param e
     * @returns {boolean}
     */
    isAllow: function(e) {
        var allow = true;
        if (TouchHandler.touches &&
        [
            'mousedown',
            'mouseup',
            'mousemove',
            'click',
            'mouseover',
            'mouseout',
            'mouseenter',
            'mouseleave'
        ].indexOf(e.type) > -1) { // 触发了 touch 事件后阻止鼠标事件
            allow = false;
        }
        return allow;
    },

    /**
     * 在 touchstart 和 touchmove、touchend、touchcancel 事件中调用该方法注册事件
     *
     * @param e
     */
    register: function(e) {
        if (e.type === "touchstart") {
            TouchHandler.touches += 1;
        } else if(['touchmove', 'touchend', 'touchcancel'].indexOf(e.type) > -1) {
            setTimeout(function() {
                if(TouchHandler.touches) {
                    TouchHandler.touches -= 1;
                }
            }, 500);
        }
    },
    START: 'touchstart mousedown',
    MOVE: 'touchmove mousemove',
    END: 'touchend mouseup',
    CANCEL: 'touchcancel mouseleave',
    UNLOCK: 'touchend touchmove touchcancel',
};

export default TouchHandler;