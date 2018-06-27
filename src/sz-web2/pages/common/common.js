/**
 * 单页应用的页面切换，需要配合特定的html格式实现
 * @param id
 */
export const switchPage =(id)=> {
    $('.muti-page-section').removeClass('active');
    $('#'+id).addClass('active');
    $('a[data-page="'+ id +'"]').addClass('active')
};
/**
 * 头部展示一个提示
 */
export const showHeaderTips =(()=> {
    const o = $('.header-c .tips-c');
    return (msg)=>{
        o.html(`<i class="fa fa-fw fa-volume-up"></i>${msg}`);
    }
})();