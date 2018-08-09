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
            // move to top
            self.map.moveLayer(layerData.id)
          })
        })
      }
    },
    toggleLayers () {
      // toggle the visibility and opacity of the mapbox layers
      if (this.map && this.layers) {
        var self = this
        this.layers.forEach((layer) => {
          layer.data.forEach((layerData) => {
            if (layer.active) {
              self.map.setLayoutProperty(layerData.id, 'visibility', 'visible')
              self.setOpacity(layerData, layer.opacity)
            } else {
              self.map.setLayoutProperty(layerData.id, 'visibility', 'none')
            }
          })
        })
      }
    },
    setOpacity (layerData, opacity) {
      // opacity is defined for a logical layer but applies to all sub-layers
      if (layerData && opacity) {
        var value = Math.max(opacity * 0.01, 0.01)
        var property = `${layerData.type}-opacity`.replace('symbol', 'icon')
        this.map.setPaintProperty(layerData.id, property, value)
      }
    },
    colorRamp (legend) {
      // css rendering of color ramp (used when legend.range is defined)
      if (legend && legend.colors) {
        return 'background: linear-gradient(to right, ' + legend.colors.join() + ');'
      }
    }
  },
  components: {
    draggable
  }
}
