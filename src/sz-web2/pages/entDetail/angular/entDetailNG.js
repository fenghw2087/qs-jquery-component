import angular from 'angular';
import * as UrlUtil from '../../../../util/lib/urlUtil';
import $ from "jquery";
import toHtmlStr from "../../../../util/lib/toHtmlStr";
import doRequest from "../../../../util/lib/doRequest";
import YearMonthSelect from "../../../../component/yearMonthSelect/yearMonthSelect";
import echarts from "echarts";
import lineOption from "../config/lineOption";
import format from "../../../../util/lib/format";
import AddPersonModal from "../modal/addPersonModal";
import message from "../../../../component/message/message";
import notification from "../../../../component/notification/notification";
import ConfirmModal2 from "../../../../component/confirmModal2/confirmModal2";
import MutiImgViewer from "../../../../component/mutiImgViewer/mutiImgViewer";
import Dropdown from "../../../../component/dropDown/dropdown";
import TagModal from "../modal/tagModal";
import {getUrlParam} from "../../../../util/lib/urlUtil";

//办公用房用途
const userTypeDic = ['生产','办公','开发研发','仓库','公寓','宿舍'];

angular.module("myApp", ['ngSanitize']).controller("myCtrl", ["$scope", "$http", function ($scope) {
    //外层容器
    const outer = $('#entDetailPageOuter');

    $scope.config = {
        entName: UrlUtil.getUrlParam('entName'),
        eid: UrlUtil.getUrlParam('eid'),
        editType:false,
        tagList:[],
        taxAddTypeList:['平台本级','区内','区外'],
        userTypeDic:userTypeDic,
        talentsImportPlanDic:['无','国千','省千','市521人才'],
        marketStatusDic:['无','有','已上市'],
        zheJiangCenterStatusDic:['无','有'],
        countyCenterStatusDic:['否','国家级','省级','市级','区级'],
        countyNewCenterStatusDic:['否','国家级','省级','市级','区级'],
        year:new Date().getFullYear(),
        month:'',
        tagSorter:['industryphy','moveStatus','focusList','workArea','buildFileStatus','monitor','layout1','layout11','layout2','layout22','layout3','layout33'],
        sourceList:['智能抓取','智能抓取','企业导入','手动添加','税收导入']
    };
    //企业基本信息
    $scope.entDetail = {};

    //企业概括信息
    $scope.summarizeInfo = {
        editType:false,
        data:{

        },
        editData:{

        }
    };

    //企业税务信息
    $scope.taxInfo = {};

    //企业办公用房信息
    $scope.workPlaceInfo = {
        editType:false,
        data:{

        },
        editData:{

        }
    };

    //企业创新信息
    $scope.innovationInfo = {
        editType:false,
        data:{

        },
        editData:{

        }
    };

    //纳税地址选择下拉组件
    const payTaxAddressSelect = new Dropdown({
        obj:outer.find('.payTaxAddress-select'),
        list:$scope.config.taxAddTypeList,
        onSelectChange:(current,index)=>{
            $scope.summarizeInfo.editData.payTaxAddress = (index+1)||undefined;
            $scope.$apply();
        }
    });

    //税务信息，年月级联选择
    $scope.dateSelect = new YearMonthSelect({
        obj:outer.find('.date-select'),
        onSelectChange:(year,month)=>{
            if(year !== $scope.config.year){
                $scope.getTaxChartData(year);
            }
            $scope.config.year = year;
            $scope.config.month = month;
            $scope.getTaxInfo();
        },
        yearList:new window.Promise(res=>{
            doRequest({
                url:'label/getDateRange',
                success:(data)=>{
                    if(data.success){
                        const sy = parseInt(data.data);
                        const ny = new Date().getFullYear();
                        res(new Array(ny-sy+1).join(',').split(',').map((v,i)=>{
                            return {
                                name:ny-i+'年',
                                year:ny-i,
                                hasNext:true
                            };
                        }));
                    }
                }
            });
        }),
        activeValue:`${$scope.config.year}年-全年`
    });

    /**
     * 通过标签id获取标签名称
     */
    const _getNameByTagData =(()=> {
        const focusList = window.focusList;
        const industryDic = window.newIndustry.reduce((o,v)=>{
            o = [...o,...v.children];
            return o;
        },[]);
        const layoutDic = window.layoutList.reduce((o,v)=>{
            o = [...o,...v.children];
            return o;
        },[]);
        return (row)=>{
            switch (row.type){
                case '重点关注':{
                    const _row = focusList.find(v=>v.code === row.value);
                    return _row?_row.name:''
                }
                case '产业标签':{
                    const _row = industryDic.find(v=>v.id === row.value);
                    return _row?_row.ysName:''
                }
                case '1所属范围':
                case '2所属范围':
                case '3所属范围':{
                    const _row = layoutDic.find(v=>v.id === row.value);
                    return _row?_row.name:''
                }
                case '1所属范围二级':
                case '2所属范围二级':
                case '3所属范围二级':{
                    return layoutDic.reduce((o,v)=>{
                        if(o) return o;
                        const _row = v.children?v.children.find(v2=>v2.id === row.value):null;
                        if(!_row) return o;
                        o = v.name +'-'+ _row.name;
                        return o;
                    },null) || '';
                }
            }
        };
    })();
    /**
     * 获取企业标签
     */
    $scope.getEntTag =()=> {
        doRequest({
            url:'entFileLabel/getAllEntFileLabel',
            data:{
                eid:$scope.config.eid,
                ts:Date.now()
            },
            success:data=>{
                if(data.success){
                    $scope.config.tagList = $scope.config.tagSorter.reduce((o,v)=>{
                        let _data = data.data[v];
                        if(!Array.isArray(_data) && !_data.value) return o;
                        if(!Array.isArray(_data)) _data = [_data];
                        _data = _data.map((v2)=>{
                            if(!v2.name){
                                v2.name = _getNameByTagData(v2);
                            }
                            return v2;
                        });
                        o = [...o,..._data];
                        return o;
                    },[]).filter(v=>!!v.name);
                    $scope.$apply();
                }
            }
        })
    };
    $scope.getEntTag();

    /**
     * 打开标签管理弹框
     */
    $scope.openTagModal =(()=> {
        const tagModal = new TagModal({});
        const zoneKeys = [
            ['layoutZoneId','layoutTwoZoneId'],
            ['layoutGroupId','layoutTwoGroupId'],
            ['layoutBuildingId','layoutTwoBuildingId']
        ];
        const layoutList = JSON.parse(JSON.stringify(window.layoutList));
        //可选择的企业标签数据，分4类
        tagModal.setTagList([
            {
                name:'重点关注',
                hasSec:false,
                list:[
                    { name:'重点企业',type:'重点关注',value:'Y', db:'entFile' ,key:'majorProjectStatus',isMuti:true },
                    { name:'人才型企业',type:'重点关注',value:'1', db:'entFile' ,key:'labelTalentEnt',isMuti:true },
                    { name:'科技型企业',type:'重点关注',value:'1', db:'entFile' ,key:'labelTechnologyEnt',isMuti:true },
                    { name:'街属企业',type:'重点关注',value:'1', db:'entFile' ,key:'labelStreetEnt',isMuti:true },
                    { name:'区属企业',type:'重点关注',value:'1', db:'entFile' ,key:'labelAreaEnt',isMuti:true },
                    { name:'国高备后企业',type:'重点关注',value:'1', db:'entFile' ,key:'labelHighnewCandidateEnt',isMuti:true },
                    { name:'专利企业',type:'重点关注',value:'1', db:'entFile' ,key:'labelPatentEnt',isMuti:true },
                    ...window.focusList.map(v=>{
                    return {
                        name:v.name,
                        type:'重点关注',
                        value:v.code,
                        db:'entFileEmergentIndustry',
                        key:'code',
                        isMuti:true
                    }
                })]
            },
            {
                name:'办公区域',
                hasSec:false,
                list:[ {name:'区域内办公',key:'workArea',value:1,type:'办公区域',db:'entFile',isMuti:false},{name:'区域外办公',value:2,key:'workArea',type:'办公区域',db:'entFile',isMuti:false} ],
                isMuti:false
            },
            {
                name:'所属范围',
                hasSec:true,
                children:layoutList.map(v=>{
                    return {
                        name:v.name,
                        key:v.type,
                        list:((children)=>{
                            return children.map(v2=>{
                                v2.key = zoneKeys[v2.type-1][0];
                                v2.value = v2.id;
                                v2._type = v2.type;
                                v2.db = 'entFile';
                                v2.type = v2._type+'所属范围';
                                v2.isMuti = false;
                                v2.list = v2.children?v2.children.map(v3=>{
                                    v3.key = zoneKeys[v2._type-1][1];
                                    v3.name = v2.name+'-'+v3.name;
                                    v3.value = v3.id;
                                    v3.db = 'entFile';
                                    v3.type = v2._type+'所属范围二级';
                                    v3.isMuti = false;
                                    return v3;
                                }):[];
                                return v2;
                            });
                        })(v.children)
                    }
                })
            },
            {
                name:'其它标签',
                hasSec:false,
                isMuti:true,
                list:[ { name:'关注企业',key:'buildFileStatus',db:'entFile',type:'其它标签',value:'Y',isMuti:true },{ name:'监控企业',key:'eid',db:'monitorEnt',value:getUrlParam('eid'),type:'其它标签',isMuti:true } ]
            }
        ]);
        return ()=> {
            tagModal.setData({
                list:$scope.config.tagList,
                fn:()=>{
                    tagModal.modalHide();
                },
                title:'企业标签管理',
                addTag:(row,list)=>{
                    doRequest({
                        url:'entFileLabel/addTag',
                        data:{...row,eid:$scope.config.eid,entName:$scope.config.entName },
                        success:()=>{
                            $scope.config.tagList = list;
                            $scope.$apply();
                        }
                    })
                },
                removeTag:(row,list)=>{
                    doRequest({
                        url:'entFileLabel/removeTag',
                        data:{...row,eid:$scope.config.eid,entName:$scope.config.entName },
                        success:()=>{
                            $scope.config.tagList = list;
                            $scope.$apply();
                        }
                    })
                }
            }).modalShow();
        }
    })();

    /**
     * 获取企业基本信息
     */
    $scope.getCommonInfo =()=> {
        doRequest({
            url:'entFile/getEntFileBaseForNew',
            data:{
                eid:$scope.config.eid,
                ts:Date.now()
            },
            success:data=>{
                if(data.success){
                    data.data.regcapcurName = data.data.regcapcurName || '';
                    data.data.regcap = data.data.regcap?(data.data.regcap+(data.data.regcapcurName.indexOf('人民币')>-1?'万元':('万'+data.data.regcapcurName))):'-';
                    $scope.entDetail = data.data;
                    $scope.$apply();
                }else {
                    notification({
                        type:'error',
                        title:'查询错误',
                        msg:'该企业不在企业档案内',
                        time:0,
                        confirmBtn:{
                            show:true,
                            text:'关闭页面',
                            onClick:()=>window.close()
                        }
                    })
                }
            }
        })
    };
    $scope.getCommonInfo();

    /**
     * 获取企业概括信息
     */
    $scope.getEntBasicInfo =()=>{
        doRequest({
            url:'entFileOverView/getEntFileOverViewByEid',
            data:{
                typeFromStatus:1,
                eid:$scope.config.eid,
                ts:Date.now()
            },
            success:(data)=>{
                if(data.success){
                    data.data = data.data || {};
                    for(const i in data.data){
                        if(data.data.hasOwnProperty(i) && i.toLowerCase().indexOf('phone')>-1){
                            data.data[i] = (data.data[i]-0)||'';
                        }
                    }
                    $scope.summarizeInfo.data = data.data;
                    $scope.summarizeInfo.editData = { ...data.data };
                    payTaxAddressSelect.setData(data.data.payTaxAddress?data.data.payTaxAddress-1:-1);
                    $scope.$apply();
                }
            }
        })
    };
    $scope.getEntBasicInfo();
    /**
     * 保存企业概括信息
     */
    $scope.saveBasicInfo =()=> {
        const { id, truePrincipal, truePrincipalPhone, linkMan, linkManPhone, employeeNum, partyNum, lastYearProduction, workAddress, payTaxAddress, publicWeChat, appName, website, mainBusiness, typeFromStatus } = $scope.summarizeInfo.editData;
        doRequest({
            url:'entFileOverView/editEntOverViewById',
            data:{ id, eid:$scope.config.eid, truePrincipal, truePrincipalPhone, linkMan, linkManPhone, employeeNum, partyNum, lastYearProduction, workAddress, payTaxAddress, publicWeChat, appName, website, mainBusiness, typeFromStatus, ts:Date.now() },
            success:(data)=>{
                if(data.success){
                    notification({
                        title:'编辑成功',
                        msg:'企业概括信息编辑成功'
                    });
                    $scope.summarizeInfo.editType = false;
                    $scope.config.editType = false;
                    $scope.$apply();
                    $scope.getEntBasicInfo();
                }else {
                    notification({
                        type:'error',
                        title:'编辑失败',
                        msg:'企业概括信息编辑失败，请稍后重试！'
                    });
                }
            }
        })
    };

    /**
     * 获取企业税务信息
     */
    $scope.getTaxInfo =()=> {
        doRequest({
            url:'entFile/findByEId',
            data:{
                eid:$scope.config.eid,
                nowYear:new Date().getFullYear(),
                nowMonth:new Date().getMonth()+1,
                queryYear:$scope.config.year,
                queryMonth:$scope.config.month,
                ts:Date.now()
            },
            success:(data)=>{
                if(data.code === '0000'){
                    $scope.taxInfo = data.data.uploadTax || {};
                    $scope.$apply();
                }

            }
        })
    };
    $scope.getTaxInfo();

    // 纳税直线图
    const nsChart = echarts.init(document.getElementById('nsChart'));
    nsChart.setOption(lineOption);
    //获取历史纳税信息并绘制折线图
    $scope.getTaxChartData =(year)=>{
        nsChart.showLoading();
        const dateStr = format(year+1+'-'+1+'-01');
        doRequest({
            url:'uploadTax/getChartByEidAndTime',
            data:{
                dateStr,
                str:$scope.config.eid
            },
            success:(data)=>{
                if(data.success){
                    const list = data.data.reverse().map((v={},i)=>{
                        if(year === new Date().getFullYear() && i>=new Date().getMonth()){
                            v.tax = '-';
                        }
                        return v;
                    });
                    nsChart.setOption({
                        xAxis:{
                            data:list.map((v)=>{
                                return v.date
                            })
                        },
                        series:[{
                            data:list.map((v)=>{
                                return v.tax
                            })
                        }]
                    });
                    nsChart.hideLoading();
                }
            }
        })
    };
    $scope.getTaxChartData($scope.config.year);
    //视窗变化时，折线图重新跳转大小
    $(window).on('resize',()=>{
        nsChart.resize();
    });

    /**
     * 获取办公用房信息
     */
    $scope.getWorkPlace =()=> {
        doRequest({
            url:'entOffice/getOfficeDetailByEid',
            data:{
                eid:$scope.config.eid,
                typeFromStatus:1,
                ts:Date.now()
            },
            success:(data)=>{
                if(data.success){
                    $scope.workPlaceInfo.data = data.data;
                    $scope.workPlaceInfo.editData = {...data.data};
                    const useType = $scope.workPlaceInfo.editData.useType?$scope.workPlaceInfo.editData.useType.split(','):[];
                    $scope.workPlaceInfo.editData.useTypeList = userTypeDic.map((v,i)=>{
                        return {
                            name:v,
                            isChecked:useType.indexOf(i+1+'')>-1
                        }
                    });
                    $scope.$apply();
                }
            }
        })
    };
    $scope.getWorkPlace();

    /**
     * 保存办公用房信息
     */
    $scope.saveWorkPlace =()=> {
        $scope.workPlaceInfo.editData.useType = $scope.workPlaceInfo.editData.useTypeList.reduce((o,v,i)=>{
            if(v.isChecked){
                o.push(i+1)
            }
            return o;
        },[]).join(',');
        const { id, useStatus, propertyFrom, propertyPhone, propertyArea, propertyPrice, rentFrom, rentPhone, rentArea, rentPrice, useType } = $scope.workPlaceInfo.editData;
        if(!useStatus){
            return message({
                type:'error',
                msg:'请先选择产权方式'
            })
        }
        const params = useStatus === 1?{ eid:$scope.config.eid, useStatus, propertyFrom, propertyPhone, propertyArea, propertyPrice, useType }:{ eid:$scope.config.eid, useStatus, rentFrom, rentPhone, rentArea, rentPrice, useType };
        doRequest({
            url:'entOffice/saveOrUpdateOfficeById',
            data:{ id, ...params,ts:Date.now()},
            success:(data)=>{
                if(data.success){
                    notification({
                        title:'编辑成功',
                        msg:'企业办公用房信息编辑成功'
                    });
                    $scope.getWorkPlace();
                    $scope.workPlaceInfo.editType = false;
                    $scope.config.editType = false;
                    $scope.$apply();
                }else {
                    notification({
                        type:'error',
                        title:'编辑失败',
                        msg:'企业办公用房信息编辑失败，请稍后重试！'
                    });
                }
            }
        })
    };

    /**
     * 获取创新信息
     */
    $scope.getInnovationInfo =()=> {
        doRequest({
            url:'innovateMessage/getInnovateMessageByEid',
            data:{
                eid:$scope.config.eid,
                typeFromStatus:1,
                ts:Date.now()
            },
            success:(data)=>{
                if(data.success){
                    data.data = data.data || {};
                    $scope.innovationInfo.data = data.data;
                    $scope.innovationInfo.editData = { ...data.data };
                    $scope.$apply();
                }
            }
        })
    };
    $scope.getInnovationInfo();

    /**
     * 保存创新信息
     */
    $scope.saveInnovationInfo =()=> {
        const { talentsImportPlan, marketStatus, zheJiangCenterStatus, countyCenterStatus, countyNewCenterStatus } = $scope.innovationInfo.editData;
        doRequest({
            url:'innovateMessage/editInnovateMessageById',
            data:{ eid:$scope.config.eid, talentsImportPlan, marketStatus, zheJiangCenterStatus, countyCenterStatus, countyNewCenterStatus, ts:Date.now() },
            success:(data)=>{
                if(data.success){
                    notification({
                        title:'编辑成功',
                        msg:'企业创新信息编辑成功'
                    });
                    $scope.getInnovationInfo();
                    $scope.innovationInfo.editType = false;
                    $scope.config.editType = false;
                    $scope.$apply();
                }else {
                    notification({
                        type:'error',
                        title:'编辑失败',
                        msg:'企业创新信息编辑失败，请稍后重试！'
                    });
                }
            }
        })
    };

    //人员信息
    $scope.personInfo = {
        editType:false,
        data:{

        },
        editData:{

        },
        personList:[],
        personListTotal:-1
    };
    /**
     * 获取人员信息
     */
    $scope.getPersonInfo =()=> {
        doRequest({
            url:'talents/getAllTalentsAndNum',
            data:{
                eid:$scope.config.eid
            },
            success:data=>{
                if(data.code === '0000'){
                    $scope.personInfo.personList = data.data.talentsList;
                    $scope.personInfo.personListTotal = data.data.talentsList.length;
                    $scope.personInfo.data = data.data.entTalents || {};
                    $scope.personInfo.editData = { ...$scope.personInfo.data };
                    $scope.$apply();
                }
            }
        })
    };
    $scope.getPersonInfo();
    //保存人员数量信息
    $scope.savePerson =()=>{
        const { id,doctorNum, returneeNum, talentsImportNum, provinceImportNum } = $scope.personInfo.editData;
        doRequest({
            url:'entTalents/insertOneEntTalents',
            data:{ id,eid:$scope.config.eid,doctorNum, returneeNum, talentsImportNum, provinceImportNum },
            success:(data)=>{
                if(data.code === '0000'){
                    notification({
                        title:'编辑成功',
                        msg:'企业人才信息编辑成功'
                    });
                    $scope.getPersonInfo();
                    $scope.personInfo.editType = false;
                    $scope.config.editType = false;
                    $scope.$apply();
                }else {
                    notification({
                        type:'error',
                        title:'编辑失败',
                        msg:'企业人才信息编辑失败，请稍后重试！'
                    });
                }
            }
        })
    };

    //走访信息
    $scope.visitList = [];
    $scope.visitListTotal = -1;
    $scope.nextVisit = {};
    //获取走访信息
    $scope.getVisitList =()=> {
        doRequest({
            url:'interview/interviewRecordShow',
            data:{
                eid:$scope.config.eid
            },
            success:(data)=>{
                if(data.code === '0000'){
                    $scope.visitList = (data.data.interviewList || []).map(v=>{
                        v.uploadImgs = v.uploadImgs?v.uploadImgs.split(',') : [];
                        v.goPerson = Array.isArray(v.goPerson)?v.goPerson.join(','):'';
                        return v;
                    });
                    $scope.visitListTotal = $scope.visitList.length;
                    $scope.nextVisit = data.data.interviewTask || {};
                    $scope.$apply();
                }
            }
        })
    };
    $scope.getVisitList();

    //新增人员弹框
    $scope.addPersonModal = new AddPersonModal({});

    //新增人员
    $scope.addNewPerson = function () {
        $scope.addPersonModal.setData({
            fn:({ name,position,phone,isgd })=>{
                doRequest({
                    url:'talents/insertOneTalents',
                    data:{
                        eid:$scope.config.eid,
                        username:name,
                        job:position,
                        phone,
                        iSstockholder:isgd
                    },
                    success:data=>{
                        if(data.code === '0000'){
                            message({
                                type:'success',
                                msg:'添加企业人才成功'
                            });
                            $scope.addPersonModal.modalHide();
                            $scope.getPersonInfo();
                        }
                    }
                });
            }
        }).modalShow();
    };

    $scope.confirmModal = new ConfirmModal2({});

    //删除人员
    $scope.deletePerson = function (row) {
        $scope.confirmModal.setData({
            title:'删除企业人才',
            msg:`确认是否删除${row.username}？`,
            confirmFn:()=>{
                $scope.confirmModal.modalHide();
                doRequest({
                    url:'talents/deleteOneTalents',
                    data:{
                        id:row.id
                    },
                    success:data=>{
                        if(data.code === '0000'){
                            message({
                                type:'success',
                                msg:'企业人才删除成功'
                            });
                            $scope.addPersonModal.modalHide();
                            $scope.getPersonInfo();
                        }
                    }
                });
            }
        }).modalShow();
    };
    //编辑人员
    $scope.editPerson = function (row) {
        const { id,username:name,job:position,phone,iSstockholder:isgd } = row;
        $scope.addPersonModal.setData({
            fn:({ name,position,phone,isgd })=>{
                doRequest({
                    url:'talents/insertOneTalents',
                    data:{
                        eid:$scope.config.eid,
                        id,
                        username:name,
                        job:position,
                        phone,
                        iSstockholder:isgd
                    },
                    success:data=>{
                        if(data.code === '0000'){
                            message({
                                type:'success',
                                msg:'编辑企业人才成功'
                            });
                            $scope.addPersonModal.modalHide();
                            $scope.getPersonInfo();
                        }
                    }
                });
            },
            data:{name,position,phone,isgd}
        }).modalShow();
    };
    //多图预览组件
    $scope.mutiImgViewer = new MutiImgViewer();
    //多图预览
    $scope.showImgs = function (imgs) {
        $scope.mutiImgViewer.show(imgs)
    };
    //跳转至简查oem
    $scope.jumpToMore =()=> {
        window.open( `${window.basePath}cysAuth/jumpToCysQuery?entName=${$scope.config.entName}&eid=${$scope.config.eid}`);
    };
    //将企业移除，不在企业档案内显示
    $scope.deleteEnt =()=> {
        $scope.confirmModal.setData({
            title:'移除企业',
            msg:`是否将${$scope.config.entName}从企业档案移除？`,
            confirmFn:()=>{
                doRequest({
                    url:'entFile/deleteEntFile',
                    data:{id:$scope.entDetail.id},
                    success:(data)=> {
                        if(data.success){
                            notification({
                                title:'移除企业成功',
                                msg:$scope.config.entName+' 已被成功移除',
                                confirmBtn:{
                                    show:true,
                                    text:'返回企业档案列表',
                                    onClick:()=>{
                                        window.location.href = window.basePath+'entFile/entList'
                                    }
                                }
                            });
                            setTimeout(()=>{
                                window.location.href = window.basePath+'entFile/entList'
                            },5000);
                            $scope.confirmModal.modalHide();
                        }
                    }
                })
            }
        }).modalShow();
    }

}]).filter('toHtmlStr',function () {
    return function (input,p='-') {
        const _s = toHtmlStr(input,p);
        return _s === ''?p:_s;
    }
}).filter('userType',function () {
    return function (input) {
        if(!input) return '-';
        return input.split(',').map((v)=>{
            return userTypeDic[v-1] || ''
        }).join(',');
    }
});

