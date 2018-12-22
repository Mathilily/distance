import * as echarts from '../../ec-canvas/echarts';

function initChart(canvas, width, height) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height
  })
  canvas.setChart(chart);
 //图表函数
  var option = {
    backgroundColor: "#ffffff",
    color: ["#37A2DA", "#32C5E9", "#67E0E3"],
    series: [{
      name: '业务指标',
      type: 'gauge',
      detail: {
        formatter: '{value}%'
      },
      axisLine: {
        show: true,
        lineStyle: {
          width: 30,
          shadowBlur: 0,
          color: [
            [0.3, '#67e0e3'],
            [0.7, '#37a2da'],
            [1, '#fd666d']
          ]
        }
      },
      
      data: [{
        value: 120,
        name: '水位占比',
      }],
    
    }]
  };

  chart.setOption(option, true);
  clock(0,chart,option)
}
//计时器
function clock(timer,chart,option){
  if(timer>1200){
    wx.showModal({
      title: '还没装满？',
      content: '一分钟了，水还没装满。。。有毒吧！！！',
    })
    return;
  }
  else{
    timer++
    console.log(timer)
    setTimeout(
      function(){
        wx.request({
          //从OneNet上请求数据并处理
          url: 'http://api.heclouds.com/devices/503175816/datapoints?datastream_id=Distance',
          header: {
            'api-key': 'Ib=Oc6lBrBnpb2iswDaRfl9m8cM='
          },
          success: function (res) {
            var value = res.data.data.datastreams[0].datapoints[0].value
            option.series[0].data[0].value = (value/18)*100
            //“18”是水瓶高度，根据不同型号可进行修改，初始距离由超声波传感器测出
            chart.setOption(option, true);
            if (option.series[0].data[0].value>20)//水位低于80%时
            {
              clock(timer, chart, option);
            }
            else
            {
              wx.showModal({
                //水快要充满水瓶时警示
                title: '水快满啦',
                content: '当前水位为'+value+",可以把卡拿出来啦",
              })
            }
          }
        })
      },100
    )
  }
}
Page({
  data: {
    ec: {
      onInit: initChart
    }
  }
});
