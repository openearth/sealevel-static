<template>
  <!-- define viewBox so we can maintain aspect -->
  <div class="chart">
    <h3 class="headline" v-if="station">{{ station.properties.name | startCase }}</h3>

    <v-progress-circular
      v-else
      indeterminate
      ></v-progress-circular>
    <svg class="chart" viewBox="0 0 600 300" v-show="station" ></svg>

</div>
    </template>
<script>
import Vue from 'vue'
import * as d3 from 'd3'
import _ from 'lodash'

Vue.filter('startCase', x => {
  let result = _.startCase(_.lowerCase(x))
  return result
})

export default {
  props: {
    station: {
      // timeseries object
      type: Object
    }
  },
  watch: {
    station (station) {
      if (_.isNil(station)) {
        return
      }
      this.updateChart(station)
    }
  },
  data () {
    return {
      margin: {
        left: 30,
        right: 30,
        top: 30,
        bottom: 30
      },
      width: 600,
      height: 300
    }
  },
  mounted () {
  },
  methods: {
    updateChart (station) {
      let margin = this.margin
      let height = this.height
      let width = this.width

      let events = station.properties.series.events
      let gmsl = station.properties.gmsl

      let x = d3.scaleTime()
        .domain(
          d3.extent(events.concat(gmsl), d => d.t)
        )
        .range(
          [margin.left, width - margin.right]
        )
      let y = d3.scaleLinear()
        .domain([
          d3.min(events, d => d.value),
          d3.max(events, d => d.value)
        ])
        .nice(5)
        .range([height - margin.bottom, margin.top])

      let xAxis = g => g
        .attr('transform', `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0))

      let yAxis = g => g
        .attr('transform', `translate(${margin.left},0)`)
        .call(d3.axisLeft(y))
        .call(
          g => g.select('.tick:last-of-type text')
            .clone()
            .attr('x', 3)
            .attr('text-anchor', 'start')
            .attr('font-weight', 'bold')
            .text(station.properties.series.observationType.quantity)

        )

      let line = d3.line()
        .defined(d => !_.isNil(d.value))
        .x(d => x(d.t))
        .y(d => y(d.value))

      let svg = d3.select(this.$el.querySelector('svg.chart'))
      svg.selectAll('*').remove()

      svg.append('g')
        .call(xAxis)

      svg.append('g')
        .call(yAxis)

      // path
      svg.append('g')
        .attr('fill', 'none')
        .attr('stroke-width', 1.5)
        .attr('stroke-opacity', 0.5)
        .attr('stroke-linejoin', 'round')
        .attr('stroke-linecap', 'round')
        .selectAll('path')
        .data(
          [
            events,
            gmsl
          ]
        )
        .enter()
        .append('path')
        .attr('stroke', (d, i) => ['steelblue', 'white'][i])
        .attr('d', d => {
          return line(d)
        })
    }
  }
}
</script>
<style>
.chart {
  width: 100%;
  height: 100%;
}
</style>
