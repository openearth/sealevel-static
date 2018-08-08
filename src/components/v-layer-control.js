import _ from 'lodash'
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
    // computed property which links the 'vuedraggable' control to the list of layers
    computedList: {
      get () {
        return this.layers
      },
      set (layers) {
        this.layers = layers
        bus.$emit('select-layers', this.layers)
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
      // sort the layers in mapbox to match this.layers
      if (this.map && this.layers) {
        for (var i = this.layers.length - 2; i >= 0; --i) {
          for (var thislayer = 0; thislayer < this.layers[i].data.length; ++thislayer) {
            this.map.moveLayer(this.layers[i].data[thislayer].id)
          }
        }
      }
    },
    toggleLayers () {
      // toggle the visibility and opacity of the layers in mapbox.
      if (this.map && this.layers) {
        _.each(this.layers, (layer) => {
          _.each(layer.data, (sublayer) => {
            if (layer.active) {
              this.map.setLayoutProperty(sublayer.id, 'visibility', 'visible')
              this.setOpacity(layer, sublayer)
            } else {
              this.map.setLayoutProperty(sublayer.id, 'visibility', 'none')
            }
          })
        })
      }
    },
    setOpacity (layer, sublayer) {
      if (layer.opacity) {
        try {
          var opacity = Math.max(layer.opacity * 0.01, 0.01)
          var property
          if (layer.layertype === 'gee-layer') {
            property = 'raster-opacity'
          } else if (sublayer.type === 'fill') {
            property = 'fill-opacity'
          } else if (sublayer.type === 'line') {
            property = 'line-opacity'
          }
          if (property) {
            this.map.setPaintProperty(sublayer.id, property, opacity)
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
