import $ from 'jquery';

import './css/carousel.css';

import * as CommonUtil from '../../common/common';
import {propsList, apiList} from "./paramsAndApi";
import Carousel from "../../../component/carousel/carousel";

class carouselPage {
    constructor() {
        this.outer = $('#carousel');

        this._init();
    }

    init = () => {

    };

    _bindEvent = () => {
        const that = this;
        this.outer.on('click', function () {

        })
    };

    _init = () => {
        new Carousel({
            outer:$('#test1'),
            autoChange:true,
            hasSidePager:false
        });

        new Carousel({
            outer:$('#test2')
        });

        CommonUtil.initCode(this.outer);

        CommonUtil.createDetailTable({outer: this.outer, propsList, apiList});
        this._bindEvent();
    }
}

new carouselPage().init();