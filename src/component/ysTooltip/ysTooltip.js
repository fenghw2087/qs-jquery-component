import './ysTooltip.css';
import YsTouchHandler from '../ysTouchHandler/touchHandler'
import $ from 'jquery';


/**
 * =============================================================================
 * ************   开放的常用方法   ************
 * =============================================================================
 */
$.fn.extend({

    /**
     * 执行强制重绘
     */
    reflow: function () {
        return this.each(function () {
            return this.clientLeft;
        });
    },

    /**
     * 设置 transition 时间
     * @param duration
     */
    transition: function (duration) {
        if (typeof duration !== 'string') {
            duration = duration + 'ms';
        }

        return this.each(function () {
            this.style.webkitTransitionDuration = duration;
            this.style.transitionDuration = duration;
        });
    },

    /**
     * transition 动画结束回调
     * @param callback
     * @returns {transitionEnd}
     */
    transitionEnd: function (callback) {
        var events = [
            'webkitTransitionEnd',
            'transitionend',
        ];
        var i;
        var _this = this;

        function fireCallBack(e) {
            if (e.target !== this) {
                return;
            }

            callback.call(this, e);

            for (i = 0; i < events.length; i++) {
                _this.off(events[i], fireCallBack);
            }
        }

        if (callback) {
            for (i = 0; i < events.length; i++) {
                _this.on(events[i], fireCallBack);
            }
        }

        return this;
    },

    /**
     * 设置 transform-origin 属性
     * @param transformOrigin
     */
    transformOrigin: function (transformOrigin) {
        return this.each(function () {
            this.style.webkitTransformOrigin = transformOrigin;
            this.style.transformOrigin = transformOrigin;
        });
    },

    /**
     * 设置 transform 属性
     * @param transform
     */
    transform: function (transform) {
        return this.each(function () {
            this.style.webkitTransform = transform;
            this.style.transform = transform;
        });
    },

});

/**
 * 生成唯一 id
 * @param string name id的名称，若该名称对于的guid不存在，则生成新的guid并返回；若已存在，则返回原有guid
 * @returns {string}
 */
