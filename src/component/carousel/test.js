import Carousel from './carousel'

$('body').append('<div id="test"></div>');
$('#test').html([1,2,3,4,5,6,7,8].map((v)=>{
    return `<div class="section">${v}</div>`
}));

new Carousel({
    outer:$('#test'),
    autoChange:true,
    during:5,
    hasSidePager:false
});