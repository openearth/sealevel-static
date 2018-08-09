import draggable from 'vuedraggable'
import {
  bus
} from '@/event-bus.js'
export default {
  name: 'layer-control',
  props: {
    layers: {
      type: Array,
      required: true
    },
    map: {
      type: Object
    }
  },
  data: function () {
    return {
      expand: 0,
      drag: false
    }
  },
  computed: {
    // the ui handles (drag/drop) layers in reverse order
    reverseLayers: {
      get () {
        return this.layers.slice().reverse()
      },
      set (data) {
        this.layers = data.slice().reverse()
      }
    }
  },
  watch: {
    // watch for changes of the 'layers' control property
    layers: {
      handler: function (layers) {
        this.toggleLayers()
        this.sortLayers()
        bus.$emit('select-layers', this.layers)
      },
      deep: true
    }
  },
  mounted () { },
  methods: {
    sortLayers () {
      // sort the layers in mapbox to match this.layers order
      if (this.map && this.layers) {
        var self = this
        this.layers.forEach((layer) => {
          layer.data.forEach((layerData) => {
            self.map.moveLayer(layerData.id)
          })
        })
      }
    },
    toggleLayers () {
      // toggle the visibility and opacity of the layers in mapbox.
      if (this.map && this.layers) {
        var self = this
        this.layers.forEach((layer) => {
          layer.data.forEach((layerData) => {
            if (layer.active) {
              self.map.setLayoutProperty(layerData.id, 'visibility', 'visible')
              self.setOpacity(layer, layerData)
            } else {
              self.map.setLayoutProperty(layerData.id, 'visibility', 'none')
            }
          })
        })
      }
    },
    setOpacity (layer, layerData) {
      if (layer.opacity) {
        try {
          var opacity = Math.max(layer.opacity * 0.01, 0.01)
          var property
          if (layer.layerType === 'gee') {
            property = 'raster-opacity'
          } else if (layerData.type === 'fill') {
            property = 'fill-opacity'
          } else if (layerData.type === 'line') {
            property = 'line-opacity'
          }
          if (property) {
            this.map.setPaintProperty(layerData.id, property, opacity)
          }
        } catch (err) {
          console.log('error setting opacity: ' + opacity + '(' + err.message + ')')
        }
      }
    },
    colorRamp (legend) {
      if (legend && legend.colors) {
        return 'background: linear-gradient(to right, ' + legend.colors.join() + ');'
      }
    }
  },
  components: {
    draggable
  }
}
