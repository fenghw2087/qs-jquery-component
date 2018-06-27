import './less/nav.less';
import setLocalStorage from "../../../util/lib/setLocalStorage";
import doRequest from "../../../util/lib/doRequest";
// 过滤type=3的新版权限
const navList = (window.navList || []).filter(v=>v.type-0 === 3);

// 如果旧版权限包含区域概览，则生成一个标识，允许用户切换到2.0版本页面的大屏
export const hasOld = (window.navList || []).some(v=>v.description === '区域概览');
$('.switch-2-old').toggle(hasOld);

// 将权限数组处理为权限字典，以description为key
const navDic = navList.reduce((o,v)=>{
    v.resUrl = v.resUrl.substr(1);
    o[v.description] = v;
    return o;
},{});

//当前页面路径
const path = window.location.pathname;

/**
 * 导出导航数据
 * @type {*[]}
 */
export const nav = [
    {
        name:'平台首页',
        icon:'icon-pingtaishouye',
        url:navDic['平台首页']?navDic['平台首页'].resUrl:'',
        active:navDic['平台首页']?navDic['平台首页'].cUrls.indexOf(path)>-1:false,
        hide:true,//是否在首页大图标隐藏
    },{
        name:'企业档案',
        icon:'icon-qiyedangan',
        icon2:'icon-qiyedangan1',
        url:navDic['企业档案']?navDic['企业档案'].resUrl:'',
        active:navDic['企业档案']?navDic['企业档案'].cUrls.indexOf(path)>-1:false,
        des:'掌握企业经营状况，构建企业经济画像，实现一企一档全面监管'
    },{
        name:'精准招商',//导航名称
        icon:'icon-jingzhunzhaoshang',//导航小图标
        icon2:'icon-jingzhunzhaoshang1',//导航大图标
        url:navDic['精准招商']?navDic['精准招商'].resUrl:'',//用户是否拥有此导航权限
        active: navDic['精准招商']?navDic['精准招商'].cUrls.indexOf(path)>-1:false,//当前页面是否在此导航下
        des:'全国范围大数据招商 多维度标签精准排查',//首页导航块的描述文案
        size:100,//大图标大小
        lineHeight:70
    },{
        name:'政企服务',
        icon:'icon-zhengqifuwu',
        icon2:'icon-zhengqifuwu1',
        url:navDic['政企服务']?navDic['政企服务'].resUrl:'',
        active:navDic['政企服务']?navDic['政企服务'].cUrls.indexOf(path)>-1:false,
        des:'企业信息在线填报，企业服务线下走访，实现政企服务无缝对接',
        size:100,
        lineHeight:80
    },{
        name:'动态监控',
        icon:'icon-dongtaijiankong',
        icon2:'icon-dongtaijiankong1',
        url:navDic['动态监控']?navDic['动态监控'].resUrl:'',
        active:navDic['动态监控']?navDic['动态监控'].cUrls.indexOf(path)>-1:false,
        des:'基于人工智能技术，针对税收工商舆情信息，实现企业动态分析研判',
        size:90
    },{
        name:'产业布局',
        icon:'icon-chanyebuju',
        icon2:'icon-chanyebuju1',
        url:navDic['产业布局']?navDic['产业布局'].resUrl:'',
        active:navDic['产业布局']?navDic['产业布局'].cUrls.indexOf(path)>-1:false,
        des:'区域经济指标分析，构建经济评价体系，实现区域经济量化评估'
    },{
        name:'政策文库',
        icon:'icon-zhengcewenku',
        icon2:'icon-zhengcewenku1',
        url:navDic['政策文库']?navDic['政策文库'].resUrl:'',
        active:navDic['政策文库']?navDic['政策文库'].cUrls.indexOf(path)>-1:false,
        des:'以政策研究为基础，为经济决策提供依据，提升政府软硬实力',
        size:100
    },{
        name:'数据中心',
        icon:'icon-shujuzhongxin',
        url:navDic['数据中心']?navDic['数据中心'].resUrl:'',
        active:navDic['数据中心']?navDic['数据中心'].cUrls.indexOf(path)>-1:false,
        hide:true
    },{
        name:'系统设置',
        icon:'icon-xitongshezhi',
        url:navDic['系统设置']?navDic['系统设置'].resUrl:'',
        active:navDic['系统设置']?navDic['系统设置'].cUrls.indexOf(path)>-1:false,
        hide:true,
        children:[
            {
                name:'角色设置',
                path:`${window.basePath}setting/setting`
            },{
                name:'账号设置',
                path:`${window.basePath}setting/account`
            },{
                name:'动态监控设置',
                path:`${window.basePath}setting/monitor`,
                hide:!navDic['动态监控']
            },{
                name:'产业布局设置',
                path:`${window.basePath}setting/layout`,
                hide:!navDic['产业布局']
            },{
                name:'企业标签设置',
                path:`${window.basePath}setting/entTag`
            },{
                name:'企业档案设置',
                path:`${window.basePath}setting/entFile`
            }
        ]
    }
];

