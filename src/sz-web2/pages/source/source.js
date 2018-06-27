import './less/source.less';

import Nav from '../../../component/nav/nav';
import YsRouter from '../../../component/ysRouter/ysRouter';

import Indicator from './page/indicator';
import UploadSS from './page/uploadSS';
import UploadGT from './page/uploadGT';
import UploadSL from './page/uploadSL';
import UploadEnt from './page/uploadEnt';
import SingleEnt from "./page/singleEnt";

class SourcePage {
    constructor(){
        this.id = 'sourcePageOuter';
        this.outer = $('#'+this.id);
        this.routerConfig = [
            {
                path:window.basePath + 'source/portal',
                name:'indicator',
                page:new Indicator()
            },{
                path:window.basePath + 'source/uploadSS2',
                name:'uploadSS',
                page:new UploadSS()
            },{
                path:window.basePath + 'source/uploadGT2',
                name:'uploadGT',
                page:new UploadGT()
            },{
                path:window.basePath + 'source/uploadSL2',
                name:'uploadSL',
                page:new UploadSL()
            },{
                path:window.basePath + 'source/uploadEnt2',
                name:'uploadEnt',
                page:new UploadEnt()
            },{
                path:window.basePath + 'source/singleEnt',
                name:'singleEnt',
                page:new SingleEnt()
            }
        ];

        this._init();
    }

    init =()=> {
        this.ysRouter.initCurrent();
    };

    _bindEvent =()=> {

    };

    _init =()=> {
        this.ysRouter = new YsRouter({
            router:this.routerConfig
        });

        new Nav({
            navs:this.outer.find('.sec-nav-c').find('a'),
            router:this.ysRouter
        });

        this._bindEvent();
    }
}

new SourcePage().init();
