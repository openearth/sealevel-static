import {
  bus
} from '@/event-bus.js'

import 'vuetify/dist/vuetify.min.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import 'mapbox-gl/dist/mapbox-gl.css'

import Vue from 'vue'
import Vuetify from 'vuetify'
import Vue2Mapbox from 'vue2mapbox-gl'
import mapboxgl from 'mapbox-gl'
import MapLayers from '../components/VMapLayers'
import LayerControl from '../components/VLayerControl'

import ECharts from 'vue-echarts/components/ECharts'
import {
  eChartOptions
} from './echartoptions.js'

Vue.use(Vuetify)
Vue.use(Vue2Mapbox)

// timeseries data sources
const psmslUrl = 'https://storage.googleapis.com/slr/psmsl/'
const nasaUrl = 'http://hydro-engine.appspot.com/get_sea_surface_height_time_series'

export default {
  name: 'home',
  data () {
    return {
      map: null,
      layers: [],
      drawer: true,
      expand: 0,
      popup: null,
      loading: 0,
      psmslData: {},
      nasaData: {},
      chartOptions: eChartOptions,
      items: [
        { icon: 'trending_up', text: 'Trends', public: true, route: 'trends' },
        { icon: 'subscriptions', text: 'Animations', public: true, route: 'animations' },
        { icon: 'featured_play_list', text: 'Reports', public: false, route: 'reports' },
        { icon: 'alarm', text: 'Signals', public: false, route: 'signals' },
        { icon: 'business', text: 'Cost estimates', public: false, route: 'cost' }
      ]
    }
  },
  watch: {
    // respond to asynch loading of timeseries
    psmslData: function (value) {
      var data = []
      value.events.forEach(event => {
        data.push([
          event.timeStamp.substring(0, 10),
          (event.value) ? event.value / 1000.0 : null
        ])
      })
      this.chartOptions.series[0].data = data
      console.log(`PSMSL data: ${value.events.length} months`)
    },
    nasaData: function (value) {
      var data = []
      for (var i = 0; i < value.times.length; i++) {
        data.push([
          new Date(value.times[i]).toISOString().substring(0, 10),
          value.values[i]
        ])
      }
      this.chartOptions.series[1].data = data
      console.log(`NASA data: ${value.times.length} months`)
    },
    // wait cursor while loading
    loading: function (value) {
      var cursor = (value > 0) ? 'wait' : 'default'
      document.body.style.cursor = cursor
      this.map.getCanvas().style.cursor = cursor
      this.$refs.popup.style.cursor = cursor
      if (value < 0 || value > 2) {
        this.loading = 0
      }
    }
  },
  mounted () {
    this.map = this.$refs.map.map
    this.getMarker('marker')

    bus.$on('add-layer', (layer) => {
      this.layers.push(layer)
      if (layer.layerType === 'gee') {
        this.getGeeTileSet(layer)
      }
    })

    // Change pointer on hover
    this.map.on('mousemove', (e) => {
      if (!this.loading) {
        this.map.getCanvas().style.cursor = ''
        var features = this.map.queryRenderedFeatures(e.point)
        if (features && features.length > 0) {
          var feature = features.find(feature => feature.layer.id.includes('stations'))
          if (feature) {
            this.map.getCanvas().style.cursor = 'pointer'
          }
        }
      }
    })

    // click to query time series
    this.map.on('click', (e) => {
      if (this.popup) {
        // close popup
        this.popup.remove()
        this.popup = null
      } else {
        // nasa data from gee ?
        this.getNasaData(e.lngLat.lng, e.lngLat.lat)

        // tide station data ?
        var features = this.map.queryRenderedFeatures(e.point)
        if (features && features.length > 0) {
          var feature = features.find(feature => feature.layer.id.includes('stations'))
          this.getPsmslData(feature)
        }

        // open the popup
        this.popupChart(e.lngLat)
      }
    })
  },
  methods: {
    // fetch tileset url for GEE layer and add it as layer to MapBox
    getGeeTileSet (layer) {
      fetch(layer.serviceUrl).then((response) => {
        return response.json().then((result) => {
          var tileset = {
            id: layer.id,
            type: 'raster',
            source: {
              type: 'raster',
              tiles: [result.url],
              tileSize: 256
            }
          }
          layer.data = [tileset]
          this.map.addLayer(tileset)
        })
      })
    },

    // fetch PSMSL time series data from google storage
    getPsmslData (feature) {
      if (feature) {
        this.loading++
        var url = psmslUrl + feature.properties.rlr_monthly_url
        fetch(url)
          .then((response) => {
            this.loading--
            return response.text()
          })
          .then((text) => {
            // workaround: json contains invalid NaN values
            this.psmslData = JSON.parse(text.replace(/\bNaN\b/g, 'null'))
          })
          .catch((error) => {
            console.log(`Error loading PSMSL time series data: ${error.message}`)
            this.loading = 0
          })
      }
    },

    // fetch NASA time series data from hydro engine
    getNasaData (lng, lat) {
      this.loading++
      var request = JSON.stringify({
        region: {
          type: 'Point',
          coordinates: [ lng, lat ]
        }
      })
      fetch(nasaUrl, {
        method: 'POST',
        body: request,
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then((response) => {
          this.loading--
          return response.json()
        })
        .then((json) => {
          this.nasaData = json
        })
        .catch((error) => {
          console.log(`Error loading NASA time series data: ${error.message}`)
          this.loading = 0
        })
    },

    // load marker icon from image
    getMarker (name) {
      this.map.loadImage(`images/${name}.png`, (error, image) => {
        if (error) throw error
        this.map.addImage(name, image)
      })
    },

    // display popup with time series chart
    popupChart (lngLat) {
      if (!this.popup) {
        var self = this
        this.popup = new mapboxgl.Popup()
        this.popup.setDOMContent(this.$refs.popup)
        this.popup.setLngLat(lngLat)
        this.popup.addTo(this.map)
        this.popup.on('close', (e) => {
          self.popup = null
        })
      }
    }
  },

  components: {
    'v-map-layers': MapLayers,
    'v-layer-control': LayerControl,
    'v-chart': ECharts
  }
}
