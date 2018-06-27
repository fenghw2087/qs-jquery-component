import $ from 'jquery';

import * as CommonUtil from '../../common/common';
import {propsList, apiList} from "./paramsAndApi";

import './less/mutiimgviewer.less';
import MutiImgViewer from "../../../component/mutiImgViewer/mutiImgViewer";

class MutiimgviewerPage {
    constructor() {
        this.outer = $('#mutiimgviewerPageOuter');

        this._init();
    }

    init = () => {

    };

    _bindEvent = () => {
        const that = this;
        this.outer.on('click','.btn-test1', function () {
            const imgs = [
                'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1529060343132&di=df1312e72202cff3d1c9fa5e7c0d69cb&imgtype=0&src=http%3A%2F%2Fimg.go007.com%2F2017%2F03%2F01%2Fb4ed6f4247c72b3a_1.jpg',
                'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1529060343132&di=80bd48e19de660ec2a1b0cbe73e958d8&imgtype=0&src=http%3A%2F%2Fimg.go007.com%2F2016%2F12%2F28%2F6d5418687df48824_5.jpg',
                'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1529060343132&di=6d7bb6c7cc9240b0bcb2f3228acb18d5&imgtype=0&src=http%3A%2F%2Fimg.go007.com%2F2016%2F12%2F28%2F6d5418687df48824_7.jpg',
                'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1529060343131&di=018e6c0c8dba827c68e42c59228a8e1f&imgtype=0&src=http%3A%2F%2Fwww.goumin.com%2Fattachments%2Fsale%2F0%2F0%2F13%2F3552%2F909377.jpg%3F1406510935'
            ];
            that.mutiImgViewer.show(imgs,1);
        })
    };

    _init = () => {
        this.mutiImgViewer = new MutiImgViewer();

        CommonUtil.initCode(this.outer);

        CommonUtil.createDetailTable({outer: this.outer, propsList, apiList});
        this._bindEvent();
    }
}

new MutiimgviewerPage().init();