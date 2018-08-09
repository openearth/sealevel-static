import {
  bus
} from '@/event-bus.js'
import {
  mapLayers
} from './map-layers-config.js'

import _ from 'lodash'

export default {
  name: 'v-map-layers',
  data () {
    return {
      map: null
    }
  },
  methods: {
    deferredMountedTo (map) {
      _.each(mapLayers, (layer) => {
        bus.$emit('add-layer', layer)
        if (layer.layertype && (layer.layertype.includes('mapbox') || layer.layertype.includes('geojson'))) {
          _.each(layer.data, (maplayer) => {
            maplayer.active = layer.active
            map.addLayer(maplayer)
          })
        }
      })
    }
  }
}
