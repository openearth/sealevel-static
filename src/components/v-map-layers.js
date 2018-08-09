import {
  bus
} from '@/event-bus.js'
import {
  mapLayers
} from './map-layers-config.js'

export default {
  name: 'v-map-layers',
  data () {
    return {
      map: null
    }
  },
  methods: {
    deferredMountedTo (map) {
      mapLayers.forEach((layer) => {
        bus.$emit('add-layer', layer)
        if (layer.layerType && (layer.layerType.includes('mapbox') || layer.layerType.includes('geojson'))) {
          layer.active = (layer.active === false) ? layer.active : true
          layer.data.forEach((layerData) => {
            layerData.active = layer.active
            map.addLayer(layerData)
          })
        }
      })
    }
  }
}
