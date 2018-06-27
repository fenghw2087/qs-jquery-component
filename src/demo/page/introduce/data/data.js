export const data = new Array(30).join(',').split(',').map((v,i)=>{
    const keynum = Math.ceil(Math.random()*3)+2;
    const _keys = new Array(keynum).join(',').split(',').map((v2,i2)=>{
        return 'key'+(i+1)+'-'+(i2+1)
    });
    const _options = _keys.reduce((o,v2,i2)=>{
        o[v2] = '名称'+(i+1)+'-'+(i2+1);
        return o;
    },{});
    const entNum = Math.ceil(Math.random()*5)+2;
    const _list = new Array(entNum).join(',').split(',').map((v2,i2)=>{
        const deltaiNum = Math.ceil(Math.random()*6)-1;
        const _detail = new Array(deltaiNum).join(',').split(',').map((v3,i3)=>{
            return _keys.reduce((o,v4,i4)=>{
                o[v4] = 'data'+(i+1)+'-'+(i2+1)+'-'+(i3+1)+'-'+(i4+1);
                return o;
            },{});
        });
        return {
            entName: "企业名称"+(i+1)+'-'+(i2+1),
            entId: "efqefwefwef"+(i+1)+'-'+(i2+1),
            isCompany: "Y",
            detail: deltaiNum?_detail:[],
            totalRecord:deltaiNum === 5? (5+Math.ceil(Math.random()*20)):deltaiNum
        }
    });
    return {
        type: "type"+(i+1),
        keys: _keys,
        options: _options,
        list: _list
    }
});

