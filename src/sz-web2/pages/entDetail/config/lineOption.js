const lineOption = {
    backgroundColor:'transparent',
    color: ['rgba(17,137,255,1)'],
    tooltip: {trigger: 'axis'},
    title: {
        show: false
    },
    grid: {
        left: 0,
        right: 40,
        top: 15,
        bottom: 0,
        containLabel: true
    },
    xAxis: {
        type: 'category',
        boundaryGap: false,
        axisTick:{show:true},
        axisLine:{
            show:true,
            lineStyle:{color:'#ccc'}
        },
        axisLabel:{
            textStyle:{color:'#85898b'}
        }
    },
    yAxis: {
        axisLine:{
            show:true,
            lineStyle:{color:'#ccc'}
        },
        axisLabel:{
            textStyle:{color:'#85898b'}
        },
        splitLine:{show: false}//网格线
    },
    series: [
        {
            name:'',
            type:'line',
            smooth:false,
            areaStyle: {
                normal: {
                    color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [{offset: 0, color: 'rgba(17, 137, 255, 0.8)'},
                            {offset: 0.2, color: 'rgba(17, 137, 255, 0.6)'},
                            {offset: 0.3, color: 'rgba(17, 137, 255, 0.4)'},
                            {offset: 0.8, color: 'rgba(17, 137, 255, 0.2)'},
                            {offset: 1, color: 'rgba(17, 137, 255, 0)'}]
                    }
                }
            },
            lineStyle:{
                normal:{
                    width:1
                }
            },
            symbol: 'emptyCircle',
            symbolSize:4,
            showSymbol:false,
            itemStyle: {
                normal: {
                    borderColor: 'rgba(105,165,255,0.2)',
                    borderWidth: 1 // 标注边线线宽，单位px，默认为1
                }
            },
            data:[],
            label: {
                normal: {show: true, position: 'top'}//值显示
            }
        }
    ]
};

export default lineOption;