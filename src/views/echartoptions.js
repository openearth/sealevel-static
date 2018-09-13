// echarts options for time series charts, see: https://ecomfe.github.io/echarts-examples/public/index.html

import 'echarts/lib/chart/line'
import 'echarts/lib/component/title'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/axisPointer'
import 'echarts/lib/component/dataZoom'

var eChartOptions = {
  title: {
    text: '',
    subtext: 'note: loading of nasa data takes +/- 30 sec',
    x: 'center'
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      animation: false
    }
  },
  axisPointer: {
    link: {xAxisIndex: 'all'}
  },
  legend: {
    data: ['psmsl', 'nasa'],
    x: 'left'
  },
  dataZoom: [
    {
      show: true,
      realtime: true,
      start: 50,
      end: 100,
      xAxisIndex: [0]
    },
    {
      type: 'inside',
      realtime: true,
      start: 50,
      end: 100,
      xAxisIndex: [0]
    }
  ],
  xAxis: { type: 'time' },
  yAxis: { type: 'value' },
  series: [
    { name: 'psmsl', data: [], type: 'line' },
    { name: 'nasa', data: [], type: 'line' }
  ]
}

export {
  eChartOptions
}