(function () {
    var GUID = {};

    $.extend({
        createGuid: function (name) {
            if (typeof name !== 'undefined' && typeof GUID[name] !== 'undefined') {
                return GUID[name];
            }

            function s4() {
                return Math.floor((1 + Math.random()) * 0x10000)
                    .toString(16)
                    .substring(1);
            }

            var guid = s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();

            if (typeof name !== 'undefined') {
                GUID[name] = guid;
            }

            return guid;
        },
    });

    /**
     * 解析 DATA API 的参数
     * @param str
     * @returns {*}
     */
    var parseOptions = function (str) {
        var options = {};

        if (str === null || !str) {
            return options;
        }

        if (typeof str === 'object') {
            return str;
        }

        /* eslint-disable */
        /* jshint ignore:start */
        var start = str.indexOf('{');
        try {
            options = (new Function('',
                'var json = ' + str.substr(start) +
                '; return JSON.parse(JSON.stringify(json));'))();
        } catch (e) {
        }
        /* jshint ignore:start */
        /* eslint-enable */

        return options;
    };
    $.extend({parseOptions: parseOptions});
})();
const YsTooltip = (function(selectStr, options) {

    /**
     * 默认参数
     */
    var defaultOption = {
        position: 'auto',     // 提示所在位置, bottom, top, right, left
        delay: 0,             // 延迟，单位毫秒
        content: '',          // 提示文本，允许包含 HTML
    }, $window = $(window);


    /**
     * 是否是桌面设备
     * @returns {boolean}
     */
    var isDesktop = function () {
        return $window.width() > 1024;
    };

    /**
     * 设置 Tooltip 的位置
     * @param inst
     */
    function setPosition(inst) {
        var marginLeft;
        var marginTop;
        var position;

        // 触发的元素
        var targetProps = inst.$target[0].getBoundingClientRect();

        // 触发的元素和 Tooltip 之间的距离
        var targetMargin = (isDesktop() ? 14 : 24);

        // Tooltip 的宽度和高度
        var tooltipWidth = inst.$tooltip[0].offsetWidth;
        var tooltipHeight = inst.$tooltip[0].offsetHeight;

        // Tooltip 的方向
        position = inst.options.position;

        // 自动判断位置，加 2px，使 Tooltip 距离窗口边框至少有 2px 的间距
        if (['bottom', 'top', 'left', 'right'].indexOf(position) === -1) {
            if (
                targetProps.top + targetProps.height + targetMargin + tooltipHeight + 2 <
                $window.height()
            ) {
                position = 'bottom';
            } else if (targetMargin + tooltipHeight + 2 < targetProps.top) {
                position = 'top';
            } else if (targetMargin + tooltipWidth + 2 < targetProps.left) {
                position = 'left';
            } else if (
                targetProps.width + targetMargin + tooltipWidth + 2 <
                $window.width() - targetProps.left
            ) {
                position = 'right';
            } else {
                position = 'bottom';
            }
        }

        // 设置位置
        switch (position) {
            case 'bottom':
                marginLeft = -1 * (tooltipWidth / 2);
                marginTop = (targetProps.height / 2) + targetMargin;
                inst.$tooltip.transformOrigin('top center');
                break;
            case 'top':
                marginLeft = -1 * (tooltipWidth / 2);
                marginTop = -1 * (tooltipHeight + (targetProps.height / 2) + targetMargin);
                inst.$tooltip.transformOrigin('bottom center');
                break;
            case 'left':
                marginLeft = -1 * (tooltipWidth + (targetProps.width / 2) + targetMargin);
                marginTop = -1 * (tooltipHeight / 2);
                inst.$tooltip.transformOrigin('center right');
                break;
            case 'right':
                marginLeft = (targetProps.width / 2) + targetMargin;
                marginTop = -1 * (tooltipHeight / 2);
                inst.$tooltip.transformOrigin('center left');
                break;
        }

        var targetOffset = inst.$target.offset();
        inst.$tooltip.css({
            top: targetOffset.top + (targetProps.height / 2) + 'px',
            left: targetOffset.left + (targetProps.width / 2) + 'px',
            'margin-left': marginLeft + 'px',
            'margin-top': marginTop + 'px',
        });
    }

    /**
     * Tooltip 实例
     * @param selectStr
     * @param options
     * @constructor
     */
    function Tooltip (selectStr, options) {
        var _this = this;
        _this.$target = $(selectStr).eq(0);
        if (!_this.$target.length) {
            return;
        }
        _this.options = $.extend({}, defaultOption, options || {});
        // 创建 Tooltip HTML
        _this.$tooltip = $(
            '<div class="ys-tooltip" id="' + $.createGuid() + '">' +
            _this.options.content +
            '</div>'
        ).appendTo(document.body);

        _this.$target.on("touchstart mouseenter", function(e) {
            if (!YsTouchHandler.isAllow(e)) {
                return;
            }
            YsTouchHandler.register(e);
            _this.open();
        });
        _this.$target.on("touchend mouseleave", function(e) {
            if (!YsTouchHandler.isAllow(e)) {
                return;
            }
            YsTouchHandler.register(e);
            _this.close();
        });
    }

    /**
     * 打开 Tooltip
     * @param opts 允许每次打开时设置不同的参数
     */
    Tooltip.prototype.open = function (opts) {
        var _this = this;

        if (_this.state === 'opening' || _this.state === 'opened') {
            return;
        }

        var oldOpts = $.extend({}, _this.options);

        // 合并 data 属性参数
        $.extend(_this.options, $.parseOptions(_this.$target.attr('ys-tooltip')));
        if (opts) {
            $.extend(_this.options, opts);
        }

        // tooltip 的内容有更新
        if (oldOpts.content !== _this.options.content) {
            _this.$tooltip.html(_this.options.content);
        }

        setPosition(_this);

        if (_this.options.delay) {
            _this.timeoutId = setTimeout(function () {
                _this.state = 'opening';
                _this.$tooltip.addClass('ys-tooltip-open').transitionEnd(function () {
                    _this.state = 'opened';
                });
            }, _this.options.delay);
        } else {
            _this.timeoutId = false;
            _this.state = 'opening';
            _this.$tooltip.addClass('ys-tooltip-open').transitionEnd(function () {
                _this.state = 'opened';
            });
        }
    };

    /**
     * 关闭 Tooltip
     */
    Tooltip.prototype.close = function () {
        var _this = this;

        if (_this.timeoutId) {
            clearTimeout(_this.timeoutId);
            _this.timeoutId = false;
        }

        if (_this.state === 'closing' || _this.state === 'closed') {
            return;
        }

        _this.state = 'closing';
        _this.$tooltip
            .removeClass('ys-tooltip-open')
            .transitionEnd(function () {
                _this.state = 'closed';
            });
    };

    return Tooltip;
})();

/**
 * =============================================================================
 * ************   Tooltip DATA API   ************
 * =============================================================================
 */
$(function () {
    // mouseenter 不能冒泡，所以这里用 mouseover 代替
    $(document).on('touchstart mouseover', '[ys-tooltip]', function () {
        var $this = $(this);
        var inst = $this.data('ys.tooltip');
        if (!inst) {
            var options = $.parseOptions($this.attr('ys-tooltip'));
            inst = new YsTooltip($this, options);
            $this.data('ys.tooltip', inst);
        }
    });
});

export default YsTooltip;