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
import Loess from 'loess'

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
        right: 70,
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
    computeLoess (series) {
      // filter events, loess doesn't do missings
      const validEvents = _.filter(
        series,
        'value'
      )
      // this creates a sample x sample size matrix, limit number of samples by resampling to 200 val max
      const sampledEvents = _.pullAt(
        validEvents,
        _.range(0, validEvents.length, Math.ceil(validEvents.length / 200))
      )

      // create equations
      const y = _.map(sampledEvents, x => x.value)
      const x = _.map(sampledEvents, x => x.t.getTime())
      // compute loess
      const options = { span: 0.5, band: 0.8, degree: 1 }
      const loess = new Loess({ x, y }, options)
      const fit = loess.predict()
      // extract confidence bands
      const upperLimit = fit.fitted.map((yhat, idx) => yhat + fit.halfwidth[idx])
      const lowerLimit = fit.fitted.map((yhat, idx) => yhat - fit.halfwidth[idx])

      const bands = _.map(loess.x[0], (t, i) => {
        return {
          t: new Date(t),
          fit: fit.fitted[i],
          upper: upperLimit[i],
          lower: lowerLimit[i]
        }
      })

      // return results
      return {
        bands,
        loess,
        fit
      }
    },
    updateChart (station) {
      let margin = this.margin
      let height = this.height
      let width = this.width

      let psmsl = station.properties.series.events
      let gmsl = station.properties.gmsl

      let x = d3.scaleTime()
        .domain(
          d3.extent(psmsl.concat(gmsl), d => d.t)
        )
        .range(
          [margin.left, width - margin.right]
        )
      let y = d3.scaleLinear()
        .domain([
          d3.min(psmsl.concat(gmsl), d => d.value),
          d3.max(psmsl.concat(gmsl), d => d.value)
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
            .text(`${station.properties.series.observationType.quantity} [${station.properties.series.observationType.unit}]`)

        )

      let line = d3.line()
        .defined(d => !_.isNil(d.value))
        .x(d => x(d.t))
        .y(d => y(d.value))
        .curve(d3.curveCatmullRom.alpha(0.5))

      let svg = d3.select(this.$el.querySelector('svg.chart'))
      svg.selectAll('*').remove()

      svg.append('g')
        .call(xAxis)

      svg.append('g')
        .call(yAxis)

      // path
      let g = svg.append('g')
        .attr('fill', 'none')
        .attr('stroke-width', 1.5)
        .attr('stroke-opacity', 0.5)
        .attr('stroke-linejoin', 'round')
        .attr('stroke-linecap', 'round')

      // add path
      g
        .selectAll('path')
        .data(
          [
            psmsl,
            gmsl
          ]
        )
        .enter()
        .append('path')
        .attr('stroke', (d, i) => ['steelblue', 'white'][i])
        .attr('d', d => {
          return line(d)
        })

      // add label
      g
        .selectAll('text')
        .data(
          [
            psmsl,
            gmsl
          ]
        )
        .enter()
        .append('text')
        .attr('class', 'label')
        .attr('dx', '.35em')
        .attr(
          'transform',
          (d, i) => 'translate(' + x(d[d.length - 1].t) + ',' + y(d[d.length - 1].value) + ')'
        )
        .attr('fill', (d, i) => ['steelblue', 'white'][i])
        .text((d, i) => ['psmsl', 'gmsl'][i])

      // take about 200 samples
      const psmslBands = this.computeLoess(psmsl).bands
      // // TODO: ake 1 every 10 values of gmsl
      const gmslBands = this.computeLoess(gmsl).bands

      let area = d3.area()
        .x(d => x(d.t))
        .y0(d => y(d.lower))
        .y1(d => y(d.upper))

      // add confidence bands
      svg.append('g')
        .attr('class', 'ci')
        .selectAll('path')
        .data([
          psmslBands,
          gmslBands
        ])
        .enter()
        .append('path')
        .attr('fill', (d, i) => ['steelblue', 'white'][i])
        .attr('d', area)
    }

  }
}
</script>
<style>
.chart {
  width: 100%;
  height: 100%;
}
.ci {
  fill-opacity: 0.3;
}
.label {
  text-anchor: middle;
}
</style>
