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
          // opacity and active properties are defined for a logical layer but appliy to all sub-layers
          layer.data.forEach((layerData) => {
            layerData.active = layer.active
            layerData.opacity = layer.opacity
            map.addLayer(layerData)
          })
        }
      })
    }
  }
}
