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
// @ is an alias to /src
export default {
  name: 'home',
  data () {
    return {
      map: null,
      layers: [],
      drawer: true,
      expand: 0,
      items: [
        { icon: 'trending_up', text: 'Trends', public: true, route: 'trends' },
        { icon: 'subscriptions', text: 'Animations', public: true, route: 'animations' },
        { icon: 'featured_play_list', text: 'Reports', public: false, route: 'reports' },
        { icon: 'alarm', text: 'Signals', public: false, route: 'signals' },
        { icon: 'business', text: 'Cost estimates', public: false, route: 'cost' }
      ]
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
    // load marker icon
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
