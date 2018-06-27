import './nav.css';
import navList from './navList';
import AutoComplete from "../../component/autoComplete/autoComplete";

$('#navC').html(`<li class="first-li"><a class="${ window.location.pathname !== '/'?'':'active' }" href="/">介绍</a></li>
<li class="first-li">
<a href="${ '/component'+navList[0].url }" class="${ window.location.pathname === '/'?'':'active' }">组件</a>
<ul class="sec-ul">${
    navList.map((v,i)=>{
        return `<li class="sec-li"><a class="${ '/component'+v.url === window.location.pathname?'active':'' }" href="${'/component'+v.url}">${v.name}</a></li>`
    }).join('')
    }</ul></li>`);

export const _search =(val)=> {
    val = val.toLowerCase();
    return new window.Promise((resolve)=>{
        const _list = navList.filter((v)=>{
            let _str = '';
            for(const i in v){
                if(v.hasOwnProperty(i)){
                    _str+=v[i].toLowerCase();
                }
            }
            return _str.indexOf(val)>-1
        });
        resolve(_list.splice(0,10));
    });
};

new AutoComplete({
    input:$('#headSearch'),
    getData:(name)=>{
        return _search(name)
    },
    formatList:(data)=>{
        return data
    },
    delay:200,
    renderLi:row=>row.name,
    onSelect:(current)=>{
        window.location.href = '/component'+current.url;
    },
    keyTigger:false
});

const c = navList.find((v)=>{
    return window.location.pathname === '/component'+v.url
});
if(c){
    $('.content-title').text(c.name);
    $('.content-des').text(c.description);
}
