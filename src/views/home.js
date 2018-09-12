import {
  bus
} from '@/event-bus.js'

import 'vuetify/dist/vuetify.min.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import 'mapbox-gl/dist/mapbox-gl.css'

import Vue from 'vue'
import Vuetify from 'vuetify'
import Vue2Mapbox from 'vue2mapbox-gl'
import MapLayers from '../components/VMapLayers'
import LayerControl from '../components/VLayerControl'

Vue.use(Vuetify)
Vue.use(Vue2Mapbox)

// timeseries data sources
const psmslUrl = 'https://storage.googleapis.com/slr/psmsl/'
const nasaUrl = 'http://hydro-engine.appspot.com/get_sea_surface_height_time_series'

// @ is an alias to /src
export default {
  name: 'home',
  data () {
    return {
      map: null,
      layers: [],
      drawer: true,
      expand: 0,
      popup: false,
      loading: 0,
      psmslData: {},
      nasaData: {},
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
      console.log(`PSMSL data: ${value.events.length} months`)
    },
    nasaData: function (value) {
      console.log(`NASA data: ${value.times.length} months`)
    },
    loading: function (value) {
      this.map.getCanvas().style.cursor = (value > 0) ? 'wait' : 'default'
      if (value < 0) {
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
          var feature = features.find(feature => feature.layer.id.includes('gages'))
          if (feature) {
            this.map.getCanvas().style.cursor = 'pointer'
          }
        }
      }
    })

    // click to query time series
    this.map.on('click', (e) => {
      // gaging station data ?
      var features = this.map.queryRenderedFeatures(e.point)
      if (features && features.length > 0) {
        var feature = features.find(feature => feature.layer.id.includes('gages'))
        this.getPsMslData(feature)
      }
      // nasa data from gee ?
      this.getNasaData(e.lngLat.lng, e.lngLat.lat)
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
    getPsMslData (feature) {
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
            console.log(error)
            this.loading--
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
          console.log(error)
          this.loading--
        })
    },

    // load marker icon from image
    getMarker (name) {
      this.map.loadImage(`images/${name}.png`, (error, image) => {
        if (error) throw error
        this.map.addImage(name, image)
      })
    }
  },

  components: {
    'v-map-layers': MapLayers,
    'v-layer-control': LayerControl
  }
}