//导出用户是否具有监控权限
export const hasMonitor = !!nav[4].url;
if(!hasMonitor){
    //移除监控消息相关
    $('.monitor-type').remove();
}

const $body = $('body');
$body.on('click','.toggle-slider',function () {
    $body.toggleClass('active');
    if($body.hasClass('active')){
        setLocalStorage('slider',2)
    }else {
        setLocalStorage('slider',1)
    }
}).on('click','.switch-msg',function () {
    const index = $(this).index();
    $('.msg-list-c').toggleClass('type-monitor',index === 0).toggleClass('type-sys',index === 1);
}).on('click','.switch-2-old',function () {
    window.open(window.basePath+'user/intoIndex');
}).on('click','.l-t-logo',function () {
    window.location.href = window.basePath + nav[0].url;
});

//渲染左侧导航
$('.nav-list-c').html(nav.map(v=>{
    return v.url?`<a class="${v.active?'active':''}" href="${window.basePath+v.url}"><div class="nav-icon-c"><i class="iconfont ${v.icon}"></i></div>${v.name}</a>`:''
}));

//系统消息接口
export const getMessage =(pageNum=1,pageSize=5)=> {
    return new window.Promise(res=>{
        doRequest({
            url:'user/message/getMessageList',
            data:{
                pageSize,
                pageNum,
                ts:Date.now()
            },
            success:data=>{
                if(data.success){
                    const list = data.data.data.results || [];
                    const noRead = data.data.data.totalUnread;
                    res(noRead);
                    $('.switch-msg.sys-type .new-msg2').text(noRead>99?'99+':noRead).toggle(noRead>0);
                    $('.msg-list.sys-type').html(list.map(v=>`<a href="${window.basePath}${ v.msgId?`user/message/detailInfo?msgId=${v.msgId}`:`user/message/sysList` }" class="msg-item ${v.isRead-0!==0?'is-read':''}">${v.title}</a>`))
                }
            }
        })
    });
};
//监控消息接口
const getMonitorMsg =()=> {
    return new window.Promise(res=>{
        if(!hasMonitor) return res(0);
        doRequest({
            url:'monitorWarning/getMonitorMessage',
            data:{
                pageSize:5,
                pageNum:1,
                ts:Date.now()
            },
            success:data=>{
                if(data.success){
                    const list = data.data.results || [];
                    const noRead = data.data.totalUnread;
                    res(noRead);
                    $('.switch-msg.monitor-type .new-msg2').text(noRead>99?'99+':noRead).toggle(noRead>0);
                    $('.msg-list.monitor-type').html(list.map(v=>`<a href="${window.basePath}user/message/monitorList" class="msg-item ${v.isRead === 2?'is-read':''}">${v.isRead === 2?'【已读】':'【未读】'}${v.item} ${v.entName}</a>`))
                }
            }
        })
    })
};
//获取系统消息闭包函数，每180s轮询，单页面最多轮询10次
const getMsg = (()=> {
    let times = 0;
    return ()=>{
        window.Promise.all([getMessage(),getMonitorMsg()]).then(data=>{
            const noRead = data[0]+data[1];
            $('.new-msg').text(noRead>99?'99+':noRead).toggle(noRead>0);
            if(hasMonitor && data[0]){
                $('.msg-list-c').addClass('type-monitor');
            }else {
                $('.msg-list-c').addClass('type-sys');
            }
            times++;
            if(times<10) setTimeout(getMsg,180000);
        });
    }
})();
//非登录页，请求消息
if($('.new-msg').length){
    getMsg();
}
